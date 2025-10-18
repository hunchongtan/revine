"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseAuthClient } from "@/lib/supabase-client"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = getSupabaseAuthClient()
      if (!supabase) {
        router.push("/")
        return
      }

      // Handle the OAuth callback
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.search
      )

      if (error) {
        console.error("Auth callback error:", error)
        router.push("/?error=auth_failed")
      } else {
        // Successfully authenticated, redirect to home
        router.push("/")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#00bf8f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#8a8a8a] text-lg">Signing you in...</p>
      </div>
    </div>
  )
}

