"use client"

import { RevealOnScroll } from "@/components/landing/reveal-on-scroll"

const industries = [
  "Salons & Barbershops",
  "Clinics & Health Centers",
  "Spas & Wellness Centers",
  "Gyms & Fitness Studios",
  "Consultation Firms",
  "Beauty Studios",
  "Massage Therapy",
  "Tattoo Studios",
  "Photography Studios",
  "Tutoring Centers",
  "Pet Grooming",
  "Other Services",
]

export function Industries() {
  return (
    <section id="industries" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Industries
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Built for service businesses
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              BookMiadi works for any business that takes appointments.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="flex flex-wrap gap-3">
            {industries.map((ind) => (
              <span
                key={ind}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:text-foreground hover:-translate-y-0.5"
              >
                {ind}
              </span>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
