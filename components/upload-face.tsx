"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface UploadFaceProps {
  onImageSelect: (url: string) => void
  preview?: string
}

export function UploadFace({ onImageSelect, preview }: UploadFaceProps) {
  const [isDragging, setIsDragging] = useState(false)

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

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      onImageSelect(url)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <Card
      className="p-6 border-2 border-dashed transition-colors"
      style={{
        borderColor: isDragging ? "#00B488" : "#E8E8E8",
        backgroundColor: isDragging ? "#E8F8F3" : "transparent",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {preview ? (
        <div className="space-y-4">
          <div className="relative w-full h-48 rounded-lg overflow-hidden" style={{ backgroundColor: "#F0F0F0" }}>
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          </div>
          <label className="block">
            <input type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
            <span className="text-sm cursor-pointer hover:underline font-medium" style={{ color: "#00B488" }}>
              Change image
            </span>
          </label>
        </div>
      ) : (
        <label className="block cursor-pointer">
          <input type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
          <div className="text-center py-8">
            <p className="text-foreground font-medium mb-2">Upload your image</p>
            <p className="text-sm" style={{ color: "#999999" }}>
              Drag and drop or click to select
            </p>
          </div>
        </label>
      )}
    </Card>
  )
}
