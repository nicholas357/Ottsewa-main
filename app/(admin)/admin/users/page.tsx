"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldCheck,
  User,
  Chrome,
  Smartphone,
  Globe,
  Clock,
  Trash2,
  UserCog,
} from "lucide-react"
import { Card } from "@/components/ui/card"
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
import { toast } from "sonner"

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
      toast.error("Failed to load users")
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
        return <Chrome className="w-4 h-4" />
      case "phone":
        return <Smartphone className="w-4 h-4" />
      case "github":
        return <Globe className="w-4 h-4" />
      default:
        return <Mail className="w-4 h-4" />
    }
  }

  const getProviderLabel = (provider?: string) => {
    switch (provider?.toLowerCase()) {
      case "google":
        return "Google"
      case "phone":
        return "Phone"
      case "github":
        return "GitHub"
      default:
        return "Email"
    }
  }

  const getProviderColor = (provider?: string) => {
    switch (provider?.toLowerCase()) {
      case "google":
        return "bg-red-500/10 text-red-500"
      case "phone":
        return "bg-green-500/10 text-green-500"
      case "github":
        return "bg-purple-500/10 text-purple-500"
      default:
        return "bg-blue-500/10 text-blue-500"
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    customers: users.filter((u) => u.role !== "admin").length,
    googleUsers: users.filter((u) => u.auth_provider?.toLowerCase() === "google").length,
    emailUsers: users.filter((u) => !u.auth_provider || u.auth_provider?.toLowerCase() === "email").length,
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

      toast.success(`User role updated to ${newRole}`)
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
      setRoleUpdateUser(null)
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, role: newRole } : null))
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update role")
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

      toast.success("User deleted successfully")
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setDeleteUserId(null)
      if (selectedUser?.id === userId) {
        setSelectedUser(null)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-zinc-900/50 border border-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-zinc-900/50 border border-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users Management</h1>
          <p className="text-zinc-400 text-sm mt-1">{stats.total} registered users</p>
        </div>
        <Button onClick={fetchUsers} variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-800 rounded-lg">
              <Users className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Total Users</p>
              <p className="text-white font-semibold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Admins</p>
              <p className="text-white font-semibold">{stats.admins}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <User className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Customers</p>
              <p className="text-white font-semibold">{stats.customers}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Mail className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Email Sign-ups</p>
              <p className="text-white font-semibold">{stats.emailUsers}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Chrome className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Google Sign-ups</p>
              <p className="text-white font-semibold">{stats.googleUsers}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-36 bg-zinc-900/50 border-zinc-800 text-white">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-full sm:w-36 bg-zinc-900/50 border-zinc-800 text-white">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400">User</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400 hidden md:table-cell">
                  Email
                </th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400 hidden lg:table-cell">
                  Provider
                </th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400">Role</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400 hidden sm:table-cell">
                  Joined
                </th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-800 flex items-center justify-center text-amber-500 font-medium text-sm">
                        {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.full_name || "No name"}</p>
                        <p className="text-xs text-zinc-500 truncate md:hidden">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 hidden md:table-cell">
                    <span className="text-sm text-zinc-300 truncate block max-w-[200px]">{user.email}</span>
                  </td>
                  <td className="p-3 sm:p-4 hidden lg:table-cell">
                    <Badge
                      variant="outline"
                      className={`${getProviderColor(user.auth_provider)} flex items-center gap-1 w-fit`}
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
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          : "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
                      }
                    >
                      {user.role === "admin" ? (
                        <ShieldCheck className="w-3 h-3 mr-1" />
                      ) : (
                        <User className="w-3 h-3 mr-1" />
                      )}
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-3 sm:p-4 hidden sm:table-cell">
                    <span className="text-sm text-zinc-400">{new Date(user.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                        title="View details"
                      >
                        <User className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setRoleUpdateUser({
                            id: user.id,
                            currentRole: user.role,
                            newRole: user.role === "admin" ? "customer" : "admin",
                          })
                        }
                        className={`h-8 w-8 p-0 ${
                          user.role === "admin"
                            ? "text-amber-500 hover:text-amber-400"
                            : "text-zinc-400 hover:text-amber-500"
                        }`}
                        title={user.role === "admin" ? "Remove admin" : "Make admin"}
                      >
                        <UserCog className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteUserId(user.id)}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-red-500"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                  {selectedUser.avatar_url ? (
                    <img
                      src={selectedUser.avatar_url || "/placeholder.svg"}
                      alt={selectedUser.full_name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-zinc-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedUser.full_name || "No name"}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${getProviderColor(selectedUser.auth_provider)} text-xs px-2 py-0.5`}>
                      {getProviderIcon(selectedUser.auth_provider)}
                      <span className="ml-1">{getProviderLabel(selectedUser.auth_provider)}</span>
                    </Badge>
                    {selectedUser.role === "admin" && (
                      <Badge className="bg-amber-500/10 text-amber-500 text-xs px-2 py-0.5">Admin</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-400">Email:</span>
                  <span className="text-white truncate">{selectedUser.email}</span>
                </div>
                {selectedUser.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-zinc-500" />
                    <span className="text-zinc-400">Phone:</span>
                    <span className="text-white">{selectedUser.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-400">Role:</span>
                  <span className="text-white capitalize">{selectedUser.role || "customer"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-400">Auth Provider:</span>
                  <span className="text-white">{getProviderLabel(selectedUser.auth_provider)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-400">Joined:</span>
                  <span className="text-white">{formatDateTime(selectedUser.created_at)}</span>
                </div>
                {selectedUser.last_sign_in_at && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <span className="text-zinc-400">Last Sign In:</span>
                    <span className="text-white">
                      {new Date(selectedUser.last_sign_in_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-zinc-800">
                <p className="text-xs text-zinc-500">User ID</p>
                <p className="text-xs font-mono text-zinc-400 mt-1 break-all">{selectedUser.id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!roleUpdateUser} onOpenChange={() => setRoleUpdateUser(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {roleUpdateUser?.newRole === "admin" ? "Make Admin" : "Remove Admin"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {roleUpdateUser?.newRole === "admin"
                ? "This user will have full admin access to manage products, orders, users, and all site settings."
                : "This user will lose admin privileges and become a regular customer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
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
              {actionLoading ? "Updating..." : roleUpdateUser?.newRole === "admin" ? "Make Admin" : "Remove Admin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this user? This will permanently remove their account and all associated
              data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && deleteUser(deleteUserId)}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {actionLoading ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
