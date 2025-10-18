"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Lock, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { VideoVisibility, VideoRecord } from "@/lib/video-sharing"

interface ResultPlayerProps {
  videoUrl: string
  caption: string
  videoId?: string
  templateId?: string
  onDownload: () => void
  onCopyCaption: () => void
  onGenerateAgain: () => void
}

export function ResultPlayer({ videoUrl, caption, videoId, templateId, onDownload, onCopyCaption, onGenerateAgain }: ResultPlayerProps) {
  const [copied, setCopied] = useState(false)
  const [refreshSeed, setRefreshSeed] = useState<number>(Date.now())
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [visibility, setVisibility] = useState<VideoVisibility>("private")
  const [shareUrl, setShareUrl] = useState<string>("")
  const [isSharing, setIsSharing] = useState(false)
  const [isChangingVisibility, setIsChangingVisibility] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { toast } = useToast()

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

  // Create video record on mount if videoId doesn't exist
  useEffect(() => {
    const createVideo = async () => {
      if (!videoId && videoUrl && templateId) {
        try {
          const res = await fetch("/api/videos/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              templateId,
              videoUrl,
              caption,
              visibility: "private",
            }),
          });

          if (res.ok) {
            const data = await res.json();
            setShareUrl(data.shareUrl);
            // Optionally redirect to the video page
            // window.location.href = data.shareUrl;
          }
        } catch (error) {
          console.error("Failed to create video record:", error);
        }
      }
    };

    createVideo();
  }, [videoId, videoUrl, templateId, caption]);

  const handleVisibilityToggle = async () => {
    if (!videoId) {
      toast({
        title: "Error",
        description: "Video not saved yet",
        variant: "destructive",
      });
      return;
    }

    setIsChangingVisibility(true);
    const newVisibility: VideoVisibility = visibility === "private" ? "public" : "private";

    try {
      const res = await fetch(`/api/videos/${videoId}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: newVisibility }),
      });

      if (res.ok) {
        const data = await res.json();
        setVisibility(newVisibility);
        setShareUrl(data.shareUrl);
        toast({
          title: "Success!",
          description: `Video is now ${newVisibility}`,
        });
      } else {
        throw new Error("Failed to update visibility");
      }
    } catch (error) {
      console.error("Failed to update visibility:", error);
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive",
      });
    } finally {
      setIsChangingVisibility(false);
    }
  };

  const handleShare = async () => {
    const urlToShare = shareUrl || window.location.href;
    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: caption || "Check out my ReVine!",
          text: caption || "Made with ReVine",
          url: urlToShare,
        });
        toast({
          title: "Shared!",
          description: "Video shared successfully",
        });
      } else {
        await navigator.clipboard.writeText(urlToShare);
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard",
        });
      }
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        console.error("Share failed:", error);
        toast({
          title: "Error",
          description: "Failed to share",
          variant: "destructive",
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const hasUrl = Boolean(videoUrl)
  const src = hasUrl ? bust(videoUrl) : undefined

  return (
    <div className="bg-white border border-[#e6e6e6] rounded-[12px] overflow-hidden max-w-md mx-auto shadow-md">
      {/* Video Player */}
      <div className="bg-black flex items-center justify-center" style={{ height: "400px" }}>
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
          className="h-full object-contain"
          style={{ maxWidth: "100%" }}
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
      <div className="p-4 flex items-center justify-center gap-4 text-[#8a8a8a] border-b border-[#e6e6e6]">
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

      {/* Visibility & Share Controls */}
      <div className="p-4 space-y-3 border-b border-[#e6e6e6]">
        {/* Visibility Toggle */}
        <div className="flex items-center justify-between p-3 bg-[#f8f8f8] rounded-lg">
          <div className="flex items-center gap-2">
            {visibility === "private" ? (
              <Lock className="h-4 w-4 text-[#8a8a8a]" />
            ) : (
              <Globe className="h-4 w-4 text-[#00bf8f]" />
            )}
            <div>
              <p className="text-sm font-semibold text-[#333]">
                {visibility === "private" ? "Private" : "Public"}
              </p>
              <p className="text-xs text-[#8a8a8a]">
                {visibility === "private" 
                  ? "Shareable link only" 
                  : "Shown in Discover"}
              </p>
            </div>
          </div>
          <button
            onClick={handleVisibilityToggle}
            disabled={isChangingVisibility || !videoId}
            className="px-4 py-2 text-xs font-semibold text-[#00bf8f] hover:bg-[#00bf8f] hover:text-white border border-[#00bf8f] rounded-full transition-colors disabled:opacity-50"
          >
            {isChangingVisibility ? "Updating..." : "Change"}
          </button>
        </div>

        {/* Share Button */}
        <Button
          onClick={handleShare}
          disabled={isSharing || !shareUrl}
          className="w-full bg-[#00bf8f] hover:bg-[#00a77a] text-white font-semibold rounded-full py-3 flex items-center justify-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          {isSharing ? "Sharing..." : "Share This Vine"}
        </Button>
      </div>

      {/* Actions */}
      <div className="p-4">
        <button
          onClick={onGenerateAgain}
          className="w-full bg-white hover:bg-[#f8f8f8] text-[#00bf8f] border border-[#00bf8f] font-semibold rounded-full py-3 transition-colors"
        >
          Create Another Vine
        </button>
      </div>
    </div>
  )
}
