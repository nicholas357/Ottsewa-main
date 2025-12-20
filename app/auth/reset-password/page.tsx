"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { showNotification } from "@/components/notification-provider"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user has a valid recovery session
    const checkSession = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // User should have a session from clicking the reset link
      setIsValidSession(!!session)
    }

    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      setIsSuccess(true)

      showNotification({
        type: "success",
        title: "Password updated",
        message: "Your password has been successfully reset",
        duration: 3000,
      })

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: "", color: "" }
    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++

    const labels = ["Weak", "Fair", "Good", "Strong"]
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]

    return {
      strength,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "",
    }
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle amber gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10">
        <div className="rounded-2xl border border-white/[0.08] p-3">
          <div className="bg-[#0f0f0f] rounded-xl p-6 sm:p-8">
            {/* Logo */}
            <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center overflow-hidden group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                <span className="relative text-black font-bold text-lg">O</span>
              </div>
            </Link>

            {isValidSession === null ? (
              // Loading state
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">Verifying your session...</p>
              </div>
            ) : isValidSession === false ? (
              // Invalid session state
              <div className="text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Invalid or expired link</h1>
                <p className="text-muted-foreground text-sm mb-6">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Link
                  href="/auth/forgot-password"
                  className="inline-flex items-center justify-center gap-2 w-full relative bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-medium py-2.5 rounded-lg transition-all text-sm shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                  <span className="relative">Request new link</span>
                  <ArrowRight className="w-4 h-4 relative" />
                </Link>
              </div>
            ) : isSuccess ? (
              // Success state
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
                  Password reset successful
                </h1>
                <p className="text-muted-foreground text-sm mb-6">
                  Your password has been updated. Redirecting you to login...
                </p>
                <Loader2 className="w-5 h-5 animate-spin text-amber-400 mx-auto" />
              </div>
            ) : (
              // Form state
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Set new password</h1>
                  <p className="text-muted-foreground text-sm">
                    Your new password must be different from previously used passwords.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">New password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={8}
                        className="w-full bg-secondary border border-border rounded-lg px-4 pr-10 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password strength indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                level <= passwordStrength.strength ? passwordStrength.color : "bg-border"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {passwordStrength.label && `Password strength: ${passwordStrength.label}`}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Confirm new password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={8}
                        className="w-full bg-secondary border border-border rounded-lg px-4 pr-10 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                    )}
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || password !== confirmPassword}
                    className="w-full relative bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="relative">Updating...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative">Reset password</span>
                        <ArrowRight className="w-4 h-4 relative" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-muted-foreground text-xs mt-6">
                  Password must be at least 8 characters and include a mix of letters, numbers, and symbols for best
                  security.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
