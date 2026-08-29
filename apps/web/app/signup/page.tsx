import { SignupForm } from "@workspace/ui/components/signup-form"
import Image from "next/image"

export const metadata = {
  title: "BookaFlow — Sign up",
  description: "Create your BookaFlow account and start managing your bookings.",
}

export default function SignupPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6 sm:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/peercoin.png"
            alt="BookaFlow"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <span className="text-xl font-bold tracking-tight">BookaFlow</span>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
