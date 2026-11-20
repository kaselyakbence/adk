"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./pagetransition.module.css";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  // Path without its /<locale> prefix - a language switch changes only that
  // prefix and happens in place (the menu stays open), so no cover.
  const page = pathname.split("/").slice(2).join("/");
  const isFirstRender = useRef(true);
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    // Skip the very first render - there's nothing to transition from on
    // initial load, so flashing the cover then would just be noise.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setTransitionKey((k) => k + 1);
  }, [page]);

  return (
    <>
      {children}
      {transitionKey > 0 && (
        <div key={transitionKey} className={styles.cover} aria-hidden="true" />
      )}
    </>
  );
};

export default PageTransition;
