import express from "express";
import { PrismaClient } from "@prisma/client";
import { MODE, PORT } from "./secrets";
import DeviceRouter from "./routers";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

if (MODE === "development") app.use(cors({ credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/device", DeviceRouter);

export const prismaClient = new PrismaClient({ log: ["query"] });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
