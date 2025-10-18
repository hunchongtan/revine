"use client"

import { Card } from "@/components/ui/card"

interface SpinnerOverlayProps {
  isVisible: boolean
  message?: string
}

export function SpinnerOverlay({ isVisible, message = "cooking that vine energy…" }: SpinnerOverlayProps) {
  if (!isVisible) return null

  const loadingMessages = [
    "cooking that vine energy…",
    "hang on, don't drop your croissant…",
    "summoning the Vine gods…",
    "making it viral…",
    "6 seconds of pure magic…",
  ]

  const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-8 text-center bg-white">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 border-4 border-[#E8E8E8] border-t-[#00B488] rounded-full animate-spin" />
        </div>
        <p className="text-foreground font-medium text-sm">{message || randomMessage}</p>
      </Card>
    </div>
  )
}
