import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT ? +process.env.PORT : 3000;
export const MODE = process.env.MODE ? process.env.MODE : "development";
export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY ?? "";
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? "";
export const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT ?? "mailto:info@ssv-adk20.example";
