"use client";
import { useMemo } from "react";
import { LocaleContext } from "./LocaleContext";
import type { Locale } from "../locales";
import en from "../locales/en.json";
import de from "../locales/de.json";

const DICTIONARIES: Record<Locale, Record<string, string>> = { en, de };

interface LocaleProviderProps {
  locale: Locale;
  children: React.ReactNode;
}

const LocaleProvider = ({ locale, children }: LocaleProviderProps) => {
  const value = useMemo(() => {
    const dict = DICTIONARIES[locale];
    return {
      locale,
      t: (key: string) => dict[key] ?? key,
    };
  }, [locale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export default LocaleProvider;
