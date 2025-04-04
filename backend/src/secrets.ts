import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT ? +process.env.PORT : 3000;
export const MODE = process.env.MODE ? process.env.MODE : "development";
export const FRONTEND_URL = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL
  : "*";
