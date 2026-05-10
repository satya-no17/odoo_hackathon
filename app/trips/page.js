"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function TripsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [trips, setTrips] = useState([])

  async function loadTrips(userId) {
    const res = await fetch(`/api/trips?userId=${userId}`)
    const data = await res.json()
    setTrips(data.trips || [])
  }

  useEffect(() => {
    const saved = localStorage.getItem("traveloop_user")
    if (!saved) {
      router.push("/auth/login")
      return
    }

    const currentUser = JSON.parse(saved)
    const timer = setTimeout(() => setUser(currentUser), 0)
    fetch(`/api/trips?userId=${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => setTrips(data.trips || []))

    return () => clearTimeout(timer)
  }, [router])

  async function deleteTrip(id) {
    if (!confirm("Delete this trip?")) return

    await fetch(`/api/trips/${id}`, { method: "DELETE" })
    if (user) loadTrips(user.id)
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link className="text-sm text-teal-700" href="/dashboard">
              Back to dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-bold">My Trips</h1>
          </div>
          <Link className="rounded bg-teal-700 px-4 py-2 text-white" href="/trips/create">
            Plan New Trip
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {trips.map((trip) => (
            <article className="rounded border bg-white p-5" key={trip.id}>
              <h2 className="text-xl font-semibold">{trip.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{trip.description || "No description"}</p>
              <p className="mt-2 text-sm text-slate-600">
                {trip.start_date || "No start date"} to {trip.end_date || "No end date"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {trip.stop_count} stops - ${Number(trip.activity_total || 0).toFixed(0)} activity cost
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link className="rounded border px-3 py-2 text-sm" href={`/trips/${trip.id}`}>
                  View/Edit
                </Link>
                <Link className="rounded border px-3 py-2 text-sm" href={`/trips/public/${trip.id}`}>
                  Public View
                </Link>
                <button
                  className="rounded border px-3 py-2 text-sm text-red-700"
                  onClick={() => deleteTrip(trip.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>

        {trips.length === 0 && (
          <p className="mt-8 rounded border bg-white p-5 text-slate-600">
            No trips yet. Create your first itinerary.
          </p>
        )}
      </section>
    </main>
  )
}
