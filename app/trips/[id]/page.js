"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, MapPin, Calendar, DollarSign, List, LayoutGrid,
  ArrowLeft, Share2, Download, ChevronDown, ChevronUp, Clock, Star
} from "lucide-react";
import Link from "next/link";
import StopCard from "@/components/StopCard";

const MOCK_TRIP = {
  id: 1,
  name: "Europe Backpacking",
  dates: "Jun 10 – Jun 28",
  totalBudget: 2400,
  spentBudget: 800,
  stops: [
    {
      id: 1, city: "Paris", country: "France",
      startDate: "Jun 10", endDate: "Jun 14",
      activities: [
        { name: "Eiffel Tower Visit", time: "10:00 AM", cost: 25 },
        { name: "Louvre Museum",      time: "2:00 PM",  cost: 17 },
        { name: "Seine River Cruise", time: "7:00 PM",  cost: 15 },
      ],
    },
    {
      id: 2, city: "Rome", country: "Italy",
      startDate: "Jun 14", endDate: "Jun 19",
      activities: [
        { name: "Colosseum Tour",  time: "9:00 AM",  cost: 20 },
        { name: "Vatican Museums", time: "2:00 PM",  cost: 35 },
      ],
    },
    {
      id: 3, city: "Barcelona", country: "Spain",
      startDate: "Jun 19", endDate: "Jun 24",
      activities: [],
    },
  ],
};

const BUDGET_BREAKDOWN = [
  { label: "Transport", amount: 420, color: "bg-violet-500",  pct: 52 },
  { label: "Stay",      amount: 240, color: "bg-indigo-400",  pct: 30 },
  { label: "Activities",amount: 100, color: "bg-purple-400",  pct: 13 },
  { label: "Meals",     amount: 40,  color: "bg-violet-300",  pct: 5  },
];

export default function ItineraryBuilderPage({ params }) {
  const [trip, setTrip]       = useState(MOCK_TRIP);
  const [view, setView]       = useState("list");   // list | budget
  const [showAddStop, setShowAddStop] = useState(false);
  const [newCity, setNewCity]         = useState({ city: "", country: "", startDate: "", endDate: "" });

  const addStop = () => {
    if (!newCity.city) return;
    setTrip((p) => ({
      ...p,
      stops: [...p.stops, { id: Date.now(), ...newCity, activities: [] }],
    }));
    setNewCity({ city: "", country: "", startDate: "", endDate: "" });
    setShowAddStop(false);
  };

  const deleteStop = (id) => setTrip((p) => ({ ...p, stops: p.stops.filter((s) => s.id !== id) }));

  const spentPct = Math.round((trip.spentBudget / trip.totalBudget) * 100);

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-violet-100/60 sticky top-0 z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/trips"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors">
              <ArrowLeft size={17} />
            </Link>
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight">{trip.name}</h1>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <Calendar size={10} /> {trip.dates}
                <span>·</span>
                <MapPin size={10} /> {trip.stops.length} stops
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors">
              <Share2 size={16} />
            </button>
            <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-2xl hover:shadow-lg hover:shadow-violet-200 transition-all">
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── View toggle ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">{trip.stops.length} stops planned</p>
          <div className="flex bg-white border border-violet-100 rounded-2xl p-1 gap-1">
            {[
              { key: "list",   icon: List },
              { key: "budget", icon: DollarSign },
            ].map(({ key, icon: Icon }) => (
              <button key={key} onClick={() => setView(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  view === key
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-violet-600"
                }`}>
                <Icon size={14} /> {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── LIST VIEW ── */}
        {view === "list" && (
          <div className="space-y-4">
            {trip.stops.map((stop, i) => (
              <StopCard key={stop.id} stop={stop} index={i} onDelete={deleteStop} />
            ))}

            {/* Add stop */}
            <AnimatePresence>
              {showAddStop && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-3xl border border-violet-100 p-5 space-y-3"
                >
                  <h4 className="font-semibold text-gray-800 text-sm">Add New Stop</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "city",      placeholder: "City name",   label: "City" },
                      { key: "country",   placeholder: "Country",     label: "Country" },
                      { key: "startDate", placeholder: "Jun 10",      label: "Start Date" },
                      { key: "endDate",   placeholder: "Jun 14",      label: "End Date" },
                    ].map(({ key, placeholder, label }) => (
                      <div key={key}>
                        <p className="text-xs text-gray-400 mb-1 font-medium">{label}</p>
                        <input value={newCity[key]}
                          onChange={(e) => setNewCity((p) => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-300 transition-all" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button onClick={() => setShowAddStop(false)}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-2xl hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={addStop}
                      className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-2xl hover:shadow-lg hover:shadow-violet-200 transition-all">
                      Add Stop
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button onClick={() => setShowAddStop(true)}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-3xl border-2 border-dashed border-violet-200 text-violet-500 text-sm font-medium hover:bg-violet-50 hover:border-violet-400 transition-all duration-300">
              <Plus size={16} /> Add Another Stop
            </button>
          </div>
        )}

        {/* ── BUDGET VIEW ── */}
        {view === "budget" && (
          <div className="space-y-5">
            {/* Summary card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 text-white">
              <p className="text-violet-100/70 text-sm mb-1">Total Budget</p>
              <p className="text-4xl font-extrabold mb-1">${trip.totalBudget.toLocaleString()}</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-violet-100/70">Spent: <span className="text-white font-semibold">${trip.spentBudget}</span></span>
                <span className="text-violet-100/70">Remaining: <span className="text-white font-semibold">${trip.totalBudget - trip.spentBudget}</span></span>
              </div>
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${spentPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <p className="text-violet-100/60 text-xs mt-1">{spentPct}% used</p>
            </motion.div>

            {/* Breakdown */}
            <div className="bg-white rounded-3xl border border-violet-50 p-6">
              <h3 className="font-bold text-gray-900 mb-5">Cost Breakdown</h3>
              <div className="space-y-4">
                {BUDGET_BREAKDOWN.map(({ label, amount, color, pct }, i) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <span className="text-sm font-bold text-violet-600">${amount}</span>
                    </div>
                    <div className="h-2 bg-violet-50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
                        className={`h-full ${color} rounded-full`}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">{pct}% of total</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Per day avg */}
            <div className="bg-white rounded-3xl border border-violet-50 p-6">
              <h3 className="font-bold text-gray-900 mb-3">Per Day Average</h3>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-extrabold text-violet-700">$44</p>
                <p className="text-gray-400 text-sm mb-1">/ day</p>
              </div>
              <p className="text-gray-400 text-xs mt-1">Based on 18 days of travel</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}