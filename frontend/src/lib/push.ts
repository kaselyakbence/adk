import { API_URL, VAPID_PUBLIC_KEY } from "../secrets";

export const MACHINE_STARTED_EVENT = "adk:machine-started";

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS 13+ reports as a Mac, but with touch support a real Mac lacks.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Whether this browser can receive web push from this site at all.
export function canUsePush(): boolean {
  if (typeof window === "undefined") return false;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return false;
  }
  if (!VAPID_PUBLIC_KEY) return false;
  // iOS only delivers web push to an installed (standalone) app - a bare
  // Safari tab silently no-ops subscribe(), so don't even prompt there.
  if (isIOS() && !isStandalone()) return false;
  return true;
}

// Asks for notification permission (if not already granted) and returns
// this browser's push subscription, creating it on first use. Null when
// push isn't available or permission was refused.
async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!canUsePush()) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  if (existing) return existing;

  return reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });
}

// Requests notification permission and subscribes this browser to push,
// tying the subscription to this specific booking (deviceId) on the
// backend. Fails silently throughout - notifications are a nice-to-have,
// never something that should block starting a machine.
export async function subscribeToPush(deviceId: number): Promise<void> {
  try {
    const subscription = await getPushSubscription();
    if (!subscription) return;

    await fetch(`${API_URL}/device/${deviceId}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });
  } catch (err) {
    // Still fails silently from the user's perspective (this should never
    // block starting a machine) - but logged so a real failure here isn't
    // completely invisible when debugging delivery issues.
    console.error("subscribeToPush failed", err);
  }
}

export type ReminderResult = "ok" | "unsupported" | "denied" | "error";

// Unlike subscribeToPush, the result is reported back - "Remind me" is the
// whole point of the button, so the user should hear if it didn't work.
export async function subscribeToEventReminder(
  eventId: number,
): Promise<ReminderResult> {
  if (!canUsePush()) return "unsupported";

  try {
    const subscription = await getPushSubscription();
    if (!subscription) return "denied";

    const res = await fetch(`${API_URL}/event/${eventId}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });
    return res.status === 201 ? "ok" : "error";
  } catch (err) {
    console.error("subscribeToEventReminder failed", err);
    return "error";
  }
}

export async function unsubscribeFromEventReminder(
  eventId: number,
): Promise<boolean> {
  try {
    // Only looks up the existing subscription - never prompts for
    // permission just to cancel something.
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.getSubscription();
    if (!subscription) return true;

    const res = await fetch(`${API_URL}/event/${eventId}/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
    return res.ok;
  } catch (err) {
    console.error("unsubscribeFromEventReminder failed", err);
    return false;
  }
}
