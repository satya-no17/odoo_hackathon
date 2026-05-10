import { pool } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(req) {
  try {
    const q = req.nextUrl.searchParams.get("q") || ""
    const search = `%${q.trim()}%`

    const result = await pool.query(
      `SELECT id, name, country, cost_index
       FROM cities
       WHERE $1 = '%%' OR name ILIKE $1 OR country ILIKE $1
       ORDER BY cost_index ASC, name ASC
       LIMIT 30`,
      [search]
    )

    return Response.json({ success: true, cities: result.rows })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
