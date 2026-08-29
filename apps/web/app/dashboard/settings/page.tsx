"use client"

import { Card } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"

import { useAuth } from "@/hooks/use-auth"
import { PageHeader } from "@/components/shared/page-header"

export default function SettingsPage() {
  const { loading } = useAuth()

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><p className="text-sm text-muted-foreground">Loading...</p></div>
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your business profile, booking link, and working hours."
      />

      {/* Business Profile */}
      <Card className="gap-0 p-6">
        <div className="border-b border-border/60 pb-4">
          <h2 className="text-base font-semibold tracking-tight">Business Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">This information appears on your public booking page.</p>
        </div>
        <div className="grid gap-4 pt-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Business Name</Label>
            <Input defaultValue="Beauty House" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Phone</Label>
            <Input defaultValue="+255 700 000 001" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Email</Label>
            <Input defaultValue="info@beauty-house.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">City</Label>
            <Input defaultValue="Dar es Salaam" />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label className="text-xs">Address</Label>
            <Input defaultValue="123 Main Street" />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button size="sm">Save Changes</Button>
        </div>
      </Card>

      {/* Booking Link */}
      <Card className="gap-0 p-6">
        <div className="border-b border-border/60 pb-4">
          <h2 className="text-base font-semibold tracking-tight">Booking Link</h2>
          <p className="mt-1 text-sm text-muted-foreground">Share this link with customers so they can book online.</p>
        </div>
        <div className="flex items-center gap-2 pt-4">
          <Input readOnly value="bookaflow.com/book/beauty-house" className="font-mono text-sm" />
          <Button variant="outline" size="sm">Copy</Button>
        </div>
      </Card>

      {/* Working Hours */}
      <Card className="gap-0 p-6">
        <div className="border-b border-border/60 pb-4">
          <h2 className="text-base font-semibold tracking-tight">Working Hours</h2>
          <p className="mt-1 text-sm text-muted-foreground">When your business accepts bookings.</p>
        </div>
        <div className="flex flex-col gap-3 pt-4">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
            <div key={day} className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium">{day}</span>
              <Input defaultValue="08:00" className="w-24 text-sm" />
              <span className="text-xs text-muted-foreground">to</span>
              <Input defaultValue="17:00" className="w-24 text-sm" />
            </div>
          ))}
          {["Saturday", "Sunday"].map((day) => (
            <div key={day} className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium">{day}</span>
              <span className="text-sm text-muted-foreground">Off</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-4">
          <Button size="sm">Save Hours</Button>
        </div>
      </Card>
    </>
  )
}
