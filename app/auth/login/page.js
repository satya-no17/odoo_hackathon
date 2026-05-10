"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    setLoading(false)
    if (!data.success) {
      setMessage(data.message || "Login failed")
      return
    }

    localStorage.setItem("traveloop_user", JSON.stringify(data.user))
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-950">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md rounded border bg-white p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Login to Traveloop</h1>
        <p className="mt-2 text-sm text-slate-600">
          Use the email and password saved during signup.
        </p>

        <label className="mt-6 block text-sm font-medium">Email</label>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          name="email"
          onChange={updateField}
          required
          type="email"
          value={form.email}
        />

        <label className="mt-4 block text-sm font-medium">Password</label>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          name="password"
          onChange={updateField}
          required
          type="password"
          value={form.password}
        />

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        <button
          className="mt-6 w-full rounded bg-teal-700 px-4 py-2 font-medium text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Checking..." : "Login"}
        </button>

        <p className="mt-4 text-sm text-slate-600">
          New here?{" "}
          <Link className="font-medium text-teal-700" href="/auth/signup">
            Create account
          </Link>
        </p>
      </form>
    </main>
  )
}
