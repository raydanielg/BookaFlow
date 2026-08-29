import { SignupForm } from "@workspace/ui/components/signup-form"
import Image from "next/image"

export const metadata = {
  title: "BookaFlow — Sign up",
  description: "Create your BookaFlow account.",
}

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left — branded panel */}
      <div className="relative hidden flex-col p-10 text-white lg:flex">
        <Image
          src="/35124.jpg"
          alt="BookaFlow team"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-primary/20" />
        <div className="relative z-10 flex items-center gap-2 text-lg font-bold">
          <Image
            src="/peercoin.png"
            alt="BookaFlow"
            width={32}
            height={32}
            className="rounded-lg"
          />
          BookaFlow
        </div>
        <div className="relative z-10 mt-auto space-y-6">
          <div className="space-y-3">
            <h2 className="max-w-md text-balance text-3xl font-bold leading-tight">
              Start booking smarter today.
            </h2>
            <p className="max-w-md text-balance text-primary-foreground/80">
              Create your account and start managing appointments, staff, and
              customers — all in one place.
            </p>
          </div>
        </div>
        <div className="relative z-10 mt-10 text-xs text-primary-foreground/60">
          &copy; {new Date().getFullYear()} BookaFlow. All rights reserved.
        </div>
      </div>

      {/* Right — signup form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Image
              src="/peercoin.png"
              alt="BookaFlow"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="text-lg font-bold">BookaFlow</span>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
