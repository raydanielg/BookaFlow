"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  Clock01Icon,
  CheckmarkCircle01Icon,
  AddMoneyCircleIcon,
} from "@hugeicons/core-free-icons"
import { RevealOnScroll } from "@/components/landing/reveal-on-scroll"

const stats = [
  {
    icon: Calendar03Icon,
    value: "10,000+",
    label: "Appointments managed",
  },
  {
    icon: Clock01Icon,
    value: "80%",
    label: "Less time on scheduling",
  },
  {
    icon: CheckmarkCircle01Icon,
    value: "60%",
    label: "Fewer no-shows",
  },
  {
    icon: AddMoneyCircleIcon,
    value: "3x",
    label: "Faster checkout",
  },
]

export function Stats() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <RevealOnScroll key={stat.label} delay={idx * 80}>
              <div className="flex flex-col items-center gap-3 rounded-xl border border-border/60 p-6 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <HugeiconsIcon icon={stat.icon} className="size-6 text-primary" />
                </div>
                <span className="text-3xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
