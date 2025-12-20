"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, ArrowRight, Loader2, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()

  const passwordRequirements = [
    { met: formData.password.length >= 8, label: "At least 8 characters" },
    { met: /[A-Z]/.test(formData.password), label: "One uppercase letter" },
    { met: /[0-9]/.test(formData.password), label: "One number" },
  ]

  const allRequirementsMet = passwordRequirements.every((req) => req.met)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (!allRequirementsMet) {
      setError("Please meet all password requirements")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/profile`,
          data: { full_name: formData.name, role: "user" },
        },
      })
      if (error) throw error
      router.push("/auth/login?registered=true")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-[420px] relative z-10">
        {/* Outer box with subtle border */}
        <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent">
          {/* Inner box with darker background */}
          <div className="rounded-xl bg-[#0f0f0f] p-6 sm:p-8">
            <Link href="/" className="flex items-center justify-center mb-6 group">
              <div className="relative w-11 h-11 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" />
                <span className="relative text-black font-bold text-xl">O</span>
              </div>
            </Link>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold text-white mb-1.5 tracking-tight">Create your account</h1>
              <p className="text-zinc-500 text-sm">Start your gaming journey today</p>
            </div>

            <div className="mb-5">
              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="flex items-center justify-center gap-2.5 w-full bg-[#1a1a1a] hover:bg-[#222222] border border-white/[0.06] text-white font-medium py-2.5 rounded-lg transition-all text-sm cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[#0f0f0f] text-zinc-600 uppercase tracking-wider">or</span>
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-3.5 pr-10 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password requirements */}
                {formData.password && (
                  <div className="mt-2.5 space-y-1.5">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${req.met ? "bg-amber-500 text-black" : "bg-[#1a1a1a] border border-white/[0.06]"}`}
                        >
                          {req.met && <Check className="w-2 h-2" />}
                        </div>
                        <span className={req.met ? "text-zinc-400" : "text-zinc-600"}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <label className="flex items-start gap-2.5 text-sm cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border border-white/[0.06] bg-[#1a1a1a] peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-colors flex items-center justify-center">
                    {agreedToTerms && <Check className="w-2.5 h-2.5 text-black" />}
                  </div>
                </div>
                <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  I agree to the{" "}
                  <Link href="#" className="text-amber-400 hover:text-amber-300">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-amber-400 hover:text-amber-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading || !agreedToTerms}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-zinc-500 text-sm mt-5">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
