import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Helper function to check if user is admin
async function checkAdmin() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabaseAdmin.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") return null

  return user
}

export async function GET() {
  const admin = await checkAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch all users from auth.users using admin API
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      console.error("Error fetching auth users:", authError)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
      return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 })
    }

    // Merge auth data with profiles
    const users = profiles.map((profile) => {
      const authUser = authUsers.users.find((u) => u.id === profile.id)

      // Determine auth provider from auth user data
      let authProvider = "email"
      if (authUser) {
        // Check identities array for provider info
        if (authUser.identities && authUser.identities.length > 0) {
          const identity = authUser.identities[0]
          authProvider = identity.provider || "email"
        }
        // Also check app_metadata.provider
        if (authUser.app_metadata?.provider) {
          authProvider = authUser.app_metadata.provider
        }
        // Check for specific providers
        if (authUser.app_metadata?.providers?.includes("google")) {
          authProvider = "google"
        }
      }

      return {
        ...profile,
        email: authUser?.email || profile.email,
        auth_provider: authProvider,
        last_sign_in_at: authUser?.last_sign_in_at,
        email_confirmed_at: authUser?.email_confirmed_at,
        created_at: authUser?.created_at || profile.created_at,
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error in users API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
