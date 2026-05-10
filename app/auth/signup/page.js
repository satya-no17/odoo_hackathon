"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    setLoading(false)
    if (!data.success) {
      setMessage(data.message || "Signup failed")
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
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Demo auth stores the password directly for this hackathon MVP.
        </p>

        <label className="mt-6 block text-sm font-medium">Name</label>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          name="name"
          onChange={updateField}
          required
          value={form.name}
        />

        <label className="mt-4 block text-sm font-medium">Email</label>
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
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-medium text-teal-700" href="/auth/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  )
}
