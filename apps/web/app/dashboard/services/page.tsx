"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, ScissorsIcon, Cancel01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

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
  category: string | null
}

export default function ServicesPage() {
  const { businessId, loading } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const fetchServices = () => {
    if (!businessId) return
    setDataLoading(true)
    api.getServices(businessId).then((data) => {
      setServices(data.services || [])
      setDataLoading(false)
    }).catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to load services")
      setDataLoading(false)
    })
  }

  useEffect(() => {
    fetchServices()
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
          <Button size="sm" onClick={() => setDrawerOpen(true)}>
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
          <Button size="sm" onClick={() => setDrawerOpen(true)}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Add service
          </Button>
        }
      />

      {drawerOpen && (
        <ServiceDrawer
          businessId={businessId}
          onClose={() => setDrawerOpen(false)}
          onSaved={() => { setDrawerOpen(false); fetchServices() }}
        />
      )}
    </>
  )
}

function ServiceDrawer({ businessId, onClose, onSaved }: { businessId: string | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!businessId) return
    setSaving(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const body: Record<string, unknown> = {
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      price: parseFloat(formData.get("price") as string),
      duration: parseInt(formData.get("duration") as string, 10),
      category: formData.get("category") || undefined,
      deposit: formData.get("deposit") ? parseFloat(formData.get("deposit") as string) : undefined,
      availableOnline: formData.get("availableOnline") === "on",
    }

    try {
      await api.createService(businessId, body)
      onSaved()
    } catch (err: any) {
      setError(err.message || "Failed to create service")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon icon={ScissorsIcon} className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Add Service</h2>
              <p className="text-xs text-muted-foreground">Create a new bookable service</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="size-8" onClick={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form onSubmit={handleSubmit} id="service-form" className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Service Name *</Label>
              <Input name="name" required placeholder="e.g. Haircut & Style" className="h-10" />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Description</Label>
              <textarea
                name="description"
                rows={3}
                placeholder="Brief description of what this service includes..."
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Price (TZS) *</Label>
                <Input name="price" type="number" required placeholder="25000" className="h-10" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Duration (min) *</Label>
                <Input name="duration" type="number" required placeholder="30" className="h-10" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Category</Label>
                <Input name="category" placeholder="e.g. Hair Care" className="h-10" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Deposit (optional)</Label>
                <Input name="deposit" type="number" placeholder="5000" className="h-10" />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border p-3">
              <input type="checkbox" name="availableOnline" defaultChecked className="size-4 rounded border-input" />
              <div>
                <p className="text-sm font-medium">Available for online booking</p>
                <p className="text-xs text-muted-foreground">Customers can book this service online</p>
              </div>
            </label>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="service-form" size="sm" loading={saving}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Add service
          </Button>
        </div>
      </div>
    </>
  )
}
