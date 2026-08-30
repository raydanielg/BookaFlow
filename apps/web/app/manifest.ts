import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BookMiadi — Smart Booking & Scheduling Platform",
    short_name: "BookMiadi",
    description:
      "The all-in-one booking platform for salons, clinics, spas, gyms, and studios. Manage appointments, staff, customers, and payments — all in one beautiful platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/peercoin.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/peercoin.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
