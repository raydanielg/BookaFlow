"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { api } from "@workspace/ui/lib/api"
import { toast } from "@workspace/ui/components/toast"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, ArrowRight01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons"

type Service = {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  staff: { id: string; name: string; title: string | null }[]
}

type StaffMember = {
  id: string
  name: string
  title: string | null
  serviceIds: string[]
}

type BusinessInfo = {
  name: string
  description: string | null
  phone: string | null
  address: string | null
  city: string | null
}

export default function BookingPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [business, setBusiness] = useState<BusinessInfo | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [slots, setSlots] = useState<string[]>([])
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")

  useEffect(() => {
    api.getBookingInfo(params.slug).then((data) => {
      setBusiness(data.business)
      setServices(data.services || [])
      setStaff(data.staff || [])
      setLoading(false)
      const serviceParam = searchParams.get("service")
      if (serviceParam && data.services?.some((s: Service) => s.id === serviceParam)) {
        setSelectedService(serviceParam)
        setStep(2)
      }
    }).catch(() => {
      setLoading(false)
    })
  }, [params.slug, searchParams])

  const selectedServiceObj = services.find((s) => s.id === selectedService)
  const availableStaff = selectedServiceObj
    ? staff.filter((st) => st.serviceIds.includes(selectedServiceObj.id))
    : []

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)

  useEffect(() => {
    if (selectedService && selectedStaff && selectedDay) {
      const dateStr = `2026-08-${String(selectedDay).padStart(2, "0")}`
      api.getBookingSlots(params.slug, {
        serviceId: selectedService,
        staffId: selectedStaff,
        date: dateStr,
      }).then((data) => {
        setSlots(data.slots || [])
      }).catch(() => setSlots([]))
    } else {
      setSlots([])
    }
  }, [selectedService, selectedStaff, selectedDay, params.slug])

  async function handleConfirm() {
    if (!selectedService || !selectedStaff || !selectedDay || !selectedTime) return
    setSubmitting(true)
    try {
      const dateStr = `2026-08-${String(selectedDay).padStart(2, "0")}`
      await api.createBooking(params.slug, {
        serviceId: selectedService,
        staffId: selectedStaff,
        date: dateStr,
        startTime: selectedTime,
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
      })
      setStep(4)
    } catch (err) {
      toast.add({
        type: "error",
        title: "Booking failed",
        description: err instanceof Error ? err.message : "Please try again",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Business not found</h1>
          <p className="text-sm text-muted-foreground mt-2">The booking link may be incorrect.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-lg px-4 py-12">
        {/* Business header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{business.name}</h1>
          {business.description && (
            <p className="text-sm text-muted-foreground mt-1">{business.description}</p>
          )}
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 w-12 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          {/* Step 1: Choose service */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Choose a service</h2>
              {services.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No services available</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s.id)}
                      className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-300 ${
                        selectedService === s.id
                          ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                          : "border-border hover:border-primary/30 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex size-5 items-center justify-center rounded-full border-2 ${
                          selectedService === s.id ? "border-primary" : "border-border"
                        }`}>
                          {selectedService === s.id && <div className="size-2.5 rounded-full bg-primary" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.duration} min · TZS {s.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <Button
                disabled={selectedService === null}
                onClick={() => setStep(2)}
                className="w-full shadow-sm shadow-primary/20 transition-all duration-300 hover:shadow-md hover:shadow-primary/25 active:scale-[0.98]"
              >
                Continue
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Choose staff + date + time */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Choose staff & time</h2>

              <div className="flex flex-col gap-2">
                <Label className="text-xs">Staff Member</Label>
                <div className="flex gap-2">
                  {availableStaff.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStaff(st.id)}
                      className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors ${
                        selectedStaff === st.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {st.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <p className="text-xs font-medium">{st.name}</p>
                      <p className="text-[10px] text-muted-foreground">{st.title || "Staff"}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs">Date — August 2026</Label>
                <div className="grid grid-cols-7 gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-medium text-muted-foreground pb-1">{d}</div>
                  ))}
                  {daysInMonth.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`flex h-8 items-center justify-center rounded-lg text-xs transition-all duration-200 ${
                        selectedDay === day
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "hover:bg-muted hover:shadow-sm"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {selectedDay && selectedStaff && (
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Available Times</Label>
                  {slots.length === 0 ? (
                    <p className="py-4 text-center text-xs text-muted-foreground">No available slots for this day</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`rounded-lg border py-2 text-sm tabular-nums transition-all duration-200 ${
                            selectedTime === time
                              ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                              : "border-border hover:border-primary/30 hover:shadow-sm"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 transition-all duration-300 hover:border-primary/30 active:scale-[0.98]">
                  <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
                  Back
                </Button>
                <Button
                  disabled={selectedStaff === null || selectedDay === null || selectedTime === null}
                  onClick={() => setStep(3)}
                  className="flex-1 shadow-sm shadow-primary/20 transition-all duration-300 hover:shadow-md hover:shadow-primary/25 active:scale-[0.98]"
                >
                  Continue
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Your details */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Your Details</h2>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Full Name</Label>
                <Input placeholder="Enter your name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Phone Number</Label>
                <Input placeholder="+255 XXX XXX XXX" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Email (optional)</Label>
                <Input placeholder="you@example.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 transition-all duration-300 hover:border-primary/30 active:scale-[0.98]">
                  <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
                  Back
                </Button>
                <Button
                  disabled={!customerName || !customerPhone || submitting}
                  onClick={handleConfirm}
                  className="flex-1 shadow-md shadow-primary/25 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                  loading={submitting}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="flex flex-col items-center gap-4 text-center py-8">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-7 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Booking Confirmed!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedServiceObj?.name} on August {selectedDay}, 2026 at {selectedTime}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  We&apos;ll send a reminder before your appointment.
                </p>
              </div>
              <Button variant="outline" onClick={() => {
                setStep(1)
                setSelectedService(null)
                setSelectedStaff(null)
                setSelectedDay(null)
                setSelectedTime(null)
                setCustomerName("")
                setCustomerPhone("")
                setCustomerEmail("")
              }} className="transition-all duration-300 hover:border-primary/30 hover:shadow-sm active:scale-[0.98]">
                Book Another
              </Button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Powered by BookaFlow
        </p>
      </div>
    </div>
  )
}
