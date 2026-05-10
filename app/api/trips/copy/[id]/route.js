import { pool } from "@/lib/db"

export const runtime = "nodejs"

export async function POST(req, { params }) {
  const client = await pool.connect()

  try {
    const { id } = await params
    const { userId } = await req.json()

    if (!userId) {
      return Response.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      )
    }

    await client.query("BEGIN")

    const tripCopy = await client.query(
      `INSERT INTO trips (user_id, name, description, start_date, end_date)
       SELECT $1, name || ' (Copy)', description, start_date, end_date
       FROM trips
       WHERE id=$2
       RETURNING *`,
      [userId, id]
    )

    if (tripCopy.rows.length === 0) {
      await client.query("ROLLBACK")
      return Response.json(
        { success: false, message: "Trip not found" },
        { status: 404 }
      )
    }

    const newTrip = tripCopy.rows[0]
    const originalStops = await client.query(
      "SELECT * FROM stops WHERE trip_id=$1 ORDER BY sort_order, id",
      [id]
    )

    const stopIdMap = new Map()
    for (const stop of originalStops.rows) {
      const copiedStop = await client.query(
        `INSERT INTO stops
          (trip_id, city_id, city_name, arrival_date, departure_date, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          newTrip.id,
          stop.city_id,
          stop.city_name,
          stop.arrival_date,
          stop.departure_date,
          stop.sort_order,
        ]
      )
      stopIdMap.set(stop.id, copiedStop.rows[0].id)
    }

    const originalActivities = await client.query(
      `SELECT a.*
       FROM activities a
       JOIN stops s ON s.id = a.stop_id
       WHERE s.trip_id=$1`,
      [id]
    )

    for (const activity of originalActivities.rows) {
      await client.query(
        `INSERT INTO activities (stop_id, name, category, cost, duration_hours)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          stopIdMap.get(activity.stop_id),
          activity.name,
          activity.category,
          activity.cost,
          activity.duration_hours,
        ]
      )
    }

    const originalPacking = await client.query(
      "SELECT * FROM packing_items WHERE trip_id=$1",
      [id]
    )

    for (const item of originalPacking.rows) {
      await client.query(
        `INSERT INTO packing_items (trip_id, name, category, is_packed)
         VALUES ($1, $2, $3, $4)`,
        [newTrip.id, item.name, item.category, false]
      )
    }

    const originalNotes = await client.query(
      "SELECT * FROM trip_notes WHERE trip_id=$1",
      [id]
    )

    for (const note of originalNotes.rows) {
      await client.query(
        `INSERT INTO trip_notes (trip_id, stop_id, content)
         VALUES ($1, $2, $3)`,
        [newTrip.id, note.stop_id ? stopIdMap.get(note.stop_id) : null, note.content]
      )
    }

    await client.query("COMMIT")
    return Response.json({ success: true, trip: newTrip }, { status: 201 })
  } catch (err) {
    await client.query("ROLLBACK")
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
