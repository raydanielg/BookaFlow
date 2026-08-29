"use client"

import { RevealOnScroll } from "@/components/landing/reveal-on-scroll"

const steps: { number: string; title: string; desc: string }[] = [
  {
    number: "01",
    title: "Create your account",
    desc: "Sign up in seconds. Add your business name, type, and details to get started.",
  },
  {
    number: "02",
    title: "Set up services & staff",
    desc: "Add your services, pricing, and staff members. Assign staff to the services they provide.",
  },
  {
    number: "03",
    title: "Share your booking link",
    desc: "Get a unique booking page link. Share it with customers so they can book online anytime.",
  },
  {
    number: "04",
    title: "Manage appointments",
    desc: "View all bookings in your dashboard. Confirm, reschedule, or cancel with one click.",
  },
  {
    number: "05",
    title: "Track & grow",
    desc: "Monitor analytics, customer trends, and revenue to make smarter business decisions.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mb-16 max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              How it works
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Get started in minutes
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, idx) => (
            <RevealOnScroll key={step.number} delay={idx * 100}>
              <div className="group flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold text-primary transition-transform duration-300 group-hover:scale-110">
                    {step.number}
                  </span>
                  {idx < steps.length - 1 && (
                    <span className="hidden h-px flex-1 bg-border lg:block" />
                  )}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
