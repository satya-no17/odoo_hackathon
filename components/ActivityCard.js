"use client";
import { motion } from "framer-motion";
import { Clock, DollarSign, Star, Plus, Check } from "lucide-react";
import { useState } from "react";

export default function ActivityCard({ activity, delay = 0 }) {
  const [added, setAdded] = useState(false);
  const { name, type, duration, cost, rating, description, img } = activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="bg-white rounded-3xl border border-violet-50 shadow-sm hover:shadow-lg hover:shadow-violet-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
    >
      {/* Image */}
      {img && (
        <div className="relative h-36 overflow-hidden">
          <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm border border-white/25 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {type}
          </span>
        </div>
      )}

      <div className="p-4">
        <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{name}</h4>
        <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={11} className="text-violet-400" /> {duration}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-violet-600">
            <DollarSign size={11} /> {cost}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Star size={11} className="fill-amber-400 stroke-amber-400" /> {rating}
          </span>
        </div>

        <button
          onClick={() => setAdded(!added)}
          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
            added
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-200 hover:scale-[1.02]"
          }`}
        >
          {added ? <><Check size={14} /> Added</> : <><Plus size={14} /> Add to Trip</>}
        </button>
      </div>
    </motion.div>
  );
}