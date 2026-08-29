"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, UserCircleIcon } from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

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
}

export default function StaffPage() {
  const { businessId, loading } = useAuth()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!businessId) return
    api.getStaff(businessId).then((data) => {
      setStaff(data.staff || [])
      setDataLoading(false)
    }).catch(() => setDataLoading(false))
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
          <Button size="sm">
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
            <Button size="sm">
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
    </>
  )
}
