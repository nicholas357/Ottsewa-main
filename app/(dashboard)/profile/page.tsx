"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Heart, Mail, Calendar, Edit2, UserIcon, Shield, Check, X, Bell, Lock, Globe, Palette } from "lucide-react"
import Link from "next/link"
import { showNotification } from "@/components/notification-provider"
import { ProfileSkeleton } from "@/components/skeleton-loader"
import { useAuth, getCachedUser } from "@/hooks/use-auth"

interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string
  role: string
  created_at: string
}

export default function ProfilePage() {
  const { user: authUser, profile: authProfile, loading: authLoading, refetch } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [fullName, setFullName] = useState("")
  const supabase = createClient()

  const [loading, setLoading] = useState(() => {
    const cachedUser = getCachedUser()
    return !cachedUser
  })

  const profile: Profile | null = authProfile
    ? {
        id: authProfile.id,
        email: authProfile.email || "",
        full_name: authProfile.full_name || "",
        avatar_url: authProfile.avatar_url || "",
        role: authProfile.role,
        created_at: authProfile.created_at,
      }
    : null

  useEffect(() => {
    if (!authLoading && !authUser) {
      window.location.href = "/auth/login"
      return
    }

    if (authUser && authProfile) {
      setFullName(authProfile.full_name || "")
      setLoading(false)
    }
  }, [authUser, authProfile, authLoading])

  const handleUpdateProfile = async () => {
    if (!authUser) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq("id", authUser.id)
      if (error) throw error

      await refetch()

      setIsEditing(false)
      showNotification({
        type: "success",
        title: "Profile updated",
        message: "Your profile has been successfully updated",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      showNotification({
        type: "error",
        title: "Update failed",
        message: "Failed to update your profile. Please try again.",
        duration: 4000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-7 h-7 text-zinc-500" />
          </div>
          <div className="text-white text-lg font-medium mb-2">Profile not found</div>
          <Link href="/auth/login" className="text-amber-400 hover:text-amber-300 text-sm transition">
            Sign in again
          </Link>
        </div>
      </div>
    )
  }

  const isAdmin = profile.role === "admin"

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile & Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account information and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl font-bold text-black flex-shrink-0">
            {profile.full_name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white truncate">{profile.full_name || "User"}</h2>
            <p className="text-zinc-500 text-sm truncate">{profile.email}</p>
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 mt-2 rounded-full text-xs font-medium ${
                isAdmin
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  : "bg-zinc-800 border border-zinc-700 text-zinc-400"
              }`}
            >
              <Shield className="w-3 h-3" />
              {isAdmin ? "Administrator" : "Member"}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
            <Mail className="w-4 h-4 text-zinc-500" />
            <div className="flex-1 min-w-0">
              <p className="text-zinc-500 text-xs">Email</p>
              <p className="text-white text-sm truncate">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
            <Calendar className="w-4 h-4 text-zinc-500" />
            <div className="flex-1 min-w-0">
              <p className="text-zinc-500 text-xs">Member Since</p>
              <p className="text-white text-sm">
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
            <Heart className="w-4 h-4 text-zinc-500" />
            <div className="flex-1 min-w-0">
              <p className="text-zinc-500 text-xs">Account ID</p>
              <p className="text-white text-sm font-mono text-xs truncate">{profile.id}</p>
            </div>
          </div>
        </div>

        {/* Edit Section */}
        <div className="border-t border-zinc-800 pt-5">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 bg-zinc-800 rounded-lg animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setFullName(profile.full_name || "")
                  }}
                  className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-all text-sm"
            >
              <Edit2 size={14} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Settings & Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Notifications */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm mb-1">Notifications</h3>
                <p className="text-zinc-500 text-xs">Manage your notification preferences</p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm mb-1">Security</h3>
                <p className="text-zinc-500 text-xs">Password and security settings</p>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm mb-1">Language & Region</h3>
                <p className="text-zinc-500 text-xs">Set your language and region</p>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Palette className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm mb-1">Appearance</h3>
                <p className="text-zinc-500 text-xs">Customize your interface theme</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      {isAdmin && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-amber-400 font-medium text-sm">Admin Access</h3>
                <p className="text-amber-500/70 text-xs">Manage users and site settings</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg transition-all text-sm"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
