"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
  FieldDescription,
} from "@workspace/ui/components/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@workspace/ui/components/input-otp"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { toast } from "@workspace/ui/components/toast"

export function OtpForm({
  className,
  email,
  onVerified,
  ...props
}: React.ComponentProps<"div"> & { email?: string; onVerified?: () => void }) {
  const [otp, setOtp] = React.useState("")
  const [verified, setVerified] = React.useState(false)
  const [resendTimer, setResendTimer] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (otp.length < 6) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setVerified(true)
      toast.add({ type: "success", title: "Code verified", description: "Your identity has been confirmed." })
      onVerified?.()
    }, 1000)
  }

  function handleResend() {
    setResendTimer(60)
    setOtp("")
    toast.add({ type: "info", title: "Code resent", description: "A new verification code has been sent." })
  }

  if (verified) {
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
          <h1 className="text-xl font-bold">Password reset confirmed</h1>
          <FieldDescription>
            Your identity has been verified. You can now set a new password.
          </FieldDescription>
        </div>
        <a
          href="/reset-password"
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-2.5 text-base font-medium text-primary-foreground transition-all hover:bg-primary/80"
        >
          Set new password
        </a>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <a href="/" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex size-10 items-center justify-center rounded-lg">
            <img
              src="/peercoin.png"
              alt="BookaFlow"
              className="size-8 rounded-lg object-cover"
            />
          </div>
          <span className="sr-only">BookaFlow</span>
        </a>
        <h1 className="text-xl font-bold">Check your email</h1>
        <FieldDescription>
          Enter the 6-digit code we sent to{" "}
          {email ? (
            <span className="font-medium text-foreground">{email}</span>
          ) : (
            <span className="font-medium text-foreground">your email</span>
          )}
        </FieldDescription>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(v) => setOtp(v)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="size-11 text-lg" />
                <InputOTPSlot index={1} className="size-11 text-lg" />
                <InputOTPSlot index={2} className="size-11 text-lg" />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} className="size-11 text-lg" />
                <InputOTPSlot index={4} className="size-11 text-lg" />
                <InputOTPSlot index={5} className="size-11 text-lg" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-11 w-full text-base"
            disabled={otp.length < 6}
            loading={loading}
          >
            Verify code
          </Button>
        </div>
      </form>

      <div className="flex flex-col items-center gap-2 text-center">
        <FieldDescription>
          Didn&apos;t receive the code?{" "}
          {resendTimer > 0 ? (
            <span className="text-muted-foreground">
              Resend in {resendTimer}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="underline underline-offset-4 hover:text-foreground"
            >
              Resend code
            </button>
          )}
        </FieldDescription>
      </div>
      </div>
    </div>
  )
}
