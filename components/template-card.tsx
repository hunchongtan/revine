"use client"

import Link from "next/link"
import Image from "next/image"
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
      <div
        className="bg-white border border-[#e6e6e6] rounded-[12px] overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          transform: isHovering ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        {/* Video Thumbnail */}
        <div className="relative w-full aspect-square bg-[#f0f0f0]">
          <Image 
            src={template.thumbnail || "/placeholder.svg"} 
            alt={template.name} 
            fill 
            className="object-cover" 
          />
          
          {/* Year Badge - Top Right */}
          <div className="absolute top-2 right-2 bg-[#00bf8f] text-white text-xs font-semibold px-2 py-1 rounded">
            {template.year}
          </div>
        </div>

        {/* Caption Area */}
        <div className="p-3">
          <p className="font-semibold text-sm text-[#333] mb-1">
            {template.name}
          </p>
          <p className="text-xs text-[#8a8a8a] line-clamp-2">
            {template.description}
          </p>
        </div>

        {/* Interaction Bar */}
        <div className="px-3 pb-3 flex items-center gap-4 text-[#8a8a8a] text-xs border-t border-[#e6e6e6] pt-3">
          <button className="flex items-center gap-1 hover:text-[#00bf8f] transition-colors">
            <span>👍</span>
            <span className="font-medium">Like</span>
          </button>
          <button className="flex items-center gap-1 hover:text-[#00bf8f] transition-colors">
            <span>🔁</span>
            <span className="font-medium">ReVine</span>
          </button>
          <button className="flex items-center gap-1 hover:text-[#00bf8f] transition-colors">
            <span>↗</span>
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>
    </Link>
  )
}
