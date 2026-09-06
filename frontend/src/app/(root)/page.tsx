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

    window.location.replace(`/${target}`);
  }, []);

  return null;
}
