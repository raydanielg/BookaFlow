"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { toast } from "@workspace/ui/components/toast"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MailCheckIcon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { api } from "@workspace/ui/lib/api"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [businessName, setBusinessName] = React.useState("")
  const [businessType, setBusinessType] = React.useState("")
  const [agree, setAgree] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [businessDisplayName, setBusinessDisplayName] = React.useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await api.signup({
        fullName: name,
        email,
        password,
        businessName,
        businessType: businessType || undefined,
      })
      api.setToken(data.token)
      api.setBusinessId(data.business.id)
      setBusinessDisplayName(data.business.name)
      setSuccess(true)
      toast.add({
        type: "success",
        title: "Account created!",
        description: `Welcome to ${data.business.name}. Check your email for a welcome message.`,
      })
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 3000)
    } catch (err) {
      toast.add({ type: "error", title: "Signup failed", description: err instanceof Error ? err.message : "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={cn("flex flex-col items-center gap-6 text-center", className)} {...props}>
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-8 text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Account created!</h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Welcome to <strong className="text-foreground">{businessDisplayName}</strong>.
            Your booking platform is ready to go.
          </p>
        </div>
        <div className="flex w-full items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 text-left">
          <HugeiconsIcon icon={MailCheckIcon} className="size-5 shrink-0 text-primary mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">Check your email</p>
            <p className="text-xs text-muted-foreground text-pretty">
              We&apos;ve sent a welcome message to <strong className="text-foreground">{email}</strong> with
              your booking link and getting started guide.
            </p>
          </div>
        </div>
        <div className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          Redirecting to dashboard...
        </div>
        <Button
          size="lg"
          className="w-full"
          nativeButton={false}
          render={<a href="/dashboard" />}
        >
          Go to dashboard
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-xl font-bold">Create your account</h1>
        <FieldDescription>
          Already have an account? <a href="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">Sign in</a>
        </FieldDescription>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 px-3 text-base"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="businessName">Business name</FieldLabel>
            <Input
              id="businessName"
              type="text"
              placeholder="e.g. Beauty House"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="h-11 px-3 text-base"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="businessType">Business type</FieldLabel>
            <select
              id="businessType"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select business type...</option>
              <option value="SALON">Salon</option>
              <option value="CLINIC">Clinic</option>
              <option value="SPA">Spa</option>
              <option value="GYM">Gym</option>
              <option value="CONSULTATION">Consultation</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 px-3 text-base"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 px-3 text-base"
            />
            <FieldDescription className="text-xs">
              Use at least 8 characters with a mix of letters, numbers, and symbols.
            </FieldDescription>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="terms"
              checked={agree}
              onCheckedChange={(v) => setAgree(v)}
              required
            />
            <FieldLabel htmlFor="terms" className="text-sm font-normal">
              I agree to the{" "}
              <a href="/terms" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </a>
            </FieldLabel>
          </Field>
          <Field>
            <Button
              type="submit"
              size="lg"
              className="h-11 w-full text-base"
              disabled={!agree}
              loading={loading}
            >
              Create account
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
