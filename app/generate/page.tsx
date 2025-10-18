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
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F6F6F6" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No template selected</h1>
          <Link href="/">
            <Button
              className="text-white font-bold rounded-full"
              style={{ backgroundColor: "#00B488" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#008B6B")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00B488")}
            >
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
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F6F6F6" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Template not found</h1>
          <Link href="/">
            <Button
              className="text-white font-bold rounded-full"
              style={{ backgroundColor: "#00B488" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#008B6B")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00B488")}
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F6F6F6" }}>
      {/* Header */}
      <header className="border-b bg-white" style={{ borderColor: "#E8E8E8" }}>
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              className="hover:bg-opacity-50"
              style={{ color: "#00B488" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F6F6F6")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              ← Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create Your Vine</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Content */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <GeneratePanel template={template} />
      </section>
    </main>
  )
}
