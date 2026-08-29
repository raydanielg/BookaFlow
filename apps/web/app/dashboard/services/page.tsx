"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, ScissorsIcon } from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"

import { useAuth } from "@/hooks/use-auth"
import { api } from "@workspace/ui/lib/api"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"

type Service = {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  isActive: boolean
}

export default function ServicesPage() {
  const { businessId, loading } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!businessId) return
    api.getServices(businessId).then((data) => {
      setServices(data.services || [])
      setDataLoading(false)
    }).catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to load services")
      setDataLoading(false)
    })
  }, [businessId])

  const columns: Column<Service>[] = [
    {
      id: "name",
      header: "Service",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.name}</p>
          {row.description ? (
            <p className="truncate text-xs text-muted-foreground">{row.description}</p>
          ) : null}
        </div>
      ),
    },
    {
      id: "duration",
      header: "Duration",
      secondary: true,
      cell: (row) => <span className="text-sm text-muted-foreground">{row.duration} min</span>,
    },
    {
      id: "price",
      header: "Price",
      align: "right",
      cell: (row) => (
        <span className="font-medium tabular-nums text-sm">
          TZS {row.price.toLocaleString()}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <StatusBadge status={row.isActive ? "CONFIRMED" : "CANCELLED"} size="sm" />
      ),
    },
  ]

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><p className="text-sm text-muted-foreground">Loading...</p></div>
  }

  return (
    <>
      <PageHeader
        title="Services"
        description="What your customers can book. Set the price, duration, and availability."
        actions={
          <Button size="sm">
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Add service
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={services}
        loading={dataLoading}
        error={error}
        rowKey={(row) => row.id}
        emptyTitle="No services yet"
        emptyDescription="Add your first service so customers can start booking."
        emptyAction={
          <Button size="sm">
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Add service
          </Button>
        }
      />
    </>
  )
}
