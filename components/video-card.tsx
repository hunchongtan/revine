"use client"

import type { Database } from "@/types/database"

type VideoRecord = Database["public"]["Tables"]["remixes"]["Row"]

interface VideoCardProps {
  video: VideoRecord
  shareUrl: string
}

export function VideoCard({ video, shareUrl }: VideoCardProps) {
  return (
    <div
      className="group relative aspect-[9/16] bg-black rounded-lg overflow-hidden border-2 border-[#e6e6e6] transition-colors"
    >
      <video
        src={video.video_url}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        onMouseEnter={(e) => {
          const video = e.target as HTMLVideoElement
          video.play().catch(() => {})
        }}
        onMouseLeave={(e) => {
          const video = e.target as HTMLVideoElement
          video.pause()
          video.currentTime = 0
        }}
      />
      
      {/* Caption Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
        <p className="text-white text-sm font-medium line-clamp-2">
          {video.caption || "Untitled Vine"}
        </p>
        {video.visibility === "public" && (
          <span className="inline-block mt-1 text-xs text-white/70">
            🌐 Public
          </span>
        )}
      </div>

      {/* Hover Play Indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-black/50 rounded-full p-4">
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

