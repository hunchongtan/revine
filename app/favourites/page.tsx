"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { fetchTemplates } from "@/lib/services/templates"
import { adaptNewTemplate, type UnifiedTemplate } from "@/lib/template-adapter"
import { TemplateCard } from "@/components/template-card"
import { useRouter } from "next/navigation"

export default function FavouritesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [templates, setTemplates] = useState<UnifiedTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to home if not logged in
      router.push("/")
      return
    }

    if (user) {
      const loadFavourites = async () => {
        setLoading(true)
        const allTemplates = await fetchTemplates(user.id)
        const favourites = allTemplates.filter((t) => t.isFavourite).map(adaptNewTemplate)
        setTemplates(favourites)
        setLoading(false)
      }
      loadFavourites()
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00bf8f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8a8a8a] text-lg">Loading your favourites...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Header */}
      <section className="bg-white border-b border-[#e6e6e6] py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#333] mb-2">
            ⭐ My Favourites
          </h1>
          <p className="text-[#8a8a8a]">
            {templates.length} saved {templates.length === 1 ? "template" : "templates"}
          </p>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-[#8a8a8a] mb-4">
              No favourites yet! Save templates by clicking the ⭐ button.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#00bf8f] hover:bg-[#00a77a] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Templates
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

