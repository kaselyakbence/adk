import type { Metadata } from "next";
import "../../main.css";

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
};

// This branch only ever renders the "/" redirect page, which picks the
// locale client-side - it can't share the [locale] branch's root layout
// (a route can only belong to one root layout), so it gets its own minimal one.
export default function RootRedirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
