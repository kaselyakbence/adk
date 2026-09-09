"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LocaleContext } from "../context/LocaleContext";
import { CameraContext } from "../context/CameraContext";
import { LOCALES, Locale, LOCALE_STORAGE_KEY } from "../locales";
import styles from "./languageswitcher.module.css";

const LABELS: Record<Locale, string> = { en: "EN", de: "DE" };

const LanguageSwitcher = () => {
  const { locale } = useContext(LocaleContext);
  const { cameraOpen } = useContext(CameraContext);
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    // pointerdown unifies mouse and touch input - more reliable across
    // devices than juggling separate mousedown/touchstart listeners.
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [open]);

  const switchTo = (target: Locale) => {
    setOpen(false);
    if (target === locale) return;
    localStorage.setItem(LOCALE_STORAGE_KEY, target);
    const rest = pathname.slice(`/${locale}`.length) || "/";
    router.push(`/${target}${rest}`);
  };

  if (cameraOpen) return null;

  return (
    <div
      className={`${styles.switcher} ${open ? styles.switcherOpen : ""}`}
      ref={wrapperRef}
    >
      <div className={`${styles.options} ${open ? styles.open : ""}`}>
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            className={`${styles.option} ${l === locale ? styles.active : ""}`}
            onClick={() => switchTo(l)}
          >
            {LABELS[l]}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={`${styles.toggle} ${open ? styles.toggleHidden : ""}`}
        onClick={() => setOpen(true)}
      >
        {LABELS[locale]}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
