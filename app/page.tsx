"use client"

import { templates } from "@/lib/templates"
import { TemplateCard } from "@/components/template-card"
import { YearSelect } from "@/components/year-select"
import { SearchTemplates } from "@/components/search-templates"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

export default function Home() {
  const searchParams = useSearchParams()
  const yearParam = searchParams.get("year")
  const searchParam = searchParams.get("search")?.toLowerCase() || ""

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesYear = !yearParam || template.year.toString() === yearParam
      const matchesSearch = !searchParam || template.name.toLowerCase().includes(searchParam)
      return matchesYear && matchesSearch
    })
  }, [yearParam, searchParam])

  return (
    <main style={{ backgroundColor: "#F6F6F6" }} className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: "#E8E8E8" }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-5xl font-bold text-foreground mb-2" style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
            vine rewind
          </h1>
          <p className="text-sm text-foreground italic" style={{ color: "#999999" }}>
            remember when 6 seconds was enough?
          </p>
        </div>
      </header>

      {/* Filter Bar */}
      <section style={{ backgroundColor: "#F6F6F6" }} className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div
            className="bg-white rounded-full shadow-sm p-4 flex gap-3 items-center"
            style={{ borderColor: "#E8E8E8" }}
          >
            <YearSelect />
            <div className="w-px h-6" style={{ backgroundColor: "#E8E8E8" }} />
            <SearchTemplates />
          </div>
        </div>
      </section>

      {/* Template Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: "#999999" }}>
              No templates found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
