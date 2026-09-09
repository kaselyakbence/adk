const CACHE_VERSION = "v1";
const SHELL_CACHE = `adk-shell-${CACHE_VERSION}`;
const ASSET_CACHE = `adk-assets-${CACHE_VERSION}`;
const API_CACHE = `adk-api-${CACHE_VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, ASSET_CACHE, API_CACHE];

// Mirrors src/lib/offlineQueue.ts - same DB/store names and record shape,
// duplicated here in plain JS since this file isn't bundled and can't
// import that module. Keep the two in sync by hand.
const QUEUE_DB_NAME = "adk-offline-queue";
const QUEUE_DB_VERSION = 1;
const QUEUE_STORE_NAME = "pending-updates";
const QUEUE_BROADCAST_CHANNEL_NAME = "adk-offline-queue-updates";

// Mirrors src/locales/index.ts's LOCALES/DEFAULT_LOCALE - duplicated for the
// same reason as the queue constants above.
const LOCALES = ["en", "de"];
const DEFAULT_LOCALE = "en";

const PRECACHE_URLS = [
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-512-maskable.png",
  "/apple-touch-icon.png",
  "/favicon-32.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !CURRENT_CACHES.includes(key))
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);
  return cached || (await networkFetch) || Response.error();
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error("network-first: no cached fallback available");
  }
}

function openQueueDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(QUEUE_DB_NAME, QUEUE_DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(QUEUE_STORE_NAME)) {
        req.result.createObjectStore(QUEUE_STORE_NAME, { keyPath: "deviceId" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getPendingUpdates() {
  const db = await openQueueDB();
  const result = await new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE_NAME, "readonly");
    const req = tx.objectStore(QUEUE_STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return result;
}

async function removePendingUpdate(deviceId) {
  const db = await openQueueDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE_NAME, "readwrite");
    tx.objectStore(QUEUE_STORE_NAME).delete(deviceId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

function notifyQueueChanged() {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(QUEUE_BROADCAST_CHANNEL_NAME);
  channel.postMessage("changed");
  channel.close();
}

// Drains the queue when connectivity returns - fires even with every tab
// for this app closed, which is the whole point of Background Sync.
//
// Unlike the page-side flushPendingUpdates() in src/lib/offlineQueue.ts,
// this one deliberately does NOT try to subscribe to push here: requesting
// Notification permission isn't available from a service worker context,
// only from an open page. A machine started offline that syncs via this
// path (tab still closed) won't get a push subscription for that booking -
// the page-side flush (on next open/online/visibilitychange) is what
// covers that, whenever a page happens to be open when the sync succeeds.
async function flushPendingUpdates() {
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
      }
    } catch {
      // Still offline - leave it queued, the browser will retry this sync
      // event on its own backoff schedule.
    }
  }
  if (changed) notifyQueueChanged();
}

self.addEventListener("sync", (event) => {
  if (event.tag === "device-update-sync") {
    event.waitUntil(flushPendingUpdates());
  }
});

self.addEventListener("push", (event) => {
  let data = { title: "Laundry done!", body: "Your load is ready." };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/favicon-32.png",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // No window open - hand off to the root redirect page, which
        // already knows how to pick the right locale (see app/(root)/page.tsx).
        // The service worker itself can't read localStorage to do this
        // directly.
        if (clients.length === 0) {
          return self.clients.openWindow("/?start=washing");
        }

        // A window is already open - it's already on some /<locale>/...
        // route, so reuse that locale instead of guessing.
        const client = clients[0];
        const segment = new URL(client.url).pathname.split("/")[1];
        const locale = LOCALES.includes(segment) ? segment : DEFAULT_LOCALE;
        const washingUrl = new URL(
          `/${locale}/washing`,
          self.location.origin,
        ).href;

        return client
          .navigate(washingUrl)
          .then((navigated) => navigated && navigated.focus());
      }),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Device list: show the last-known state instantly (works offline too),
  // then refresh it in the background for next time.
  if (url.pathname.endsWith("/device/all")) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Page navigations: prefer fresh content, fall back to the last cached
  // version so a visited page still opens offline.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, SHELL_CACHE));
    return;
  }

  // Prefer a fresh copy when online (dev-server chunk URLs aren't reliably
  // immutable across hot-reloads the way real hashed prod assets are);
  // fall back to the cache only when actually offline.
  if (["script", "style", "image", "font"].includes(request.destination)) {
    event.respondWith(networkFirst(request, ASSET_CACHE));
  }
});
