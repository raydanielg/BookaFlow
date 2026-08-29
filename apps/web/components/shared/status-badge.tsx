import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  Clock01Icon,
  Cancel01Icon,
  AlertCircleIcon,
  TimeQuarterPassIcon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@workspace/ui/lib/utils"

type Tone = "good" | "warning" | "serious" | "critical" | "neutral" | "info"

const TONE_CLASS: Record<Tone, string> = {
  good: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-400",
  serious: "bg-orange-500/10 text-orange-700 ring-orange-500/25 dark:text-orange-400",
  critical: "bg-red-500/10 text-red-700 ring-red-500/25 dark:text-red-400",
  info: "bg-sky-500/10 text-sky-700 ring-sky-500/25 dark:text-sky-400",
  neutral: "bg-muted text-muted-foreground ring-border",
}

interface StatusMeta {
  tone: Tone
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  label?: string
}

const STATUS: Record<string, StatusMeta> = {
  CONFIRMED: { tone: "good", icon: CheckmarkCircle01Icon },
  PENDING: { tone: "warning", icon: Clock01Icon },
  COMPLETED: { tone: "good", icon: CheckmarkCircle01Icon },
  CANCELLED: { tone: "neutral", icon: Cancel01Icon },
  NO_SHOW: { tone: "critical", icon: AlertCircleIcon },
  BOOKED: { tone: "info", icon: TimeQuarterPassIcon },
}

function humanise(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
}

export function StatusBadge({
  status,
  className,
  size = "default",
}: {
  status: string | null | undefined
  className?: string
  size?: "default" | "sm"
}) {
  if (!status) {
    return <span className="text-muted-foreground">—</span>
  }

  const meta = STATUS[status] ?? STATUS[status.toUpperCase()] ?? {
    tone: "neutral" as const,
    icon: HelpCircleIcon,
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium ring-1 ring-inset",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        TONE_CLASS[meta.tone],
        className,
      )}
    >
      <HugeiconsIcon icon={meta.icon} className={size === "sm" ? "size-3" : "size-3.5"} aria-hidden />
      {meta.label ?? humanise(status)}
    </span>
  )
}
