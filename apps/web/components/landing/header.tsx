"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Menu01Icon,
  ArrowRight01Icon,
  Sun03Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Industries", href: "/#industries" },
  { label: "Why BookMiadi", href: "/#why" },
]

function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle colour theme"
      onClick={() => {
        const next = !document.documentElement.classList.contains("dark")
        document.documentElement.classList.toggle("dark", next)
        document.documentElement.style.colorScheme = next ? "dark" : "light"
        try {
          window.localStorage.setItem("theme", next ? "dark" : "light")
        } catch {
          /* storage blocked */
        }
        setIsDark(next)
      }}
      className="text-muted-foreground"
    >
      {mounted && isDark ? (
        <HugeiconsIcon icon={Sun03Icon} className="size-4" />
      ) : (
        <HugeiconsIcon icon={Moon02Icon} className="size-4" />
      )}
    </Button>
  )
}

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Image
            src="/peercoin.png"
            alt="BookMiadi"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="text-base font-semibold tracking-tight text-foreground">
            BookMiadi
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Sign in
          </Link>
          <Link href="/signup">
            <Button size="sm" className="shadow-sm shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-primary/25 active:scale-95">
              Get started
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" />
              }
            >
              <HugeiconsIcon icon={Menu01Icon} className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navLinks.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  render={<Link href={link.href} />}
                >
                  {link.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem render={<Link href="/login" />}>
                Sign in
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/signup" />}>
                Get started
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
