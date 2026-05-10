"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [trips, setTrips] = useState([])
  const [cities, setCities] = useState([])

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

    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data.cities || []))

    return () => clearTimeout(timer)
  }, [router])

  function logout() {
    localStorage.removeItem("traveloop_user")
    router.push("/auth/login")
  }

  if (!user) {
    return <main className="p-6">Loading...</main>
  }

  const recentTrips = trips.slice(0, 3)
  const totalBudget = trips.reduce(
    (sum, trip) => sum + Number(trip.activity_total || 0),
    0
  )

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Traveloop
            </p>
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          </div>
          <div className="flex gap-2">
            <Link className="rounded bg-teal-700 px-4 py-2 text-white" href="/trips/create">
              Plan New Trip
            </Link>
            <button className="rounded border px-4 py-2" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded border bg-white p-5">
            <p className="text-sm text-slate-500">Trips planned</p>
            <p className="mt-2 text-3xl font-bold">{trips.length}</p>
          </div>
          <div className="rounded border bg-white p-5">
            <p className="text-sm text-slate-500">Activity budget</p>
            <p className="mt-2 text-3xl font-bold">₹{totalBudget.toFixed(0)}</p>
          </div>
          <div className="rounded border bg-white p-5">
            <p className="text-sm text-slate-500">Recommended cities</p>
            <p className="mt-2 text-3xl font-bold">{cities.length}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="rounded border bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent trips</h2>
              <Link className="text-sm font-medium text-teal-700" href="/trips">
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentTrips.length === 0 && (
                <p className="text-sm text-slate-600">No trips yet. Create one to begin.</p>
              )}
              {recentTrips.map((trip) => (
                <Link
                  className="block rounded border p-4 hover:border-teal-600"
                  href={`/trips/${trip.id}`}
                  key={trip.id}
                >
                  <h3 className="font-semibold">{trip.name}</h3>
                  <p className="text-sm text-slate-600">
                    {trip.start_date || "No start date"} to {trip.end_date || "No end date"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {trip.stop_count} stops, ${Number(trip.activity_total || 0).toFixed(0)} activities
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded border bg-white p-5">
            <h2 className="text-xl font-semibold">Popular cities</h2>
            <div className="mt-4 space-y-3">
              {cities.slice(0, 8).map((city) => (
                <div className="rounded border p-3" key={city.id}>
                  <p className="font-medium">{city.name}</p>
                  <p className="text-sm text-slate-600">
                    {city.country} - cost index {city.cost_index}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
