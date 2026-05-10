"use client";
import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, Share2, Copy, Star, Clock, ArrowLeft, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PUBLIC_TRIP = {
  name: "Europe Backpacking",
  author: "Joy Sharma",
  dates: "Jun 10 – Jun 28",
  cities: 5,
  budget: "$2,400",
  description: "An amazing 18-day journey through the heart of Europe — Paris, Rome, Barcelona, Amsterdam and Prague!",
  img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=900&q=80",
  stops: [
    { city: "Paris",     country: "France",      days: 4, activities: ["Eiffel Tower", "Louvre Museum", "Seine Cruise"] },
    { city: "Rome",      country: "Italy",       days: 5, activities: ["Colosseum", "Vatican Museums", "Trevi Fountain"] },
    { city: "Barcelona", country: "Spain",       days: 5, activities: ["Sagrada Familia", "Park Güell", "Las Ramblas"] },
    { city: "Amsterdam", country: "Netherlands", days: 2, activities: ["Anne Frank House", "Canal Tour"] },
    { city: "Prague",    country: "Czech Rep.",  days: 2, activities: ["Old Town Square", "Prague Castle"] },
  ],
};

export default function PublicTripPage() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Minimal header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-violet-100/50 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Globe size={13} className="text-white" />
          </div>
          <span className="text-violet-900 font-bold text-sm">Traveloop</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-700 text-xs font-semibold rounded-xl hover:bg-violet-100 transition-colors">
            <Copy size={12} /> {copied ? "Copied!" : "Copy Link"}
          </button>
          <Link href="/signup"
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold rounded-xl hover:shadow-md hover:shadow-violet-200 transition-all">
            Use Template
          </Link>
        </div>
      </header>

      {/* Hero image */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img src={PUBLIC_TRIP.img} alt={PUBLIC_TRIP.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-4 sm:left-8">
          <p className="text-white/70 text-xs mb-1">Shared by {PUBLIC_TRIP.author}</p>
          <h1 className="text-white font-extrabold text-3xl sm:text-4xl mb-2">{PUBLIC_TRIP.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-white/80 text-xs">
              <Calendar size={12} /> {PUBLIC_TRIP.dates}
            </span>
            <span className="flex items-center gap-1.5 text-white/80 text-xs">
              <MapPin size={12} /> {PUBLIC_TRIP.cities} cities
            </span>
            <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold">
              <DollarSign size={12} /> {PUBLIC_TRIP.budget}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-violet-50 p-6">
          <h2 className="font-bold text-gray-900 mb-2">About This Trip</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{PUBLIC_TRIP.description}</p>
        </motion.div>

        {/* Itinerary stops */}
        <div>
          <h2 className="font-bold text-gray-900 mb-4">Itinerary</h2>
          <div className="space-y-4">
            {PUBLIC_TRIP.stops.map((stop, i) => (
              <motion.div key={stop.city}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-violet-50 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">{stop.city}</h3>
                      <span className="text-gray-400 text-xs">{stop.country}</span>
                      <span className="flex items-center gap-1 text-violet-500 text-xs font-medium bg-violet-50 px-2 py-0.5 rounded-full">
                        <Clock size={10} /> {stop.days} days
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {stop.activities.map((act) => (
                        <span key={act} className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-center">
          <p className="text-white font-bold text-xl mb-1">Love this trip?</p>
          <p className="text-violet-100/70 text-sm mb-5">Use it as a template and customize it for yourself</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 font-semibold px-6 py-3 rounded-2xl hover:bg-violet-50 hover:scale-105 transition-all text-sm shadow-lg">
              <Copy size={14} /> Copy This Trip
            </Link>
            <button onClick={copyLink}
              className="inline-flex items-center justify-center gap-2 bg-white/20 border border-white/25 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white/30 transition-all text-sm">
              <Share2 size={14} /> Share
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}