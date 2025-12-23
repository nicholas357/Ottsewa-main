import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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

// GET - Fetch single user
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  try {
    // Get auth user data
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(id)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Get profile data
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Determine auth provider
    let authProvider = "email"
    if (authUser.user) {
      if (authUser.user.identities && authUser.user.identities.length > 0) {
        authProvider = authUser.user.identities[0].provider || "email"
      }
      if (authUser.user.app_metadata?.provider) {
        authProvider = authUser.user.app_metadata.provider
      }
      if (authUser.user.app_metadata?.providers?.includes("google")) {
        authProvider = "google"
      }
    }

    return NextResponse.json({
      user: {
        ...profile,
        email: authUser.user?.email || profile.email,
        auth_provider: authProvider,
        last_sign_in_at: authUser.user?.last_sign_in_at,
        email_confirmed_at: authUser.user?.email_confirmed_at,
      },
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update user role
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  console.log("[v0] PATCH request - userId:", id, "adminId:", admin.id)

  // Prevent admin from demoting themselves
  if (admin.id === id) {
    return NextResponse.json({ error: "You cannot change your own role" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { role } = body

    console.log("[v0] Updating role to:", role)

    // Validate role
    const validRoles = ["user", "admin"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role. Must be 'user' or 'admin'" }, { status: 400 })
    }

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    console.log("[v0] Update result:", { profile, error })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ user: profile })
  } catch (error) {
    console.error("[v0] Error updating user role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete a user (use with caution!)
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  // Prevent admin from deleting themselves
  if (admin.id === id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 })
  }

  try {
    // Delete from auth (this will cascade to profiles if RLS is set up)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Also delete from profiles table just to be sure
    await supabaseAdmin.from("profiles").delete().eq("id", id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
