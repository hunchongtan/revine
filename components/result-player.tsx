"use client"

import { useState } from "react"

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
    <div className="bg-white border border-[#e6e6e6] rounded-[12px] overflow-hidden max-w-md mx-auto shadow-md">
      {/* Video Player */}
      <div className="bg-black aspect-square">
        <video src={videoUrl} controls className="w-full h-full object-cover" loop autoPlay />
      </div>

      {/* Caption */}
      <div className="p-4 border-b border-[#e6e6e6]">
        <p className="text-sm text-[#333] font-medium">{caption}</p>
      </div>

      {/* Vine Interaction Bar */}
      <div className="p-4 flex items-center justify-between text-[#8a8a8a] border-b border-[#e6e6e6]">
        <button className="flex items-center gap-2 hover:text-[#00bf8f] transition-colors">
          <span className="text-lg">👍</span>
          <span className="text-sm font-semibold">Like</span>
        </button>
        <button className="flex items-center gap-2 hover:text-[#00bf8f] transition-colors">
          <span className="text-lg">🔁</span>
          <span className="text-sm font-semibold">ReVine</span>
        </button>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 hover:text-[#00bf8f] transition-colors"
        >
          <span className="text-lg">📋</span>
          <span className="text-sm font-semibold">{copied ? "Copied!" : "Copy"}</span>
        </button>
        <button 
          onClick={onDownload}
          className="flex items-center gap-2 hover:text-[#00bf8f] transition-colors"
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
