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
      const now = new Date().toISOString();
      const endDate = new Date(
        Date.now() + (hours * 60 + minutes) * 60 * 1000
      ).toISOString();

      await prismaClient.device.update({
        where: { id: parseInt(req.params.id) },
        data: {
          start_date: now,
          end_date: endDate,
          owner: owner,
        },
      });

      res.status(201).send();
    }

    res.sendStatus(403);
  } catch (_) {
    res.status(403).send();
  }
});

export default DeviceRouter;
