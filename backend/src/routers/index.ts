import { Router } from "express";
import { prismaClient } from "../index";

const DeviceRouter = Router();

DeviceRouter.get("/all", async (_, res) => {
  try {
    const devices = await prismaClient.device.findMany();

    res.status(200).send(devices);
  } catch (_) {
    res.status(400).send([]);
  }
});

function parseClientDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

DeviceRouter.post("/:id/update", async (req, res) => {
  const minutes = req.body?.minutes;
  const hours = req.body?.hours;
  const owner = req.body?.owner;

  try {
    if (
      req.params.id &&
      !isNaN(hours) &&
      !isNaN(minutes) &&
      typeof owner === "string"
    ) {
      const deviceId = parseInt(req.params.id);

      // The client computes these at the moment Start is actually pressed
      // and passes them through - important for a request that spent time
      // in the offline queue, where "now" at receipt time would otherwise
      // be well after the user's real start moment. Falls back to the
      // previous server-side "now" + duration when not provided.
      const now =
        parseClientDate(req.body?.start_date) ?? new Date().toISOString();
      const endDate =
        parseClientDate(req.body?.end_date) ??
        new Date(Date.now() + (hours * 60 + minutes) * 60 * 1000).toISOString();

      await prismaClient.device.update({
        where: { id: deviceId },
        data: {
          start_date: now,
          end_date: endDate,
          owner: owner,
        },
      });

      // Any update starts a new booking - whatever push subscription was
      // pending belonged to whatever was running before and no longer
      // applies.
      await prismaClient.pushSubscription.deleteMany({
        where: { deviceId },
      });

      res.status(201).send();
      return;
    }

    res.sendStatus(403);
  } catch (_) {
    res.status(403).send();
  }
});

DeviceRouter.post("/:id/subscribe", async (req, res) => {
  const endpoint = req.body?.endpoint;
  const p256dh = req.body?.keys?.p256dh;
  const auth = req.body?.keys?.auth;

  try {
    if (
      req.params.id &&
      typeof endpoint === "string" &&
      typeof p256dh === "string" &&
      typeof auth === "string"
    ) {
      await prismaClient.pushSubscription.create({
        data: {
          deviceId: parseInt(req.params.id),
          endpoint,
          p256dh,
          auth,
        },
      });

      res.status(201).send();
      return;
    }

    res.sendStatus(403);
  } catch (_) {
    res.status(403).send();
  }
});

export default DeviceRouter;
