"use client"

import { TemplateCard } from "@/components/template-card"
import { YearSelect } from "@/components/year-select"
import { SearchTemplates } from "@/components/search-templates"
import { WelcomeModal } from "@/components/welcome-modal"
import { useSearchParams } from "next/navigation"
import { useMemo, useEffect, useState } from "react"
import { fetchTemplates, getTemplateThumbnailUrl } from "@/lib/services/templates"
import { adaptNewTemplate } from "@/lib/template-adapter"
import { useAuth } from "@/lib/hooks/use-auth"
import type { Template } from "@/lib/services/templates"

export default function Home() {
  const searchParams = useSearchParams()
  const yearParam = searchParams.get("year")
  const searchParam = searchParams.get("search")?.toLowerCase() || ""
  const { user } = useAuth()
  
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTemplates() {
      console.log("[HomePage] Loading templates...");
      try {
        const data = await fetchTemplates(user?.id)
        console.log("[HomePage] ✓ Received templates:", data.length);
        console.log("[HomePage] Template data:", data);
        setTemplates(data)
      } catch (error) {
        console.error("[HomePage] ❌ Failed to load templates:", error)
      } finally {
        setLoading(false)
        console.log("[HomePage] Loading complete");
      }
    }
    loadTemplates()
  }, [user?.id])

  const filteredTemplates = useMemo(() => {
    return templates.map(t => {
      const adapted = adaptNewTemplate(t)
      // Get the proper Supabase Storage URL for the thumbnail
      adapted.thumbnail = getTemplateThumbnailUrl(t.thumbnail_url)
      return adapted
    }).filter((template) => {
      const matchesYear = !yearParam || template.year.toString() === yearParam
      const matchesSearch = !searchParam || template.name.toLowerCase().includes(searchParam)
      return matchesYear && matchesSearch
    })
  }, [templates, yearParam, searchParam])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00bf8f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8a8a8a] text-lg">Loading templates...</p>
        </div>
      </div>
    )
  }

  const handleSignInClick = () => {
    // Trigger click on the sign in button in the navbar
    const signInButton = document.querySelector('nav button') as HTMLButtonElement
    if (signInButton) {
      signInButton.click()
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Welcome Modal */}
      <WelcomeModal onSignInClick={handleSignInClick} />

      {/* Filter Bar */}
      <section className="bg-white border-b border-[#e6e6e6] py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-3 items-center">
            <YearSelect />
            <div className="w-px h-6 bg-[#e6e6e6]" />
            <SearchTemplates />
          </div>
        </div>
      </section>

      {/* Template Grid */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-[#8a8a8a]">
              No templates found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
