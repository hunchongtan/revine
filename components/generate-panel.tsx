"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadFace } from "./upload-face"
// Removed ElevenLabs voice selection
import { SpinnerOverlay } from "./spinner-overlay"
import { ResultPlayer } from "./result-player"
import { RetryNotice } from "./retry-notice"
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
  const [errorState, setErrorState] = useState<{
    message: string
    isContentViolation: boolean
  } | null>(null)
  const { toast } = useToast()

  // Long-job indicator: Show time estimate after 15s
  useEffect(() => {
    if (!isGenerating) {
      setSpinnerMessage(undefined)
      return
    }

    const timeout = setTimeout(() => {
      setSpinnerMessage("Still cooking… This usually takes 4-5 minutes ⏱️")
    }, 15000)

    return () => clearTimeout(timeout)
  }, [isGenerating])

  const handleGenerate = async (mode: "strict" | "light" = "strict") => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setErrorState(null)
    try {
      // Step 1: Generate caption
      const captionRes = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id }),
      })
      const { caption } = await captionRes.json()

      // Step 2: Generate video
      const videoRes = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          templateId: template.id, 
          imageUrl,
          mode 
        }),
      })

      if (!videoRes.ok) {
        const errorData = await videoRes.json().catch(() => ({ error: "Unknown error" }))
        throw {
          status: videoRes.status,
          message: errorData.error || "Failed to generate video",
          isContentViolation: videoRes.status === 422
        }
      }

      const { videoUrl } = await videoRes.json()

      setResult({ caption, videoUrl })
      toast({
        title: "Success!",
        description: mode === "light" 
          ? "Your Vine is ready (light mode)" 
          : "Your Vine is ready",
      })
    } catch (error: any) {
      console.error(error)
      
      // Check if it's a content violation that failed even after auto-retry
      if (error?.isContentViolation || error?.status === 422) {
        setErrorState({
          message: "Generation couldn't complete. Please try again.",
          isContentViolation: true
        })
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to generate video. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRetry = () => {
    handleGenerate("light")
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
      <div className="space-y-4">
        {/* Show retry notice if content violation detected */}
        {errorState?.isContentViolation && (
          <RetryNotice
            message={errorState.message}
            onRetry={handleRetry}
            isRetrying={isGenerating}
          />
        )}

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
            onClick={() => handleGenerate()}
            disabled={!imageUrl || isGenerating}
            className="w-full bg-[#00bf8f] hover:bg-[#00a77a] text-white font-semibold text-base rounded-full py-3 disabled:opacity-50 transition-colors"
          >
            CREATE VINE
          </Button>
        </Card>
      </div>
    </>
  )
}
