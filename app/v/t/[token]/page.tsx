import { notFound } from "next/navigation";
import { getVideoByToken } from "@/lib/video-sharing";
import { VideoViewer } from "@/components/video-viewer";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function PrivateVideoPage({ params }: PageProps) {
  const { token } = await params;

  const video = await getVideoByToken(token);

  if (!video) {
    notFound();
  }

  return <VideoViewer video={video} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { token } = await params;
  const video = await getVideoByToken(token);

  if (!video) {
    return {
      title: "Video Not Found | ReVine",
    };
  }

  return {
    title: video.caption || "ReVine Video",
    description: "Made with ReVine - Relive the 6-Second Era",
    openGraph: {
      title: video.caption || "ReVine Video",
      description: "Made with ReVine - Relive the 6-Second Era",
      videos: [
        {
          url: video.video_url,
          type: "video/mp4",
        },
      ],
    },
    twitter: {
      card: "player",
      title: video.caption || "ReVine Video",
      description: "Made with ReVine - Relive the 6-Second Era",
      players: {
        playerUrl: video.video_url,
        streamUrl: video.video_url,
        width: 720,
        height: 1280,
      },
    },
  };
}

