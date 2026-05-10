"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CreateTripPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("traveloop_user")
    if (!saved) {
      router.push("/auth/login")
      return
    }
    const timer = setTimeout(() => setUser(JSON.parse(saved)), 0)
    return () => clearTimeout(timer)
  }, [router])

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage("")

    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId: user.id }),
    })
    const data = await res.json()

    if (!data.success) {
      setMessage(data.message || "Could not create trip")
      return
    }

    router.push(`/trips/${data.trip.id}`)
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <form
        className="mx-auto max-w-2xl rounded border bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <Link className="text-sm text-teal-700" href="/trips">
          Back to trips
        </Link>
        <h1 className="mt-2 text-3xl font-bold">Create Trip</h1>

        <label className="mt-6 block text-sm font-medium">Trip name</label>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          name="name"
          onChange={updateField}
          required
          value={form.name}
        />

        <label className="mt-4 block text-sm font-medium">Description</label>
        <textarea
          className="mt-1 min-h-24 w-full rounded border px-3 py-2"
          name="description"
          onChange={updateField}
          value={form.description}
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Start date</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              name="startDate"
              onChange={updateField}
              type="date"
              value={form.startDate}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End date</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              name="endDate"
              onChange={updateField}
              type="date"
              value={form.endDate}
            />
          </div>
        </div>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        <button className="mt-6 rounded bg-teal-700 px-5 py-3 font-medium text-white">
          Save trip
        </button>
      </form>
    </main>
  )
}
