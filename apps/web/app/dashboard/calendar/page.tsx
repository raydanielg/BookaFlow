"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon, CalendarAdd01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"

import { useAuth } from "@/hooks/use-auth"
import { PageHeader } from "@/components/shared/page-header"

const timeSlots = [
  { time: "09:00", appointment: { name: "John Doe", service: "Haircut", duration: "30 min", color: "bg-primary/10 border-primary/20" } },
  { time: "10:00", appointment: { name: "Mary James", service: "Consultation", duration: "1 hour", color: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900" } },
  { time: "11:00", appointment: null },
  { time: "12:00", appointment: { name: "Lunch", service: "Break", duration: "1 hour", color: "bg-muted border-border" } },
  { time: "13:00", appointment: null },
  { time: "14:00", appointment: { name: "Peter Smith", service: "Massage", duration: "1 hour", color: "bg-primary/10 border-primary/20" } },
  { time: "15:00", appointment: null },
  { time: "16:00", appointment: { name: "Anna Joseph", service: "Facial", duration: "45 min", color: "bg-primary/10 border-primary/20" } },
  { time: "17:00", appointment: null },
]

export default function CalendarPage() {
  const { loading } = useAuth()
  const [view, setView] = useState<"Day" | "Week" | "Month">("Day")

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><p className="text-sm text-muted-foreground">Loading...</p></div>
  }

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Your day at a glance. Click a slot to book an appointment."
        actions={
          <Button size="sm">
            <HugeiconsIcon icon={CalendarAdd01Icon} className="size-4" />
            New appointment
          </Button>
        }
      />

      {/* Date navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="size-8">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            </Button>
            <Button variant="outline" size="icon" className="size-8">
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">Today</Button>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          {(["Day", "Week", "Month"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Day view */}
      <Card className="gap-0 p-4">
        <div className="flex flex-col">
          {timeSlots.map((slot, i) => (
            <div key={i} className="flex gap-4 border-b border-border/60 last:border-0 min-h-[80px]">
              <div className="w-16 shrink-0 pt-3 text-sm font-medium tabular-nums text-muted-foreground">
                {slot.time}
              </div>
              <div className="flex-1 py-2">
                {slot.appointment ? (
                  <div className={`flex flex-col gap-1 rounded-lg border p-3 ${slot.appointment.color}`}>
                    <p className="text-sm font-medium">{slot.appointment.name}</p>
                    <p className="text-xs text-muted-foreground">{slot.appointment.service} · {slot.appointment.duration}</p>
                  </div>
                ) : (
                  <button className="flex h-full min-h-[48px] w-full items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                    Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
