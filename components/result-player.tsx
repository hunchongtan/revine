"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ResultPlayerProps {
  videoUrl: string
  caption: string
  onDownload: () => void
  onCopyCaption: () => void
  onGenerateAgain: () => void
}

export function ResultPlayer({ videoUrl, caption, onDownload, onCopyCaption, onGenerateAgain }: ResultPlayerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(caption)
    setCopied(true)
    onCopyCaption()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="p-6 space-y-4 bg-white">
      <div className="bg-black rounded-lg overflow-hidden">
        <video src={videoUrl} controls className="w-full" />
      </div>

      <div className="p-4 rounded-lg border" style={{ backgroundColor: "#E8F8F3", borderColor: "#D0F0E8" }}>
        <p className="text-foreground font-medium">{caption}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button
          onClick={onDownload}
          className="text-white font-bold rounded-full transition-colors"
          style={{ backgroundColor: "#00B488" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#008B6B")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00B488")}
        >
          Download MP4
        </Button>
        <Button
          onClick={handleCopy}
          variant="outline"
          className="rounded-full bg-transparent"
          style={{ borderColor: "#E8E8E8" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F6F6F6")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          {copied ? "Copied!" : "Copy Caption"}
        </Button>
        <Button
          onClick={onGenerateAgain}
          variant="outline"
          className="rounded-full bg-transparent"
          style={{ borderColor: "#E8E8E8" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F6F6F6")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Generate Again
        </Button>
      </div>
    </Card>
  )
}
