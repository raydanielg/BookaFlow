"use client"

import { useEffect, useState } from "react"
import { Card } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/toast"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, Copy01Icon, EyeIcon } from "@hugeicons/core-free-icons"

import { useAuth } from "@/hooks/use-auth"
import { PageHeader } from "@/components/shared/page-header"
import { api } from "@workspace/ui/lib/api"

type BusinessData = {
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
  profileVisibility: string
  bookingVisibility: string
  bookingLink: string | null
  seo: {
    seoTitle: string | null
    metaDescription: string | null
    focusKeywords: string | null
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    canonicalUrl: string | null
  } | null
  gallery: string[]
  bio: string | null
  yearsOfExperience: number | null
  specialties: string | null
  languages: string | null
  certifications: { name: string; issuer: string; year: string }[] | null
  bookingSettings: {
    bookingEnabled: boolean
    advanceBookingDays: number
    minimumNoticeHours: number
    cancellationAllowed: boolean
    cancellationDeadlineHours: number
    reschedulingAllowed: boolean
    noShowProtection: boolean
    requirePhone: boolean
    requireEmail: boolean
    bufferMinutes: number
    maxDailyBookings: number
    allowDoubleBooking: boolean
    autoConfirm: boolean
    requireStaffSelection: boolean
    allowCustomerNotes: boolean
    paymentMode: string
  } | null
}

export default function SettingsPage() {
  const { businessId, loading } = useAuth()
  const [data, setData] = useState<BusinessData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seoSaving, setSeoSaving] = useState(false)
  const [bookingSaving, setBookingSaving] = useState(false)
  const [detailsSaving, setDetailsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "details" | "seo" | "booking">("profile")

  useEffect(() => {
    if (!businessId) return
    api.getBusiness(businessId).then((res) => {
      setData(res.business)
      setDataLoading(false)
    }).catch(() => setDataLoading(false))
  }, [businessId])

  if (loading || dataLoading) {
    return <div className="flex h-screen items-center justify-center"><p className="text-sm text-muted-foreground">Loading...</p></div>
  }

  if (!data) return null

  const profileUrl = `bookaflow-web.vercel.app/@${data.slug}`
  const bookingUrl = `bookaflow-web.vercel.app/book/${data.slug}`

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!businessId) return
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    const body: Record<string, unknown> = {}
    for (const [key, value] of formData.entries()) {
      body[key] = value || undefined
    }
    body.profileVisibility = (formData.get("profileVisibility") as string) || "PUBLIC"
    body.bookingVisibility = (formData.get("bookingVisibility") as string) || "PUBLIC"
    try {
      await api.updateBusiness(businessId, body)
      toast.add({ type: "success", title: "Profile updated", description: "Your business profile has been saved." })
    } catch (err) {
      toast.add({ type: "error", title: "Update failed", description: err instanceof Error ? err.message : "Something went wrong" })
    } finally {
      setSaving(false)
    }
  }

  async function saveSEO(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!businessId) return
    setSeoSaving(true)
    const formData = new FormData(e.currentTarget)
    const body: Record<string, unknown> = {}
    for (const [key, value] of formData.entries()) {
      body[key] = value || undefined
    }
    try {
      await api.updateSEO(businessId, body)
      toast.add({ type: "success", title: "SEO settings saved", description: "Your SEO settings have been updated." })
    } catch (err) {
      toast.add({ type: "error", title: "Save failed", description: err instanceof Error ? err.message : "Something went wrong" })
    } finally {
      setSeoSaving(false)
    }
  }

  async function saveBookingSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!businessId) return
    setBookingSaving(true)
    const formData = new FormData(e.currentTarget)
    const body: Record<string, unknown> = {
      bookingEnabled: formData.get("bookingEnabled") === "on",
      advanceBookingDays: parseInt(formData.get("advanceBookingDays") as string) || 30,
      minimumNoticeHours: parseInt(formData.get("minimumNoticeHours") as string) || 2,
      cancellationAllowed: formData.get("cancellationAllowed") === "on",
      cancellationDeadlineHours: parseInt(formData.get("cancellationDeadlineHours") as string) || 6,
      reschedulingAllowed: formData.get("reschedulingAllowed") === "on",
      noShowProtection: formData.get("noShowProtection") === "on",
      requirePhone: formData.get("requirePhone") === "on",
      requireEmail: formData.get("requireEmail") === "on",
      bufferMinutes: parseInt(formData.get("bufferMinutes") as string) || 0,
      maxDailyBookings: parseInt(formData.get("maxDailyBookings") as string) || 50,
      allowDoubleBooking: formData.get("allowDoubleBooking") === "on",
      autoConfirm: formData.get("autoConfirm") === "on",
      requireStaffSelection: formData.get("requireStaffSelection") === "on",
      allowCustomerNotes: formData.get("allowCustomerNotes") === "on",
      paymentMode: formData.get("paymentMode") as string || "PAY_AT_VENUE",
    }
    try {
      await api.updateBookingSettings(businessId, body)
      toast.add({ type: "success", title: "Booking settings saved", description: "Your booking rules have been updated." })
    } catch (err) {
      toast.add({ type: "error", title: "Save failed", description: err instanceof Error ? err.message : "Something went wrong" })
    } finally {
      setBookingSaving(false)
    }
  }

  async function saveDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!businessId) return
    setDetailsSaving(true)
    const formData = new FormData(e.currentTarget)
    const galleryUrls = formData.getAll("galleryUrl") as string[]
    const certNames = formData.getAll("certName") as string[]
    const certIssuers = formData.getAll("certIssuer") as string[]
    const certYears = formData.getAll("certYear") as string[]
    const certifications = certNames.map((name, i) => ({
      name,
      issuer: certIssuers[i] || "",
      year: certYears[i] || "",
    })).filter((c) => c.name)
    const body: Record<string, unknown> = {
      bio: formData.get("bio") || undefined,
      yearsOfExperience: formData.get("yearsOfExperience") ? parseInt(formData.get("yearsOfExperience") as string, 10) : undefined,
      specialties: formData.get("specialties") || undefined,
      languages: formData.get("languages") || undefined,
      gallery: galleryUrls.filter((u) => u.trim()).length > 0 ? JSON.stringify(galleryUrls.filter((u) => u.trim())) : undefined,
      certifications: certifications.length > 0 ? JSON.stringify(certifications) : undefined,
    }
    try {
      await api.updateBusiness(businessId, body)
      toast.add({ type: "success", title: "Profile details saved", description: "Your profile details have been updated." })
    } catch (err) {
      toast.add({ type: "error", title: "Save failed", description: err instanceof Error ? err.message : "Something went wrong" })
    } finally {
      setDetailsSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your business profile, SEO, and booking rules."
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-border p-1 w-fit">
        {(["profile", "details", "seo", "booking"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "seo" ? "SEO" : tab === "booking" ? "Booking Rules" : tab === "details" ? "Profile Details" : "Profile"}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <form onSubmit={saveProfile} className="flex flex-col gap-6">
          {/* Links */}
          <Card className="gap-0 p-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-base font-semibold tracking-tight">Your Links</h2>
              <p className="mt-1 text-sm text-muted-foreground">Share these with your customers.</p>
            </div>
            <div className="grid gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Input readOnly value={profileUrl} className="font-mono text-sm" />
                <Button type="button" variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(`https://${profileUrl}`); toast.add({ type: "success", title: "Copied!" }) }}>
                  <HugeiconsIcon icon={Copy01Icon} className="size-4" />
                </Button>
                <a href={`/@${data.slug}`} target="_blank" rel="noopener noreferrer">
                  <Button type="button" variant="ghost" size="sm">
                    <HugeiconsIcon icon={EyeIcon} className="size-4" />
                    View
                  </Button>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Input readOnly value={bookingUrl} className="font-mono text-sm" />
                <Button type="button" variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(`https://${bookingUrl}`); toast.add({ type: "success", title: "Copied!" }) }}>
                  <HugeiconsIcon icon={Copy01Icon} className="size-4" />
                </Button>
                <a href={`/book/${data.slug}`} target="_blank" rel="noopener noreferrer">
                  <Button type="button" variant="ghost" size="sm">
                    <HugeiconsIcon icon={EyeIcon} className="size-4" />
                    View
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* Business Info */}
          <Card className="gap-0 p-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-base font-semibold tracking-tight">Business Information</h2>
              <p className="mt-1 text-sm text-muted-foreground">This appears on your public profile page.</p>
            </div>
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Business Name</Label>
                <Input name="name" defaultValue={data.name} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Business Type</Label>
                <select name="type" defaultValue={data.type} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="SALON">Salon</option>
                  <option value="CLINIC">Clinic</option>
                  <option value="SPA">Spa</option>
                  <option value="GYM">Gym</option>
                  <option value="CONSULTATION">Consultation</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label className="text-xs">Short Description (max 200 chars)</Label>
                <Input name="shortDescription" maxLength={200} defaultValue={data.shortDescription || ""} placeholder="A brief tagline for your business" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label className="text-xs">Full Description</Label>
                <textarea name="description" defaultValue={data.description || ""} rows={4} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Tell customers about your business..." />
              </div>
            </div>
          </Card>

          {/* Contact & Location */}
          <Card className="gap-0 p-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-base font-semibold tracking-tight">Contact & Location</h2>
            </div>
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Phone</Label>
                <Input name="phone" defaultValue={data.phone || ""} placeholder="+255 700 000 000" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Email</Label>
                <Input name="email" type="email" defaultValue={data.email || ""} placeholder="info@example.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Website</Label>
                <Input name="website" defaultValue={data.website || ""} placeholder="https://example.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Google Maps Link</Label>
                <Input name="googleMapsLink" defaultValue={data.googleMapsLink || ""} placeholder="https://maps.google.com/..." />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label className="text-xs">Address</Label>
                <Input name="address" defaultValue={data.address || ""} placeholder="Street address" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">City</Label>
                <Input name="city" defaultValue={data.city || ""} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Region/State</Label>
                <Input name="region" defaultValue={data.region || ""} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Country</Label>
                <Input name="country" defaultValue={data.country || ""} />
              </div>
            </div>
          </Card>

          {/* Social Links */}
          <Card className="gap-0 p-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-base font-semibold tracking-tight">Social Links</h2>
            </div>
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Instagram</Label>
                <Input name="instagram" defaultValue={data.instagram || ""} placeholder="https://instagram.com/..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Facebook</Label>
                <Input name="facebook" defaultValue={data.facebook || ""} placeholder="https://facebook.com/..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">TikTok</Label>
                <Input name="tiktok" defaultValue={data.tiktok || ""} placeholder="https://tiktok.com/@..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">WhatsApp</Label>
                <Input name="whatsapp" defaultValue={data.whatsapp || ""} placeholder="https://wa.me/..." />
              </div>
            </div>
          </Card>

          {/* Visibility */}
          <Card className="gap-0 p-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-base font-semibold tracking-tight">Visibility</h2>
              <p className="mt-1 text-sm text-muted-foreground">Control who can see your profile and booking page.</p>
            </div>
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Profile Page</Label>
                <select name="profileVisibility" defaultValue={data.profileVisibility} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="PUBLIC">Public — Google can index, anyone can view</option>
                  <option value="PRIVATE">Private — Hidden from public</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Booking Page</Label>
                <select name="bookingVisibility" defaultValue={data.bookingVisibility} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="PUBLIC">Public — Anyone with link can book</option>
                  <option value="PRIVATE">Private — Hidden from public</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" loading={saving} className="shadow-sm shadow-primary/20 transition-all duration-300 hover:shadow-md hover:shadow-primary/25 active:scale-[0.98]">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
              Save Profile
            </Button>
          </div>
        </form>
      )}

      {/* Profile Details Tab */}
      {activeTab === "details" && (
        <form onSubmit={saveDetails} className="flex flex-col gap-6">
          {/* Bio */}
          <Card className="gap-0 p-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-base font-semibold tracking-tight">Professional Bio</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tell customers about your background and expertise. This appears prominently on your profile.</p>
            </div>
            <div className="grid gap-4 pt-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Bio / About Me</Label>
                <textarea name="bio" defaultValue={data.bio || ""} rows={5} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Write a detailed bio about yourself, your career, achievements, and what makes you unique..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">Years of Experience</Label>
                  <Input name="yearsOfExperience" type="number" min={0} defaultValue={data.yearsOfExperience ?? ""} placeholder="5" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">Languages Spoken (comma separated)</Label>
                  <Input name="languages" defaultValue={data.languages || ""} placeholder="English, Swahili, French" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Specialties / Expertise (comma separated)</Label>
                <Input name="specialties" defaultValue={data.specialties || ""} placeholder="Hair Coloring, Bridal Makeup, Skin Care" />
              </div>
            </div>
          </Card>

          {/* Gallery */}
          <Card className="gap-0 p-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-base font-semibold tracking-tight">Gallery Images</h2>
              <p className="mt-1 text-sm text-muted-foreground">Add image URLs to showcase your work on your profile.</p>
            </div>
            <div className="grid gap-3 pt-4">
              {data.gallery && data.gallery.length > 0 ? (
                data.gallery.map((url, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input name="galleryUrl" defaultValue={url} placeholder="https://..." className="flex-1" />
                    <div className="size-9 shrink-0 overflow-hidden rounded-lg border border-border">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2">
                  <Input name="galleryUrl" placeholder="https://...image-url.jpg" className="flex-1" />
                </div>
              )}
              {/* Extra empty slots */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-2">
                  <Input name="galleryUrl" placeholder="https://...image-url.jpg" className="flex-1" />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Tip: Upload images to a service like Imgur or Cloudinary and paste the direct URL here.</p>
            </div>
          </Card>

          {/* Certifications */}
          <Card className="gap-0 p-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-base font-semibold tracking-tight">Certifications & Qualifications</h2>
              <p className="mt-1 text-sm text-muted-foreground">Add your professional certifications to build trust.</p>
            </div>
            <div className="grid gap-3 pt-4">
              {data.certifications && data.certifications.length > 0 ? (
                data.certifications.map((cert, i) => (
                  <div key={i} className="grid gap-2 sm:grid-cols-3">
                    <Input name="certName" defaultValue={cert.name} placeholder="Certificate name" />
                    <Input name="certIssuer" defaultValue={cert.issuer} placeholder="Issued by" />
                    <Input name="certYear" defaultValue={cert.year} placeholder="Year" />
                  </div>
                ))
              ) : null}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`new-cert-${i}`} className="grid gap-2 sm:grid-cols-3">
                  <Input name="certName" placeholder="Certificate name" />
                  <Input name="certIssuer" placeholder="Issued by" />
                  <Input name="certYear" placeholder="Year" />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" loading={detailsSaving} className="shadow-sm shadow-primary/20 transition-all duration-300 hover:shadow-md hover:shadow-primary/25 active:scale-[0.98]">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
              Save Profile Details
            </Button>
          </div>
        </form>
      )}

      {/* SEO Tab */}
      {activeTab === "seo" && (
        <form onSubmit={saveSEO} className="flex flex-col gap-6">
          <Card className="gap-0 p-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-base font-semibold tracking-tight">SEO Settings</h2>
              <p className="mt-1 text-sm text-muted-foreground">Optimize your profile page for search engines.</p>
            </div>
            <div className="grid gap-4 pt-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">SEO Title (max 60 chars)</Label>
                <Input name="seoTitle" maxLength={60} defaultValue={data.seo?.seoTitle || ""} placeholder={`${data.name} | ${data.type} in ${data.city || "Tanzania"}`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Meta Description (max 160 chars)</Label>
                <textarea name="metaDescription" maxLength={160} rows={2} defaultValue={data.seo?.metaDescription || ""} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Book services at..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Focus Keywords (comma separated)</Label>
                <Input name="focusKeywords" defaultValue={data.seo?.focusKeywords || ""} placeholder="beauty salon, hair salon, mwanza" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">OG Title</Label>
                  <Input name="ogTitle" defaultValue={data.seo?.ogTitle || ""} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">OG Description</Label>
                  <Input name="ogDescription" defaultValue={data.seo?.ogDescription || ""} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">OG Image URL</Label>
                  <Input name="ogImage" defaultValue={data.seo?.ogImage || ""} placeholder="https://..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">Canonical URL</Label>
                  <Input name="canonicalUrl" defaultValue={data.seo?.canonicalUrl || ""} placeholder="https://bookaflow-web.vercel.app/@your-slug" />
                </div>
              </div>
            </div>

            {/* Google Preview */}
            <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Google Preview</p>
              <div className="flex flex-col gap-0.5">
                <p className="text-lg text-primary hover:underline cursor-pointer">{data.seo?.seoTitle || `${data.name} | ${data.type} in ${data.city || "Tanzania"}`}</p>
                <p className="text-xs text-green-700">bookaflow-web.vercel.app/@{data.slug}</p>
                <p className="text-sm text-muted-foreground">{data.seo?.metaDescription || "Book services and appointments online."}</p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" loading={seoSaving} className="shadow-sm shadow-primary/20 transition-all duration-300 hover:shadow-md hover:shadow-primary/25 active:scale-[0.98]">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
              Save SEO
            </Button>
          </div>
        </form>
      )}

      {/* Booking Rules Tab */}
      {activeTab === "booking" && (
        <form onSubmit={saveBookingSettings} className="flex flex-col gap-6">
          <Card className="gap-0 p-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-base font-semibold tracking-tight">Booking Rules</h2>
              <p className="mt-1 text-sm text-muted-foreground">Control how customers book appointments.</p>
            </div>
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Advance Booking (days)</Label>
                <Input name="advanceBookingDays" type="number" min={1} max={365} defaultValue={data.bookingSettings?.advanceBookingDays ?? 30} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Minimum Notice (hours)</Label>
                <Input name="minimumNoticeHours" type="number" min={0} defaultValue={data.bookingSettings?.minimumNoticeHours ?? 2} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Cancellation Deadline (hours before)</Label>
                <Input name="cancellationDeadlineHours" type="number" min={0} defaultValue={data.bookingSettings?.cancellationDeadlineHours ?? 6} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Buffer Between Appointments (minutes)</Label>
                <Input name="bufferMinutes" type="number" min={0} max={120} defaultValue={data.bookingSettings?.bufferMinutes ?? 0} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Max Daily Bookings</Label>
                <Input name="maxDailyBookings" type="number" min={1} defaultValue={data.bookingSettings?.maxDailyBookings ?? 50} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Payment Mode</Label>
                <select name="paymentMode" defaultValue={data.bookingSettings?.paymentMode ?? "PAY_AT_VENUE"} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="PAY_AT_VENUE">Pay at venue</option>
                  <option value="FULL_PAYMENT">Full payment online</option>
                  <option value="DEPOSIT">Deposit required</option>
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { key: "bookingEnabled", label: "Booking Enabled", default: data.bookingSettings?.bookingEnabled ?? true },
                { key: "autoConfirm", label: "Auto-confirm Bookings", default: data.bookingSettings?.autoConfirm ?? true },
                { key: "cancellationAllowed", label: "Allow Cancellation", default: data.bookingSettings?.cancellationAllowed ?? true },
                { key: "reschedulingAllowed", label: "Allow Rescheduling", default: data.bookingSettings?.reschedulingAllowed ?? true },
                { key: "noShowProtection", label: "No-show Protection", default: data.bookingSettings?.noShowProtection ?? true },
                { key: "requirePhone", label: "Require Phone", default: data.bookingSettings?.requirePhone ?? true },
                { key: "requireEmail", label: "Require Email", default: data.bookingSettings?.requireEmail ?? false },
                { key: "requireStaffSelection", label: "Require Staff Selection", default: data.bookingSettings?.requireStaffSelection ?? false },
                { key: "allowDoubleBooking", label: "Allow Double Booking", default: data.bookingSettings?.allowDoubleBooking ?? false },
                { key: "allowCustomerNotes", label: "Allow Customer Notes", default: data.bookingSettings?.allowCustomerNotes ?? true },
              ].map((toggle) => (
                <label key={toggle.key} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                  <input type="checkbox" name={toggle.key} defaultChecked={toggle.default} className="size-4 rounded border-input accent-primary" />
                  <span className="text-sm font-medium">{toggle.label}</span>
                </label>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" loading={bookingSaving} className="shadow-sm shadow-primary/20 transition-all duration-300 hover:shadow-md hover:shadow-primary/25 active:scale-[0.98]">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
              Save Booking Rules
            </Button>
          </div>
        </form>
      )}
    </>
  )
}
