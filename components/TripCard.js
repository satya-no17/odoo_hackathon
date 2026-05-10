"use client";
import { motion } from "framer-motion";
import { Calendar, MapPin, DollarSign, ArrowRight, Trash2, Pencil } from "lucide-react";
import Link from "next/link";

function Badge({ status }) {
  const s = {
    Upcoming:  "bg-violet-100 text-violet-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Ongoing:   "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${s[status] || s.Upcoming}`}>
      {status}
    </span>
  );
}

export default function TripCard({ trip, onDelete, delay = 0 }) {
  const { id, name, dates, destinations, status, budget, img } = trip;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className="group bg-white rounded-3xl border border-violet-50 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          <Link href={`/trips/${id}/edit`}
            className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/25 hover:bg-white/40 transition-colors">
            <Pencil size={13} className="text-white" />
          </Link>
          {onDelete && (
            <button onClick={() => onDelete(id)}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/25 hover:bg-red-500/60 transition-colors">
              <Trash2 size={13} className="text-white" />
            </button>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge status={status} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-2 truncate">{name}</h3>
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Calendar size={12} className="text-violet-400" /> {dates}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <MapPin size={12} className="text-violet-400" /> {destinations} cities
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-600">
            <DollarSign size={12} /> {budget}
          </div>
        </div>
        <Link href={`/trips/${id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-2xl hover:shadow-lg hover:shadow-violet-200 hover:scale-[1.02] transition-all duration-300">
          View Trip <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}