"use client"

import { useRef, useState } from "react"

interface ResultPlayerProps {
  videoUrl: string
  caption: string
  onDownload: () => void
  onCopyCaption: () => void
  onGenerateAgain: () => void
}

export function ResultPlayer({ videoUrl, caption, onDownload, onCopyCaption, onGenerateAgain }: ResultPlayerProps) {
  const [copied, setCopied] = useState(false)
  const [refreshSeed, setRefreshSeed] = useState<number>(Date.now())
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(caption)
    setCopied(true)
    onCopyCaption()
    setTimeout(() => setCopied(false), 2000)
  }

  const bust = (url?: string) => {
    if (!url) return "";
    return `${url}${url.includes("?") ? "&" : "?"}r=${refreshSeed}`;
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setLoadError(null)
    setRefreshSeed(Date.now())
    // Kick the media element to reload and attempt playback after src changes
    queueMicrotask(() => {
      const el = videoRef.current
      if (!el) return
      try {
        el.load()
        // Attempt autoplay after user gesture (Refresh click)
        el.play().catch(() => {})
      } catch {}
    })
  }

  const hasUrl = Boolean(videoUrl)
  const src = hasUrl ? bust(videoUrl) : undefined

  return (
    <div className="bg-white border border-[#e6e6e6] rounded-[12px] overflow-hidden max-w-md mx-auto shadow-md">
      {/* Video Player */}
      <div className="bg-black" style={{ aspectRatio: "9 / 16" }}>
        <video
          key={`${videoUrl ?? "no-url"}-${refreshSeed}`}
          src={src}
          controls
          playsInline
          muted
          loop
          autoPlay
          ref={videoRef}
          onLoadedData={() => setIsRefreshing(false)}
          onError={() => {
            setIsRefreshing(false)
            setLoadError("Still processing or unavailable. Please try again shortly.")
          }}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Processing Disclaimer */}
      <div className="px-4 pt-3 text-xs text-[#8a8a8a]">
        <p>
          If the video doesn't play yet, it may still be processing. Try Refresh.
        </p>
        {loadError && (
          <p className="mt-1 text-[#d46]">{loadError}</p>
        )}
      </div>

      {/* Caption */}
      <div className="p-4 border-b border-[#e6e6e6]">
        <p className="text-sm text-[#333] font-medium">{caption}</p>
      </div>

      {/* Actions Bar */}
      <div className="p-4 flex items-center justify-end gap-4 text-[#8a8a8a] border-b border-[#e6e6e6]">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 hover:text-[#00bf8f] transition-colors disabled:opacity-50"
        >
          <span className="text-lg">🔄</span>
          <span className="text-sm font-semibold">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
        <button
          onClick={() => hasUrl && window.open(videoUrl, "_blank")}
          disabled={!hasUrl}
          className="flex items-center gap-2 hover:text-[#00bf8f] transition-colors disabled:opacity-50"
        >
          <span className="text-lg">🔗</span>
          <span className="text-sm font-semibold">Open</span>
        </button>
        <button 
          onClick={onDownload}
          disabled={!hasUrl}
          className="flex items-center gap-2 hover:text-[#00bf8f] transition-colors disabled:opacity-50"
        >
          <span className="text-lg">⬇</span>
          <span className="text-sm font-semibold">Save</span>
        </button>
      </div>

      {/* Actions */}
      <div className="p-4">
        <button
          onClick={onGenerateAgain}
          className="w-full bg-[#00bf8f] hover:bg-[#00a77a] text-white font-semibold rounded-full py-3 transition-colors"
        >
          Create Another Vine
        </button>
      </div>
    </div>
  )
}
