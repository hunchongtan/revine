import Link from "next/link"
import { getSupabaseServiceClient } from "@/lib/supabase-server"
import { getShareableUrl } from "@/lib/video-sharing"
import { VideoCard } from "@/components/video-card"
import type { Database } from "@/types/database"

type VideoRecord = Database["public"]["Tables"]["remixes"]["Row"]

async function getPublicVideos(): Promise<VideoRecord[]> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) {
    console.error("[discover] Supabase client not available")
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: videos, error } = await (supabase as any)
    .from("remixes")
    .select("*")
    .eq("visibility", "public")  // Only public videos
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    console.error("[discover] Failed to get videos:", error)
    return []
  }

  console.log("[discover] Fetched videos from DB:", videos?.length || 0)
  
  // Remove duplicates by id (in case there are duplicate records)
  const uniqueVideos = (videos as VideoRecord[]) ? 
    Array.from(new Map((videos as VideoRecord[]).map(v => [v.id, v])).values()) : 
    []

  console.log("[discover] After deduplication:", uniqueVideos.length)
  
  return uniqueVideos
}

export default async function DiscoverPage() {
  const videos = await getPublicVideos()

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Hero Section */}
      <section className="bg-white border-b border-[#e6e6e6] py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-[#333] mb-2">Discover</h1>
          <p className="text-[#8a8a8a]">
            {videos.length} {videos.length === 1 ? "Vine" : "Vines"} from the community
          </p>
        </div>
      </section>

      {/* Video Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {videos.length === 0 ? (
          <div className="bg-white rounded-lg p-12 border border-[#e6e6e6] text-center">
            <h2 className="text-2xl font-bold text-[#333] mb-4">
              No public videos yet! 🎬
            </h2>
            <p className="text-[#8a8a8a] mb-8">
              Be the first to create a Vine and make it public to share with the world.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#00bf8f] hover:bg-[#00a77a] text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Create Your First Vine
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {videos.map((video) => {
              const shareUrl = getShareableUrl(video)
              return <VideoCard key={video.id} video={video} shareUrl={shareUrl} />
            })}
          </div>
        )}
      </section>
    </main>
  )
}

