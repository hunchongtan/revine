"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, ExternalLink } from "lucide-react";
import { shareVideo } from "@/lib/video-sharing";
import type { VideoRecord } from "@/lib/video-sharing";
import { useToast } from "@/hooks/use-toast";

interface VideoViewerProps {
  video: VideoRecord;
}

export function VideoViewer({ video }: VideoViewerProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await shareVideo(video);

      if (result.success) {
        if (result.method === "clipboard") {
          toast({
            title: "Link copied!",
            description: "Share link copied to clipboard",
          });
        } else {
          toast({
            title: "Shared!",
            description: "Video shared successfully",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to share video",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Share error:", error);
      toast({
        title: "Error",
        description: "Failed to share video",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00bf8f] to-[#00a77a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden bg-white border border-[#e6e6e6] rounded-[12px] shadow-xl">
          {/* Video Player */}
          <div
            className="bg-black flex items-center justify-center"
            style={{ height: "500px" }}
          >
            <video
              src={video.video_url}
              controls
              playsInline
              autoPlay
              loop
              className="h-full object-contain"
              style={{ maxWidth: "100%" }}
            />
          </div>

          {/* Caption */}
          {video.caption && (
            <div className="p-4 border-b border-[#e6e6e6]">
              <p className="text-sm text-[#333] font-medium">{video.caption}</p>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 space-y-3">
            <Button
              onClick={handleShare}
              disabled={isSharing}
              className="w-full bg-[#00bf8f] hover:bg-[#00a77a] text-white font-semibold rounded-full py-3 flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              {isSharing ? "Sharing..." : "Share This Vine"}
            </Button>

            <Button
              onClick={() => window.open("/", "_self")}
              variant="outline"
              className="w-full border-[#00bf8f] text-[#00bf8f] hover:bg-[#00bf8f] hover:text-white font-semibold rounded-full py-3 flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Make Your Own
            </Button>
          </div>

          {/* Footer Info */}
          <div className="px-4 pb-4 text-center">
            <p className="text-xs text-[#8a8a8a]">
              Made with{" "}
              <span className="font-semibold text-[#00bf8f]">ReVine</span> ·
              Relive the 6-Second Era
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

