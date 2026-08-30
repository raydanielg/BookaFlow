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
  BadgeCheckIcon,
  LanguageSkillIcon,
  TimeQuarterPassIcon,
  Award01Icon,
  UserCircleIcon,
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
    gallery: string[]
    bio: string | null
    yearsOfExperience: number | null
    specialties: string[]
    languages: string[]
    certifications: { name: string; issuer: string; year: string }[]
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
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu",
  FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
}

const dayNamesFull: Record<string, string> = {
  MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday", THURSDAY: "Thursday",
  FRIDAY: "Friday", SATURDAY: "Saturday", SUNDAY: "Sunday",
}

const businessTypeLabels: Record<string, string> = {
  SALON: "Beauty Salon", CLINIC: "Healthcare Clinic", SPA: "Spa & Wellness",
  GYM: "Fitness & Gym", CONSULTATION: "Consultation", OTHER: "Professional",
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
          <Link href="/"><Button variant="outline">Back to home</Button></Link>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const { business, services, staff, reviews, rating, reviewCount } = profile

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Cover */}
      <div className="relative h-40 w-full bg-gradient-to-br from-primary/20 via-primary/5 to-background sm:h-56 lg:h-64">
        {business.coverImage && (
          <img src={api.imageUrl(business.coverImage)} alt={business.name} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header Card */}
        <div className="-mt-16 rounded-2xl border border-border bg-card p-5 shadow-lg sm:-mt-20 sm:p-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            {/* Profile Image */}
            <div className="size-24 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-md sm:size-28 lg:size-32">
              {business.logo ? (
                <img src={api.imageUrl(business.logo)} alt={business.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-primary/30">
                  {business.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name & Title */}
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">{business.name}</h1>
                {rating && (
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 dark:bg-amber-950/30">
                    <HugeiconsIcon icon={StarIcon} className="size-3.5 text-amber-500" />
                    <span className="text-xs font-semibold">{rating}</span>
                    <span className="text-xs text-muted-foreground">({reviewCount})</span>
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-primary">{businessTypeLabels[business.type] || "Professional"}</p>
              {business.shortDescription && (
                <p className="text-sm text-muted-foreground text-pretty">{business.shortDescription}</p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground sm:justify-start">
                {business.city && (
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={MapPinIcon} className="size-3.5" />
                    {business.city}{business.region ? `, ${business.region}` : ""}
                  </span>
                )}
                {business.yearsOfExperience != null && (
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={TimeQuarterPassIcon} className="size-3.5" />
                    {business.yearsOfExperience} yr{business.yearsOfExperience !== 1 ? "s" : ""} exp
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-border/60 pt-4 sm:justify-start">
            {business.phone && (
              <a href={`tel:${business.phone}`} className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary">
                <HugeiconsIcon icon={PhoneIcon} className="size-3.5" />
                {business.phone}
              </a>
            )}
            {business.email && (
              <a href={`mailto:${business.email}`} className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary">
                <HugeiconsIcon icon={MailIcon} className="size-3.5" />
                {business.email}
              </a>
            )}
            {business.whatsapp && (
              <a href={business.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400">
                <span className="font-bold">WA</span>
                WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Main Column */}
          <div className="flex flex-col gap-6 lg:flex-1">
            {/* Bio */}
            {business.bio && (
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h2 className="mb-3 text-base font-semibold tracking-tight sm:text-lg">About</h2>
                <p className="text-sm leading-7 text-muted-foreground text-pretty">{business.bio}</p>
              </section>
            )}

            {/* Specialties & Languages */}
            {(business.specialties.length > 0 || business.languages.length > 0) && (
              <section className="grid gap-4 sm:grid-cols-2">
                {business.specialties.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <HugeiconsIcon icon={BadgeCheckIcon} className="size-4 text-primary" />
                      <h2 className="text-sm font-semibold tracking-tight">Specialties</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {business.specialties.map((s, i) => (
                        <span key={i} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {business.languages.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <HugeiconsIcon icon={LanguageSkillIcon} className="size-4 text-primary" />
                      <h2 className="text-sm font-semibold tracking-tight">Languages</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {business.languages.map((l, i) => (
                        <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Gallery */}
            {business.gallery.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h2 className="mb-4 text-base font-semibold tracking-tight sm:text-lg">Gallery</h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                  {business.gallery.map((url, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-xl border border-border">
                      <img src={api.imageUrl(url)} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {business.certifications.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <HugeiconsIcon icon={Award01Icon} className="size-4 text-primary" />
                  <h2 className="text-base font-semibold tracking-tight sm:text-lg">Certifications</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {business.certifications.map((cert, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-border p-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <HugeiconsIcon icon={Award01Icon} className="size-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{cert.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cert.issuer}{cert.year ? ` · ${cert.year}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Services */}
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h2 className="mb-4 text-base font-semibold tracking-tight sm:text-lg">Services</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div key={service.id} className="group flex flex-col gap-2 rounded-xl border border-border p-4 transition-all hover:border-primary/30 hover:shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-sm font-semibold">{service.name}</h3>
                        {service.category && <span className="text-xs text-muted-foreground">{service.category}</span>}
                      </div>
                      <span className="shrink-0 text-sm font-bold text-primary">TZS {service.price.toLocaleString()}</span>
                    </div>
                    {service.description && <p className="text-xs text-muted-foreground text-pretty">{service.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={ClockIcon} className="size-3.5" />
                        {service.duration} min
                      </span>
                    </div>
                    <Link href={`/book/${business.slug}?service=${service.id}`}>
                      <Button size="sm" variant="outline" className="mt-1 w-full">
                        Book this
                        <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
                {services.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No services available yet.</p>}
              </div>
            </section>

            {/* Team */}
            {staff.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h2 className="mb-4 text-base font-semibold tracking-tight sm:text-lg">Team</h2>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {staff.map((member) => (
                    <div key={member.id} className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
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
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-tight sm:text-lg">Reviews</h2>
                  {rating && (
                    <div className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={StarIcon} className="size-4 text-amber-500" />
                      <span className="text-sm font-semibold">{rating}</span>
                      <span className="text-xs text-muted-foreground">({reviewCount})</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{review.customerName}</p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <HugeiconsIcon key={i} icon={StarIcon} className={`size-3.5 ${i < review.rating ? "text-amber-500" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="mt-2 text-sm text-muted-foreground text-pretty">{review.comment}</p>}
                      {review.reply && (
                        <div className="mt-3 rounded-lg bg-muted/40 p-3">
                          <p className="text-xs font-medium">Response from {business.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground text-pretty">{review.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Book Appointment CTA */}
            <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-6 text-center text-primary-foreground shadow-lg sm:p-8">
              <h2 className="text-lg font-bold sm:text-xl">Ready to book an appointment?</h2>
              <p className="mt-1.5 text-sm text-primary-foreground/80">Schedule online in just a few clicks. It's quick and easy.</p>
              <Link href={`/book/${business.slug}`}>
                <Button variant="secondary" size="lg" className="mt-4 w-full shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] sm:w-auto">
                  <HugeiconsIcon icon={Calendar03Icon} className="size-5" />
                  Book Appointment
                </Button>
              </Link>
            </section>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 lg:w-72 lg:shrink-0">
            {/* Contact Info */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold">Contact</h3>
              <div className="flex flex-col gap-2.5 text-sm">
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <HugeiconsIcon icon={PhoneIcon} className="size-4 shrink-0 text-primary" />
                    {business.phone}
                  </a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <HugeiconsIcon icon={MailIcon} className="size-4 shrink-0 text-primary" />
                    <span className="truncate">{business.email}</span>
                  </a>
                )}
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <HugeiconsIcon icon={GlobeIcon} className="size-4 shrink-0 text-primary" />
                    <span className="truncate">Website</span>
                  </a>
                )}
                {business.address && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <HugeiconsIcon icon={MapPinIcon} className="size-4 shrink-0 mt-0.5 text-primary" />
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
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-2">
                  <HugeiconsIcon icon={ClockIcon} className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Working Hours</h3>
                </div>
                <div className="flex flex-col gap-1">
                  {business.workingHours.map((wh) => (
                    <div key={wh.day} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{dayNamesFull[wh.day] || wh.day}</span>
                      <span className={wh.isOff ? "text-muted-foreground/60" : "font-medium"}>
                        {wh.isOff ? "Closed" : `${wh.startTime} — ${wh.endTime}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social */}
            {(business.instagram || business.facebook || business.whatsapp || business.tiktok) && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-3 text-sm font-semibold">Follow</h3>
                <div className="flex flex-wrap gap-2">
                  {business.instagram && (
                    <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary/10 hover:text-primary">
                      <HugeiconsIcon icon={InstagramIcon} className="size-4" />
                    </a>
                  )}
                  {business.facebook && (
                    <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary/10 hover:text-primary">
                      <HugeiconsIcon icon={FacebookIcon} className="size-4" />
                    </a>
                  )}
                  {business.whatsapp && (
                    <a href={business.whatsapp} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-emerald-100 hover:text-emerald-600">
                      <span className="text-xs font-bold">WA</span>
                    </a>
                  )}
                  {business.tiktok && (
                    <a href={business.tiktok} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary/10 hover:text-primary">
                      <span className="text-xs font-bold">TT</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-border py-6">
          <p className="text-center text-xs text-muted-foreground">
            Powered by BookaFlow · <Link href="/" className="hover:text-foreground">Create your own booking page</Link>
          </p>
        </footer>
      </div>
    </div>
  )
}
