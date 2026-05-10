import { pool } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(req) {
  try {
    const stopId = req.nextUrl.searchParams.get("stopId")

    if (!stopId) {
      return Response.json(
        { success: false, message: "stopId is required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      "SELECT * FROM activities WHERE stop_id=$1 ORDER BY category, name",
      [stopId]
    )

    return Response.json({ success: true, activities: result.rows })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const { stopId, name, category, cost, durationHours } = await req.json()

    if (!stopId || !name) {
      return Response.json(
        { success: false, message: "stopId and name are required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO activities (stop_id, name, category, cost, duration_hours)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        stopId,
        name,
        category || "misc",
        Number(cost || 0),
        durationHours ? Number(durationHours) : null,
      ]
    )

    return Response.json(
      { success: true, activity: result.rows[0] },
      { status: 201 }
    )
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
      "DELETE FROM activities WHERE id=$1 RETURNING id",
      [id]
    )

    if (result.rows.length === 0) {
      return Response.json(
        { success: false, message: "Activity not found" },
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
