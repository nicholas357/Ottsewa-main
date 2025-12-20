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

            {isSuccess ? (
              // Success state
              <div className="text-center">
                <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-7 h-7 text-green-500" />
                </div>
                <h1 className="text-xl font-semibold text-white mb-1.5 tracking-tight">Check your email</h1>
                <p className="text-zinc-500 text-sm mb-5">
                  We've sent a password reset link to <span className="text-white font-medium">{email}</span>
                </p>
                <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-lg p-3.5 mb-5">
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm text-white font-medium mb-0.5">Didn't receive the email?</p>
                      <p className="text-xs text-zinc-500">
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
                <div className="mt-5">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </Link>
                </div>
              </div>
            ) : (
              // Form state
              <>
                <div className="text-center mb-6">
                  <h1 className="text-xl font-semibold text-white mb-1.5 tracking-tight">Forgot password?</h1>
                  <p className="text-zinc-500 text-sm">No worries, we'll send you reset instructions.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-5">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
