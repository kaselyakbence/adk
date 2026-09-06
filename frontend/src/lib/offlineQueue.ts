import { subscribeToPush, MACHINE_STARTED_EVENT } from "./push";

const DB_NAME = "adk-offline-queue";
const DB_VERSION = 1;
const STORE_NAME = "pending-updates";
const BROADCAST_CHANNEL_NAME = "adk-offline-queue-updates";

export const SYNC_TAG = "device-update-sync";

export interface PendingUpdate {
  deviceId: number;
  url: string;
  body: {
    hours: number;
    minutes: number;
    owner: string;
    start_date: string;
    end_date: string;
  };
  queuedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE_NAME)) {
        req.result.createObjectStore(STORE_NAME, { keyPath: "deviceId" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// A later queued update for the same device replaces the earlier one - only
// the most recent desired state matters, matching the app's no-conflict,
// last-write-wins convention.
export async function enqueueUpdate(update: PendingUpdate): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(update);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  notifyQueueChanged();
}

export async function getPendingUpdates(): Promise<PendingUpdate[]> {
  const db = await openDB();
  const result = await new Promise<PendingUpdate[]>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result as PendingUpdate[]);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return result;
}

async function removePendingUpdate(deviceId: number): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(deviceId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

// Tries every queued update once; whatever still fails (still offline)
// stays queued for the next flush. Used both as the iOS fallback (called on
// "online"/visibilitychange) and as a catch-up on app open.
//
// A machine started while offline never got a push subscription at the
// time (no network to complete it) - so a successful sync here is the
// first real chance to do that, same as TimerModal does on the
// synchronous-success path. This only runs when this code path executes,
// i.e. while a page is actually open; the service worker's own
// Background Sync handler can't request Notification permission from a
// worker context, so a sync that fires with every tab closed still won't
// produce a subscription for that booking - an inherent platform limit.
export async function flushPendingUpdates(): Promise<void> {
  const pending = await getPendingUpdates();
  let changed = false;
  for (const update of pending) {
    try {
      const res = await fetch(update.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update.body),
      });
      if (res.status === 201) {
        await removePendingUpdate(update.deviceId);
        changed = true;
        subscribeToPush(update.deviceId);
        window.dispatchEvent(new Event(MACHINE_STARTED_EVENT));
      }
    } catch {
      // Still offline - leave it queued and try again next time.
    }
  }
  if (changed) notifyQueueChanged();
}

export function notifyQueueChanged(): void {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  channel.postMessage("changed");
  channel.close();
}

// Lets the device list re-check pending updates whenever the queue changes,
// whether that happened here, in another tab, or in the service worker.
export function subscribeToQueueChanges(callback: () => void): () => void {
  if (typeof BroadcastChannel === "undefined") return () => {};
  const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  channel.onmessage = () => callback();
  return () => channel.close();
}

export async function registerBackgroundSync(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const syncManager = (
      reg as ServiceWorkerRegistration & {
        sync?: { register: (tag: string) => Promise<void> };
      }
    ).sync;
    if (syncManager) await syncManager.register(SYNC_TAG);
  } catch {
    // Unsupported (iOS Safari) or registration failed - the online/
    // visibilitychange fallback in OfflineQueueSync covers this instead.
  }
}
