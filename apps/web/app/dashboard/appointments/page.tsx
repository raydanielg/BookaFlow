"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CalendarAdd01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"

import { useAuth } from "@/hooks/use-auth"
import { api } from "@workspace/ui/lib/api"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"

type Appointment = {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  customer: { name: string; phone: string }
  service: { name: string; price: number }
  staff: { name: string }
}

export default function AppointmentsPage() {
  const { businessId, loading } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!businessId) return
    api.getAppointments(businessId).then((data) => {
      setAppointments(data.appointments || [])
      setDataLoading(false)
    }).catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to load appointments")
      setDataLoading(false)
    })
  }, [businessId])

  const filtered = search
    ? appointments.filter((a) =>
        a.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        a.service.name.toLowerCase().includes(search.toLowerCase()) ||
        a.staff.name.toLowerCase().includes(search.toLowerCase())
      )
    : appointments

  const columns: Column<Appointment>[] = [
    {
      id: "customer",
      header: "Customer",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.customer.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.customer.phone}</p>
        </div>
      ),
    },
    {
      id: "service",
      header: "Service",
      cell: (row) => <span className="text-sm">{row.service.name}</span>,
    },
    {
      id: "staff",
      header: "Staff",
      secondary: true,
      cell: (row) => <span className="text-sm">{row.staff.name}</span>,
    },
    {
      id: "date",
      header: "Date",
      secondary: true,
      cell: (row) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {new Date(row.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      id: "time",
      header: "Time",
      cell: (row) => (
        <span className="tabular-nums text-sm">{row.startTime} — {row.endTime}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      id: "price",
      header: "Price",
      align: "right",
      cell: (row) => (
        <span className="font-medium tabular-nums text-sm">
          TZS {row.service.price.toLocaleString()}
        </span>
      ),
    },
  ]

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><p className="text-sm text-muted-foreground">Loading...</p></div>
  }

  return (
    <>
      <PageHeader
        title="Appointments"
        description="Every booking on your calendar, with the customer, service, and staff member."
        actions={
          <Button size="sm">
            <HugeiconsIcon icon={CalendarAdd01Icon} className="size-4" />
            New appointment
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        loading={dataLoading}
        error={error}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Customer, service, or staff…"
        rowKey={(row) => row.id}
        emptyTitle="No appointments yet"
        emptyDescription="Your first booking will appear here the moment it's created."
        emptyAction={
          <Button size="sm">
            <HugeiconsIcon icon={CalendarAdd01Icon} className="size-4" />
            New appointment
          </Button>
        }
      />
    </>
  )
}
