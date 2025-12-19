import { createClient } from "@/lib/supabase/server"

// Re-export types and client functions for backward compatibility
export type { UserRole, Profile, AuthUser } from "@/lib/auth-client"
export { getCurrentUserClient, updateProfile } from "@/lib/auth-client"

// Server-side: Get current user with profile
export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return {
    id: user.id,
    email: user.email ?? null,
    profile: profile,
  }
}

// Server-side: Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.profile?.role === "admin"
}

// Server-side: Get user profile by ID
export async function getProfile(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single()

  return data
}
