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
          {/* Left: Empty spacer for balance */}
          <div className="w-10"></div>
          
          {/* Center: Vine Logo */}
          <Link href="/" className="flex items-center justify-center">
            <Image src="/icon.svg" alt="vine" width={70} height={70} className="brightness-0 invert" />
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
