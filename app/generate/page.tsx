"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { fetchTemplate, getTemplateThumbnailUrl } from "@/lib/services/templates"
import { adaptNewTemplate, type UnifiedTemplate } from "@/lib/template-adapter"
import { GeneratePanel } from "@/components/generate-panel"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")
  const [template, setTemplate] = useState<UnifiedTemplate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTemplate() {
      if (!templateId) {
        setLoading(false)
        return
      }

      const data = await fetchTemplate(templateId)
      if (data) {
        const adapted = adaptNewTemplate(data)
        adapted.thumbnail = getTemplateThumbnailUrl(data.thumbnail_url)
        setTemplate(adapted)
      }
      setLoading(false)
    }

    loadTemplate()
  }, [templateId])

  if (!templateId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#333] mb-4">No template selected</h1>
          <Link href="/">
            <Button className="bg-[#00bf8f] hover:bg-[#00a77a] text-white font-semibold rounded-full px-6 py-3 transition-colors">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00bf8f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8a8a8a] text-lg">Loading template...</p>
        </div>
      </main>
    )
  }

  if (!template) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#333] mb-4">Template not found</h1>
          <Link href="/">
            <Button className="bg-[#00bf8f] hover:bg-[#00a77a] text-white font-semibold rounded-full px-6 py-3 transition-colors">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Content */}
      <section className="max-w-2xl mx-auto px-4 py-8">
        <GeneratePanel template={template} />
      </section>
    </main>
  )
}
