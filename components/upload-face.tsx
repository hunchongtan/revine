"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface UploadFaceProps {
  onImageSelect: (url: string) => void
  preview?: string
}

const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function UploadFace({ onImageSelect, preview }: UploadFaceProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isNormalizing, setIsNormalizing] = useState(false)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = async (file: File) => {
    // Size check
    const MAX_SIZE = 6 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Max 6MB. Try a smaller image.",
        variant: "destructive",
      })
      return
    }

    // If supported format, use existing data URL flow
    if (SUPPORTED_TYPES.includes(file.type)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        onImageSelect(url)
      }
      reader.readAsDataURL(file)
      return
    }

    // Unsupported format - normalize via API
    setIsNormalizing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/api/normalize-image', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Normalization failed')
      }

      const { url } = await res.json()
      onImageSelect(url) // Use public Supabase URL
      
      toast({
        description: "Converted to PNG for compatibility",
      })
    } catch (error: any) {
      console.error('Normalization error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to process image. Try a different file.",
        variant: "destructive",
      })
    } finally {
      setIsNormalizing(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <Card
      className="p-6 border-2 border-dashed transition-colors relative"
      style={{
        borderColor: isDragging ? "#00B488" : "#E8E8E8",
        backgroundColor: isDragging ? "#E8F8F3" : "transparent",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isNormalizing && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#00B488] mx-auto mb-2" />
            <p className="text-sm text-[#8a8a8a]">Converting image...</p>
          </div>
        </div>
      )}
      
      {preview ? (
        <div className="space-y-4">
          <div className="relative w-full h-48 rounded-lg overflow-hidden" style={{ backgroundColor: "#F0F0F0" }}>
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill sizes="(max-width: 768px) 100vw, 600px" className="object-cover" />
          </div>
          <label className="block">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleInputChange} 
              className="hidden" 
              disabled={isNormalizing}
            />
            <span 
              className={`text-sm font-medium ${
                isNormalizing ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:underline"
              }`}
              style={{ color: "#00B488" }}
            >
              Change image
            </span>
          </label>
        </div>
      ) : (
        <label className={`block ${isNormalizing ? "cursor-not-allowed" : "cursor-pointer"}`}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleInputChange} 
            className="hidden" 
            disabled={isNormalizing}
          />
          <div className="text-center py-8">
            <p className="text-foreground font-medium mb-2">Upload your face</p>
            <p className="text-sm" style={{ color: "#999999" }}>
              Drag and drop your photo or click to select
            </p>
          </div>
        </label>
      )}
    </Card>
  )
}
