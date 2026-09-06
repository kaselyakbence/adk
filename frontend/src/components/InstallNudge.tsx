"use client";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import styles from "./installnudge.module.css";
import { isIOS, isStandalone, MACHINE_STARTED_EVENT } from "../lib/push";

const DISMISSED_KEY = "installNudgeShown";

// Shown once, right after a user's first successful machine start - not a
// generic install prompt, framed specifically around what installing
// unlocks: iOS only delivers push notifications to an installed app.
const InstallNudge = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMachineStarted = () => {
      if (
        isIOS() &&
        !isStandalone() &&
        !localStorage.getItem(DISMISSED_KEY)
      ) {
        localStorage.setItem(DISMISSED_KEY, "1");
        setVisible(true);
      }
    };

    window.addEventListener(MACHINE_STARTED_EVENT, handleMachineStarted);
    return () =>
      window.removeEventListener(MACHINE_STARTED_EVENT, handleMachineStarted);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <p className={styles.text}>
        Want a ping when it&#39;s done? Tap <strong>Share</strong>, then{" "}
        <strong>Add to Home Screen</strong> - iPhones only deliver
        notifications to installed apps.
      </p>
      <button
        type="button"
        className={styles.closeButton}
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
      >
        <IoMdClose />
      </button>
    </div>
  );
};

export default InstallNudge;
