"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Eye,
  Pencil,
} from "lucide-react"

export default function TripsPage() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [trips, setTrips] = useState([])
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")

  const FILTERS = ["All", "Upcoming", "Completed"]

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

    await fetch(`/api/trips/${id}`, {
      method: "DELETE",
    })

    if (user) {
      loadTrips(user.id)
    }
  }

  function getStatus(trip) {
    if (!trip.start_date || !trip.end_date) return "Upcoming"

    const now = new Date()
    const start = new Date(trip.start_date)
    const end = new Date(trip.end_date)

    if (end < now) return "Completed"
    if (start <= now && end >= now) return "Ongoing"

    return "Upcoming"
  }

  function formatDate(value, fallback) {
    if (!value) return fallback

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const visibleTrips = trips.filter((trip) => {
    const matchesSearch = trip.name
      ?.toLowerCase()
      .includes(search.toLowerCase())

    const status = getStatus(trip)

    const matchesFilter =
      activeFilter === "All" || status === activeFilter

    return matchesSearch && matchesFilter
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/dashboard"
              className="text-violet-100 text-sm hover:text-white transition"
            >
              ← Back to dashboard
            </Link>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
              My Trips ✈️
            </h1>

            <p className="text-violet-100/80 text-sm mt-2">
              Manage all your travel itineraries in one place
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-violet-50 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trips..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-300 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
                    : "text-gray-500 bg-gray-50 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* New Trip */}
          <Link
            href="/trips/create"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl hover:shadow-lg hover:shadow-violet-200 hover:scale-105 transition-all duration-300 whitespace-nowrap"
          >
            <Plus size={15} />
            Plan New Trip
          </Link>
        </motion.div>

        {/* Count */}
        <p className="text-gray-400 text-sm mb-4">
          {visibleTrips.length} trip
          {visibleTrips.length !== 1 ? "s" : ""} found
        </p>

        {/* Trips Grid */}
        {visibleTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {visibleTrips.map((trip, index) => {
              const status = getStatus(trip)

              return (
                <motion.article
                  key={trip.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Top */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {trip.name}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          {trip.description || "No description"}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : status === "Ongoing"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-violet-100 text-violet-700"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="mt-5 space-y-2 text-sm text-gray-500">
                      <p>
                        📅 {formatDate(trip.start_date, "No start date")} →{" "}
                        {formatDate(trip.end_date, "No end date")}
                      </p>

                      <p>
                        📍 {trip.stop_count || 0} stops
                      </p>

                      <p>
                        💰 $
                        {Number(
                          trip.activity_total || 0
                        ).toFixed(0)}{" "}
                        activity cost
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Link
                        href={`/trips/${trip.id}`}
                        className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Pencil size={15} />
                        Edit
                      </Link>

                      <Link
                        href={`/trips/public/${trip.id}`}
                        className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Eye size={15} />
                        Public
                      </Link>

                      <button
                        onClick={() => deleteTrip(trip.id)}
                        className="flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center mb-4">
              <SlidersHorizontal
                size={32}
                className="text-violet-300"
              />
            </div>

            <h3 className="font-bold text-gray-800 mb-2">
              No trips found
            </h3>

            <p className="text-gray-400 text-sm mb-6">
              Try another search or create your first trip
            </p>

            <Link
              href="/trips/create"
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-violet-200 transition-all"
            >
              <Plus size={15} />
              Create First Trip
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  )
}
