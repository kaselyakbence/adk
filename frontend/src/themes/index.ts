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
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(${JSON.stringify(THEMES)}.indexOf(t)!==-1)document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
