"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  UserGroupIcon,
  CreditCardIcon,
  CalendarAdd01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  TimeQuarterPassIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { useAuth } from "@/hooks/use-auth"
import { api } from "@workspace/ui/lib/api"
import { PageHeader } from "@/components/shared/page-header"
import { MetricCard } from "@/components/shared/metric-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/states"

type ScheduleItem = {
  id: string
  startTime: string
  endTime: string
  status: string
  customer: { name: string; phone: string }
  service: { name: string; price: number }
  staff: { name: string }
}

export default function DashboardPage() {
  const { user, businessId, loading } = useAuth()
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [stats, setStats] = useState({ appointmentsToday: 0, totalCustomers: 0, revenueToday: 0 })
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!businessId) return
    api.getDashboard(businessId).then((data) => {
      setSchedule(data.schedule || [])
      setStats(data.overview || { appointmentsToday: 0, totalCustomers: 0, revenueToday: 0 })
      setDataLoading(false)
    }).catch(() => setDataLoading(false))
  }, [businessId])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    )
  }

  const firstName = user?.fullName?.split(" ")[0] || "there"

  return (
    <>
      <PageHeader
        title={`Good to see you, ${firstName}`}
        description="Here's how your business is doing today."
        actions={
          <>
            <Button variant="outline" size="sm" render={<Link href="/dashboard/appointments" />}>
              View appointments
            </Button>
            <Button size="sm" render={<Link href="/dashboard/calendar" />}>
              New appointment
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Appointments today"
          value={String(stats.appointmentsToday)}
          icon={Calendar03Icon}
          loading={dataLoading}
          hint="Across all staff"
        />
        <MetricCard
          label="Total customers"
          value={String(stats.totalCustomers)}
          icon={UserGroupIcon}
          loading={dataLoading}
          hint="All time"
        />
        <MetricCard
          label="Revenue today"
          value={`TZS ${Math.round(stats.revenueToday / 1000)}K`}
          icon={CreditCardIcon}
          loading={dataLoading}
          hint="From completed appointments"
        />
        <MetricCard
          label="Pending"
          value={String(schedule.filter((s) => s.status === "PENDING").length)}
          icon={Clock01Icon}
          loading={dataLoading}
          hint="Awaiting confirmation"
        />
      </div>

      {/* Schedule + counts */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        {/* Today's schedule */}
        <Card className="gap-0 overflow-hidden p-0">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
            <h2 className="text-base font-semibold tracking-tight">Today&apos;s schedule</h2>
            <Button variant="ghost" size="sm" render={<Link href="/dashboard/calendar" />}>
              View all
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Button>
          </div>

          {dataLoading ? (
            <div className="divide-y divide-border/60">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse bg-muted/30" />
              ))}
            </div>
          ) : schedule.length === 0 ? (
            <EmptyState
              title="No appointments today"
              description="Your first booking will appear here the moment it comes in."
              className="border-0"
              action={
                <Button size="sm" render={<Link href="/dashboard/calendar" />}>
                  <HugeiconsIcon icon={CalendarAdd01Icon} className="size-4" />
                  Add appointment
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-border/60">
              {schedule.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/dashboard/appointments`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40"
                  >
                    <div className="w-14 shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
                      {item.startTime}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.customer.name}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {item.service.name} · {item.staff.name}
                      </p>
                    </div>
                    <StatusBadge status={item.status} size="sm" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Side cards */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <MetricCard
            label="Confirmed"
            value={String(schedule.filter((s) => s.status === "CONFIRMED").length)}
            icon={CheckmarkCircle01Icon}
            loading={dataLoading}
            hint="Ready to go"
          />
          <MetricCard
            label="Pending"
            value={String(schedule.filter((s) => s.status === "PENDING").length)}
            icon={Clock01Icon}
            loading={dataLoading}
            hint="Awaiting confirmation"
          />
          <MetricCard
            label="Completed"
            value={String(schedule.filter((s) => s.status === "COMPLETED").length)}
            icon={TimeQuarterPassIcon}
            loading={dataLoading}
            hint="Finished today"
          />
        </div>
      </div>
    </>
  )
}
