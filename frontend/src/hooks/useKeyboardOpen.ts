"use client";
import { useEffect, useState } from "react";

// visualViewport shrinks to exclude the on-screen keyboard while
// window.innerHeight (the layout viewport) doesn't - a big enough gap
// between them is a reliable signal the keyboard is actually open.
const SHRINK_THRESHOLD = 0.75;

export function useKeyboardOpen(): boolean {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleResize = () => {
      setKeyboardOpen(viewport.height < window.innerHeight * SHRINK_THRESHOLD);
    };

    handleResize();
    viewport.addEventListener("resize", handleResize);
    return () => viewport.removeEventListener("resize", handleResize);
  }, []);

  return keyboardOpen;
}
