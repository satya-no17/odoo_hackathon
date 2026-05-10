"use client";
import { motion } from "framer-motion";
import { MapPin, Calendar, Trash2, GripVertical, Plus } from "lucide-react";

export default function StopCard({ stop, index, onDelete, onAddActivity }) {
  const { city, country, startDate, endDate, activities = [] } = stop;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-3xl border border-violet-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-violet-100">
        <div className="cursor-grab text-violet-300 hover:text-violet-500 transition-colors">
          <GripVertical size={18} />
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-violet-500 shrink-0" />
            <p className="font-bold text-gray-900 text-sm truncate">{city}</p>
            <span className="text-gray-400 text-xs">{country}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Calendar size={11} className="text-gray-400" />
            <p className="text-gray-400 text-xs">{startDate} → {endDate}</p>
          </div>
        </div>
        {onDelete && (
          <button onClick={() => onDelete(stop.id)}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Activities */}
      <div className="px-5 py-3 space-y-2">
        {activities.length === 0 ? (
          <p className="text-gray-300 text-xs text-center py-3">No activities added yet</p>
        ) : (
          activities.map((act, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 bg-violet-50/50 rounded-2xl">
              <div className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{act.name}</p>
                <p className="text-xs text-gray-400">{act.time} · ${act.cost}</p>
              </div>
            </div>
          ))
        )}
        <button
          onClick={() => onAddActivity && onAddActivity(stop.id)}
          className="flex items-center gap-2 w-full py-2 px-3 rounded-2xl border border-dashed border-violet-200 text-violet-500 text-xs font-medium hover:bg-violet-50 transition-colors mt-1"
        >
          <Plus size={13} /> Add Activity
        </button>
      </div>
    </motion.div>
  );
}