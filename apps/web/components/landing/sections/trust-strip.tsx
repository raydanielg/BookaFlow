"use client"

import { RevealOnScroll } from "@/components/landing/reveal-on-scroll"

const capabilities = [
  "Appointment scheduling",
  "Staff management",
  "Customer CRM",
  "Calendar sync",
  "Booking page",
]

export function TrustStrip() {
  return (
    <section className="border-b border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex flex-col items-center gap-6 py-8 lg:flex-row lg:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {capabilities.map((cap) => (
                <span
                  key={cap}
                  className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {cap}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              Made in Tanzania
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
