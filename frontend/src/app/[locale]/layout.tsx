import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../../main.css";
import { isLocale, LOCALES } from "../../locales";
import LocaleProvider from "../../context/LocaleProvider";
import UsernameProvider from "../../context/UsernameProvider";
import ServiceWorkerRegister from "../../components/ServiceWorkerRegister";
import OfflineQueueSync from "../../components/OfflineQueueSync";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#6397ff",
};

export const metadata: Metadata = {
  title: "Alle Der Kosmonauten 20",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ADK 20",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale}>
      <head>
        {/* Next only emits the modern unprefixed tag; older iOS Safari
            versions still key standalone-mode detection off this one. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning>
        <LocaleProvider locale={locale}>
          <div id="root">
            <UsernameProvider>{children}</UsernameProvider>
          </div>
          <LanguageSwitcher />
          <ServiceWorkerRegister />
          <OfflineQueueSync />
        </LocaleProvider>
      </body>
    </html>
  );
}
