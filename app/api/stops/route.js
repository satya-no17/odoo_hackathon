import { pool } from "@/lib/db"

export const runtime = "nodejs"

export async function POST(req) {
  try {
    const {
      tripId,
      cityId,
      cityName,
      arrivalDate,
      departureDate,
      sortOrder,
    } = await req.json()

    if (!tripId || (!cityId && !cityName)) {
      return Response.json(
        { success: false, message: "tripId and a city are required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO stops
        (trip_id, city_id, city_name, arrival_date, departure_date, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        tripId,
        cityId || null,
        cityName || null,
        arrivalDate || null,
        departureDate || null,
        Number(sortOrder || 0),
      ]
    )

    return Response.json({ success: true, stop: result.rows[0] }, { status: 201 })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
  try {
    const { id, arrivalDate, departureDate, sortOrder } = await req.json()

    if (!id) {
      return Response.json(
        { success: false, message: "id is required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `UPDATE stops
       SET arrival_date=$1, departure_date=$2, sort_order=$3
       WHERE id=$4
       RETURNING *`,
      [arrivalDate || null, departureDate || null, Number(sortOrder || 0), id]
    )

    if (result.rows.length === 0) {
      return Response.json(
        { success: false, message: "Stop not found" },
        { status: 404 }
      )
    }

    return Response.json({ success: true, stop: result.rows[0] })
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

    const result = await pool.query("DELETE FROM stops WHERE id=$1 RETURNING id", [
      id,
    ])

    if (result.rows.length === 0) {
      return Response.json(
        { success: false, message: "Stop not found" },
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
