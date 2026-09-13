"use client";
import { useEffect, useState } from "react";

// visualViewport shrinks to exclude an on-screen keyboard while
// window.innerHeight doesn't. Returning the raw height (rather than just a
// derived "keyboard open" boolean) lets a modal center itself within
// whatever space is actually visible, instead of being shoved to some fixed
// offset that looks fine on one screen and cramped on another.
//
// Returns null until measured on the client, so the first render matches
// the server (no window there) and callers can fall back to a plain CSS
// center for that render instead of risking a hydration mismatch.
export function useVisualViewportHeight(): number | null {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleResize = () => setHeight(viewport.height);
    handleResize();
    viewport.addEventListener("resize", handleResize);
    return () => viewport.removeEventListener("resize", handleResize);
  }, []);

  return height;
}
