"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadFace } from "./upload-face"
// Removed ElevenLabs voice selection
import { SpinnerOverlay } from "./spinner-overlay"
import { ResultPlayer } from "./result-player"
import { useToast } from "@/hooks/use-toast"
import type { Template } from "@/lib/templates"

interface GeneratePanelProps {
  template: Template
}

export function GeneratePanel({ template }: GeneratePanelProps) {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [spinnerMessage, setSpinnerMessage] = useState<string | undefined>(undefined)
  const [result, setResult] = useState<{
    caption: string
    videoUrl: string
  } | null>(null)
  const { toast } = useToast()

  // Long-job indicator: Show meme message after 15s
  useEffect(() => {
    if (!isGenerating) {
      setSpinnerMessage(undefined)
      return
    }

    const timeout = setTimeout(() => {
      setSpinnerMessage("still cooking… don't drop your croissant 🥐")
    }, 15000)

    return () => clearTimeout(timeout)
  }, [isGenerating])

  const handleGenerate = async () => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Step 1: Generate caption
      const captionRes = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id }),
      })
      const { caption } = await captionRes.json()

      // Resolve absolute thumbnail URL for reference image 1
      const firstRef = (() => {
        const t = template.thumbnail
        if (!t) return undefined
        if (t.startsWith("http")) return t
        try {
          return new URL(t, window.location.origin).href
        } catch {
          return undefined
        }
      })()
      const isLocalhost = (u?: string) => {
        if (!u) return true
        try {
          const h = new URL(u).hostname
          return h === "localhost" || h === "127.0.0.1"
        } catch {
          return true
        }
      }

      // Step 2: Generate video (reference-to-video with thumbnail + user image)
      const videoRes = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id, imageUrl, referenceThumbnail: isLocalhost(firstRef) ? undefined : firstRef }),
      })
      const { videoUrl } = await videoRes.json()

      setResult({ caption, videoUrl })
      toast({
        title: "Success!",
        description: "Your Vine is ready",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (result?.videoUrl) {
      const a = document.createElement("a")
      a.href = result.videoUrl
      a.download = `vine-${template.id}.mp4`
      a.click()
    }
  }

  const handleCopyCaption = () => {
    const text = result?.caption?.trim()
    if (!text) return
    
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Caption copied to clipboard",
    })
  }

  const handleGenerateAgain = () => {
    setResult(null)
    setImageUrl("")
    // voice selection removed (we no longer use ElevenLabs)
  }

  if (result) {
    return (
      <ResultPlayer
        videoUrl={result.videoUrl}
        caption={result.caption}
        onDownload={handleDownload}
        onCopyCaption={handleCopyCaption}
        onGenerateAgain={handleGenerateAgain}
      />
    )
  }

  return (
    <>
      <SpinnerOverlay isVisible={isGenerating} message={spinnerMessage} />
      <Card className="p-6 space-y-6 bg-white">
        {/* Template Summary */}
        <div className="p-4 rounded-lg border border-[#e6e6e6] bg-white">
          <h3 className="font-bold text-[#333] mb-1">{template.name}</h3>
          <p className="text-sm text-[#8a8a8a]">{template.description}</p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Upload Your Photo</label>
          <UploadFace onImageSelect={setImageUrl} preview={imageUrl} />
        </div>

        {/* Voice Select removed (using model audio) */}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!imageUrl || isGenerating}
          className="w-full bg-[#00bf8f] hover:bg-[#00a77a] text-white font-semibold text-base rounded-full py-3 disabled:opacity-50 transition-colors"
        >
          CREATE VINE
        </Button>
      </Card>
    </>
  )
}
