"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Hero Section */}
      <section className="bg-white border-b border-[#e6e6e6] py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-[#333] mb-2">Discover</h1>
          <p className="text-[#8a8a8a]">Explore Vines created by the community</p>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg p-12 border border-[#e6e6e6] text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#333] mb-4">
              Coming Soon — The ReVine Feed 🎬
            </h2>
            <p className="text-[#8a8a8a] mb-8">
              Soon you'll be able to browse and share Vines created by the community.
              Discover the best remixes, trending templates, and viral moments.
            </p>
            
            {/* Mock Video Grid Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-[#f3f3f3] rounded-lg border-2 border-dashed border-[#e6e6e6] flex items-center justify-center"
                >
                  <p className="text-[#8a8a8a] text-sm">Video {i}</p>
                </div>
              ))}
            </div>

            <Button asChild className="bg-[#00bf8f] hover:bg-[#00a77a] text-white font-semibold">
              <Link href="/">Browse Templates</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

