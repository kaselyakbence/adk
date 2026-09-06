import { createContext } from "react";
import type { Locale } from "../locales";

export interface LocaleContextType {
  locale: Locale;
  t: (key: string) => string;
}

export const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  t: (key) => key,
});
