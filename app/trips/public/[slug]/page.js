"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import PlanzoLogo from "@/components/PlanzoLogo"
import {
  Calendar,
  Clock,
  Copy,
  DollarSign,
  Globe,
  MapPin,
  Share2,
} from "lucide-react"

function formatDate(value, fallback) {
  if (!value) return fallback

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function PublicTripPage() {
  const router = useRouter()
  const { slug } = useParams()

  const [data, setData] = useState(null)
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/trips/public/${slug}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json)
        } else {
          setMessage(json.message || "Trip not found")
        }
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
      }),
    })

    const json = await res.json()

    if (!json.success) {
      setMessage(json.message || "Could not copy trip")
      return
    }

    router.push(`/trips/${json.trip.id}`)
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center max-w-md w-full">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 mx-auto mb-4 flex items-center justify-center">
            <Globe className="text-violet-600" size={24} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Public Trip
          </h2>

          <p className="text-sm text-gray-500">
            {message || "Loading itinerary..."}
          </p>
        </div>
      </main>
    )
  }

  const { trip, stops, budget } = data

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-violet-100/50 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <PlanzoLogo className="h-16 w-auto" />
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-700 text-xs font-semibold rounded-xl hover:bg-violet-100 transition"
          >
            <Copy size={12} />
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <button
            onClick={copyTrip}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold rounded-xl hover:shadow-md hover:shadow-violet-200 transition-all"
          >
            Use Template
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-700">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-violet-100/70 text-sm mb-2">
              Shared by {trip.owner_name}
            </p>

            <h1 className="text-white text-4xl sm:text-5xl font-extrabold max-w-3xl leading-tight">
              {trip.name}
            </h1>

            <p className="text-violet-100/80 mt-4 max-w-2xl text-sm sm:text-base leading-relaxed">
              {trip.description || "No description provided."}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <span className="flex items-center gap-2 text-white/80 text-sm">
                <Calendar size={14} />
                {formatDate(trip.start_date, "No start")} →{" "}
                {formatDate(trip.end_date, "No end")}
              </span>

              <span className="flex items-center gap-2 text-white/80 text-sm">
                <MapPin size={14} />
                {stops.length} stops
              </span>

              <span className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                <DollarSign size={14} />$
                {Number(
                  budget.activityTotal || 0
                ).toFixed(0)}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Error Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {message}
          </motion.div>
        )}

        {/* Summary */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-violet-50 p-6"
        >
          <h2 className="font-bold text-gray-900 mb-3">
            Trip Summary
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-1">
                Travel Dates
              </p>

              <p className="text-sm font-semibold text-gray-800">
                {formatDate(trip.start_date, "No start")} →{" "}
                {formatDate(trip.end_date, "No end")}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-1">
                Destinations
              </p>

              <p className="text-sm font-semibold text-gray-800">
                {stops.length} Stops
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-1">
                Estimated Budget
              </p>

              <p className="text-sm font-semibold text-gray-800">
                $
                {Number(
                  budget.activityTotal || 0
                ).toFixed(0)}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Stops */}
        <section>
          <h2 className="font-bold text-gray-900 mb-4 text-xl">
            Itinerary
          </h2>

          <div className="space-y-4">
            {stops.map((stop, index) => (
              <motion.article
                key={stop.id}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-3xl border border-violet-50 p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Number */}
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {stop.display_city || stop.city_name}
                      </h3>

                      <span className="text-xs text-gray-400">
                        {stop.country || "Custom city"}
                      </span>

                      <span className="flex items-center gap-1 text-violet-600 text-xs font-medium bg-violet-50 px-2 py-1 rounded-full">
                        <Clock size={10} />
                        {stop.arrival_date || "No arrival"} →{" "}
                        {stop.departure_date || "No departure"}
                      </span>
                    </div>

                    {/* Activities */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {stop.activities.length === 0 && (
                        <span className="text-xs text-gray-400">
                          No activities listed
                        </span>
                      )}

                      {stop.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="bg-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-700"
                        >
                          {activity.name} •{" "}
                          {activity.category} • $
                          {Number(activity.cost || 0).toFixed(0)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-center"
        >
          <h2 className="text-white text-2xl font-bold mb-2">
            Love this itinerary?
          </h2>

          <p className="text-violet-100/80 text-sm mb-6">
            Copy this trip and customize it for your own adventure.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={copyTrip}
              className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 font-semibold px-6 py-3 rounded-2xl hover:bg-violet-50 hover:scale-105 transition-all text-sm shadow-lg"
            >
              <Copy size={14} />
              Copy This Trip
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white/30 transition-all text-sm"
            >
              <Share2 size={14} />
              Share Trip
            </button>
          </div>
        </motion.section>
      </div>
    </main>
  )
}
