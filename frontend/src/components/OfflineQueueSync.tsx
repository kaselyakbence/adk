"use client";
import { useEffect } from "react";
import { flushPendingUpdates } from "../lib/offlineQueue";

// Background Sync (registered in offlineQueue.ts) covers Chromium even with
// the tab closed. iOS Safari has no Background Sync, so this is the
// fallback: it only gets a chance to flush while the app is actually open,
// on reconnect or when it's brought back to the foreground.
const OfflineQueueSync = () => {
  useEffect(() => {
    flushPendingUpdates();

    const onOnline = () => flushPendingUpdates();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") flushPendingUpdates();
    };

    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("online", onOnline);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
};

export default OfflineQueueSync;
