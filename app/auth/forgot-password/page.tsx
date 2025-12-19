"use client"

import type React from "react"
import { useState } from "react"
import { ArrowRight, Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setIsSuccess(true)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle amber gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[400px] relative z-10">
        <Link href="/" className="flex items-center justify-center mb-8 group">
          <div className="relative w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center overflow-hidden group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" />
            <span className="relative text-black font-bold text-2xl">O</span>
          </div>
        </Link>

        {isSuccess ? (
          // Success state
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Check your email</h1>
            <p className="text-muted-foreground text-sm mb-6">
              We've sent a password reset link to <span className="text-foreground font-medium">{email}</span>
            </p>
            <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-foreground font-medium mb-1">Didn't receive the email?</p>
                  <p className="text-xs text-muted-foreground">
                    Check your spam folder or try again with a different email address.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSuccess(false)
                setEmail("")
              }}
              className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors cursor-pointer"
            >
              Try another email
            </button>
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          // Form state
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Forgot password?</h1>
              <p className="text-muted-foreground text-sm">No worries, we'll send you reset instructions.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="relative">Sending...</span>
                  </>
                ) : (
                  <>
                    <span className="relative">Reset password</span>
                    <ArrowRight className="w-4 h-4 relative" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
