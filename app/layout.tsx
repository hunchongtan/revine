import type React from "react"
import type { Metadata } from "next"
import { AppToaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { UserMenu } from "@/components/user-menu"
import Image from "next/image"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "ReVine",
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
        <AuthProvider>
          {/* Vine Teal Header */}
          <header className="bg-[#00bf8f] h-14 flex items-center justify-between px-4 sticky top-0 z-50 shadow-sm">
            {/* Left: Empty spacer for balance */}
            <div className="w-10"></div>
            
            {/* Center: Vine Logo */}
            <Link href="/" className="flex items-center justify-center">
              <Image src="/icon_header.svg" alt="vine" width={70} height={70} className="brightness-0 invert" />
            </Link>
            
            {/* Right: User menu */}
            <UserMenu />
          </header>
          
          {children}
          <AppToaster />
        </AuthProvider>
      </body>
    </html>
  )
}
