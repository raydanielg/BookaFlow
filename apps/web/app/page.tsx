import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Hero } from "@/components/landing/sections/hero"
import { TrustStrip } from "@/components/landing/sections/trust-strip"
import { Features } from "@/components/landing/sections/features"
import { Benefits } from "@/components/landing/sections/benefits"
import { HowItWorks } from "@/components/landing/sections/how-it-works"
import { Industries } from "@/components/landing/sections/industries"
import { Testimonials } from "@/components/landing/sections/testimonials"
import { WhyBookMiadi } from "@/components/landing/sections/why-BookMiadi"
import { CTA } from "@/components/landing/sections/cta"

export const metadata = {
  title: "BookMiadi — Booking & Scheduling Platform",
  description:
    "BookMiadi helps salons, clinics, spas, and gyms streamline appointments, staff, and customers — all in one beautiful platform.",
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
