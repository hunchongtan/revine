"use client"

import { useState } from "react"
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
  const [result, setResult] = useState<{
    caption: string
    videoUrl: string
  } | null>(null)
  const { toast } = useToast()

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
        onCopyCaption={() => {}}
        onGenerateAgain={handleGenerateAgain}
      />
    )
  }

  return (
    <>
      <SpinnerOverlay isVisible={isGenerating} />
      <Card className="p-6 space-y-6 bg-white">
        {/* Template Summary */}
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "#E8F8F3", borderColor: "#D0F0E8" }}>
          <h3 className="font-bold text-foreground mb-1">{template.name}</h3>
          <p className="text-sm text-foreground">{template.description}</p>
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
          className="w-full text-white font-bold text-base rounded-full py-3 disabled:opacity-50 transition-colors"
          style={{ backgroundColor: "#00B488" }}
          onMouseEnter={(e) => !(!imageUrl || isGenerating) && (e.currentTarget.style.backgroundColor = "#008B6B")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00B488")}
        >
          CREATE
        </Button>
      </Card>
    </>
  )
}
