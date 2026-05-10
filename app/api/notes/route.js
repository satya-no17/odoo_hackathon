import { pool } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(req) {
  try {
    const tripId = req.nextUrl.searchParams.get("tripId")

    if (!tripId) {
      return Response.json(
        { success: false, message: "tripId is required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `SELECT n.*, s.city_name
       FROM trip_notes n
       LEFT JOIN stops s ON s.id = n.stop_id
       WHERE n.trip_id=$1
       ORDER BY n.created_at DESC`,
      [tripId]
    )

    return Response.json({ success: true, notes: result.rows })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const { tripId, stopId, content } = await req.json()

    if (!tripId || !content) {
      return Response.json(
        { success: false, message: "tripId and content are required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO trip_notes (trip_id, stop_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [tripId, stopId || null, content]
    )

    return Response.json({ success: true, note: result.rows[0] }, { status: 201 })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id")

    if (!id) {
      return Response.json(
        { success: false, message: "id is required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      "DELETE FROM trip_notes WHERE id=$1 RETURNING id",
      [id]
    )

    if (result.rows.length === 0) {
      return Response.json(
        { success: false, message: "Note not found" },
        { status: 404 }
      )
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
