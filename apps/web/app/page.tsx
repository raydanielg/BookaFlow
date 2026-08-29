import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Hero } from "@/components/landing/sections/hero"
import { TrustStrip } from "@/components/landing/sections/trust-strip"
import { Features } from "@/components/landing/sections/features"
import { HowItWorks } from "@/components/landing/sections/how-it-works"
import { Industries } from "@/components/landing/sections/industries"
import { WhyBookaFlow } from "@/components/landing/sections/why-bookaflow"
import { CTA } from "@/components/landing/sections/cta"

export const metadata = {
  title: "BookaFlow — Booking & Scheduling Platform",
  description:
    "BookaFlow helps salons, clinics, spas, and gyms streamline appointments, staff, and customers — all in one beautiful platform.",
}

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <LandingHeader />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Features />
        <HowItWorks />
        <Industries />
        <WhyBookaFlow />
        <CTA />
      </main>
      <LandingFooter />
    </div>
  )
}
