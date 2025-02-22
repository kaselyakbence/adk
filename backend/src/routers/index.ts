import { Router } from "express";
import { prismaClient } from "../index";

const DeviceRouter = Router();

DeviceRouter.get("/all", async (_, res) => {
  const devices = await prismaClient.device.findMany();

  res.status(200).send(devices);
});

DeviceRouter.post("/:id/update", async (req, res) => {
  const minutes = req.body?.minutes;
  const hours = req.body?.hours;

  try {
    if (req.params.id && !isNaN(hours) && !isNaN(minutes)) {
      const endDate = new Date(
        Date.now() + (hours * 60 + minutes) * 60 * 1000
      ).toISOString();

      await prismaClient.device.update({
        where: { id: parseInt(req.params.id) },
        data: {
          end_date: endDate,
        },
      });

      res.status(201).send();
    }

    res.sendStatus(403);
  } catch (e) {
    if (e) res.status(403).send();
  }
});

export default DeviceRouter;
