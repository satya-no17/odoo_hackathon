"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const quickActivities = [
  { name: "City walking tour", category: "sightseeing", cost: 25, durationHours: 3 },
  { name: "Local food tasting", category: "food", cost: 40, durationHours: 2 },
  { name: "Museum visit", category: "culture", cost: 18, durationHours: 2 },
  { name: "Day adventure", category: "adventure", cost: 75, durationHours: 5 },
]

export default function TripDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [tripData, setTripData] = useState(null)
  const [cities, setCities] = useState([])
  const [cityQuery, setCityQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState(null)
  const [stopForm, setStopForm] = useState({
    cityName: "",
    arrivalDate: "",
    departureDate: "",
  })
  const [activityForms, setActivityForms] = useState({})
  const [packingForm, setPackingForm] = useState({ name: "", category: "misc" })
  const [noteForm, setNoteForm] = useState({ content: "", stopId: "" })
  const [message, setMessage] = useState("")

  const loadTrip = useCallback(async () => {
    const res = await fetch(`/api/trips/${id}`)
    const data = await res.json()
    if (data.success) setTripData(data)
    else setMessage(data.message || "Could not load trip")
  }, [id])

  useEffect(() => {
    const saved = localStorage.getItem("traveloop_user")
    if (!saved) {
      router.push("/auth/login")
      return
    }
    const timer = setTimeout(() => setUser(JSON.parse(saved)), 0)
    fetch(`/api/trips/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTripData(data)
        else setMessage(data.message || "Could not load trip")
      })

    return () => clearTimeout(timer)
  }, [id, router])

  useEffect(() => {
    fetch(`/api/cities?q=${encodeURIComponent(cityQuery)}`)
      .then((res) => res.json())
      .then((data) => setCities(data.cities || []))
  }, [cityQuery])

  function updateStopField(event) {
    setStopForm({ ...stopForm, [event.target.name]: event.target.value })
  }

  function updateActivityForm(stopId, field, value) {
    setActivityForms({
      ...activityForms,
      [stopId]: {
        name: "",
        category: "misc",
        cost: "",
        durationHours: "",
        ...(activityForms[stopId] || {}),
        [field]: value,
      },
    })
  }

  async function addStop(event) {
    event.preventDefault()
    const payload = {
      tripId: id,
      cityId: selectedCity?.id,
      cityName: selectedCity ? selectedCity.name : stopForm.cityName,
      arrivalDate: stopForm.arrivalDate,
      departureDate: stopForm.departureDate,
      sortOrder: tripData?.stops?.length || 0,
    }

    const res = await fetch("/api/stops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (!data.success) {
      setMessage(data.message || "Could not add stop")
      return
    }

    setStopForm({ cityName: "", arrivalDate: "", departureDate: "" })
    setSelectedCity(null)
    setCityQuery("")
    loadTrip()
  }

  async function deleteStop(stopId) {
    if (!confirm("Delete this stop and its activities?")) return
    await fetch(`/api/stops?id=${stopId}`, { method: "DELETE" })
    loadTrip()
  }

  async function addActivity(stopId, preset) {
    const form = preset || activityForms[stopId]
    if (!form?.name) return

    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stopId, ...form }),
    })
    const data = await res.json()

    if (!data.success) {
      setMessage(data.message || "Could not add activity")
      return
    }

    setActivityForms({ ...activityForms, [stopId]: undefined })
    loadTrip()
  }

  async function deleteActivity(activityId) {
    await fetch(`/api/activities?id=${activityId}`, { method: "DELETE" })
    loadTrip()
  }

  async function addPacking(event) {
    event.preventDefault()
    const res = await fetch("/api/packing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId: id, ...packingForm }),
    })
    const data = await res.json()

    if (!data.success) {
      setMessage(data.message || "Could not add packing item")
      return
    }

    setPackingForm({ name: "", category: "misc" })
    loadTrip()
  }

  async function togglePacking(item) {
    await fetch("/api/packing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isPacked: !item.is_packed }),
    })
    loadTrip()
  }

  async function deletePacking(itemId) {
    await fetch(`/api/packing?id=${itemId}`, { method: "DELETE" })
    loadTrip()
  }

  async function addNote(event) {
    event.preventDefault()
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId: id, ...noteForm }),
    })
    const data = await res.json()

    if (!data.success) {
      setMessage(data.message || "Could not add note")
      return
    }

    setNoteForm({ content: "", stopId: "" })
    loadTrip()
  }

  async function deleteNote(noteId) {
    await fetch(`/api/notes?id=${noteId}`, { method: "DELETE" })
    loadTrip()
  }

  if (!user || !tripData) {
    return <main className="p-6">Loading trip...</main>
  }

  const { trip, stops, packingItems, notes, budget } = tripData

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link className="text-sm text-teal-700" href="/trips">
              Back to trips
            </Link>
            <h1 className="mt-2 text-3xl font-bold">{trip.name}</h1>
            <p className="mt-1 max-w-2xl text-slate-600">
              {trip.description || "No description yet"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {trip.start_date || "No start date"} to {trip.end_date || "No end date"}
            </p>
          </div>
          <Link className="rounded border bg-white px-4 py-2" href={`/trips/public/${trip.id}`}>
            Public View
          </Link>
        </div>

        {message && <p className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">{message}</p>}

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            <form className="rounded border bg-white p-5" onSubmit={addStop}>
              <h2 className="text-xl font-semibold">Add stop</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium">Search city</label>
                  <input
                    className="mt-1 w-full rounded border px-3 py-2"
                    onChange={(event) => {
                      setCityQuery(event.target.value)
                      setSelectedCity(null)
                    }}
                    placeholder="Paris, Tokyo, Bali..."
                    value={cityQuery}
                  />
                  <div className="mt-2 max-h-44 overflow-auto rounded border">
                    {cities.slice(0, 8).map((city) => (
                      <button
                        className={`block w-full px-3 py-2 text-left text-sm hover:bg-teal-50 ${
                          selectedCity?.id === city.id ? "bg-teal-50" : ""
                        }`}
                        key={city.id}
                        onClick={() => {
                          setSelectedCity(city)
                          setCityQuery(`${city.name}, ${city.country}`)
                        }}
                        type="button"
                      >
                        {city.name}, {city.country} - cost {city.cost_index}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Custom city name</label>
                  <input
                    className="mt-1 w-full rounded border px-3 py-2"
                    name="cityName"
                    onChange={updateStopField}
                    placeholder="Use if city is not listed"
                    value={stopForm.cityName}
                  />
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input
                      className="rounded border px-3 py-2"
                      name="arrivalDate"
                      onChange={updateStopField}
                      type="date"
                      value={stopForm.arrivalDate}
                    />
                    <input
                      className="rounded border px-3 py-2"
                      name="departureDate"
                      onChange={updateStopField}
                      type="date"
                      value={stopForm.departureDate}
                    />
                  </div>
                </div>
              </div>
              <button className="mt-4 rounded bg-teal-700 px-4 py-2 text-white">
                Add Stop
              </button>
            </form>

            <section className="rounded border bg-white p-5">
              <h2 className="text-xl font-semibold">Itinerary</h2>
              <div className="mt-4 space-y-4">
                {stops.length === 0 && (
                  <p className="text-sm text-slate-600">Add stops to build your route.</p>
                )}
                {stops.map((stop, index) => {
                  const activityForm = activityForms[stop.id] || {
                    name: "",
                    category: "misc",
                    cost: "",
                    durationHours: "",
                  }

                  return (
                    <article className="rounded border p-4" key={stop.id}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-teal-700">
                            Stop {index + 1}
                          </p>
                          <h3 className="text-lg font-semibold">
                            {stop.display_city || stop.city_name}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {stop.country || "Custom city"} - {stop.arrival_date || "No arrival"} to {stop.departure_date || "No departure"}
                          </p>
                        </div>
                        <button
                          className="rounded border px-3 py-2 text-sm text-red-700"
                          onClick={() => deleteStop(stop.id)}
                          type="button"
                        >
                          Delete stop
                        </button>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium">Activities</h4>
                        <div className="mt-2 space-y-2">
                          {stop.activities.map((activity) => (
                            <div
                              className="flex flex-wrap items-center justify-between gap-2 rounded bg-slate-50 px-3 py-2 text-sm"
                              key={activity.id}
                            >
                              <span>
                                {activity.name} - {activity.category} - ${Number(activity.cost || 0).toFixed(0)}
                              </span>
                              <button
                                className="text-red-700"
                                onClick={() => deleteActivity(activity.id)}
                                type="button"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {quickActivities.map((activity) => (
                            <button
                              className="rounded border px-3 py-1 text-sm"
                              key={activity.name}
                              onClick={() => addActivity(stop.id, activity)}
                              type="button"
                            >
                              + {activity.name}
                            </button>
                          ))}
                        </div>

                        <div className="mt-3 grid gap-2 md:grid-cols-5">
                          <input
                            className="rounded border px-3 py-2 md:col-span-2"
                            onChange={(event) => updateActivityForm(stop.id, "name", event.target.value)}
                            placeholder="Activity name"
                            value={activityForm.name}
                          />
                          <input
                            className="rounded border px-3 py-2"
                            onChange={(event) => updateActivityForm(stop.id, "category", event.target.value)}
                            placeholder="Category"
                            value={activityForm.category}
                          />
                          <input
                            className="rounded border px-3 py-2"
                            onChange={(event) => updateActivityForm(stop.id, "cost", event.target.value)}
                            placeholder="Cost"
                            type="number"
                            value={activityForm.cost}
                          />
                          <button
                            className="rounded bg-slate-900 px-3 py-2 text-white"
                            onClick={() => addActivity(stop.id)}
                            type="button"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          </section>

          <aside className="space-y-6">
            <section className="rounded border bg-white p-5">
              <h2 className="text-xl font-semibold">Budget</h2>
              <p className="mt-3 text-sm text-slate-600">Activity total</p>
              <p className="text-3xl font-bold">${Number(budget.activityTotal || 0).toFixed(0)}</p>
              <p className="mt-3 text-sm text-slate-600">City cost estimate</p>
              <p className="text-2xl font-bold">${Number(budget.estimatedDailyBase || 0).toFixed(0)}</p>
              <p className="mt-3 text-sm text-slate-600">Estimated total</p>
              <p className="text-3xl font-bold text-teal-700">
                ${Number(budget.estimatedTotal || 0).toFixed(0)}
              </p>
            </section>

            <section className="rounded border bg-white p-5">
              <h2 className="text-xl font-semibold">Packing</h2>
              <form className="mt-4 grid gap-2" onSubmit={addPacking}>
                <input
                  className="rounded border px-3 py-2"
                  onChange={(event) => setPackingForm({ ...packingForm, name: event.target.value })}
                  placeholder="Passport, charger..."
                  required
                  value={packingForm.name}
                />
                <input
                  className="rounded border px-3 py-2"
                  onChange={(event) => setPackingForm({ ...packingForm, category: event.target.value })}
                  placeholder="documents"
                  value={packingForm.category}
                />
                <button className="rounded bg-slate-900 px-3 py-2 text-white">
                  Add item
                </button>
              </form>
              <div className="mt-4 space-y-2">
                {packingItems.map((item) => (
                  <div className="flex items-center justify-between gap-2 text-sm" key={item.id}>
                    <label className="flex items-center gap-2">
                      <input
                        checked={item.is_packed}
                        onChange={() => togglePacking(item)}
                        type="checkbox"
                      />
                      <span className={item.is_packed ? "line-through" : ""}>
                        {item.name} ({item.category})
                      </span>
                    </label>
                    <button className="text-red-700" onClick={() => deletePacking(item.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded border bg-white p-5">
              <h2 className="text-xl font-semibold">Notes</h2>
              <form className="mt-4 grid gap-2" onSubmit={addNote}>
                <select
                  className="rounded border px-3 py-2"
                  onChange={(event) => setNoteForm({ ...noteForm, stopId: event.target.value })}
                  value={noteForm.stopId}
                >
                  <option value="">Whole trip</option>
                  {stops.map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop.display_city || stop.city_name}
                    </option>
                  ))}
                </select>
                <textarea
                  className="min-h-24 rounded border px-3 py-2"
                  onChange={(event) => setNoteForm({ ...noteForm, content: event.target.value })}
                  placeholder="Hotel check-in, reminders, contacts..."
                  required
                  value={noteForm.content}
                />
                <button className="rounded bg-slate-900 px-3 py-2 text-white">
                  Add note
                </button>
              </form>
              <div className="mt-4 space-y-3">
                {notes.map((note) => (
                  <article className="rounded bg-slate-50 p-3 text-sm" key={note.id}>
                    <p>{note.content}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date(note.created_at).toLocaleString()}</span>
                      <button className="text-red-700" onClick={() => deleteNote(note.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}
