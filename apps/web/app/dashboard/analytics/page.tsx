"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CreditCardIcon,
  Calendar03Icon,
  UserGroupIcon,
  ChartAnalysisIcon,
} from "@hugeicons/core-free-icons"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

import { Card } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { useAuth } from "@/hooks/use-auth"
import { api } from "@workspace/ui/lib/api"
import { PageHeader } from "@/components/shared/page-header"
import { MetricCard } from "@/components/shared/metric-card"

type AnalyticsData = {
  kpis: {
    revenue: { value: number; delta: number }
    appointments: { value: number; delta: number }
    customers: { value: number; delta: number }
    avgOrderValue: { value: number; delta: number }
  }
  revenueTrend: { date: string; label: string; revenue: number; appointments: number }[]
  statusBreakdown: { name: string; value: number }[]
  topServices: { name: string; bookings: number; revenue: number }[]
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "#10b981",
  CONFIRMED: "#3b82f6",
  PENDING: "#f59e0b",
  CANCELLED: "#ef4444",
  NO_SHOW: "#a78bfa",
}

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Completed",
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
}

function formatTZS(value: number) {
  if (value >= 1000000) return `TZS ${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `TZS ${Math.round(value / 1000)}K`
  return `TZS ${Math.round(value)}`
}

function ChartTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-semibold tabular-nums">
          {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { businessId, loading } = useAuth()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!businessId) return
    api.getAnalytics(businessId).then((d) => {
      setData(d)
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

  const pieData = (data?.statusBreakdown || []).map((s) => ({
    ...s,
    name: STATUS_LABELS[s.name] || s.name,
  }))

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Track your business performance over the last 7 days."
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Revenue (7d)"
          value={data ? formatTZS(data.kpis.revenue.value) : "—"}
          delta={data?.kpis.revenue.delta}
          icon={CreditCardIcon}
          loading={dataLoading}
          hint="From completed appointments"
        />
        <MetricCard
          label="Appointments (7d)"
          value={data ? String(data.kpis.appointments.value) : "—"}
          delta={data?.kpis.appointments.delta}
          icon={Calendar03Icon}
          loading={dataLoading}
          hint="All appointments this week"
        />
        <MetricCard
          label="Total Customers"
          value={data ? String(data.kpis.customers.value) : "—"}
          delta={data?.kpis.customers.delta}
          icon={UserGroupIcon}
          loading={dataLoading}
          hint="All time customers"
        />
        <MetricCard
          label="Avg Order Value"
          value={data ? formatTZS(data.kpis.avgOrderValue.value) : "—"}
          delta={data?.kpis.avgOrderValue.delta}
          icon={ChartAnalysisIcon}
          loading={dataLoading}
          hint="Revenue per appointment"
        />
      </div>

      {/* Revenue Trend + Status Breakdown */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Revenue Line/Area Chart */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Revenue Trend</h2>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
          </div>
          {dataLoading ? (
            <Skeleton className="h-[280px] w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data?.revenueTrend || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e7f76" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#1e7f76" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#71717a" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#71717a" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}K` : v)}
                />
                <Tooltip
                  content={<ChartTooltip formatter={(v: number) => formatTZS(v)} />}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1e7f76"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  dot={{ r: 4, fill: "#1e7f76", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#1e7f76", strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Appointment Status Pie Chart */}
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold tracking-tight">Appointment Status</h2>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
          {dataLoading ? (
            <Skeleton className="h-[280px] w-full rounded-lg" />
          ) : pieData.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center">
              <p className="text-sm text-muted-foreground">No appointments yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={STATUS_COLORS[entry.name] || "#71717a"} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<ChartTooltip />}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                {pieData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[entry.name] || "#71717a" }}
                    />
                    <span className="text-xs text-muted-foreground">{entry.name}</span>
                    <span className="text-xs font-semibold tabular-nums">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Top Services Bar Chart */}
      <Card className="p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold tracking-tight">Top Services by Bookings</h2>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </div>
        {dataLoading ? (
          <Skeleton className="h-[260px] w-full rounded-lg" />
        ) : (data?.topServices || []).length === 0 ? (
          <div className="flex h-[260px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No service bookings yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data?.topServices || []}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <Tooltip
                cursor={{ fill: "#f4f4f5" }}
                content={<ChartTooltip formatter={(v: number) => `${v} bookings`} />}
              />
              <Bar
                dataKey="bookings"
                fill="#1e7f76"
                radius={[0, 6, 6, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </>
  )
}
