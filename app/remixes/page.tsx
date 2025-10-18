"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MyRemixesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
        <div className="text-[#8a8a8a]">Loading...</div>
      </main>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Header */}
      <section className="bg-white border-b border-[#e6e6e6] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#333] mb-2">My Remixes</h1>
          <p className="text-[#8a8a8a]">Your created Vines</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Empty State */}
        <div className="bg-white rounded-lg p-12 text-center border border-[#e6e6e6]">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-xl font-bold text-[#333] mb-2">
              No Remixes Yet
            </h2>
            <p className="text-[#8a8a8a] mb-6">
              You haven't created any Vines yet. Start by choosing a template and creating your first masterpiece!
            </p>
            <Button
              asChild
              className="bg-[#00bf8f] hover:bg-[#00a77a] text-white font-semibold"
            >
              <Link href="/">Browse Templates</Link>
            </Button>
          </div>
        </div>

        {/* Future: Grid of user's remixes will go here */}
      </section>
    </main>
  )
}

