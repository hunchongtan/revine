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
}

function NavIcon({ href, icon, label, requiresAuth = false }: NavIconProps) {
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

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <TooltipProvider delayDuration={300}>
      <nav className="bg-[#00B488] h-[70px] flex items-center justify-between px-4 sticky top-0 z-50 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        {/* Left Spacer */}
        <div className="flex-1" />

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
            className="text-[10px] sm:text-[11px] font-medium tracking-wide"
            style={{
              color: "#E8FFF7",
              opacity: 0.8,
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            Relive the 6-Second Era.
          </span>
        </Link>

        {/* Right: Icon Navigation */}
        <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
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
      </nav>

      {/* Auth Modal for Sign In */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </TooltipProvider>
  )
}
