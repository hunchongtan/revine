"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadFace } from "./upload-face"
import { VoiceSelect } from "./voice-select"
import { SpinnerOverlay } from "./spinner-overlay"
import { ResultPlayer } from "./result-player"
import { useToast } from "@/hooks/use-toast"
import type { Template } from "@/lib/templates"

interface GeneratePanelProps {
  template: Template
}

export function GeneratePanel({ template }: GeneratePanelProps) {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [voice, setVoice] = useState<string>(template.defaultVoice)
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

      // Step 2: Generate TTS
      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: template.audioScript, voice, templateId: template.id }),
      })
      const { audioUrl } = await ttsRes.json()

      // Step 3: Generate video
      const videoRes = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id, imageUrl }),
      })
      const { videoUrl } = await videoRes.json()

      // Step 4: Mux audio and video
      const muxRes = await fetch("/api/mux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl, videoUrl, delayMs: 300 }),
      })
      const { finalUrl } = await muxRes.json()

      setResult({ caption, videoUrl: finalUrl })
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
    setVoice(template.defaultVoice)
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
          <label className="text-sm font-medium text-foreground block mb-2">Upload Image</label>
          <UploadFace onImageSelect={setImageUrl} preview={imageUrl} />
        </div>

        {/* Voice Select */}
        <VoiceSelect value={voice} onValueChange={setVoice} />

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
