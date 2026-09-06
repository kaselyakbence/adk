import webpush from "web-push";
import { prismaClient } from "./index";
import { VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY, VAPID_SUBJECT } from "./secrets";

const CHECK_INTERVAL_MS = 30_000;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

async function notifyFinishedCycles() {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return;

  const due = await prismaClient.pushSubscription.findMany({
    where: { device: { end_date: { lte: new Date() } } },
    include: { device: true },
  });

  for (const sub of due) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify({
          title: "Laundry done!",
          body: `${sub.device.type === "dryer" ? "Dryer" : "Washer"} ${sub.device.number} is ready.`,
        }),
      );
    } catch (err) {
      console.error("Push send failed", err);
    }

    // One-shot regardless of outcome - a booking only ever gets notified
    // once, matching the app's existing no-retry, trust-based conventions.
    await prismaClient.pushSubscription.delete({ where: { id: sub.id } });
  }
}

export function startPushJob() {
  setInterval(() => {
    notifyFinishedCycles().catch((err) =>
      console.error("Push job failed", err),
    );
  }, CHECK_INTERVAL_MS);
}
