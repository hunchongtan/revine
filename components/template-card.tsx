"use client"

import Link from "next/link"
import Image from "next/image"
import type { Template } from "@/lib/templates"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface TemplateCardProps {
  template: Template
}

export function TemplateCard({ template }: TemplateCardProps) {
  const searchParams = useSearchParams()
  const year = searchParams.get("year")
  const search = searchParams.get("search")
  const [isHovering, setIsHovering] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const queryString = new URLSearchParams()
  queryString.set("template", template.id)
  if (year) queryString.set("year", year)
  if (search) queryString.set("search", search)

  // Check if template is saved on mount
  useEffect(() => {
    const saved = localStorage.getItem("revine_favourites")
    if (saved) {
      const favourites = JSON.parse(saved) as string[]
      setIsSaved(favourites.includes(template.id))
    }
  }, [template.id])

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const saved = localStorage.getItem("revine_favourites")
    const favourites = saved ? (JSON.parse(saved) as string[]) : []
    
    if (isSaved) {
      // Remove from favourites
      const updated = favourites.filter(id => id !== template.id)
      localStorage.setItem("revine_favourites", JSON.stringify(updated))
      setIsSaved(false)
      toast.success("Removed from saved")
    } else {
      // Add to favourites
      const updated = [...favourites, template.id]
      localStorage.setItem("revine_favourites", JSON.stringify(updated))
      setIsSaved(true)
      toast.success("Saved to favourites")
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const url = `${window.location.origin}/generate?template=${template.id}`
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied!")
    }).catch(() => {
      toast.error("Failed to copy link")
    })
  }

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
          <button 
            onClick={handleSave}
            className="flex items-center gap-1 hover:text-[#00B488] transition-colors"
            style={{ color: isSaved ? '#00B488' : undefined }}
          >
            <span>{isSaved ? '⭐' : '☆'}</span>
            <span className="font-medium">Save</span>
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center gap-1 hover:text-[#00B488] transition-colors"
          >
            <span>🔗</span>
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>
    </Link>
  )
}
