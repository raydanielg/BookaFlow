"use client"

import Link from "next/link"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Mail01Icon,
  PhoneIcon,
  Location01Icon,
  ArrowUpRight01Icon,
  ChevronRightIcon,
} from "@hugeicons/core-free-icons"
import { RevealOnScroll } from "@/components/landing/reveal-on-scroll"

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Industries", href: "/#industries" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Contact", href: "mailto:info@lipasalama.co.tz" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-foreground">
      {/* Giant watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden leading-none"
      >
        <span className="block translate-y-[18%] text-center text-[22vw] font-bold tracking-tighter text-background/[0.03] sm:text-[18vw] lg:text-[16vw]">
          BookaFlow
        </span>
      </div>

      {/* CTA strip */}
      <RevealOnScroll>
        <div className="relative border-b border-background/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left lg:px-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-semibold tracking-tight text-background text-balance sm:text-3xl">
                Ready to streamline your bookings?
              </h3>
              <p className="text-sm text-background/50">
                Start your free account today — no credit card required.
              </p>
            </div>
            <Link
              href="/signup"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-3 text-sm font-medium text-background transition-all duration-300 hover:bg-primary/20 hover:border-primary/60"
            >
              Get started free
              <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </RevealOnScroll>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_3fr]">
          {/* Brand */}
          <RevealOnScroll>
            <div className="flex flex-col gap-5">
              <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
                <Image
                  src="/peercoin.png"
                  alt="BookaFlow"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-lg font-semibold tracking-tight text-background">
                  BookaFlow
                </span>
              </Link>
              <p className="max-w-xs text-sm text-background/50 text-pretty">
                The all-in-one booking and scheduling platform for modern businesses.
              </p>
              <div className="flex flex-col gap-2.5 text-sm text-background/50">
                <a href="mailto:info@lipasalama.co.tz" className="flex items-center gap-2 transition-colors hover:text-background">
                  <HugeiconsIcon icon={Mail01Icon} className="size-4 shrink-0 text-primary" />
                  info@lipasalama.co.tz
                </a>
                <a href="tel:+255123456789" className="flex items-center gap-2 transition-colors hover:text-background">
                  <HugeiconsIcon icon={PhoneIcon} className="size-4 shrink-0 text-primary" />
                  +255 123 456 789
                </a>
                <span className="flex items-center gap-2">
                  <HugeiconsIcon icon={Location01Icon} className="size-4 shrink-0 text-primary" />
                  Dar es Salaam, Tanzania
                </span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerSections.map((section, idx) => (
              <RevealOnScroll key={section.title} delay={idx * 80}>
                <div className="flex flex-col gap-3">
                  <h4 className="group relative text-sm font-semibold text-background">
                    {section.title}
                    <span className="absolute -bottom-1 left-0 h-px w-6 bg-primary/60 transition-all duration-300 group-hover:w-full" />
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-0.5 text-sm text-background/50 transition-colors duration-200 hover:text-background"
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                          </span>
                          <HugeiconsIcon icon={ChevronRightIcon} className="size-3.5 shrink-0 text-primary opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <div className="relative mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 sm:flex-row">
          <p className="text-sm text-background/40">
            &copy; {new Date().getFullYear()} BookaFlow. All rights reserved.
          </p>
          <p className="text-sm text-background/40">
            Built in Tanzania
          </p>
        </div>
      </div>
    </footer>
  )
}
