import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@workspace/ui/components/toast"
import { cn } from "@workspace/ui/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const siteUrl = "https://bookaflow.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BookaFlow — Smart Booking & Scheduling Platform",
    template: "%s | BookaFlow",
  },
  description:
    "BookaFlow is the all-in-one booking platform for salons, clinics, spas, gyms, and studios. Manage appointments, staff, customers, and payments — all in one beautiful platform.",
  keywords: [
    "booking platform",
    "appointment scheduling",
    "online booking",
    "salon booking",
    "clinic scheduling",
    "spa booking",
    "gym booking",
    "business scheduling",
    "Tanzania booking",
    "BookaFlow",
  ],
  authors: [{ name: "BookaFlow" }],
  creator: "BookaFlow",
  publisher: "BookaFlow",
  applicationName: "BookaFlow",
  category: "Business & Scheduling",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "BookaFlow",
    title: "BookaFlow — Smart Booking & Scheduling Platform",
    description:
      "The all-in-one booking platform for salons, clinics, spas, gyms, and studios. Manage appointments, staff, customers, and payments — all in one beautiful platform.",
    images: [
      {
        url: "/team-young-african-people-office-table-with-laptops_219728-4522.jpg",
        width: 1200,
        height: 630,
        alt: "BookaFlow — Smart Booking Platform for African Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BookaFlow — Smart Booking & Scheduling Platform",
    description:
      "The all-in-one booking platform for salons, clinics, spas, gyms, and studios. Manage appointments, staff, customers, and payments — all in one beautiful platform.",
    images: ["/team-young-african-people-office-table-with-laptops_219728-4522.jpg"],
  },
  icons: {
    icon: "/peercoin.png",
    apple: "/peercoin.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
