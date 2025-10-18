import type React from "react"
import type { Metadata } from "next"
import { AppToaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { Navbar } from "@/components/navbar"
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
          <Navbar />
          {children}
          <AppToaster />
        </AuthProvider>
      </body>
    </html>
  )
}
