import type { Locale } from "../locales";

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

// "5 minutes ago" / "vor 5 Minuten" - for "reported broken X ago". Anything
// under a minute reads as "now" / "jetzt".
export function formatTimeAgo(date: string | Date, locale: Locale): string {
  const diff = new Date(date).getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return rtf.format(0, "minute");
}
