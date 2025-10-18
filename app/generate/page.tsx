"use client"

import { useSearchParams } from "next/navigation"
import { getTemplate } from "@/lib/templates"
import { GeneratePanel } from "@/components/generate-panel"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")

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

  const template = getTemplate(templateId)

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
