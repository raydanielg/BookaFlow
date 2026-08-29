"use client"

import { RevealOnScroll } from "@/components/landing/reveal-on-scroll"

const reasons: { title: string; desc: string }[] = [
  {
    title: "No technical skills needed",
    desc: "Set up your booking system in minutes. No coding, no complex configuration — just sign up and go.",
  },
  {
    title: "Reduce no-shows",
    desc: "Automatic reminders keep your customers informed and significantly reduce missed appointments.",
  },
  {
    title: "Save time daily",
    desc: "Stop managing bookings on paper or WhatsApp. Everything is organized in one beautiful dashboard.",
  },
  {
    title: "Look professional",
    desc: "Give your customers a modern booking experience with your own branded booking page.",
  },
  {
    title: "Make data-driven decisions",
    desc: "See which services are most popular, busiest days, and revenue trends at a glance.",
  },
  {
    title: "Built for Africa",
    desc: "Designed and built in Tanzania. Works great on low bandwidth and mobile-first audiences.",
  },
]

export function WhyBookaFlow() {
  return (
    <section id="why" className="bg-foreground py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mb-16 max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Why BookaFlow
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-background text-balance sm:text-4xl lg:text-5xl">
              The smarter way to manage bookings
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid gap-px overflow-hidden rounded-xl border border-background/8 bg-background/8 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, idx) => (
            <RevealOnScroll key={reason.title} delay={idx * 70}>
              <div className="flex h-full flex-col gap-3 bg-foreground p-8 transition-colors duration-300 hover:bg-background/[0.03]">
                <h3 className="text-lg font-semibold text-background">
                  {reason.title}
                </h3>
                <p className="text-sm text-background/50">{reason.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
