import { pool } from "@/lib/db"

export const runtime = "nodejs"

export async function POST(req) {
  try {
    const body = await req.json()

    const { email, password } = body
    if (!email || !password) {
      return Response.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE email=$1 AND password=$2",
      [email, password]
    )

    if (result.rows.length === 0) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }

    return Response.json({
      success: true,
      user: result.rows[0],
    })
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
