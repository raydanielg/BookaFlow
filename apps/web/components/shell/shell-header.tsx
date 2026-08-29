"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"

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
          const value = next ? "dark" : "light"
          window.localStorage.setItem("theme", value)
        } catch {
          /* storage blocked */
        }
        setIsDark(next)
      }}
      className="text-muted-foreground"
    >
      {mounted && isDark ? <HugeiconsIcon icon={Sun03Icon} className="size-4" /> : <HugeiconsIcon icon={Moon02Icon} className="size-4" />}
    </Button>
  )
}

export function ShellHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="min-w-0 flex-1">{children}</div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
      </div>
    </header>
  )
}
