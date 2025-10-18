"use client"

import { useEffect, useState } from "react"
import { getSupabaseAuthClient } from "@/lib/supabase-client"
import type { Database } from "@/types/database"

type Remix = Database["public"]["Tables"]["remixes"]["Row"] & {
  template?: {
    title: string
    id: string
  } | null
}

export default function PublicRemixesPage() {
  const [remixes, setRemixes] = useState<Remix[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPublicRemixes()
  }, [])

  const loadPublicRemixes = async () => {
    const supabase = getSupabaseAuthClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("remixes")
        .select(`
          *,
          template:templates(id, title)
        `)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error("Error fetching remixes:", error)
      } else {
        setRemixes(data || [])
      }
    } catch (error) {
      console.error("Failed to load remixes:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00bf8f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8a8a8a] text-lg">Loading public remixes...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Header */}
      <section className="bg-white border-b border-[#e6e6e6] py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#333] mb-2">
            🎬 Public Remixes
          </h1>
          <p className="text-[#8a8a8a]">
            {remixes.length} public {remixes.length === 1 ? "remix" : "remixes"} from the community
          </p>
        </div>
      </section>

      {/* Remixes Grid */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        {remixes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-[#8a8a8a] mb-2">
              No public remixes yet!
            </p>
            <p className="text-sm text-[#8a8a8a]">
              Be the first to create and share a remix.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {remixes.map((remix) => (
              <div
                key={remix.id}
                className="bg-white border border-[#e6e6e6] rounded-[12px] overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Video */}
                <div className="relative w-full aspect-square bg-black">
                  <video
                    src={remix.video_url}
                    controls
                    loop
                    className="w-full h-full object-contain"
                    preload="metadata"
                  />
                </div>

                {/* Info */}
                <div className="p-3">
                  {remix.caption && (
                    <p className="text-sm font-medium text-[#333] mb-2">
                      {remix.caption}
                    </p>
                  )}
                  {remix.template && (
                    <p className="text-xs text-[#8a8a8a]">
                      From template: <span className="font-medium">{remix.template.title}</span>
                    </p>
                  )}
                  <p className="text-xs text-[#8a8a8a] mt-1">
                    {new Date(remix.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Stats */}
                <div className="px-3 pb-3 flex items-center gap-4 text-[#8a8a8a] text-xs border-t border-[#e6e6e6] pt-3">
                  <span>👁️ {remix.views_count || 0} views</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

