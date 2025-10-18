"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  Home,
  Compass,
  Star,
  Clapperboard,
  User,
  LogOut,
  Heart,
  Video,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AuthModal } from "@/components/auth-modal"

interface NavIconProps {
  href: string
  icon: React.ReactNode
  label: string
  requiresAuth?: boolean
  isMobile?: boolean
}

function NavIcon({ href, icon, label, requiresAuth = false, isMobile = false }: NavIconProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const isActive = pathname === href

  const handleClick = (e: React.MouseEvent) => {
    if (requiresAuth && !user) {
      e.preventDefault()
      setShowAuthModal(true)
    }
  }

  if (isMobile) {
    // Mobile bottom nav style
    return (
      <>
        <Link
          href={href}
          onClick={handleClick}
          aria-label={label}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
            isActive
              ? "text-[#00B488]"
              : "text-gray-500"
          }`}
        >
          {icon}
          <span className="text-[10px] font-medium">{label}</span>
        </Link>
        {requiresAuth && !user && (
          <AuthModal
            open={showAuthModal}
            onOpenChange={setShowAuthModal}
            message="Sign in to save Vines and manage your remixes."
          />
        )}
      </>
    )
  }

  // Desktop style (existing)
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            onClick={handleClick}
            aria-label={label}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${
              isActive
                ? "text-[#E8FFF7]"
                : "text-[#E8FFF7]/90 hover:text-[#E8FFF7]"
            }`}
          >
            {icon}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
      {requiresAuth && !user && (
        <AuthModal
          open={showAuthModal}
          onOpenChange={setShowAuthModal}
          message="Sign in to save Vines and manage your remixes."
        />
      )}
    </>
  )
}

export function Navbar() {
  const { user, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <TooltipProvider delayDuration={300}>
      {/* Top Navbar */}
      <nav className="bg-[#00B488] h-[70px] flex items-center justify-between px-4 sticky top-0 z-50 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        {/* Left: Help Tooltip */}
        <div className="flex-1 flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
                <span className="text-xs font-medium hidden sm:inline">How it works</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-sm bg-[#333] text-white p-4">
              <p className="font-semibold mb-3 text-base">Create Your ReVine</p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="font-bold text-[#00bf8f]">Step 1:</span>
                  <span className="text-sm">Select a Vine template</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-[#00bf8f]">Step 2:</span>
                  <span className="text-sm">Upload your photo</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-[#00bf8f]">Step 3:</span>
                  <span className="text-sm">Click CREATE VINE and wait 4-5 minutes ✨</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Center: Logo + Tagline */}
        <Link href="/" className="flex flex-col items-center justify-center gap-1">
          <Image
            src="/icon_header.svg"
            alt="ReVine"
            width={100}
            height={100}
            className="brightness-0 invert"
          />
          <span
            className="text-[10px] sm:text-[11px] font-medium tracking-wide hidden md:block"
            style={{
              color: "#E8FFF7",
              opacity: 0.8,
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            Relive the 6-Second Era.
          </span>
        </Link>

        {/* Right: Icon Navigation (Desktop Only) */}
        <div className="flex-1 hidden md:flex items-center justify-end gap-3 md:gap-4">
          <NavIcon href="/" icon={<Home className="w-5 h-5" />} label="Home" />
          <NavIcon
            href="/discover"
            icon={<Compass className="w-5 h-5" />}
            label="Discover"
          />
          <NavIcon
            href="/favourites"
            icon={<Star className="w-5 h-5" />}
            label="Favourites"
            requiresAuth
          />
          <NavIcon
            href="/remixes"
            icon={<Clapperboard className="w-5 h-5" />}
            label="My Remixes"
            requiresAuth
          />

          {/* User Menu / Sign In */}
          {user ? (
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-[#E8FFF7]"
                      aria-label="Profile menu"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/favourites" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    My Favourites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/remixes" className="cursor-pointer">
                    <Video className="mr-2 h-4 w-4" />
                    My Remixes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-[#E8FFF7]"
                  aria-label="Sign in"
                >
                  <User className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Sign In</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Mobile: Empty flex-1 spacer */}
        <div className="flex-1 md:hidden" />
      </nav>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around">
          <NavIcon 
            href="/" 
            icon={<Home className="w-5 h-5" />} 
            label="Home" 
            isMobile 
          />
          <NavIcon
            href="/discover"
            icon={<Compass className="w-5 h-5" />}
            label="Discover"
            isMobile
          />
          <NavIcon
            href="/favourites"
            icon={<Star className="w-5 h-5" />}
            label="Favourites"
            requiresAuth
            isMobile
          />
          <NavIcon
            href="/remixes"
            icon={<Clapperboard className="w-5 h-5" />}
            label="Remixes"
            requiresAuth
            isMobile
          />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
                    pathname === "/profile" ? "text-[#00B488]" : "text-gray-500"
                  }`}
                  aria-label="Profile menu"
                >
                  <User className="h-5 w-5" />
                  <span className="text-[10px] font-medium">Profile</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mb-2">
                <div className="px-2 py-1.5 text-sm font-medium">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/favourites" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    My Favourites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/remixes" className="cursor-pointer">
                    <Video className="mr-2 h-4 w-4" />
                    My Remixes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-gray-500 transition-colors"
              aria-label="Sign in"
            >
              <User className="h-5 w-5" />
              <span className="text-[10px] font-medium">Sign In</span>
            </button>
          )}
        </div>
      </nav>


      {/* Auth Modal for Sign In */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </TooltipProvider>
  )
}
