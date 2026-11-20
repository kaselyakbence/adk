export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];
export const DEFAULT_THEME: Theme = "light";
export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: string): value is Theme {
  return (THEMES as readonly string[]).includes(value);
}

// Inlined into each root layout's <head> so a stored choice is on <html>
// before first paint - otherwise someone who picked dark on a light-mode OS
// would see a light flash on every load until React hydrated. With nothing
// stored it does nothing, and the prefers-color-scheme rules in main.css
// handle it.
//
// Deliberately a plain literal rather than built from the constants above
// with JSON.stringify: generating script code from data is what CodeQL's
// "improper code sanitization" rule flags (#3, #4), and there's no need for
// it with two fixed values. The check below keeps the literal honest - if
// THEME_STORAGE_KEY or THEMES change without this string, the build fails.
export const THEME_INIT_SCRIPT =
  '(function(){try{var t=localStorage.getItem("theme");if(["light","dark"].indexOf(t)!==-1)document.documentElement.setAttribute("data-theme",t);}catch(e){}})();';

// Compile-time guard for the literal above: errors if the constants drift.
type Assert<T extends true> = T;
export type ThemeInitScriptInSync = [
  Assert<typeof THEME_STORAGE_KEY extends "theme" ? true : false>,
  Assert<
    (typeof THEMES)[number] extends "light" | "dark"
      ? "light" | "dark" extends (typeof THEMES)[number]
        ? true
        : false
      : false
  >,
];
