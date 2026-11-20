"use client";
import { useContext } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { LocaleContext } from "../context/LocaleContext";
import styles from "./themetoggle.module.css";

// Sliding switch - lives in the navbar's user dropdown (and the mobile menu
// panel) next to the username controls.
const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { t } = useContext(LocaleContext);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={t(isDark ? "themeToggle.toLight" : "themeToggle.toDark")}
      className={`${styles.track} ${isDark ? styles.dark : ""}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <FaSun className={`${styles.trackIcon} ${styles.sunSide}`} aria-hidden />
      <FaMoon className={`${styles.trackIcon} ${styles.moonSide}`} aria-hidden />
      <span className={styles.knob}>
        {isDark ? <FaMoon aria-hidden /> : <FaSun aria-hidden />}
      </span>
    </button>
  );
};

export default ThemeToggle;
