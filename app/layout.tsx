import type React from "react"
import type { Metadata } from "next"
import { AppToaster } from "@/components/ui/sonner"
import Image from "next/image"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "vine",
  description: "Create viral Vine-inspired videos in seconds",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#f3f3f3]" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        {/* Vine Teal Header */}
        <header className="bg-[#00bf8f] h-14 flex items-center justify-between px-4 sticky top-0 z-50 shadow-sm">
          {/* Left: Home icon */}
          <Link href="/" className="w-10">
            <svg className="w-6 h-6 text-white hover:opacity-80 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          
          {/* Center: Vine Logo */}
          <Link href="/" className="flex items-center justify-center gap-2">
            <Image src="/icon.svg" alt="vine" width={28} height={28} className="brightness-0 invert" />
            <span className="text-white font-bold text-xl tracking-tight">vine</span>
          </Link>
          
          {/* Right: User icon placeholder */}
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </header>
        
        {children}
        <AppToaster />
      </body>
    </html>
  )
}
