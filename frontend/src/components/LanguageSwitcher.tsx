"use client";
import { useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LocaleContext } from "../context/LocaleContext";
import { LOCALES, Locale, LOCALE_STORAGE_KEY } from "../locales";
import { REOPEN_USER_MENU_KEY } from "../lib/userMenu";
import styles from "./languageswitcher.module.css";

const LABELS: Record<Locale, string> = { en: "EN", de: "DE" };
const NAMES: Record<Locale, string> = { en: "English", de: "Deutsch" };

// Matches the indicator's transition in languageswitcher.module.css.
const SLIDE_MS = 200;

// Segmented EN | DE control - lives in the navbar's user dropdown (and the
// mobile menu panel) next to the dark mode switch, sized off the same
// --switch-size variable so the two line up.
const LanguageSwitcher = () => {
  const { locale } = useContext(LocaleContext);
  const pathname = usePathname();
  const router = useRouter();
  // Moves ahead of the actual navigation so the indicator can slide first.
  const [selected, setSelected] = useState<Locale>(locale);

  const switchTo = (target: Locale) => {
    if (target === selected) return;
    setSelected(target);
    localStorage.setItem(LOCALE_STORAGE_KEY, target);

    // The other locale is a separate page, so the navbar (and its open
    // menu) remounts on arrival - this tells the new one to come up open,
    // making the switch look like it happened in place.
    try {
      sessionStorage.setItem(REOPEN_USER_MENU_KEY, "1");
    } catch {
      // Storage blocked - the menu just closes on switch, as before.
    }

    const rest = pathname.slice(`/${locale}`.length) || "/";
    setTimeout(() => router.push(`/${target}${rest}`), SLIDE_MS);
  };

  const index = LOCALES.indexOf(selected);

  return (
    <div className={styles.segmented} role="group">
      <span
        className={styles.indicator}
        style={{ "--index": index } as React.CSSProperties}
        aria-hidden
      />
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className={`${styles.option} ${l === selected ? styles.active : ""}`}
          onClick={() => switchTo(l)}
          aria-pressed={l === selected}
          aria-label={NAMES[l]}
          lang={l}
        >
          <span className={styles.label}>{LABELS[l]}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
