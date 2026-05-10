"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import PlanzoLogo from "@/components/PlanzoLogo"

import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Compass,
  FileText,
  MapPin,
  Sparkles,
} from "lucide-react"

const steps = ["Basic Info", "Dates", "Details"]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
    },
  }),
}

export default function CreateTripPage() {
  const router = useRouter()

  const [user, setUser] = useState(null)

  const [step, setStep] = useState(0)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  })

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
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  function canContinue() {
    if (step === 0) {
      return form.name.trim().length > 0
    }

    if (step === 1) {
      return form.startDate && form.endDate
    }

    return true
  }

  async function handleSubmit() {
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          userId: user.id,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setMessage(data.message || "Could not create trip")
        setLoading(false)
        return
      }

      router.push(`/trips/${data.trip.id}`)
    } catch {
      setMessage("Something went wrong")
    }

    setLoading(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-violet-300 border-t-transparent animate-spin" />

          <p className="text-xs tracking-widest uppercase text-violet-400 font-bold">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f3ff] overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-violet-300/20 blur-[120px]" />
        <div className="absolute top-[35%] -right-24 w-[340px] h-[340px] rounded-full bg-indigo-300/20 blur-[100px]" />
        <div className="absolute bottom-0 left-[30%] w-[280px] h-[280px] rounded-full bg-sky-200/20 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-violet-100 px-6 py-4 flex items-center justify-between">
        <Link
          href="/trips"
          className="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition"
        >
          <ArrowLeft size={18} />
          <span className="font-semibold text-sm">
            Back to trips
          </span>
        </Link>

        <Link href="/" className="flex items-center">
          <PlanzoLogo className="h-16 w-auto" />
        </Link>

        <div className="text-xs text-violet-400 font-semibold">
          Step {step + 1} of 3
        </div>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full mb-4">
            <Sparkles size={12} />
            Plan Your Next Adventure
          </div>

          <h1 className="text-4xl font-black text-indigo-950 leading-tight">
            Create Your
            <br />
            <span className="text-violet-600">
              Dream Trip
            </span>
          </h1>

          <p className="text-sm text-gray-500 mt-3">
            Start building your perfect itinerary.
          </p>
        </motion.div>

        {/* Stepper */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="flex items-center justify-center mb-8"
        >
          {steps.map((label, index) => (
            <div key={label} className="flex items-center">
              <button
                onClick={() => index < step && setStep(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  index === step
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-300"
                    : index < step
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-white text-gray-400"
                }`}
              >
                {index < step ? (
                  <Check size={12} />
                ) : (
                  <span>{index + 1}</span>
                )}

                {label}
              </button>

              {index < steps.length - 1 && (
                <div
                  className={`w-6 h-0.5 mx-2 rounded ${
                    index < step
                      ? "bg-violet-500"
                      : "bg-violet-100"
                  }`}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="bg-white/90 backdrop-blur-xl rounded-[32px] border border-violet-100 shadow-[0_12px_50px_rgba(109,93,230,0.08)] p-6 md:p-8"
          >
            {/* Step 1 */}
            {step === 0 && (
              <div className="space-y-6">
                <SectionHeader
                  icon={<MapPin size={18} />}
                  title="Trip Name"
                />

                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  required
                  placeholder="e.g. Bali Escape 2026"
                  className="w-full rounded-2xl bg-violet-50 border border-violet-100 px-4 py-3 text-sm font-medium text-indigo-950 placeholder:text-violet-300 outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-300 transition-all"
                />

                <div>
                  <SectionHeader
                    icon={<FileText size={18} />}
                    title="Quick Description"
                    subtitle="Optional"
                  />

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={updateField}
                    rows={5}
                    placeholder="Tell us about your trip..."
                    className="w-full rounded-2xl bg-violet-50 border border-violet-100 px-4 py-3 text-sm font-medium text-indigo-950 placeholder:text-violet-300 outline-none resize-none focus:ring-4 focus:ring-violet-100 focus:border-violet-300 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div className="space-y-6">
                <SectionHeader
                  icon={<Calendar size={18} />}
                  title="Travel Dates"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <DateField
                    label="Start Date"
                    value={form.startDate}
                    onChange={(value) =>
                      setForm({
                        ...form,
                        startDate: value,
                      })
                    }
                  />

                  <DateField
                    label="End Date"
                    value={form.endDate}
                    min={form.startDate}
                    onChange={(value) =>
                      setForm({
                        ...form,
                        endDate: value,
                      })
                    }
                  />
                </div>

                {form.startDate && form.endDate && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-violet-100 rounded-2xl p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                      <Calendar
                        size={18}
                        className="text-white"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-violet-500 font-medium">
                        Trip Duration
                      </p>

                      <p className="text-sm font-bold text-indigo-950">
                        {Math.max(
                          1,
                          Math.ceil(
                            (new Date(form.endDate) -
                              new Date(form.startDate)) /
                              86400000
                          )
                        )}{" "}
                        days
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <div className="space-y-6">
                <SectionHeader
                  icon={<Compass size={18} />}
                  title="Ready to Launch"
                />

                <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-6 text-white">
                  <p className="text-xs uppercase tracking-widest text-violet-100 mb-2">
                    Trip Summary
                  </p>

                  <h2 className="text-2xl font-black">
                    {form.name || "Untitled Trip"}
                  </h2>

                  <p className="text-sm text-violet-100 mt-2">
                    {form.description ||
                      "No description added."}
                  </p>

                  {(form.startDate || form.endDate) && (
                    <p className="mt-4 text-sm font-medium text-violet-50">
                      {form.startDate || "No start"} →{" "}
                      {form.endDate || "No end"}
                    </p>
                  )}
                </div>

                {message && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {message}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Buttons */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="flex items-center justify-between gap-4 mt-6"
        >
          <button
            onClick={() =>
              setStep((prev) => Math.max(0, prev - 1))
            }
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-violet-200 text-violet-600 font-semibold text-sm hover:bg-violet-50 transition disabled:opacity-30"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() =>
                canContinue() &&
                setStep((prev) => prev + 1)
              }
              disabled={!canContinue()}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 shadow-lg shadow-violet-300 transition disabled:opacity-40"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-violet-300 hover:opacity-90 transition disabled:opacity-50"
            >
              <Compass size={16} />

              {loading
                ? "Creating Trip..."
                : "Create Trip"}
            </button>
          )}
        </motion.div>
      </div>
    </main>
  )
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-violet-600">{icon}</div>

      <h2 className="font-bold text-indigo-950">
        {title}
      </h2>

      {subtitle && (
        <span className="text-xs text-gray-400">
          ({subtitle})
        </span>
      )}
    </div>
  )
}

function DateField({
  label,
  value,
  min,
  onChange,
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-violet-400 mb-2">
        {label}
      </label>

      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-violet-50 border border-violet-100 px-4 py-3 text-sm font-medium text-indigo-950 outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-300 transition-all"
      />
    </div>
  )
}
