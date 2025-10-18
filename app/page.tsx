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
    <main className="min-h-screen bg-[#f3f3f3]">
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
