import { pool } from "@/lib/db"

export const runtime = "nodejs"

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return Response.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, password]
    )

    return Response.json({ success: true, user: result.rows[0] }, { status: 201 })
  } catch (err) {
    const message =
      err.code === "23505" ? "Email is already registered" : err.message

    return Response.json(
      { success: false, message },
      { status: err.code === "23505" ? 409 : 500 }
    )
  }
}
