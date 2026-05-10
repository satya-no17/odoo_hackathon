"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PublicTripPage() {
  const router = useRouter()
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch(`/api/trips/public/${slug}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json)
        else setMessage(json.message || "Trip not found")
      })
      .catch((error) => setMessage(error.message))
  }, [slug])

  async function copyTrip() {
    const saved = localStorage.getItem("traveloop_user")
    if (!saved) {
      router.push("/auth/login")
      return
    }

    const user = JSON.parse(saved)
    const res = await fetch(`/api/trips/copy/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    })
    const json = await res.json()

    if (!json.success) {
      setMessage(json.message || "Could not copy trip")
      return
    }

    router.push(`/trips/${json.trip.id}`)
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
        <p>{message || "Loading public itinerary..."}</p>
      </main>
    )
  }

  const { trip, stops, budget } = data

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <section className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Public itinerary
            </p>
            <h1 className="mt-2 text-3xl font-bold">{trip.name}</h1>
            <p className="mt-1 text-slate-600">Shared by {trip.owner_name}</p>
            <p className="mt-2 max-w-2xl text-slate-600">
              {trip.description || "No description"}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded bg-teal-700 px-4 py-2 text-white" onClick={copyTrip}>
              Copy Trip
            </button>
            <Link className="rounded border bg-white px-4 py-2" href="/dashboard">
              Dashboard
            </Link>
          </div>
        </div>

        {message && <p className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">{message}</p>}

        <section className="mt-8 rounded border bg-white p-5">
          <h2 className="text-xl font-semibold">Summary</h2>
          <p className="mt-2 text-sm text-slate-600">
            {trip.start_date || "No start date"} to {trip.end_date || "No end date"} - {stops.length} stops
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Activity estimate: ${Number(budget.activityTotal || 0).toFixed(0)}
          </p>
        </section>

        <section className="mt-6 space-y-4">
          {stops.map((stop, index) => (
            <article className="rounded border bg-white p-5" key={stop.id}>
              <p className="text-sm font-semibold text-teal-700">Stop {index + 1}</p>
              <h2 className="text-xl font-semibold">{stop.display_city || stop.city_name}</h2>
              <p className="text-sm text-slate-600">
                {stop.country || "Custom city"} - {stop.arrival_date || "No arrival"} to {stop.departure_date || "No departure"}
              </p>

              <div className="mt-4 space-y-2">
                {stop.activities.length === 0 && (
                  <p className="text-sm text-slate-600">No activities listed.</p>
                )}
                {stop.activities.map((activity) => (
                  <div className="rounded bg-slate-50 px-3 py-2 text-sm" key={activity.id}>
                    {activity.name} - {activity.category} - ${Number(activity.cost || 0).toFixed(0)}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}
