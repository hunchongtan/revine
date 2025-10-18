"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { signInWithMagicLink, signIn, signUp } = useAuth()
  const [mode, setMode] = useState<"magic" | "signin" | "signup">("magic")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signInWithMagicLink(email)

    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Check your email for the magic link!")
      onClose()
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(email, password)

    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Signed in successfully!")
      onClose()
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signUp(email, password)

    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Account created! Check your email to verify.")
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === "magic" ? "Sign in to ReVine" : mode === "signin" ? "Welcome back" : "Create account"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {mode === "magic" && (
            <>
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00bf8f] hover:bg-[#00a77a] text-white"
                >
                  {loading ? "Sending..." : "Send Magic Link"}
                </Button>
              </form>

              <div className="text-center text-sm text-[#8a8a8a]">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-[#00bf8f] hover:underline"
                >
                  Sign in with password
                </button>
                {" or "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-[#00bf8f] hover:underline"
                >
                  create an account
                </button>
              </div>
            </>
          )}

          {mode === "signin" && (
            <>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00bf8f] hover:bg-[#00a77a] text-white"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center text-sm text-[#8a8a8a]">
                <button
                  type="button"
                  onClick={() => setMode("magic")}
                  className="text-[#00bf8f] hover:underline"
                >
                  Use magic link instead
                </button>
                {" or "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-[#00bf8f] hover:underline"
                >
                  create an account
                </button>
              </div>
            </>
          )}

          {mode === "signup" && (
            <>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00bf8f] hover:bg-[#00a77a] text-white"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center text-sm text-[#8a8a8a]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-[#00bf8f] hover:underline"
                >
                  Sign in
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

