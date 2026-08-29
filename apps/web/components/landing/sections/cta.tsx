"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { RevealOnScroll } from "@/components/landing/reveal-on-scroll"

export function CTA() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Get started
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Ready to transform your booking experience?
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Join businesses across Africa using BookaFlow to manage
              appointments, staff, and customers — all in one place.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  Create free account
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="transition-all duration-300 hover:scale-[1.02]"
                >
                  Sign in
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required. Set up in minutes.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
