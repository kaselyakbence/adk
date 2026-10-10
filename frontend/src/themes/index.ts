export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];
export const DEFAULT_THEME: Theme = "light";
export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: string): value is Theme {
  return (THEMES as readonly string[]).includes(value);
}

// Plain JSON.stringify is sanitized for JS string syntax, not for the
// inline-<script> context this gets embedded into: it doesn't escape
// "</script" (which would close the tag early if it ever appeared in the
// value) or the U+2028/U+2029 line/paragraph separators (valid in a JSON
// string, but treated as line terminators by JS parsers). Neither constant
// below contains either today, but this is the sink CodeQL flags the raw
// calls for - escaping properly here is cheap and correct regardless of
// what the current values happen to be.
//
// Built from String.fromCharCode/concatenation rather than writing the
// escape sequences directly in this file's own source, to avoid any
// ambiguity between "a backslash followed by the text u2028" and "the
// actual U+2028 character" - exactly the kind of mix-up this function
// exists to prevent on the output side.
function jsonForInlineScript(value: unknown): string {
  const lineSeparator = String.fromCharCode(0x2028);
  const paragraphSeparator = String.fromCharCode(0x2029);
  const backslash = String.fromCharCode(0x5c);
  const escapedLt = backslash + "u003c";
  const escapedLineSeparator = backslash + "u2028";
  const escapedParagraphSeparator = backslash + "u2029";

  return JSON.stringify(value)
    .split("<")
    .join(escapedLt)
    .split(lineSeparator)
    .join(escapedLineSeparator)
    .split(paragraphSeparator)
    .join(escapedParagraphSeparator);
}

// Inlined into each root layout's <head> so a stored choice is on <html>
// before first paint - otherwise someone who picked dark on a light-mode OS
// would see a light flash on every load until React hydrated. With nothing
// stored it does nothing, and the prefers-color-scheme rules in main.css
// handle it.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${jsonForInlineScript(
  THEME_STORAGE_KEY,
)});if(${jsonForInlineScript(THEMES)}.indexOf(t)!==-1)document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
