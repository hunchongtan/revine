"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Template } from "@/lib/templates"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

interface TemplateCardProps {
  template: Template
}

export function TemplateCard({ template }: TemplateCardProps) {
  const searchParams = useSearchParams()
  const year = searchParams.get("year")
  const search = searchParams.get("search")
  const [isHovering, setIsHovering] = useState(false)

  const queryString = new URLSearchParams()
  queryString.set("template", template.id)
  if (year) queryString.set("year", year)
  if (search) queryString.set("search", search)

  return (
    <Link href={`/generate?${queryString.toString()}`}>
      <Card
        className="overflow-hidden cursor-pointer h-full flex flex-col bg-white transition-all duration-300"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          animation: isHovering ? "jitter 0.3s ease-in-out, shadow-pulse 0.6s ease-in-out" : "none",
          boxShadow: isHovering ? "0 8px 12px rgba(0, 180, 136, 0.2)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="relative w-full h-48" style={{ backgroundColor: "#F0F0F0" }}>
          <Image src={template.thumbnail || "/placeholder.svg"} alt={template.name} fill className="object-cover" />
          <div
            className="absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: "#00B488" }}
          >
            {template.year}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-foreground mb-1">{template.name}</h3>
          <p className="text-sm mb-4 flex-1" style={{ color: "#999999" }}>
            {template.description}
          </p>
          <Button
            className="w-full text-white font-bold text-sm rounded-full py-2 transition-colors"
            style={{ backgroundColor: "#00B488" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#008B6B")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00B488")}
          >
            CREATE
          </Button>
        </div>
      </Card>
    </Link>
  )
}
