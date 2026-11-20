import { Router } from "express";
import { prismaClient } from "../index";

// Read-only for now - events are managed straight in the DB (see
// prisma/seed.ts), the site only lists them and lets residents opt into a
// reminder.
const EventRouter = Router();

EventRouter.get("/all", async (_, res) => {
  try {
    const events = await prismaClient.event.findMany({
      orderBy: { startDate: "asc" },
    });

    res.status(200).send(events);
  } catch (_) {
    res.status(400).send([]);
  }
});

EventRouter.post("/:id/subscribe", async (req, res) => {
  const endpoint = req.body?.endpoint;
  const p256dh = req.body?.keys?.p256dh;
  const auth = req.body?.keys?.auth;
  const eventId = parseInt(req.params.id);

  try {
    if (
      !isNaN(eventId) &&
      typeof endpoint === "string" &&
      typeof p256dh === "string" &&
      typeof auth === "string"
    ) {
      const event = await prismaClient.event.findUnique({
        where: { id: eventId },
      });

      // Nothing to remind about once it's started.
      if (!event || event.startDate <= new Date()) {
        res.sendStatus(403);
        return;
      }

      // Upsert so pressing "Remind me" twice on the same browser (or after
      // clearing localStorage) doesn't queue a duplicate notification.
      await prismaClient.eventSubscription.upsert({
        where: { eventId_endpoint: { eventId, endpoint } },
        update: { p256dh, auth },
        create: { eventId, endpoint, p256dh, auth },
      });

      res.status(201).send();
      return;
    }

    res.sendStatus(403);
  } catch (_) {
    res.status(403).send();
  }
});

EventRouter.post("/:id/unsubscribe", async (req, res) => {
  const endpoint = req.body?.endpoint;
  const eventId = parseInt(req.params.id);

  try {
    if (!isNaN(eventId) && typeof endpoint === "string") {
      await prismaClient.eventSubscription.deleteMany({
        where: { eventId, endpoint },
      });

      res.status(200).send();
      return;
    }

    res.sendStatus(403);
  } catch (_) {
    res.status(403).send();
  }
});

export default EventRouter;
