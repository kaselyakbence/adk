import express from "express";
import { PrismaClient } from "@prisma/client";
import { MODE, PORT } from "./secrets";
import DeviceRouter from "./routers";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

const app = express();

if (MODE === "development") {
  const corsOptions = {
    origin: "https://main.d3dzus7hfrui6z.amplifyapp.com",
    methods: ["POST", "GET", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", ""],
    preflightContinue: true,
  };
  app.use(cors(corsOptions));
  app.use(morgan("tiny"));
  console.log("Cors and Morgan set up");
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/device", DeviceRouter);

app.get("/", (_, res) => {
  res.status(201).send({ msg: "Successfull" });
});

export const prismaClient = new PrismaClient({ log: ["info"] });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
