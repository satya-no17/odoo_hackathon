"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Map, Plus, List, User, Globe,
  CheckSquare, FileText, BarChart2, LogOut, Bell,
  Plane, MapPin, Star, ArrowRight, TrendingUp,
  Calendar, DollarSign, ChevronRight, Menu, X,
  Clock, Sparkles, Package
} from "lucide-react";
import Link from "next/link";

/* ── Sidebar nav items ── */
const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",       href: "/dashboard" },
  { icon: Map,             label: "My Trips",         href: "/trips" },
  { icon: Plus,            label: "Create Trip",      href: "/trips/new" },
  { icon: Globe,           label: "City Search",      href: "/search/cities" },
  { icon: List,            label: "Activity Search",  href: "/search/activities" },
  { icon: CheckSquare,     label: "Packing List",     href: "/packing" },
  { icon: FileText,        label: "Trip Notes",       href: "/notes" },
  { icon: BarChart2,       label: "Budget",           href: "/budget" },
  { icon: User,            label: "Profile",          href: "/profile" },
];

/* ── Mock data ── */
const RECENT_TRIPS = [
  { id: 1, name: "Europe Backpacking",  dates: "Jun 10 – Jun 28", destinations: 5, status: "Upcoming",  budget: "$2,400", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=300&q=80" },
  { id: 2, name: "Bali Retreat",        dates: "Jul 5 – Jul 12",  destinations: 3, status: "Upcoming",  budget: "$1,100", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80" },
  { id: 3, name: "Japan Cherry Blossom",dates: "Apr 1 – Apr 14",  destinations: 4, status: "Completed", budget: "$3,200", img: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=300&q=80" },
];

const RECOMMENDED = [
  { city: "Santorini",  country: "Greece",    rating: 4.9, price: "$499", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80" },
  { city: "Kyoto",      country: "Japan",     rating: 4.8, price: "$620", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80" },
  { city: "Amalfi",     country: "Italy",     rating: 4.7, price: "$540", img: "https://images.unsplash.com/photo-1534445967719-8ae7b972b1a5?w=400&q=80" },
  { city: "Queenstown", country: "NZ",        rating: 4.8, price: "$710", img: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&q=80" },
];

const STATS = [
  { icon: Map,         label: "Total Trips",     value: "3",     sub: "+1 this month",   color: "from-violet-500 to-violet-600" },
  { icon: DollarSign,  label: "Total Budget",    value: "$6.7k", sub: "Across all trips", color: "from-indigo-500 to-indigo-600" },
  { icon: MapPin,      label: "Cities Visited",  value: "12",    sub: "In 8 countries",   color: "from-purple-500 to-purple-600" },
  { icon: Calendar,    label: "Days Travelled",  value: "34",    sub: "This year",        color: "from-violet-400 to-indigo-500" },
];

/* ── Scroll reveal ── */
function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Status badge ── */
function Badge({ status }) {
  const styles = {
    Upcoming:  "bg-violet-100 text-violet-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Ongoing:   "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${styles[status] || styles.Upcoming}`}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav]     = useState("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ════════════════════════════════
          SIDEBAR — Desktop
      ════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-violet-100/60 fixed top-0 bottom-0 left-0 z-30">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-violet-50">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md shadow-violet-200">
              <Plane size={17} className="text-white" />
            </div>
            <div className="leading-none">
              <p className="text-violet-900 font-bold text-[15px]">Traveloop</p>
              <p className="text-violet-400 text-[10px]">Plan. Explore. Loop.</p>
            </div>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ icon: Icon, label, href }) => {
            const active = activeNav === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setActiveNav(href)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
                    : "text-gray-500 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                <Icon size={17} className={active ? "text-white" : "text-gray-400 group-hover:text-violet-500"} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User card bottom */}
        <div className="px-4 py-4 border-t border-violet-50">
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-50 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              J
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">name</p>
              <p className="text-[11px] text-gray-400 truncate">email@example.com</p>
            </div>
            <LogOut size={15} className="text-gray-300 hover:text-red-400 transition-colors shrink-0" />
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════
          MOBILE SIDEBAR DRAWER
      ════════════════════════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="px-6 py-5 border-b border-violet-50 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <Plane size={17} className="text-white" />
                  </div>
                  <p className="text-violet-900 font-bold text-[15px]">Traveloop</p>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV.map(({ icon: Icon, label, href }) => {
                  const active = activeNav === href;
                  return (
                    <Link key={href} href={href}
                      onClick={() => { setActiveNav(href); setSidebarOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                        active
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
                          : "text-gray-500 hover:bg-violet-50 hover:text-violet-700"
                      }`}
                    >
                      <Icon size={17} className={active ? "text-white" : "text-gray-400"} />
                      {label}
                    </Link>
                  );
                })}
              </nav>
              <div className="px-4 py-4 border-t border-violet-50">
                <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-50 cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">J</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">name</p>
                    <p className="text-[11px] text-gray-400">email@example.com</p>
                  </div>
                  <LogOut size={15} className="text-gray-300" />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════ */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">

        {/* ── Top navbar ── */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-violet-100/50 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-violet-50 text-violet-700"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900">Dashboard</h1>
              
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
            </button>
            <Link href="/trips/new"
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-2xl hover:shadow-lg hover:shadow-violet-200 hover:scale-105 transition-all duration-300">
              <Plus size={15} /> Plan New Trip
            </Link>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-8">

          {/* ── Welcome banner ── */}
          <Reveal>
            <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 rounded-3xl p-6 sm:p-8">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-violet-200" />
                    <span className="text-violet-200 text-xs font-medium">Sunday, May 10</span>
                  </div>
                  <h2 className="text-white font-bold text-2xl sm:text-3xl mb-1">Good morning, Joy! ✈️</h2>
                  <p className="text-violet-100/70 text-sm">You have 2 upcoming trips. Keep planning!</p>
                </div>
                <Link href="/trips/new"
                  className="shrink-0 flex items-center gap-2 bg-white text-violet-700 font-semibold text-sm px-5 py-3 rounded-2xl hover:bg-violet-50 hover:scale-105 transition-all duration-300 shadow-lg">
                  <Plus size={15} /> New Trip
                </Link>
              </div>
            </div>
          </Reveal>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ icon: Icon, label, value, sub, color }, i) => (
              <Reveal key={label} delay={i * 0.07}>
                <div className="bg-white rounded-2xl p-5 border border-violet-50 hover:shadow-lg hover:shadow-violet-100/50 hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-3 shadow-md`}>
                    <Icon size={17} className="text-white" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                  <p className="text-gray-500 text-xs font-medium mt-0.5">{label}</p>
                  <p className="text-violet-400 text-[11px] mt-1 flex items-center gap-1">
                    <TrendingUp size={10} /> {sub}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ── Recent Trips ── */}
          <Reveal delay={0.1}>
            <div className="bg-white rounded-3xl border border-violet-50 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-violet-50">
                <div>
                  <h3 className="font-bold text-gray-900">My Trips</h3>
                  <p className="text-gray-400 text-xs mt-0.5">All your travel plans</p>
                </div>
                <Link href="/trips" className="flex items-center gap-1 text-violet-600 text-sm font-semibold hover:gap-2 transition-all">
                  View all <ChevronRight size={15} />
                </Link>
              </div>

              <div className="divide-y divide-violet-50/60">
                {RECENT_TRIPS.map((trip, i) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-violet-50/40 transition-colors group cursor-pointer"
                  >
                    {/* Trip image */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                      <img src={trip.img} alt={trip.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm truncate">{trip.name}</p>
                        <Badge status={trip.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <Calendar size={11} /> {trip.dates}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <MapPin size={11} /> {trip.destinations} cities
                        </span>
                        <span className="flex items-center gap-1 text-violet-600 text-xs font-semibold">
                          <DollarSign size={11} /> {trip.budget}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <Link href={`/trips/${trip.id}`}
                      className="shrink-0 w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                      <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Add trip CTA */}
              <div className="px-6 py-4 border-t border-violet-50">
                <Link href="/trips/new"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-violet-200 text-violet-500 text-sm font-medium hover:bg-violet-50 hover:border-violet-400 transition-all duration-300">
                  <Plus size={16} /> Plan a new trip
                </Link>
              </div>
            </div>
          </Reveal>

          {/* ── Recommended Destinations ── */}
          <Reveal delay={0.15}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">Recommended for You</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Based on your travel history</p>
                </div>
                <Link href="/search/cities" className="flex items-center gap-1 text-violet-600 text-sm font-semibold hover:gap-2 transition-all">
                  Explore all <ChevronRight size={15} />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {RECOMMENDED.map((dest, i) => (
                  <motion.div
                    key={dest.city}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="group rounded-2xl overflow-hidden bg-white border border-violet-50 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img src={dest.img} alt={dest.city}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-2.5 left-3">
                        <p className="text-white font-bold text-sm">{dest.city}</p>
                        <p className="text-white/60 text-[10px]">{dest.country}</p>
                      </div>
                    </div>
                    <div className="px-3 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="fill-amber-400 stroke-amber-400" />
                        <span className="text-xs font-semibold text-gray-700">{dest.rating}</span>
                      </div>
                      <span className="text-violet-700 font-bold text-xs">From {dest.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── Budget Highlights ── */}
          <Reveal delay={0.2}>
            <div className="bg-white rounded-3xl border border-violet-50 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900">Budget Highlights</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Spending overview across trips</p>
                </div>
                <Link href="/budget" className="flex items-center gap-1 text-violet-600 text-sm font-semibold hover:gap-2 transition-all">
                  Full breakdown <ChevronRight size={15} />
                </Link>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Europe Backpacking", spent: 800,  total: 2400, color: "bg-violet-500" },
                  { label: "Bali Retreat",        spent: 200,  total: 1100, color: "bg-indigo-500" },
                  { label: "Japan Cherry Blossom",spent: 3200, total: 3200, color: "bg-purple-500" },
                ].map(({ label, spent, total, color }) => {
                  const pct = Math.round((spent / total) * 100);
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <span className="text-xs text-gray-400">${spent.toLocaleString()} / ${total.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-violet-50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                          className={`h-full ${color} rounded-full`}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">{pct}% used</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* ── Quick Actions ── */}
          <Reveal delay={0.25}>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Plus,        label: "New Trip",       href: "/trips/new",            color: "from-violet-500 to-indigo-600" },
                  { icon: Globe,       label: "Search Cities",  href: "/search/cities",         color: "from-indigo-400 to-violet-500" },
                  { icon: Package,     label: "Packing List",   href: "/packing",               color: "from-purple-400 to-violet-500" },
                  { icon: FileText,    label: "Trip Notes",     href: "/notes",                 color: "from-violet-400 to-purple-500" },
                ].map(({ icon: Icon, label, href, color }) => (
                  <Link key={label} href={href}
                    className={`flex flex-col items-center gap-2 p-5 rounded-2xl bg-gradient-to-br ${color} text-white hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-1 transition-all duration-300 group`}>
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold text-center leading-tight">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Bottom padding */}
          <div className="h-6" />
        </main>
      </div>
    </div>
  );
}