import type { Metadata } from "next"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Hero } from "@/components/landing/sections/hero"
import { TrustStrip } from "@/components/landing/sections/trust-strip"
import { Features } from "@/components/landing/sections/features"
import { Benefits } from "@/components/landing/sections/benefits"
import { HowItWorks } from "@/components/landing/sections/how-it-works"
import { Industries } from "@/components/landing/sections/industries"
import { Testimonials } from "@/components/landing/sections/testimonials"
import { WhyBookMiadi } from "@/components/landing/sections/why-bookaflow"
import { CTA } from "@/components/landing/sections/cta"

export const metadata: Metadata = {
  title: "BookMiadi — Smart Booking & Scheduling Platform",
  description:
    "BookMiadi is the all-in-one booking platform for salons, clinics, spas, gyms, and studios in Tanzania. Manage appointments, staff, customers, and payments — all in one beautiful platform.",
  openGraph: {
    title: "BookMiadi — Smart Booking & Scheduling Platform",
    description:
      "The all-in-one booking platform for salons, clinics, spas, gyms, and studios. Manage appointments, staff, customers, and payments — all in one beautiful platform.",
    images: [
      {
        url: "/team-young-african-people-office-table-with-laptops_219728-4522.jpg",
        width: 1200,
        height: 630,
        alt: "BookMiadi — Smart Booking Platform for African Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BookMiadi — Smart Booking & Scheduling Platform",
    description:
      "The all-in-one booking platform for salons, clinics, spas, gyms, and studios. Manage appointments, staff, customers, and payments — all in one beautiful platform.",
    images: ["/team-young-african-people-office-table-with-laptops_219728-4522.jpg"],
  },
}

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <LandingHeader />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Features />
        <Benefits />
        <HowItWorks />
        <Industries />
        <Testimonials />
        <WhyBookMiadi />
        <CTA />
      </main>
      <LandingFooter />
    </div>
  )
}
