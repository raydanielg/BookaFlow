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
import { EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons"
import { toast } from "@workspace/ui/components/toast"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)

  const strength = React.useMemo(() => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++
    return score
  }, [password])

  const strengthLabel = ["Too weak", "Weak", "Fair", "Good", "Strong"][strength]
  const strengthColor = [
    "bg-destructive",
    "bg-destructive",
    "bg-yellow-500",
    "bg-primary",
    "bg-primary",
  ][strength]

  const passwordsMatch = password === confirmPassword && password.length > 0
  const canSubmit = password.length >= 8 && passwordsMatch

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
      toast.add({ type: "success", title: "Password updated", description: "Your password has been reset successfully." })
    }, 1200)
  }

  if (done) {
    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg">
            <img
              src="/peercoin.png"
              alt="BookMiadi"
              className="size-8 rounded-lg object-cover"
            />
          </div>
          <h1 className="text-xl font-bold">Password updated</h1>
          <FieldDescription>
            Your password has been reset successfully. You can now sign in with your new password.
          </FieldDescription>
        </div>
        <a
          href="/"
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-2.5 text-base font-medium text-primary-foreground transition-all hover:bg-primary/80"
        >
          Back to sign in
        </a>
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
              alt="BookMiadi"
              className="size-8 rounded-lg object-cover"
            />
          </div>
          <span className="sr-only">BookMiadi</span>
        </a>
        <h1 className="text-xl font-bold">Set new password</h1>
        <FieldDescription>
          Choose a strong password to secure your account.
        </FieldDescription>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 px-3 pe-10 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                <HugeiconsIcon
                  icon={showPassword ? EyeOffIcon : EyeIcon}
                  className="size-5"
                  strokeWidth={2}
                />
              </button>
            </div>
            {password.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors",
                        i < strength ? strengthColor : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <FieldDescription className="text-xs">
                  {strengthLabel}
                </FieldDescription>
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 px-3 pe-10 text-base"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                <HugeiconsIcon
                  icon={showConfirm ? EyeOffIcon : EyeIcon}
                  className="size-5"
                  strokeWidth={2}
                />
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <FieldDescription className="text-xs text-destructive">
                Passwords do not match
              </FieldDescription>
            )}
          </Field>

          <Field>
            <Button
              type="submit"
              size="lg"
              className="h-11 w-full text-base"
              disabled={!canSubmit}
              loading={loading}
            >
              Reset password
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-2 text-center">
        Remember your password?{" "}
        <a href="/" className="underline underline-offset-4 hover:text-foreground">
          Sign in
        </a>
      </FieldDescription>
    </div>
  )
}
