"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { NetworkBackground } from "@/components/landing/network-background"
import { TextRotator } from "@/components/landing/text-rotator"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent" />
        <NetworkBackground />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-8 animate-[fade-in_0.8s_ease-out]">
          <div className="flex flex-col items-center gap-6">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary animate-[fade-in_0.6s_ease-out]">
              Booking & Scheduling Platform
            </span>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl animate-[fade-in_0.8s_ease-out_0.1s_both]">
              The booking platform for
              <br className="hidden sm:block" />
              <TextRotator />.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground text-pretty animate-[fade-in_0.8s_ease-out_0.2s_both]">
              BookMiadi helps you streamline appointments, staff, and customers
              — all in one beautiful platform built for modern businesses.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row animate-[fade-in_0.8s_ease-out_0.3s_both]">
            <Link href="/signup">
              <Button
                size="lg"
                className="shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
              >
                Start free today
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4.5 transition-transform duration-300 group-hover/button:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="transition-all duration-300 hover:scale-[1.03] hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
