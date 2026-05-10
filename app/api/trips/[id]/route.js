import { pool } from "@/lib/db"

export const runtime = "nodejs"

async function loadTrip(id) {
  const tripResult = await pool.query("SELECT * FROM trips WHERE id=$1", [id])

  if (tripResult.rows.length === 0) {
    return null
  }

  const [stopsResult, activitiesResult, packingResult, notesResult] =
    await Promise.all([
      pool.query(
        `SELECT s.*, c.name AS city_db_name, c.country, c.cost_index
         FROM stops s
         LEFT JOIN cities c ON c.id = s.city_id
         WHERE s.trip_id=$1
         ORDER BY s.sort_order, s.arrival_date NULLS LAST, s.id`,
        [id]
      ),
      pool.query(
        `SELECT a.*
         FROM activities a
         JOIN stops s ON s.id = a.stop_id
         WHERE s.trip_id=$1
         ORDER BY a.category, a.name`,
        [id]
      ),
      pool.query(
        "SELECT * FROM packing_items WHERE trip_id=$1 ORDER BY category, name",
        [id]
      ),
      pool.query(
        `SELECT n.*, s.city_name
         FROM trip_notes n
         LEFT JOIN stops s ON s.id = n.stop_id
         WHERE n.trip_id=$1
         ORDER BY n.created_at DESC`,
        [id]
      ),
    ])

  const activitiesByStop = activitiesResult.rows.reduce((acc, activity) => {
    acc[activity.stop_id] ||= []
    acc[activity.stop_id].push(activity)
    return acc
  }, {})

  const stops = stopsResult.rows.map((stop) => ({
    ...stop,
    display_city: stop.city_name || stop.city_db_name,
    activities: activitiesByStop[stop.id] || [],
  }))

  const activityTotal = activitiesResult.rows.reduce(
    (sum, activity) => sum + Number(activity.cost || 0),
    0
  )
  const costIndexTotal = stops.reduce(
    (sum, stop) => sum + Number(stop.cost_index || 1),
    0
  )

  return {
    trip: tripResult.rows[0],
    stops,
    packingItems: packingResult.rows,
    notes: notesResult.rows,
    budget: {
      activityTotal,
      estimatedDailyBase: Math.round(costIndexTotal * 100),
      estimatedTotal: Math.round(activityTotal + costIndexTotal * 100),
    },
  }
}

export async function GET(_req, { params }) {
  try {
    const { id } = await params
    const data = await loadTrip(id)

    if (!data) {
      return Response.json(
        { success: false, message: "Trip not found" },
        { status: 404 }
      )
    }

    return Response.json({ success: true, ...data })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params
    const { name, description, startDate, endDate } = await req.json()

    if (!name) {
      return Response.json(
        { success: false, message: "Trip name is required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `UPDATE trips
       SET name=$1, description=$2, start_date=$3, end_date=$4
       WHERE id=$5
       RETURNING *`,
      [name, description || null, startDate || null, endDate || null, id]
    )

    if (result.rows.length === 0) {
      return Response.json(
        { success: false, message: "Trip not found" },
        { status: 404 }
      )
    }

    return Response.json({ success: true, trip: result.rows[0] })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { id } = await params
    const result = await pool.query("DELETE FROM trips WHERE id=$1 RETURNING id", [
      id,
    ])

    if (result.rows.length === 0) {
      return Response.json(
        { success: false, message: "Trip not found" },
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
