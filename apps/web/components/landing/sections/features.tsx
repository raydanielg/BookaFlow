"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  Calendar03Icon,
  UserGroupIcon,
  CustomerServiceIcon,
  Chart01Icon,
  BellRingIcon,
  Link01Icon,
} from "@hugeicons/core-free-icons"
import { RevealOnScroll } from "@/components/landing/reveal-on-scroll"

const features: {
  number: string
  icon: typeof Calendar03Icon
  title: string
  desc: string
}[] = [
  {
    number: "01",
    icon: Calendar03Icon,
    title: "Appointment Scheduling",
    desc: "Book, reschedule, and manage appointments with an intuitive calendar interface. Avoid double-bookings automatically.",
  },
  {
    number: "02",
    icon: UserGroupIcon,
    title: "Staff Management",
    desc: "Assign staff to services, set working hours, and track performance — all from one dashboard.",
  },
  {
    number: "03",
    icon: CustomerServiceIcon,
    title: "Customer CRM",
    desc: "Keep track of customer history, contact info, and booking patterns to deliver personalized service.",
  },
  {
    number: "04",
    icon: Chart01Icon,
    title: "Analytics & Reports",
    desc: "Monitor revenue, appointment trends, and staff performance with real-time dashboard metrics.",
  },
  {
    number: "05",
    icon: BellRingIcon,
    title: "Smart Notifications",
    desc: "Automatic SMS and email reminders for upcoming appointments — reduce no-shows and keep customers engaged.",
  },
  {
    number: "06",
    icon: Link01Icon,
    title: "Public Booking Page",
    desc: "Share your unique booking link with customers. They can book appointments online — no account needed.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mb-16 max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Features
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Everything you need to run your booking business
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <RevealOnScroll key={feature.number} delay={idx * 60} className="h-full">
              <div className="group flex h-full flex-col gap-4 bg-background p-8 transition-all duration-300 hover:bg-muted/30 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                    <HugeiconsIcon icon={feature.icon} className="size-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground/50">
                    {feature.number}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
