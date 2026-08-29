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
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { toast } from "@workspace/ui/components/toast"
import { api } from "@workspace/ui/lib/api"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = React.useState<"email" | "password">("email")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [direction, setDirection] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setDirection(1)
    setStep("password")
    setTimeout(() => passwordRef.current?.focus(), 350)
  }

  function handleBack() {
    setDirection(-1)
    setStep("email")
    setTimeout(() => emailRef.current?.focus(), 350)
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await api.login({ email, password })
      api.setToken(data.token)
      if (data.businesses && data.businesses.length > 0) {
        api.setBusinessId(data.businesses[0].id)
      }
      toast.add({ type: "success", title: "Welcome back!", description: `Signed in as ${data.user.fullName}.` })
      window.location.href = "/dashboard"
    } catch (err) {
      toast.add({ type: "error", title: "Login failed", description: err instanceof Error ? err.message : "Invalid email or password" })
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-xl font-bold">
          {step === "email" ? "Welcome to BookaFlow" : "Enter your password"}
        </h1>
        {step === "email" ? (
          <FieldDescription>
            Don&apos;t have an account? <a href="/signup">Sign up</a>
          </FieldDescription>
        ) : (
          <FieldDescription>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-foreground"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} className="size-3.5" strokeWidth={2} />
              {email}
            </button>
          </FieldDescription>
        )}
      </div>

      <div className="relative overflow-hidden">
        {/* Email step */}
        <div
          className={cn(
            "transition-all duration-300 ease-out",
            step === "email"
              ? "translate-x-0 opacity-100"
              : direction > 0
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0"
          )}
        >
          <form onSubmit={handleEmailSubmit}>
            <FieldGroup className="gap-3">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  ref={emailRef}
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
                  Continue
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>

        {/* Password step */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300 ease-out",
            step === "password"
              ? "translate-x-0 opacity-100"
              : direction > 0
                ? "translate-x-full opacity-0"
                : "-translate-x-full opacity-0"
          )}
        >
          <form onSubmit={handlePasswordSubmit}>
            <FieldGroup className="gap-3">
              <Field>
                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>
                <Input
                  ref={passwordRef}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 px-3 text-base"
                />
              </Field>
              <Field>
                <Button type="submit" size="lg" className="h-11 w-full text-base" loading={loading}>
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>

    </div>
  )
}
