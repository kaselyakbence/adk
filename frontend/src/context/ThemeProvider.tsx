"use client";
import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { DEFAULT_THEME, isTheme, Theme, THEME_STORAGE_KEY } from "../themes";

// Mirrors the locale fallback chain: an explicit stored choice wins, then
// the OS preference, then DEFAULT_THEME if neither is available.
function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) ?? "";
  if (isTheme(stored)) return stored;
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
  return DEFAULT_THEME;
}

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Starts at the default so the first client render matches the static
  // HTML; the page colors are already right before this runs (the inline
  // script in the layout's <head> sets data-theme pre-paint), this state
  // only drives the toggle's icon.
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    setThemeState(getInitialTheme());

    // Only follow OS-level changes while the user hasn't picked a theme
    // themselves - once they have, their choice is sticky, same as locale.
    // Checked on every change, not just at mount, so a toggle made
    // mid-session stops this from overriding it afterward.
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) ?? "";
      if (isTheme(stored)) return;
      setThemeState(mql.matches ? "dark" : "light");
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (next: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
    setThemeState(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
