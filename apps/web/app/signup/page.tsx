import type { Metadata } from "next"
import { SignupForm } from "@workspace/ui/components/signup-form"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your BookMiadi account and start managing your bookings, staff, and customers — all in one beautiful platform.",
  openGraph: {
    title: "BookMiadi — Create your account",
    description: "Start managing your bookings, staff, and customers with BookMiadi.",
    images: ["/team-young-african-people-office-table-with-laptops_219728-4522.jpg"],
  },
}

export default function SignupPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6 sm:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/peercoin.png"
            alt="BookMiadi"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <span className="text-xl font-bold tracking-tight">BookMiadi</span>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
