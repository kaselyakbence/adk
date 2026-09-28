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

const EVENT_REMINDER_LEAD_MS = 30 * 60_000;

// The dorm's timezone, not the server's - the box may well run on UTC.
const eventTimeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Berlin",
});

async function notifyUpcomingEvents() {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return;

  const now = new Date();
  const due = await prismaClient.eventSubscription.findMany({
    where: {
      event: {
        startDate: { lte: new Date(now.getTime() + EVENT_REMINDER_LEAD_MS) },
      },
    },
    include: { event: true },
  });

  for (const sub of due) {
    // Already underway (e.g. the backend was down through the reminder
    // window) - a "starting soon" ping would just be wrong, so drop it.
    if (sub.event.startDate > now) {
      const where = sub.event.location ? ` · ${sub.event.location}` : "";
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify({
            title: `Starting soon: ${sub.event.title}`,
            body: `Starts at ${eventTimeFormat.format(sub.event.startDate)}${where}`,
            // Which page the service worker opens on click (see sw.js).
            page: "events",
          }),
        );
      } catch (err) {
        console.error("Event push send failed", err);
      }
    }

    // One-shot, same as laundry notifications.
    await prismaClient.eventSubscription.delete({ where: { id: sub.id } });
  }
}

export function startPushJob() {
  setInterval(() => {
    notifyFinishedCycles().catch((err) =>
      console.error("Push job failed", err),
    );
    notifyUpcomingEvents().catch((err) =>
      console.error("Event push job failed", err),
    );
  }, CHECK_INTERVAL_MS);
}
