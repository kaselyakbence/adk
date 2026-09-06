import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alle Der Kosmonauten 20",
    short_name: "ADK 20",
    description: "Book a washer or dryer at Alle Der Kosmonauten 20.",
    start_url: "/washing",
    display: "standalone",
    background_color: "#6397ff",
    theme_color: "#6397ff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
