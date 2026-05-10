import { pool } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(_req, { params }) {
  try {
    const { slug } = await params
    const tripResult = await pool.query(
      `SELECT t.id, t.name, t.description, t.start_date, t.end_date, t.created_at,
              u.name AS owner_name
       FROM trips t
       JOIN users u ON u.id = t.user_id
       WHERE t.id=$1`,
      [slug]
    )

    if (tripResult.rows.length === 0) {
      return Response.json(
        { success: false, message: "Trip not found" },
        { status: 404 }
      )
    }

    const stopsResult = await pool.query(
      `SELECT s.*, c.name AS city_db_name, c.country, c.cost_index
       FROM stops s
       LEFT JOIN cities c ON c.id = s.city_id
       WHERE s.trip_id=$1
       ORDER BY s.sort_order, s.arrival_date NULLS LAST, s.id`,
      [slug]
    )

    const activitiesResult = await pool.query(
      `SELECT a.*
       FROM activities a
       JOIN stops s ON s.id = a.stop_id
       WHERE s.trip_id=$1
       ORDER BY a.category, a.name`,
      [slug]
    )

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

    return Response.json({
      success: true,
      trip: tripResult.rows[0],
      stops,
      budget: { activityTotal },
    })
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
