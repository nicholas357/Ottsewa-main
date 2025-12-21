import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createClient()
    const now = new Date().toISOString()

    const { data: deals, error } = await supabase
      .from("flash_deals")
      .select(`
        id,
        product_id,
        discount_percentage,
        start_time,
        end_time,
        is_active,
        product:products(id, title, slug, image_url, base_price, original_price)
      `)
      .eq("is_active", true)
      .lte("start_time", now)
      .gt("end_time", now)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ deals: [] })
    }

    const validDeals = (deals || []).filter((deal) => deal.product)

    return NextResponse.json({ deals: validDeals })
  } catch {
    return NextResponse.json({ deals: [] })
  }
}
