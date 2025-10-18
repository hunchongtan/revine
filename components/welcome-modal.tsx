"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"

interface WelcomeModalProps {
  onSignInClick: () => void
}

export function WelcomeModal({ onSignInClick }: WelcomeModalProps) {
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Don't show if user is already logged in or still loading
    if (loading || user) {
      return
    }

    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem("revine_welcome_seen")
    
    if (!hasSeenWelcome) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setOpen(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [loading, user])

  const handleClose = () => {
    setOpen(false)
    localStorage.setItem("revine_welcome_seen", "true")
  }

  const handleSignIn = () => {
    setOpen(false)
    localStorage.setItem("revine_welcome_seen", "true")
    onSignInClick()
  }

  const handleContinueAsGuest = () => {
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Welcome to ReVine! 🎬
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <p className="text-center text-[#666]">
            Turn yourself into classic Vine memes using AI! 
          </p>

          {/* Guest Features */}
          <div className="bg-[#f3f3f3] rounded-lg p-4">
            <h3 className="font-semibold text-[#333] mb-3">
              ✨ As a Guest, you can:
            </h3>
            <ul className="space-y-2 text-sm text-[#666]">
              <li className="flex items-start gap-2">
                <span className="text-[#00bf8f] font-bold">✓</span>
                <span>Browse all 23 classic Vine templates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00bf8f] font-bold">✓</span>
                <span>Generate unlimited AI videos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00bf8f] font-bold">✓</span>
                <span>Save favorites (in browser only)</span>
              </li>
            </ul>
          </div>

          {/* Premium Features */}
          <div className="bg-[#00bf8f]/10 rounded-lg p-4 border-2 border-[#00bf8f]">
            <h3 className="font-semibold text-[#333] mb-3 flex items-center gap-2">
              <span>🚀</span>
              Sign in to unlock:
            </h3>
            <ul className="space-y-2 text-sm text-[#666]">
              <li className="flex items-start gap-2">
                <span className="text-[#00bf8f] font-bold">★</span>
                <span><strong>Sync favorites</strong> across all your devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00bf8f] font-bold">★</span>
                <span><strong>Never lose</strong> your saved templates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00bf8f] font-bold">★</span>
                <span><strong>Coming soon:</strong> Save videos & share with friends</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSignIn}
              className="w-full bg-[#00bf8f] hover:bg-[#00a77a] text-white font-semibold py-3 h-auto"
            >
              Sign In / Create Account
            </Button>
            <Button
              onClick={handleContinueAsGuest}
              variant="outline"
              className="w-full border-[#e6e6e6] text-[#666] hover:bg-[#f3f3f3] py-3 h-auto"
            >
              Continue as Guest
            </Button>
          </div>

          <p className="text-xs text-center text-[#8a8a8a]">
            You can always sign in later from the user icon in the header
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

