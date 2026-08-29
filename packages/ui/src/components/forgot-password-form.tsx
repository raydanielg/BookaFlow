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
import { HugeiconsIcon } from "@hugeicons/react"
import { MailCheckIcon } from "@hugeicons/core-free-icons"
import { toast } from "@workspace/ui/components/toast"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState("")
  const [sent, setSent] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
      toast.add({ type: "success", title: "Code sent", description: `Verification code sent to ${email}.` })
    }, 1000)
  }

  if (sent) {
    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg">
            <img
              src="/peercoin.png"
              alt="BookaFlow"
              className="size-8 rounded-lg object-cover"
            />
          </div>
          <h1 className="text-xl font-bold">Check your email</h1>
          <FieldDescription>
            We sent a verification code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </FieldDescription>
        </div>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/50 p-4 text-center">
          <HugeiconsIcon
            icon={MailCheckIcon}
            className="size-10 text-primary"
            strokeWidth={2}
          />
          <p className="text-sm text-muted-foreground">
            Check your inbox for the 6-digit verification code. The code will expire in 30 minutes.
          </p>
          <a
            href={`/verify-otp?email=${encodeURIComponent(email)}`}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-2.5 text-base font-medium text-primary-foreground transition-all hover:bg-primary/80"
          >
            Enter verification code
          </a>
        </div>
        <FieldDescription className="px-2 text-center">
          <button
            type="button"
            onClick={() => {
              setSent(false)
              setEmail("")
            }}
            className="underline underline-offset-4 hover:text-foreground"
          >
            Try a different email
          </button>
        </FieldDescription>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <a
          href="/"
          className="flex flex-col items-center gap-2 font-medium"
        >
          <div className="flex size-10 items-center justify-center rounded-lg">
            <img
              src="/peercoin.png"
              alt="BookaFlow"
              className="size-8 rounded-lg object-cover"
            />
          </div>
          <span className="sr-only">BookaFlow</span>
        </a>
        <h1 className="text-xl font-bold">Forgot password?</h1>
        <FieldDescription>
          Enter your email and we&apos;ll send you a verification code to reset your password.
        </FieldDescription>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup className="gap-3">
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
            <Button type="submit" size="lg" className="h-11 w-full text-base" loading={loading}>
              Send verification code
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-2 text-center">
        Remember your password? <a href="/" className="underline underline-offset-4 hover:text-foreground">Sign in</a>
      </FieldDescription>
    </div>
  )
}
