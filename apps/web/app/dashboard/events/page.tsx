"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PartyIcon,
  Calendar03Icon,
  Location01Icon,
  UserGroupIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  TimeQuarterPassIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import { useAuth } from "@/hooks/use-auth"
import { api } from "@workspace/ui/lib/api"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/states"

type EventTicket = { id: string; name: string; price: number; quantity: number; soldCount: number }
type EventItem = {
  id: string
  title: string
  slug: string
  description: string | null
  coverImage: string | null
  category: string
  mode: string
  registrationType: string
  startDate: string
  endDate: string
  location: string | null
  capacity: number
  isPublished: boolean
  isRegistrationOpen: boolean
  registrationsCount: number
  tickets: EventTicket[]
}

type Registration = {
  id: string
  fullName: string
  email: string
  phone: string
  organization: string | null
  occupation: string | null
  motivation: string | null
  status: string
  ticketNumber: string | null
  checkedIn: boolean
  createdAt: string
}

const CATEGORY_LABELS: Record<string, string> = {
  CONFERENCE: "Conference", WORKSHOP: "Workshop", SEMINAR: "Seminar", TRAINING: "Training",
  WEBINAR: "Webinar", NETWORKING: "Networking", EXHIBITION: "Exhibition", WEDDING: "Wedding",
  BIRTHDAY: "Birthday", CORPORATE: "Corporate", COMMUNITY: "Community", OTHER: "Other",
}

const MODE_LABELS: Record<string, string> = {
  ONLINE: "Online", PHYSICAL: "In-Person", HYBRID: "Hybrid",
}

const REG_TYPE_LABELS: Record<string, string> = {
  FREE: "Free", TICKETED: "Ticketed", APPLICATION: "Application",
}

const REG_STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: "bg-amber-100 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", label: "Pending" },
  APPROVED: { bg: "bg-blue-100 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-400", label: "Approved" },
  REJECTED: { bg: "bg-red-100 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", label: "Rejected" },
  WAITLISTED: { bg: "bg-violet-100 dark:bg-violet-950/30", text: "text-violet-700 dark:text-violet-400", label: "Waitlisted" },
  REGISTERED: { bg: "bg-emerald-100 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", label: "Registered" },
  CANCELLED: { bg: "bg-red-100 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", label: "Cancelled" },
  CHECKED_IN: { bg: "bg-teal-100 dark:bg-teal-950/30", text: "text-teal-700 dark:text-teal-400", label: "Checked In" },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

export default function EventsPage() {
  const { businessId, loading } = useAuth()
  const [events, setEvents] = useState<EventItem[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<{ event: EventItem; registrations: Registration[] } | null>(null)

  const fetchEvents = () => {
    if (!businessId) return
    api.getEvents(businessId).then((data: any) => {
      setEvents(data.events || [])
      setDataLoading(false)
    }).catch(() => setDataLoading(false))
  }

  useEffect(() => {
    fetchEvents()
  }, [businessId])

  const handleViewEvent = async (ev: EventItem) => {
    if (!businessId) return
    try {
      const data: any = await api.getEvent(businessId, ev.id)
      setSelectedEvent({ event: data.event, registrations: data.event.registrations || [] })
    } catch (err) {
      console.error(err)
    }
  }

  const handleRegStatus = async (regId: string, status: string) => {
    if (!businessId || !selectedEvent) return
    try {
      await api.updateRegistrationStatus(businessId, selectedEvent.event.id, regId, status)
      const data: any = await api.getEvent(businessId, selectedEvent.event.id)
      setSelectedEvent({ event: data.event, registrations: data.event.registrations || [] })
    } catch (err) {
      console.error(err)
    }
  }

  const handleCheckin = async (regId: string) => {
    if (!businessId || !selectedEvent) return
    try {
      await api.checkinRegistration(businessId, selectedEvent.event.id, regId)
      const data: any = await api.getEvent(businessId, selectedEvent.event.id)
      setSelectedEvent({ event: data.event, registrations: data.event.registrations || [] })
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Skeleton className="h-8 w-48" /></div>
  }

  if (selectedEvent) {
    return (
      <EventDetailView
        event={selectedEvent.event}
        registrations={selectedEvent.registrations}
        onBack={() => { setSelectedEvent(null); fetchEvents() }}
        onRegStatus={handleRegStatus}
        onCheckin={handleCheckin}
      />
    )
  }

  return (
    <>
      <PageHeader
        title="Events"
        description="Create and manage events, ticketing, and registrations."
        actions={
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <HugeiconsIcon icon={PartyIcon} className="size-4" />
            Create event
          </Button>
        }
      />

      {dataLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Create your first event to start accepting registrations."
          className="border-0"
          action={
            <Button size="sm" onClick={() => setShowCreate(true)}>
              <HugeiconsIcon icon={PartyIcon} className="size-4" />
              Create event
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <Card key={ev.id} className="gap-0 overflow-hidden p-0">
              {ev.coverImage ? (
                <img src={ev.coverImage} alt={ev.title} className="h-32 w-full object-cover" />
              ) : (
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <HugeiconsIcon icon={PartyIcon} className="size-10 text-primary/30" />
                </div>
              )}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {CATEGORY_LABELS[ev.category] || ev.category}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {MODE_LABELS[ev.mode] || ev.mode}
                  </span>
                </div>
                <h3 className="font-semibold tracking-tight">{ev.title}</h3>
                <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                    {formatDate(ev.startDate)} · {formatTime(ev.startDate)}
                  </span>
                  {ev.location && (
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={Location01Icon} className="size-3.5" />
                      {ev.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={UserGroupIcon} className="size-3.5" />
                    {ev.registrationsCount} / {ev.capacity || "∞"} registered
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {REG_TYPE_LABELS[ev.registrationType] || ev.registrationType}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => handleViewEvent(ev)}>
                    View details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateEventDrawer
          businessId={businessId}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); fetchEvents() }}
        />
      )}
    </>
  )
}

function CreateEventDrawer({ businessId, onClose, onCreated }: { businessId: string | null; onClose: () => void; onCreated: () => void }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!businessId) return
    setSaving(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const body: Record<string, unknown> = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      mode: formData.get("mode"),
      registrationType: formData.get("registrationType"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      location: formData.get("location"),
      capacity: parseInt(formData.get("capacity") as string || "0", 10),
    }

    const ticketNames = formData.getAll("ticketName") as string[]
    const ticketPrices = formData.getAll("ticketPrice") as string[]
    const ticketQtys = formData.getAll("ticketQty") as string[]
    if (ticketNames.length > 0 && ticketNames[0]) {
      body.tickets = ticketNames.map((name, i) => ({
        name,
        price: parseFloat(ticketPrices[i] || "0"),
        quantity: parseInt(ticketQtys[i] || "0", 10),
      })).filter((t) => t.name)
    }

    try {
      await api.createEvent(businessId, body)
      onCreated()
    } catch (err: any) {
      setError(err.message || "Failed to create event")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon icon={PartyIcon} className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Create Event</h2>
              <p className="text-xs text-muted-foreground">Set up a new event for your audience</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="size-8" onClick={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form onSubmit={handleSubmit} id="event-form" className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Event Title *</Label>
              <Input name="title" required placeholder="Tech Meetup Mwanza 2026" className="h-10" />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Description</Label>
              <textarea name="description" rows={3} placeholder="Tell people what this event is about..."
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Category</Label>
                <select name="category" className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Mode</Label>
                <select name="mode" className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="PHYSICAL">In-Person</option>
                  <option value="ONLINE">Online</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Registration</Label>
                <select name="registrationType" className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="FREE">Free</option>
                  <option value="TICKETED">Ticketed</option>
                  <option value="APPLICATION">Application</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Start Date & Time *</Label>
                <Input name="startDate" type="datetime-local" required className="h-10" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">End Date & Time *</Label>
                <Input name="endDate" type="datetime-local" required className="h-10" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Location</Label>
                <Input name="location" placeholder="Rock City Mall, Mwanza" className="h-10" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">Capacity</Label>
                <Input name="capacity" type="number" placeholder="100" className="h-10" />
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Tickets (optional — leave empty for free events)</p>
              <div className="grid gap-2 sm:grid-cols-3">
                <Input name="ticketName" placeholder="Ticket name (e.g. VIP)" className="h-10" />
                <Input name="ticketPrice" type="number" placeholder="Price (TZS)" className="h-10" />
                <Input name="ticketQty" type="number" placeholder="Quantity" className="h-10" />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="event-form" size="sm" loading={saving}>
            <HugeiconsIcon icon={PartyIcon} className="size-4" />
            Create event
          </Button>
        </div>
      </div>
    </>
  )
}

function EventDetailView({
  event, registrations, onBack, onRegStatus, onCheckin,
}: {
  event: EventItem
  registrations: Registration[]
  onBack: () => void
  onRegStatus: (regId: string, status: string) => void
  onCheckin: (regId: string) => void
}) {
  return (
    <>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <HugeiconsIcon icon={Cancel01Icon} className="size-4 rotate-45" />
          Back to events
        </Button>
      </div>

      <PageHeader
        title={event.title}
        description={`${CATEGORY_LABELS[event.category] || event.category} · ${MODE_LABELS[event.mode] || event.mode} · ${REG_TYPE_LABELS[event.registrationType] || event.registrationType}`}
      />

      {/* Event info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="gap-0 p-4">
          <p className="text-xs text-muted-foreground">Date</p>
          <p className="mt-1 text-sm font-semibold">{formatDate(event.startDate)}</p>
          <p className="text-xs text-muted-foreground">{formatTime(event.startDate)} — {formatTime(event.endDate)}</p>
        </Card>
        <Card className="gap-0 p-4">
          <p className="text-xs text-muted-foreground">Location</p>
          <p className="mt-1 text-sm font-semibold">{event.location || "TBD"}</p>
        </Card>
        <Card className="gap-0 p-4">
          <p className="text-xs text-muted-foreground">Registrations</p>
          <p className="mt-1 text-sm font-semibold">{registrations.length} / {event.capacity || "∞"}</p>
        </Card>
        <Card className="gap-0 p-4">
          <p className="text-xs text-muted-foreground">Tickets</p>
          <p className="mt-1 text-sm font-semibold">{event.tickets.length}</p>
          {event.tickets.map((t) => (
            <p key={t.id} className="text-xs text-muted-foreground">{t.name}: TZS {t.price.toLocaleString()} ({t.soldCount}/{t.quantity})</p>
          ))}
        </Card>
      </div>

      {/* Registrations */}
      <Card className="gap-0 p-0 overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold tracking-tight">Registrations ({registrations.length})</h2>
        </div>
        {registrations.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">No registrations yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {registrations.map((r) => {
                  const st = REG_STATUS_STYLES[r.status] || { bg: "bg-muted", text: "text-muted-foreground", label: r.status }
                  return (
                    <tr key={r.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium">{r.fullName}</p>
                        {r.organization && <p className="text-xs text-muted-foreground">{r.organization}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs">{r.phone}</p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${st.bg} ${st.text}`}>
                          {st.label}
                        </span>
                        {r.checkedIn && <span className="ml-1 text-xs text-teal-600">✓ Checked in</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {r.status === "PENDING" && (
                            <>
                              <Button size="xs" variant="outline" onClick={() => onRegStatus(r.id, "APPROVED")}>
                                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3" />
                                Approve
                              </Button>
                              <Button size="xs" variant="outline" onClick={() => onRegStatus(r.id, "REJECTED")}>
                                Reject
                              </Button>
                            </>
                          )}
                          {r.status === "APPROVED" && !r.checkedIn && (
                            <Button size="xs" variant="outline" onClick={() => onCheckin(r.id)}>
                              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3" />
                              Check in
                            </Button>
                          )}
                          {r.status === "REGISTERED" && !r.checkedIn && (
                            <Button size="xs" variant="outline" onClick={() => onCheckin(r.id)}>
                              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3" />
                              Check in
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
