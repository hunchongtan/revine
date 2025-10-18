"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface RetryNoticeProps {
  message?: string
  onRetry: () => void
  isRetrying?: boolean
}

export function RetryNotice({
  message = "Generation couldn't complete. Please try again.",
  onRetry,
  isRetrying = false,
}: RetryNoticeProps) {
  return (
    <Card className="p-6 bg-amber-50 border-amber-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-2">
            Generation Issue
          </h3>
          <p className="text-sm text-amber-800 mb-4">{message}</p>
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full px-6 py-2 transition-colors disabled:opacity-50"
          >
            {isRetrying ? "Retrying..." : "Retry"}
          </Button>
        </div>
      </div>
    </Card>
  )
}

