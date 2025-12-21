import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const now = new Date().toISOString()

    const { data: deals, error } = await supabase
      .from("flash_deals")
      .select(`
        *,
        product:products(id, title, slug, image_url, base_price, original_price)
      `)
      .eq("is_active", true)
      .gt("end_time", now)
      .lte("start_time", now)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      // Table doesn't exist yet - return null silently
      if (error.code === "42P01" || error.code === "PGRST204" || error.code === "PGRST205") {
        return NextResponse.json({ deal: null })
      }
      console.error("[v0] Flash deal query error:", error)
      return NextResponse.json({ deal: null })
    }

    // Return first deal or null
    const deal = deals && deals.length > 0 ? deals[0] : null
    return NextResponse.json({ deal })
  } catch (error) {
    console.error("[v0] Flash deal catch error:", error)
    return NextResponse.json({ deal: null })
  }
}
