import { LoginForm } from "@workspace/ui/components/login-form"
import Image from "next/image"

export const metadata = {
  title: "BookMiadi — Sign in",
  description: "Sign in to your BookMiadi account.",
}

export default function LoginPage() {
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
        <LoginForm />
      </div>
    </div>
  )
}
