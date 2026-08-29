"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@workspace/ui/lib/api"

export function useAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{
    id: string
    email: string
    fullName: string
    role: string
  } | null>(null)
  const [businessId, setBusinessIdState] = useState<string | null>(null)

  useEffect(() => {
    const token = api.getToken()
    const bid = api.getBusinessId()

    if (!token || !bid) {
      router.replace("/")
      return
    }

    api
      .me()
      .then((data) => {
        setUser(data.user)
        setBusinessIdState(bid)
        setLoading(false)
      })
      .catch(() => {
        api.removeToken()
        router.replace("/")
      })
  }, [router])

  return { user, businessId, loading }
}
