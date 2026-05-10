"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import TripCard from "@/components/TripCard";
import Navbar from "@/components/Navbar";

const ALL_TRIPS = [
  { id: 1, name: "Europe Backpacking",   dates: "Jun 10 – Jun 28", destinations: 5, status: "Upcoming",  budget: "$2,400", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80" },
  { id: 2, name: "Bali Retreat",          dates: "Jul 5 – Jul 12",  destinations: 3, status: "Upcoming",  budget: "$1,100", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" },
  { id: 3, name: "Japan Cherry Blossom",  dates: "Apr 1 – Apr 14",  destinations: 4, status: "Completed", budget: "$3,200", img: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=400&q=80" },
  { id: 4, name: "Morocco Desert Tour",   dates: "Aug 20 – Aug 30", destinations: 3, status: "Upcoming",  budget: "$900",   img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400&q=80" },
  { id: 5, name: "New York City Weekend", dates: "Mar 5 – Mar 8",   destinations: 1, status: "Completed", budget: "$800",   img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80" },
  { id: 6, name: "Thailand Temples",      dates: "Sep 1 – Sep 15",  destinations: 4, status: "Upcoming",  budget: "$1,500", img: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=80" },
];

const FILTERS = ["All", "Upcoming", "Completed", "Ongoing"];

export default function TripsPage() {
  const [search,    setSearch]    = useState("");
  const [activeFilter, setFilter] = useState("All");
  const [trips, setTrips]         = useState(ALL_TRIPS);

  const handleDelete = (id) => setTrips((p) => p.filter((t) => t.id !== id));

  const visible = trips.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "All" || t.status === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">My Trips ✈️</h1>
            <p className="text-violet-100/70 text-sm">All your travel plans in one place</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">

        {/* Search + Filter bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-violet-50 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trips..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-300 transition-all" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === f
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
                    : "text-gray-500 bg-gray-50 hover:bg-violet-50 hover:text-violet-700"
                }`}>
                {f}
              </button>
            ))}
          </div>
          <Link href="/trips/new"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl hover:shadow-lg hover:shadow-violet-200 hover:scale-105 transition-all duration-300 whitespace-nowrap shrink-0">
            <Plus size={15} /> New Trip
          </Link>
        </motion.div>

        {/* Count */}
        <p className="text-gray-400 text-sm mb-4">{visible.length} trip{visible.length !== 1 ? "s" : ""} found</p>

        {/* Grid */}
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDelete} delay={i * 0.07} />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center mb-4">
              <SlidersHorizontal size={32} className="text-violet-300" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">No trips found</h3>
            <p className="text-gray-400 text-sm mb-6">Try a different filter or create a new trip</p>
            <Link href="/trips/new"
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-violet-200 transition-all">
              <Plus size={15} /> Create First Trip
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}