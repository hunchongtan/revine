"use client"

import { Card } from "@/components/ui/card"

interface SpinnerOverlayProps {
  isVisible: boolean
  message?: string
}

export function SpinnerOverlay({ isVisible, message = "Generating your Vine…" }: SpinnerOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="p-8 text-center bg-white shadow-xl max-w-sm mx-4">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 border-4 border-[#E8E8E8] border-t-[#00bf8f] rounded-full animate-spin" />
        </div>
        <p className="text-foreground font-semibold text-base mb-2">{message}</p>
        {!message.includes("minutes") && (
          <p className="text-sm text-[#8a8a8a] mt-2">
            This usually takes 4-5 minutes
          </p>
        )}
      </Card>
    </div>
  )
}
