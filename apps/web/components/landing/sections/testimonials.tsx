"use client"

import { RevealOnScroll } from "@/components/landing/reveal-on-scroll"

const testimonials = [
  {
    quote:
      "BookMiadi changed how we run our salon. No more double-bookings or missed appointments. Our customers love booking online.",
    author: "Amina Hassan",
    role: "Owner, Beauty Lounge",
    location: "Dar es Salaam",
  },
  {
    quote:
      "I used to manage appointments on paper. Now everything is digital. I can see my calendar, staff, and customers in one place.",
    author: "Dr. Joseph Mwangi",
    role: "Director, HealthFirst Clinic",
    location: "Arusha",
  },
  {
    quote:
      "The booking page link is a game changer. Customers book themselves and I just see the appointments in my dashboard.",
    author: "Sarah Kimathi",
    role: "Founder, Serenity Spa",
    location: "Nairobi",
  },
  {
    quote:
      "Our gym class bookings used to be chaotic. BookMiadi made it simple. Members book online and we track everything.",
    author: "Michael Okoye",
    role: "Manager, FitZone Gym",
    location: "Kampala",
  },
]

export function Testimonials() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mb-16 max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Testimonials
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Loved by businesses across Africa
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {testimonials.map((testimonial, idx) => (
            <RevealOnScroll key={testimonial.author} delay={idx * 100}>
              <div className="flex h-full flex-col gap-4 rounded-xl border border-border p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                <p className="text-base text-foreground text-pretty leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-auto flex items-center gap-3 border-t border-border/60 pt-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {testimonial.author}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {testimonial.role} · {testimonial.location}
                    </span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
