"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import Link from "next/link"

export function UserMenu() {
  const { user, loading, signOut } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
    )
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </button>
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-10 h-10 rounded-full bg-[#00a77a] flex items-center justify-center hover:bg-[#008c66] transition-colors"
      >
        <span className="text-white font-bold text-sm uppercase">
          {user.email?.[0] || "U"}
        </span>
      </button>

      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-[#e6e6e6]">
            <div className="px-4 py-2 border-b border-[#e6e6e6]">
              <p className="text-sm font-medium text-[#333] truncate">
                {user.email}
              </p>
            </div>
            
            <Link
              href="/favourites"
              className="block px-4 py-2 text-sm text-[#333] hover:bg-[#f3f3f3] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              ⭐ My Favourites
            </Link>
            
            <Link
              href="/remixes/public"
              className="block px-4 py-2 text-sm text-[#333] hover:bg-[#f3f3f3] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              🎬 Public Remixes
            </Link>
            
            <div className="border-t border-[#e6e6e6] my-1" />
            
            <button
              onClick={() => {
                signOut()
                setMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-sm text-[#333] hover:bg-[#f3f3f3] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

