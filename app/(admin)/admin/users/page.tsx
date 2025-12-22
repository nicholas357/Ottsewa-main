"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  User,
  Clock,
  Trash2,
  UserCog,
  TrendingUp,
  UserPlus,
  Activity,
  CheckCircle2,
  XCircle,
  Eye,
  MoreHorizontal,
  Sparkles,
  Award,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: string
  avatar_url: string | null
  created_at: string
  updated_at: string
  auth_provider: string
  last_sign_in_at?: string
  email_confirmed_at?: string
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [providerFilter, setProviderFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [roleUpdateUser, setRoleUpdateUser] = useState<{ id: string; currentRole: string; newRole: string } | null>(
    null,
  )
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/users")

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data.users || [])
    } catch (err: any) {
      console.error("Error fetching users:", err)
      toast.error("Failed to load users", {
        description: "Please check your connection and try again.",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const getProviderIcon = (provider?: string) => {
    switch (provider?.toLowerCase()) {
      case "google":
        return <GoogleIcon className="w-4 h-4" />
      default:
        return <Mail className="w-4 h-4" />
    }
  }

  const getProviderLabel = (provider?: string) => {
    switch (provider?.toLowerCase()) {
      case "google":
        return "Google"
      default:
        return "Email"
    }
  }

  const getProviderColor = (provider?: string) => {
    switch (provider?.toLowerCase()) {
      case "google":
        return "bg-white/10 text-white border-white/20"
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    }
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRelativeTime = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery)

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesProvider =
      providerFilter === "all" || user.auth_provider?.toLowerCase() === providerFilter.toLowerCase()

    return matchesSearch && matchesRole && matchesProvider
  })

  const now = new Date()
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    customers: users.filter((u) => u.role !== "admin").length,
    googleUsers: users.filter((u) => u.auth_provider?.toLowerCase() === "google").length,
    emailUsers: users.filter((u) => !u.auth_provider || u.auth_provider?.toLowerCase() === "email").length,
    newThisWeek: users.filter((u) => new Date(u.created_at) >= thisWeek).length,
    newThisMonth: users.filter((u) => new Date(u.created_at) >= thisMonth).length,
    verified: users.filter((u) => u.email_confirmed_at).length,
    activeRecently: users.filter((u) => u.last_sign_in_at && new Date(u.last_sign_in_at) >= thisWeek).length,
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update role")
      }

      toast.success(`User role updated to ${newRole}`, {
        description: "The user's permissions have been updated successfully.",
      })
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
      setRoleUpdateUser(null)
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, role: newRole } : null))
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update role", {
        description: "Please try again or contact support.",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete user")
      }

      toast.success("User deleted successfully", {
        description: "The user account has been permanently removed.",
      })
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setDeleteUserId(null)
      if (selectedUser?.id === userId) {
        setSelectedUser(null)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user", {
        description: "Please try again or contact support.",
      })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-[#1a1a1a] rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#0f0f0f] border border-white/[0.08] rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#0f0f0f] border border-white/[0.08] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl border border-amber-500/20">
              <Users className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Users Management</h1>
              <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">Growing community, one user at a time</p>
            </div>
          </div>
        </div>
        <Button
          onClick={fetchUsers}
          variant="outline"
          size="sm"
          className="bg-[#1a1a1a] border-white/[0.08] text-zinc-300 hover:text-white hover:bg-[#222222] h-9"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Users Card */}
        <div className="rounded-2xl border border-white/[0.08] p-[1px] bg-gradient-to-b from-white/[0.05] to-transparent">
          <div className="bg-[#0f0f0f] rounded-2xl p-4 h-full">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-lg">
                <Users className="w-4 h-4 text-amber-500" />
              </div>
              {stats.newThisWeek > 0 && (
                <div className="flex items-center gap-1 text-emerald-400 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{stats.newThisWeek}</span>
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-zinc-500 text-xs mt-0.5">Total Users</p>
            </div>
          </div>
        </div>

        {/* New This Month Card */}
        <div className="rounded-2xl border border-white/[0.08] p-[1px] bg-gradient-to-b from-white/[0.05] to-transparent">
          <div className="bg-[#0f0f0f] rounded-2xl p-4 h-full">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-lg">
                <UserPlus className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs">
                <Sparkles className="w-3 h-3" />
                <span>Growth</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-white">{stats.newThisMonth}</p>
              <p className="text-zinc-500 text-xs mt-0.5">New This Month</p>
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="rounded-2xl border border-white/[0.08] p-[1px] bg-gradient-to-b from-white/[0.05] to-transparent">
          <div className="bg-[#0f0f0f] rounded-2xl p-4 h-full">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg">
                <Activity className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-center gap-1 text-blue-400 text-xs">
                <Zap className="w-3 h-3" />
                <span>Active</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-white">{stats.activeRecently}</p>
              <p className="text-zinc-500 text-xs mt-0.5">Active This Week</p>
            </div>
          </div>
        </div>

        {/* Admins Card */}
        <div className="rounded-2xl border border-white/[0.08] p-[1px] bg-gradient-to-b from-white/[0.05] to-transparent">
          <div className="bg-[#0f0f0f] rounded-2xl p-4 h-full">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg">
                <Award className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex items-center gap-1 text-purple-400 text-xs">
                <Shield className="w-3 h-3" />
                <span>Team</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-white">{stats.admins}</p>
              <p className="text-zinc-500 text-xs mt-0.5">Admin Users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0f0f0f] rounded-xl border border-white/[0.06] p-3 flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{stats.emailUsers}</p>
            <p className="text-xs text-zinc-500">Email Signups</p>
          </div>
        </div>
        <div className="bg-[#0f0f0f] rounded-xl border border-white/[0.06] p-3 flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <GoogleIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{stats.googleUsers}</p>
            <p className="text-xs text-zinc-500">Google Signups</p>
          </div>
        </div>
        <div className="bg-[#0f0f0f] rounded-xl border border-white/[0.06] p-3 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{stats.verified}</p>
            <p className="text-xs text-zinc-500">Verified Emails</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] p-3">
        <div className="bg-[#0f0f0f] rounded-xl p-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-white/[0.06] text-white placeholder:text-zinc-600 h-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-36 bg-[#1a1a1a] border-white/[0.06] text-white h-10">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/[0.08]">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-full sm:w-36 bg-[#1a1a1a] border-white/[0.06] text-white h-10">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/[0.08]">
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="google">Google</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
            <p className="text-xs text-zinc-500">
              Showing <span className="text-zinc-300 font-medium">{filteredUsers.length}</span> of {stats.total} users
            </p>
            {(searchQuery || roleFilter !== "all" || providerFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setRoleFilter("all")
                  setProviderFilter("all")
                }}
                className="text-xs text-amber-500 hover:text-amber-400 h-7 px-2"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] p-3">
        <div className="bg-[#0f0f0f] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#0a0a0a]">
                  <th className="text-left p-3 sm:p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left p-3 sm:p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th className="text-left p-3 sm:p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">
                    Provider
                  </th>
                  <th className="text-left p-3 sm:p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left p-3 sm:p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">
                    Joined
                  </th>
                  <th className="text-left p-3 sm:p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-[#1a1a1a] rounded-full">
                          <Users className="w-6 h-6 text-zinc-600" />
                        </div>
                        <div>
                          <p className="text-zinc-400 font-medium">No users found</p>
                          <p className="text-zinc-600 text-sm">Try adjusting your search or filters</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="relative">
                            <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border border-amber-500/20">
                              {user.avatar_url && (
                                <AvatarImage
                                  src={user.avatar_url || "/placeholder.svg"}
                                  alt={user.full_name || "User"}
                                  className="object-cover"
                                />
                              )}
                              <AvatarFallback className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-500 font-semibold text-sm">
                                {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            {user.role === "admin" && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center border-2 border-[#0f0f0f]">
                                <ShieldCheck className="w-2.5 h-2.5 text-black" />
                              </div>
                            )}
                            {user.auth_provider === "google" && user.avatar_url && (
                              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-zinc-200 shadow-sm">
                                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
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
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.full_name || "No name"}</p>
                            <p className="text-xs text-zinc-600 truncate md:hidden">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-400 truncate max-w-[180px]">{user.email}</span>
                          {user.email_confirmed_at && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          )}
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 hidden lg:table-cell">
                        <Badge
                          variant="outline"
                          className={`${getProviderColor(user.auth_provider)} flex items-center gap-1.5 w-fit text-xs px-2 py-1`}
                        >
                          {getProviderIcon(user.auth_provider)}
                          <span>{getProviderLabel(user.auth_provider)}</span>
                        </Badge>
                      </td>
                      <td className="p-3 sm:p-4">
                        <Badge
                          variant="outline"
                          className={
                            user.role === "admin"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/30 text-xs px-2 py-1"
                              : "bg-zinc-500/10 text-zinc-400 border-zinc-500/30 text-xs px-2 py-1"
                          }
                        >
                          {user.role === "admin" ? (
                            <ShieldCheck className="w-3 h-3 mr-1" />
                          ) : (
                            <User className="w-3 h-3 mr-1" />
                          )}
                          {user.role === "admin" ? "Admin" : "Customer"}
                        </Badge>
                      </td>
                      <td className="p-3 sm:p-4 hidden sm:table-cell">
                        <div>
                          <span className="text-sm text-zinc-400">{getRelativeTime(user.created_at)}</span>
                          <p className="text-xs text-zinc-600">{new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-zinc-500 hover:text-white hover:bg-white/[0.05]"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/[0.08] w-48">
                            <DropdownMenuItem
                              onClick={() => setSelectedUser(user)}
                              className="text-zinc-300 hover:text-white hover:bg-white/[0.05] cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setRoleUpdateUser({
                                  id: user.id,
                                  currentRole: user.role,
                                  newRole: user.role === "admin" ? "customer" : "admin",
                                })
                              }
                              className="text-zinc-300 hover:text-white hover:bg-white/[0.05] cursor-pointer"
                            >
                              <UserCog className="w-4 h-4 mr-2" />
                              {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/[0.06]" />
                            <DropdownMenuItem
                              onClick={() => setDeleteUserId(user.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-[#0f0f0f] border-white/[0.08] text-white max-w-md p-0 overflow-hidden">
          {selectedUser && (
            <>
              {/* Header with gradient */}
              <div className="bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent p-6 pb-12 relative">
                <DialogHeader>
                  <DialogTitle className="text-white/80 text-sm font-normal">User Profile</DialogTitle>
                </DialogHeader>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white h-8 w-8 p-0"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              {/* Avatar overlapping header */}
              <div className="px-6 -mt-10">
                <div className="flex items-end gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#1a1a1a] border-4 border-[#0f0f0f] flex items-center justify-center overflow-hidden shadow-xl">
                    {selectedUser.avatar_url ? (
                      <img
                        src={selectedUser.avatar_url || "/placeholder.svg"}
                        alt={selectedUser.full_name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-amber-500">
                        {selectedUser.full_name?.[0]?.toUpperCase() || selectedUser.email?.[0]?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  <div className="pb-1">
                    <h3 className="text-lg font-semibold text-white">{selectedUser.full_name || "No name"}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${getProviderColor(selectedUser.auth_provider)} text-xs px-2 py-0.5`}>
                        {getProviderIcon(selectedUser.auth_provider)}
                        <span className="ml-1">{getProviderLabel(selectedUser.auth_provider)}</span>
                      </Badge>
                      {selectedUser.role === "admin" && (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-xs px-2 py-0.5">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* User details */}
              <div className="p-6 pt-4 space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Mail className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-zinc-500">Email</p>
                      <p className="text-sm text-white truncate">{selectedUser.email}</p>
                    </div>
                    {selectedUser.email_confirmed_at && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Shield className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Role</p>
                      <p className="text-sm text-white capitalize">{selectedUser.role || "customer"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Joined</p>
                      <p className="text-sm text-white">{formatDateTime(selectedUser.created_at)}</p>
                    </div>
                  </div>

                  {selectedUser.last_sign_in_at && (
                    <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Last Sign In</p>
                        <p className="text-sm text-white">{formatDateTime(selectedUser.last_sign_in_at)}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/[0.06]">
                  <p className="text-xs text-zinc-600 mb-1">User ID</p>
                  <p className="text-xs font-mono text-zinc-500 bg-[#1a1a1a] p-2 rounded-lg break-all">
                    {selectedUser.id}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(null)
                      setRoleUpdateUser({
                        id: selectedUser.id,
                        currentRole: selectedUser.role,
                        newRole: selectedUser.role === "admin" ? "customer" : "admin",
                      })
                    }}
                    className="flex-1 bg-[#1a1a1a] border-white/[0.08] text-zinc-300 hover:text-white"
                  >
                    <UserCog className="w-4 h-4 mr-2" />
                    {selectedUser.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(null)
                      setDeleteUserId(selectedUser.id)
                    }}
                    className="bg-red-500/10 border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Role update dialog */}
      <AlertDialog open={!!roleUpdateUser} onOpenChange={() => setRoleUpdateUser(null)}>
        <AlertDialogContent className="bg-[#0f0f0f] border-white/[0.08]">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2.5 rounded-xl ${roleUpdateUser?.newRole === "admin" ? "bg-amber-500/10" : "bg-zinc-500/10"}`}
              >
                {roleUpdateUser?.newRole === "admin" ? (
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                ) : (
                  <User className="w-5 h-5 text-zinc-400" />
                )}
              </div>
              <AlertDialogTitle className="text-white">
                {roleUpdateUser?.newRole === "admin" ? "Promote to Admin" : "Remove Admin Access"}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-zinc-400">
              {roleUpdateUser?.newRole === "admin"
                ? "This user will have full admin access to manage products, orders, users, and all site settings. This is a powerful permission."
                : "This user will lose admin privileges and become a regular customer. They will no longer have access to the admin panel."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-[#1a1a1a] border-white/[0.08] text-white hover:bg-[#222222]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => roleUpdateUser && updateUserRole(roleUpdateUser.id, roleUpdateUser.newRole)}
              disabled={actionLoading}
              className={
                roleUpdateUser?.newRole === "admin"
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-zinc-600 hover:bg-zinc-700 text-white"
              }
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : roleUpdateUser?.newRole === "admin" ? (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Make Admin
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Remove Admin
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete user dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent className="bg-[#0f0f0f] border-white/[0.08]">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-red-500/10">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <AlertDialogTitle className="text-white">Delete User Account</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this user? This will permanently remove their account and all associated
              data including orders and preferences. <span className="text-red-400">This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-[#1a1a1a] border-white/[0.08] text-white hover:bg-[#222222]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && deleteUser(deleteUserId)}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Permanently
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
