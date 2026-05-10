"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, RotateCcw, CheckCircle2, Circle } from "lucide-react";

const CATEGORIES = ["Documents", "Clothing", "Electronics", "Toiletries", "Other"];

const DEFAULT_ITEMS = [
  { id: 1, name: "Passport",        category: "Documents",   packed: false },
  { id: 2, name: "Flight Tickets",  category: "Documents",   packed: false },
  { id: 3, name: "Travel Insurance",category: "Documents",   packed: false },
  { id: 4, name: "Casual Shirts",   category: "Clothing",    packed: false },
  { id: 5, name: "Jeans / Pants",   category: "Clothing",    packed: false },
  { id: 6, name: "Phone Charger",   category: "Electronics", packed: false },
  { id: 7, name: "Power Adapter",   category: "Electronics", packed: false },
];

export default function PackingList() {
  const [items, setItems]       = useState(DEFAULT_ITEMS);
  const [newItem, setNewItem]   = useState("");
  const [newCat, setNewCat]     = useState("Other");
  const [activeTab, setActiveTab] = useState("All");

  const toggle   = (id) => setItems((p) => p.map((i) => i.id === id ? { ...i, packed: !i.packed } : i));
  const remove   = (id) => setItems((p) => p.filter((i) => i.id !== id));
  const reset    = ()   => setItems((p) => p.map((i) => ({ ...i, packed: false })));
  const addItem  = ()   => {
    if (!newItem.trim()) return;
    setItems((p) => [...p, { id: Date.now(), name: newItem.trim(), category: newCat, packed: false }]);
    setNewItem("");
  };

  const tabs    = ["All", ...CATEGORIES];
  const visible = activeTab === "All" ? items : items.filter((i) => i.category === activeTab);
  const packed  = items.filter((i) => i.packed).length;
  const pct     = items.length ? Math.round((packed / items.length) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl border border-violet-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-violet-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-900">Packing Checklist</h3>
            <p className="text-gray-400 text-xs mt-0.5">{packed} of {items.length} items packed</p>
          </div>
          <button onClick={reset} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-violet-600 transition-colors px-3 py-1.5 rounded-xl hover:bg-violet-50">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
        {/* Progress */}
        <div className="h-2 bg-violet-50 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
          />
        </div>
        <p className="text-[11px] text-violet-500 font-medium mt-1">{pct}% packed</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 px-4 py-3 border-b border-violet-50 overflow-x-auto scrollbar-none">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === t
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                : "text-gray-500 hover:bg-violet-50 hover:text-violet-700"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="px-4 py-3 space-y-1.5 max-h-72 overflow-y-auto">
        <AnimatePresence>
          {visible.map((item) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 ${
                item.packed ? "bg-violet-50/60 border-violet-100" : "bg-white border-gray-100"
              }`}
            >
              <button onClick={() => toggle(item.id)} className="shrink-0">
                {item.packed
                  ? <CheckCircle2 size={18} className="text-violet-500" />
                  : <Circle size={18} className="text-gray-300 hover:text-violet-400 transition-colors" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate transition-all ${item.packed ? "line-through text-gray-400" : "text-gray-800"}`}>
                  {item.name}
                </p>
                <p className="text-[11px] text-violet-400">{item.category}</p>
              </div>
              <button onClick={() => remove(item.id)}
                className="text-gray-200 hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {visible.length === 0 && (
          <p className="text-center text-gray-300 text-sm py-6">No items in this category</p>
        )}
      </div>

      {/* Add item */}
      <div className="px-4 pb-4 pt-2 border-t border-violet-50">
        <div className="flex gap-2">
          <select value={newCat} onChange={(e) => setNewCat(e.target.value)}
            className="bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2.5 text-xs text-gray-600 focus:outline-none focus:border-violet-300 shrink-0">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input value={newItem} onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Add new item..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-violet-300 transition-all" />
          <button onClick={addItem}
            className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white hover:shadow-lg hover:shadow-violet-200 transition-all shrink-0">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}