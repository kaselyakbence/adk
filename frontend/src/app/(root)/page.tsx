"use client";
import { useEffect } from "react";
import { DEFAULT_LOCALE, isLocale, LOCALE_STORAGE_KEY } from "../../locales";

export default function RootRedirect() {
  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) ?? "";
    const browserLang = navigator.language.slice(0, 2);
    const target = isLocale(stored)
      ? stored
      : isLocale(browserLang)
        ? browserLang
        : DEFAULT_LOCALE;

    // The PWA manifest's start_url can't hardcode a locale, so it points here
    // with ?start=washing and lets this page's locale detection decide where
    // that actually lands.
    // (Also used by sw.js's notification click - "events" for reminders.)
    const startPage = new URLSearchParams(window.location.search).get("start");
    const path =
      startPage === "washing" || startPage === "events" ? `/${startPage}` : "";

    window.location.replace(`/${target}${path}`);
  }, []);

  return null;
}
