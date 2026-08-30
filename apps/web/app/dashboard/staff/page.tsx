"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, UserCircleIcon, Cancel01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import { useAuth } from "@/hooks/use-auth"
import { api } from "@workspace/ui/lib/api"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/states"

type StaffMember = {
  id: string
  name: string
  title: string | null
  appointmentsCount: number
  email: string
  phone: string | null
  isActive: boolean
}

export default function StaffPage() {
  const { businessId, loading } = useAuth()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const fetchStaff = () => {
    if (!businessId) return
    setDataLoading(true)
    api.getStaff(businessId).then((data) => {
      setStaff(data.staff || [])
      setDataLoading(false)
    }).catch(() => setDataLoading(false))
  }

  useEffect(() => {
    fetchStaff()
  }, [businessId])

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><p className="text-sm text-muted-foreground">Loading...</p></div>
  }

  return (
    <>
      <PageHeader
        title="Staff"
        description="Your team members and their appointment counts."
        actions={
          <Button size="sm" onClick={() => setDrawerOpen(true)}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Add staff
          </Button>
        }
      />

      {dataLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="mt-4 h-3 w-32" />
            </Card>
          ))}
        </div>
      ) : staff.length === 0 ? (
        <EmptyState
          title="No staff members yet"
          description="Add your first team member so customers can book with them."
          action={
            <Button size="sm" onClick={() => setDrawerOpen(true)}>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Add staff
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((s) => (
            <Card key={s.id} className="gap-0 p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.title || "Staff"}</p>
                </div>
                <HugeiconsIcon icon={UserCircleIcon} className="size-4 text-muted-foreground" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium tabular-nums text-foreground">{s.appointmentsCount}</span>
                appointments
              </div>
            </Card>
          ))}
        </div>
      )}

      {drawerOpen && (
        <StaffDrawer
          businessId={businessId}
          onClose={() => setDrawerOpen(false)}
          onSaved={() => { setDrawerOpen(false); fetchStaff() }}
        />
      )}
    </>
  )
}

function StaffDrawer({ businessId, onClose, onSaved }: { businessId: string | null; onClose: () => void; onSaved: () => void }) {
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
      title: formData.get("title") || undefined,
      email: formData.get("email") || undefined,
      phone: formData.get("phone") || undefined,
      isActive: formData.get("isActive") === "on",
    }

    try {
      await api.createStaff(businessId, body)
      onSaved()
    } catch (err: any) {
      setError(err.message || "Failed to add staff member")
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
              <HugeiconsIcon icon={UserCircleIcon} className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Add Staff Member</h2>
              <p className="text-xs text-muted-foreground">Add a new team member to your business</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="size-8" onClick={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form onSubmit={handleSubmit} id="staff-form" className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Full Name *</Label>
              <Input name="name" required placeholder="e.g. John Joseph" className="h-10" />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Title / Role</Label>
              <Input name="title" placeholder="e.g. Senior Barber" className="h-10" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Phone</Label>
                <Input name="phone" placeholder="+255..." className="h-10" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Email</Label>
                <Input name="email" type="email" placeholder="john@bookaflow.com" className="h-10" />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border p-3">
              <input type="checkbox" name="isActive" defaultChecked className="size-4 rounded border-input" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">Active staff can accept bookings</p>
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
          <Button type="submit" form="staff-form" size="sm" loading={saving}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Add staff
          </Button>
        </div>
      </div>
    </>
  )
}
