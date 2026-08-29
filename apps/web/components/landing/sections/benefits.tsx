"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  UserGroupIcon,
  CustomerServiceIcon,
  Chart01Icon,
  BellRingIcon,
  Link01Icon,
  Clock01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons"
import { RevealOnScroll } from "@/components/landing/reveal-on-scroll"

const benefits = [
  { icon: Calendar03Icon, title: "Smart calendar", desc: "See all appointments at a glance. Drag to reschedule." },
  { icon: UserGroupIcon, title: "Team scheduling", desc: "Assign staff to services and manage their availability." },
  { icon: CustomerServiceIcon, title: "Customer profiles", desc: "Track history, preferences, and contact details." },
  { icon: Chart01Icon, title: "Revenue insights", desc: "Know your busiest days and most profitable services." },
  { icon: BellRingIcon, title: "Auto reminders", desc: "SMS and email reminders reduce no-shows by 60%." },
  { icon: Link01Icon, title: "Booking page", desc: "Share your link. Customers book online 24/7." },
  { icon: Clock01Icon, title: "Time slots", desc: "Set custom time slots and buffer times per service." },
  { icon: CheckmarkCircle01Icon, title: "Confirm bookings", desc: "Approve or decline bookings with one click." },
]

export function Benefits() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mb-16 max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Benefits
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Powerful tools, beautifully simple
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Everything you need to manage your booking business, nothing you don&apos;t.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {benefits.map((benefit, idx) => (
            <RevealOnScroll key={benefit.title} delay={idx * 60}>
              <div className="group flex items-start gap-4 rounded-xl border border-border/60 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <HugeiconsIcon icon={benefit.icon} className="size-5 text-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
