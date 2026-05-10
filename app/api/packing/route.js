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
      "SELECT * FROM packing_items WHERE trip_id=$1 ORDER BY category, name",
      [tripId]
    )

    return Response.json({ success: true, packingItems: result.rows })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const { tripId, name, category } = await req.json()

    if (!tripId || !name) {
      return Response.json(
        { success: false, message: "tripId and name are required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO packing_items (trip_id, name, category)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [tripId, name, category || "misc"]
    )

    return Response.json({ success: true, item: result.rows[0] }, { status: 201 })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
  try {
    const { id, isPacked } = await req.json()

    if (!id) {
      return Response.json(
        { success: false, message: "id is required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      "UPDATE packing_items SET is_packed=$1 WHERE id=$2 RETURNING *",
      [Boolean(isPacked), id]
    )

    if (result.rows.length === 0) {
      return Response.json(
        { success: false, message: "Packing item not found" },
        { status: 404 }
      )
    }

    return Response.json({ success: true, item: result.rows[0] })
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
      "DELETE FROM packing_items WHERE id=$1 RETURNING id",
      [id]
    )

    if (result.rows.length === 0) {
      return Response.json(
        { success: false, message: "Packing item not found" },
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
