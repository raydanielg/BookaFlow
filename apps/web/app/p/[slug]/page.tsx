"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
  InstagramIcon,
  FacebookIcon,
  ClockIcon,
  Calendar03Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { api } from "@workspace/ui/lib/api"

type Profile = {
  business: {
    id: string
    name: string
    slug: string
    type: string
    description: string | null
    shortDescription: string | null
    logo: string | null
    coverImage: string | null
    phone: string | null
    email: string | null
    website: string | null
    address: string | null
    city: string | null
    region: string | null
    country: string | null
    googleMapsLink: string | null
    instagram: string | null
    facebook: string | null
    tiktok: string | null
    whatsapp: string | null
    bookingLink: string | null
    workingHours: { day: string; startTime: string; endTime: string; isOff: boolean }[]
  }
  seo: {
    seoTitle: string | null
    metaDescription: string | null
    focusKeywords: string | null
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    canonicalUrl: string | null
  } | null
  services: {
    id: string
    name: string
    description: string | null
    category: string | null
    price: number
    duration: number
    deposit: number | null
  }[]
  staff: { id: string; name: string; title: string | null }[]
  reviews: {
    id: string
    customerName: string
    rating: number
    comment: string | null
    reply: string | null
    createdAt: string
  }[]
  rating: number | null
  reviewCount: number
}

const dayNames: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
}

const businessTypeLabels: Record<string, string> = {
  SALON: "Beauty Salon",
  CLINIC: "Healthcare Clinic",
  SPA: "Spa & Wellness",
  GYM: "Fitness & Gym",
  CONSULTATION: "Consultation",
  OTHER: "Business",
}

export default function BusinessProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    api.getPublicProfile(slug).then((data) => {
      setProfile(data)
      setLoading(false)
    }).catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to load profile")
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-semibold text-foreground">{error}</p>
          <Link href="/">
            <Button variant="outline">Back to home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const { business, services, staff, reviews, rating, reviewCount } = profile

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 via-primary/5 to-background sm:h-64 lg:h-80">
        {business.coverImage && (
          <img
            src={business.coverImage}
            alt={business.name}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:gap-6">
          <div className="size-24 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-lg sm:size-32">
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground">
                {business.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 pb-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{business.name}</h1>
              {rating && (
                <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                  <HugeiconsIcon icon={StarIcon} className="size-4 text-amber-500" />
                  <span className="text-sm font-semibold">{rating}</span>
                  <span className="text-xs text-muted-foreground">({reviewCount})</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-primary">{businessTypeLabels[business.type] || "Business"}</span>
              {business.city && (
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={MapPinIcon} className="size-3.5" />
                  {business.city}{business.region ? `, ${business.region}` : ""}
                </span>
              )}
            </div>
            {business.shortDescription && (
              <p className="text-sm text-muted-foreground text-pretty">{business.shortDescription}</p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href={`/book/${business.slug}`}>
              <Button size="lg" className="shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]">
                <HugeiconsIcon icon={Calendar03Icon} className="size-4.5" />
                Book appointment
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* About */}
            {business.description && (
              <section>
                <h2 className="mb-3 text-lg font-semibold tracking-tight">About</h2>
                <p className="text-sm leading-7 text-muted-foreground text-pretty">{business.description}</p>
              </section>
            )}

            {/* Services */}
            <section>
              <h2 className="mb-4 text-lg font-semibold tracking-tight">Our Services</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-sm font-semibold">{service.name}</h3>
                        {service.category && (
                          <span className="text-xs text-muted-foreground">{service.category}</span>
                        )}
                      </div>
                      <span className="shrink-0 text-sm font-bold text-primary">
                        TZS {service.price.toLocaleString()}
                      </span>
                    </div>
                    {service.description && (
                      <p className="text-xs text-muted-foreground text-pretty">{service.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={ClockIcon} className="size-3.5" />
                        {service.duration} min
                      </span>
                      {service.deposit && (
                        <span>Deposit: TZS {service.deposit.toLocaleString()}</span>
                      )}
                    </div>
                    <Link href={`/book/${business.slug}?service=${service.id}`}>
                      <Button size="sm" variant="outline" className="mt-1 w-full transition-all duration-300 hover:border-primary/40 hover:shadow-sm active:scale-[0.98]">
                        Book this
                        <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5 transition-transform duration-300 group-hover/button:translate-x-0.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
                {services.length === 0 && (
                  <p className="col-span-full text-sm text-muted-foreground">No services available yet.</p>
                )}
              </div>
            </section>

            {/* Team */}
            {staff.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold tracking-tight">Our Team</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {staff.map((member) => (
                    <div key={member.id} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center">
                      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                        {member.name.charAt(0)}
                      </div>
                      <p className="text-sm font-semibold">{member.name}</p>
                      {member.title && <p className="text-xs text-muted-foreground">{member.title}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-tight">Reviews</h2>
                  {rating && (
                    <div className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={StarIcon} className="size-4 text-amber-500" />
                      <span className="text-sm font-semibold">{rating}</span>
                      <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{review.customerName}</p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <HugeiconsIcon
                              key={i}
                              icon={StarIcon}
                              className={`size-3.5 ${i < review.rating ? "text-amber-500" : "text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="mt-2 text-sm text-muted-foreground text-pretty">{review.comment}</p>}
                      {review.reply && (
                        <div className="mt-3 rounded-lg bg-muted/40 p-3">
                          <p className="text-xs font-medium text-foreground">Response from {business.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground text-pretty">{review.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Contact */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold">Contact</h3>
              <div className="flex flex-col gap-2.5 text-sm">
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <HugeiconsIcon icon={PhoneIcon} className="size-4 shrink-0" />
                    {business.phone}
                  </a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <HugeiconsIcon icon={MailIcon} className="size-4 shrink-0" />
                    {business.email}
                  </a>
                )}
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <HugeiconsIcon icon={GlobeIcon} className="size-4 shrink-0" />
                    Website
                  </a>
                )}
                {business.address && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <HugeiconsIcon icon={MapPinIcon} className="size-4 shrink-0 mt-0.5" />
                    <span>{business.address}{business.city ? `, ${business.city}` : ""}</span>
                  </div>
                )}
              </div>
              {business.googleMapsLink && (
                <a href={business.googleMapsLink} target="_blank" rel="noopener noreferrer" className="mt-3 block">
                  <Button size="sm" variant="outline" className="w-full">View on map</Button>
                </a>
              )}
            </div>

            {/* Working Hours */}
            {business.workingHours.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-sm font-semibold">Working Hours</h3>
                <div className="flex flex-col gap-1.5">
                  {business.workingHours.map((wh) => (
                    <div key={wh.day} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{dayNames[wh.day] || wh.day}</span>
                      <span className={wh.isOff ? "text-muted-foreground" : "font-medium"}>
                        {wh.isOff ? "Closed" : `${wh.startTime} ??? ${wh.endTime}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social */}
            {(business.instagram || business.facebook || business.whatsapp || business.tiktok) && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-sm font-semibold">Follow</h3>
                <div className="flex flex-wrap gap-2">
                  {business.instagram && (
                    <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                      <HugeiconsIcon icon={InstagramIcon} className="size-4" />
                    </a>
                  )}
                  {business.facebook && (
                    <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                      <HugeiconsIcon icon={FacebookIcon} className="size-4" />
                    </a>
                  )}
                  {business.whatsapp && (
                    <a href={business.whatsapp} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                      <span className="text-xs font-bold">WA</span>
                    </a>
                  )}
                  {business.tiktok && (
                    <a href={business.tiktok} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                      <span className="text-xs font-bold">TT</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-xl bg-primary p-5 text-primary-foreground">
              <h3 className="text-sm font-semibold">Ready to book?</h3>
              <p className="mt-1 text-xs text-primary-foreground/80">Schedule your appointment online in just a few clicks.</p>
              <Link href={`/book/${business.slug}`}>
                <Button variant="secondary" size="sm" className="mt-3 w-full shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]">
                  Book now
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5 transition-transform duration-300 group-hover/button:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-border py-6">
          <p className="text-center text-xs text-muted-foreground">
            Powered by BookMiadi ?? <Link href="/" className="hover:text-foreground">Create your own booking page</Link>
          </p>
        </footer>
      </div>
    </div>
  )
}
