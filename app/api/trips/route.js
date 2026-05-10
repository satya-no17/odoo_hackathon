import { pool } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")

    if (!userId) {
      return Response.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `SELECT
        t.*,
        COUNT(DISTINCT s.id)::int AS stop_count,
        COALESCE(SUM(a.cost), 0)::float AS activity_total
       FROM trips t
       LEFT JOIN stops s ON s.trip_id = t.id
       LEFT JOIN activities a ON a.stop_id = s.id
       WHERE t.user_id = $1
       GROUP BY t.id
       ORDER BY COALESCE(t.start_date, t.created_at::date), t.created_at DESC`,
      [userId]
    )

    return Response.json({ success: true, trips: result.rows })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const { userId, name, description, startDate, endDate } = await req.json()

    if (!userId || !name) {
      return Response.json(
        { success: false, message: "userId and name are required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO trips (user_id, name, description, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, name, description || null, startDate || null, endDate || null]
    )

    return Response.json({ success: true, trip: result.rows[0] }, { status: 201 })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
