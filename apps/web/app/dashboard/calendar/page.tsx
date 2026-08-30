"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CalendarAdd01Icon,
  Clock01Icon,
  CheckmarkCircle01Icon,
  TimeQuarterPassIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { useAuth } from "@/hooks/use-auth"
import { api } from "@workspace/ui/lib/api"
import { PageHeader } from "@/components/shared/page-header"

type Appointment = {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  notes: string | null
  customer: { id: string; name: string; phone: string; email: string | null }
  service: { id: string; name: string; price: number; duration: number }
  staff: { id: string; name: string }
}

type Staff = { id: string; name: string; title: string | null }

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string; dot: string; label: string }> = {
  COMPLETED: { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-900", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500", label: "Completed" },
  CONFIRMED: { bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-900", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500", label: "Confirmed" },
  PENDING: { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-900", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500", label: "Pending" },
  CANCELLED: { bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-900", text: "text-red-700 dark:text-red-400", dot: "bg-red-500", label: "Cancelled" },
  NO_SHOW: { bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-900", text: "text-violet-700 dark:text-violet-400", dot: "bg-violet-500", label: "No Show" },
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8)

function formatDate(d: Date) {
  return d.toISOString().split("T")[0] || ""
}

function getWeekStart(d: Date) {
  const start = new Date(d)
  const day = start.getDay()
  const diff = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diff)
  start.setHours(0, 0, 0, 0)
  return start
}

function getWeekDays(start: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

function getMonthDays(d: Date) {
  const year = d.getFullYear()
  const month = d.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDay = firstDay.getDay()
  const startDate = new Date(firstDay)
  const diff = startDay === 0 ? -6 : 1 - startDay
  startDate.setDate(firstDay.getDate() + diff)
  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate)
    day.setDate(startDate.getDate() + i)
    days.push(day)
  }
  return days
}

function timeToMinutes(time: string) {
  const parts = time.split(":").map(Number)
  return (parts[0] || 0) * 60 + (parts[1] || 0)
}

export default function CalendarPage() {
  const { businessId, loading } = useAuth()
  const [view, setView] = useState<"Day" | "Week" | "Month">("Day")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [staffFilter, setStaffFilter] = useState<string>("all")
  const [dataLoading, setDataLoading] = useState(true)
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null)

  useEffect(() => {
    if (!businessId) return
    api.getStaff(businessId).then((data: any) => {
      setStaff(data.staff || data || [])
    }).catch(() => {})
  }, [businessId])

  const fetchAppointments = useCallback(() => {
    if (!businessId) return
    setDataLoading(true)
    let from = ""
    let to = ""
    if (view === "Day") {
      from = formatDate(currentDate)
      to = from
    } else if (view === "Week") {
      const start = getWeekStart(currentDate)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      from = formatDate(start)
      to = formatDate(end)
    } else {
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      from = formatDate(start)
      to = formatDate(end)
    }
    const params: Record<string, string> = { from, to }
    if (staffFilter !== "all") params.staffId = staffFilter
    api.getAppointments(businessId, params).then((data: any) => {
      setAppointments(data.appointments || [])
      setDataLoading(false)
    }).catch(() => setDataLoading(false))
  }, [businessId, currentDate, view, staffFilter])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const apptsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {}
    appointments.forEach((a) => {
      const d = formatDate(new Date(a.date))
      if (!map[d]) map[d] = []
      map[d]!.push(a)
    })
    return map
  }, [appointments])

  const navigate = (dir: "prev" | "next" | "today") => {
    if (dir === "today") { setCurrentDate(new Date()); return }
    const d = new Date(currentDate)
    if (view === "Day") d.setDate(d.getDate() + (dir === "next" ? 1 : -1))
    else if (view === "Week") d.setDate(d.getDate() + (dir === "next" ? 7 : -7))
    else d.setMonth(d.getMonth() + (dir === "next" ? 1 : -1))
    setCurrentDate(d)
  }

  const headerDateLabel = useMemo(() => {
    if (view === "Day") return currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    if (view === "Week") {
      const start = getWeekStart(currentDate)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    }
    return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }, [currentDate, view])

  const isToday = (d: Date) => {
    const today = new Date()
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  }
  const isSameMonth = (d: Date) => d.getMonth() === currentDate.getMonth()

  const handleStatusUpdate = async (id: string, status: string) => {
    if (!businessId) return
    try {
      await api.updateAppointmentStatus(businessId, id, status)
      fetchAppointments()
      setSelectedAppt(null)
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Manage your appointments with day, week, and month views."
        actions={
          <Button size="sm" render={<a href="/dashboard/appointments" />}>
            <HugeiconsIcon icon={CalendarAdd01Icon} className="size-4" />
            New appointment
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight">{headerDateLabel}</h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="size-8" onClick={() => navigate("prev")}>
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            </Button>
            <Button variant="outline" size="icon" className="size-8" onClick={() => navigate("next")}>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("today")}>Today</Button>
        </div>
        <div className="flex items-center gap-2">
          {staff.length > 1 && (
            <select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="all">All staff</option>
              {staff.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
          )}
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            {(["Day", "Week", "Month"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {dataLoading ? (
        <Skeleton className="h-[600px] w-full rounded-xl" />
      ) : view === "Day" ? (
        <DayView date={currentDate} appts={apptsByDate[formatDate(currentDate)] || []} onSelect={setSelectedAppt} />
      ) : view === "Week" ? (
        <WeekView weekStart={getWeekStart(currentDate)} apptsByDate={apptsByDate} onSelect={setSelectedAppt} isToday={isToday} />
      ) : (
        <MonthView days={getMonthDays(currentDate)} apptsByDate={apptsByDate} isToday={isToday} isSameMonth={isSameMonth} onSelect={setSelectedAppt} />
      )}

      {selectedAppt && (
        <AppointmentPanel appointment={selectedAppt} onClose={() => setSelectedAppt(null)} onStatusUpdate={handleStatusUpdate} />
      )}
    </>
  )
}

function DayView({ date, appts, onSelect }: { date: Date; appts: Appointment[]; onSelect: (a: Appointment) => void }) {
  return (
    <Card className="gap-0 p-0 overflow-hidden">
      <div className="relative" style={{ height: HOURS.length * 72 + 40 }}>
        {HOURS.map((hour, i) => (
          <div key={i} className="absolute left-0 right-0 flex border-t border-border/40" style={{ top: i * 72 + 20 }}>
            <div className="w-16 shrink-0 -translate-y-2 pl-3 text-xs font-medium tabular-nums text-muted-foreground">
              {hour > 12 ? hour - 12 : hour}{hour >= 12 ? "PM" : "AM"}
            </div>
            <div className="flex-1" />
          </div>
        ))}
        <div className="absolute left-16 right-3" style={{ top: 20, height: HOURS.length * 72 }}>
          {appts.filter((a: Appointment) => a.status !== "CANCELLED").map((a) => {
            const startMin = timeToMinutes(a.startTime)
            const endMin = timeToMinutes(a.endTime)
            const top = (startMin - 8 * 60) * 1.2
            const height = Math.max((endMin - startMin) * 1.2, 36)
            const style = STATUS_STYLES[a.status] ?? { bg: "", border: "", text: "", dot: "", label: a.status }
            return (
              <button key={a.id} onClick={() => onSelect(a)}
                className={`absolute left-0 right-0 rounded-lg border p-2 text-left transition-all hover:shadow-md ${style.bg} ${style.border}`}
                style={{ top, height }}>
                <div className="flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${style.dot}`} />
                  <p className="truncate text-sm font-medium">{a.customer.name}</p>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{a.service.name}</p>
                <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">{a.startTime} — {a.endTime}</p>
              </button>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

function WeekView({ weekStart, apptsByDate, onSelect, isToday }: { weekStart: Date; apptsByDate: Record<string, Appointment[]>; onSelect: (a: Appointment) => void; isToday: (d: Date) => boolean }) {
  const days = getWeekDays(weekStart)
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return (
    <Card className="gap-0 p-0 overflow-hidden">
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
        <div className="border-r border-border" />
        {days.map((d, i) => (
          <div key={i} className={`border-r border-border px-2 py-3 text-center ${isToday(d) ? "bg-primary/5" : ""}`}>
            <p className="text-xs font-medium text-muted-foreground">{dayNames[i]}</p>
            <p className={`mt-0.5 text-lg font-semibold ${isToday(d) ? "text-primary" : ""}`}>{d.getDate()}</p>
          </div>
        ))}
      </div>
      <div className="relative overflow-y-auto" style={{ maxHeight: 600 }}>
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          <div className="border-r border-border">
            {HOURS.map((hour, i) => (
              <div key={i} className="h-16 border-b border-border/40 px-2 pt-1 text-right text-xs font-medium tabular-nums text-muted-foreground">
                {hour > 12 ? hour - 12 : hour}{hour >= 12 ? "PM" : "AM"}
              </div>
            ))}
          </div>
          {days.map((d, i) => {
            const dateStr = formatDate(d)
            const dayAppts = apptsByDate[dateStr] || []
            return (
              <div key={i} className={`relative border-r border-border ${isToday(d) ? "bg-primary/[0.02]" : ""}`}>
                {HOURS.map((_, hi) => (<div key={hi} className="h-16 border-b border-border/40" />))}
                {dayAppts.filter((a: Appointment) => a.status !== "CANCELLED").map((a) => {
                  const startMin = timeToMinutes(a.startTime)
                  const endMin = timeToMinutes(a.endTime)
                  const top = (startMin - 8 * 60) * (64 / 60)
                  const height = Math.max((endMin - startMin) * (64 / 60), 28)
                  const style = STATUS_STYLES[a.status] ?? { bg: "", border: "", text: "", dot: "", label: a.status }
                  return (
                    <button key={a.id} onClick={() => onSelect(a)}
                      className={`absolute left-1 right-1 rounded-md border p-1.5 text-left transition-all hover:shadow-sm ${style.bg} ${style.border}`}
                      style={{ top, height }}>
                      <p className="truncate text-xs font-medium">{a.customer.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{a.startTime} {a.service.name}</p>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

function MonthView({ days, apptsByDate, isToday, isSameMonth, onSelect }: { days: Date[]; apptsByDate: Record<string, Appointment[]>; isToday: (d: Date) => boolean; isSameMonth: (d: Date) => boolean; onSelect: (a: Appointment) => void }) {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return (
    <Card className="gap-0 p-0 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border">
        {dayNames.map((d) => (<div key={d} className="border-r border-border px-3 py-2 text-xs font-semibold text-muted-foreground">{d}</div>))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const dateStr = formatDate(d)
          const dayAppts = apptsByDate[dateStr] || []
          return (
            <div key={i} className={`min-h-[110px] border-r border-b border-border p-1.5 ${!isSameMonth(d) ? "bg-muted/30" : ""} ${isToday(d) ? "ring-2 ring-primary ring-inset" : ""}`}>
              <p className={`mb-1 text-xs font-medium ${!isSameMonth(d) ? "text-muted-foreground/50" : isToday(d) ? "text-primary" : "text-muted-foreground"}`}>{d.getDate()}</p>
              <div className="flex flex-col gap-0.5">
                {dayAppts.slice(0, 3).map((a: Appointment) => {
                  const style = STATUS_STYLES[a.status] ?? { bg: "", border: "", text: "", dot: "", label: a.status }
                  return (
                    <button key={a.id} onClick={() => onSelect(a)}
                      className={`flex items-center gap-1 rounded px-1 py-0.5 text-left text-[10px] transition-all hover:shadow-sm ${style.bg}`}>
                      <span className={`size-1.5 shrink-0 rounded-full ${style.dot}`} />
                      <span className="truncate font-medium">{a.startTime} {a.customer.name}</span>
                    </button>
                  )
                })}
                {dayAppts.length > 3 && (<p className="px-1 text-[10px] text-muted-foreground">+{dayAppts.length - 3} more</p>)}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function AppointmentPanel({ appointment, onClose, onStatusUpdate }: { appointment: Appointment; onClose: () => void; onStatusUpdate: (id: string, status: string) => void }) {
  const style = STATUS_STYLES[appointment.status] ?? { bg: "", border: "", text: "", dot: "", label: appointment.status }
  const apptDate = new Date(appointment.date)
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/20 p-0 sm:p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-t-xl border border-border bg-background p-5 shadow-xl sm:rounded-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`size-2.5 rounded-full ${style.dot}`} />
              <span className={`text-xs font-semibold ${style.text}`}>{style.label}</span>
            </div>
            <h3 className="mt-1.5 text-lg font-semibold">{appointment.customer.name}</h3>
            <p className="text-sm text-muted-foreground">{appointment.service.name}</p>
          </div>
          <Button variant="ghost" size="icon" className="size-8" onClick={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Clock01Icon} className="size-4 text-muted-foreground" />
            <span className="tabular-nums">{apptDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {appointment.startTime} — {appointment.endTime}</span>
          </div>
          <div className="flex items-center gap-2"><span className="text-muted-foreground">Staff:</span><span className="font-medium">{appointment.staff.name}</span></div>
          <div className="flex items-center gap-2"><span className="text-muted-foreground">Price:</span><span className="font-medium tabular-nums">TZS {appointment.service.price.toLocaleString()}</span></div>
          <div className="flex items-center gap-2"><span className="text-muted-foreground">Phone:</span><span className="font-medium">{appointment.customer.phone}</span></div>
          {appointment.notes && (<div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">{appointment.notes}</div>)}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {appointment.status !== "CONFIRMED" && (<Button size="sm" variant="outline" onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}><HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />Confirm</Button>)}
          {appointment.status !== "COMPLETED" && (<Button size="sm" variant="outline" onClick={() => onStatusUpdate(appointment.id, "COMPLETED")}><HugeiconsIcon icon={TimeQuarterPassIcon} className="size-4" />Complete</Button>)}
          {appointment.status !== "CANCELLED" && (<Button size="sm" variant="outline" onClick={() => onStatusUpdate(appointment.id, "CANCELLED")}><HugeiconsIcon icon={Cancel01Icon} className="size-4" />Cancel</Button>)}
        </div>
      </div>
    </div>
  )
}
