import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AppToaster } from "@/components/ui/sonner"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], weight: ["400", "600", "700"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vine Rewind",
  description: "Create viral Vine-inspired videos in seconds",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} text-foreground`} style={{ backgroundColor: "#F6F6F6" }}>
        {children}
        <AppToaster />
      </body>
    </html>
  )
}
