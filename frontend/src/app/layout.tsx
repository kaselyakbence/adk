import type { Metadata, Viewport } from "next";
import "../main.css";
import UsernameProvider from "../context/UsernameProvider";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";
import OfflineQueueSync from "../components/OfflineQueueSync";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Next only emits the modern unprefixed tag; older iOS Safari
            versions still key standalone-mode detection off this one. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning>
        <div id="root">
          <UsernameProvider>{children}</UsernameProvider>
        </div>
        <ServiceWorkerRegister />
        <OfflineQueueSync />
      </body>
    </html>
  );
}
