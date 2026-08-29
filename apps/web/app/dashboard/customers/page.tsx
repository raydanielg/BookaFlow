"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserAdd01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"

import { useAuth } from "@/hooks/use-auth"
import { api } from "@workspace/ui/lib/api"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"

type Customer = {
  id: string
  name: string
  phone: string
  email: string | null
  visits: number
  createdAt: string
}

export default function CustomersPage() {
  const { businessId, loading } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!businessId) return
    api.getCustomers(businessId, search || undefined).then((data) => {
      setCustomers(data.customers || [])
      setDataLoading(false)
    }).catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to load customers")
      setDataLoading(false)
    })
  }, [businessId, search])

  const columns: Column<Customer>[] = [
    {
      id: "name",
      header: "Customer",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.name || "Unnamed"}</p>
          <p className="truncate text-xs text-muted-foreground">{row.email ?? row.phone}</p>
        </div>
      ),
    },
    {
      id: "phone",
      header: "Phone",
      secondary: true,
      cell: (row) => <span className="text-sm tabular-nums text-muted-foreground">{row.phone}</span>,
    },
    {
      id: "visits",
      header: "Visits",
      align: "right",
      cell: (row) => <span className="tabular-nums text-sm">{row.visits}</span>,
    },
    {
      id: "created",
      header: "First seen",
      align: "right",
      secondary: true,
      cell: (row) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
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
        title="Customers"
        description="People who have booked with you, grouped by phone number."
        actions={
          <Button size="sm">
            <HugeiconsIcon icon={UserAdd01Icon} className="size-4" />
            Add customer
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={customers}
        loading={dataLoading}
        error={error}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Name, phone, or email…"
        rowKey={(row) => row.id}
        emptyTitle="No customers yet"
        emptyDescription="A customer record is created the first time someone books with you."
      />
    </>
  )
}
