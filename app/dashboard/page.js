"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import PlanzoLogo from "@/components/PlanzoLogo";
import {
  ArrowRight,
  Bell,
  Building2,
  Calendar,
  ChevronRight,
  Compass,
  Home,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  Menu,
  Plus,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "My Trips", href: "/trips" },
  { icon: Plus, label: "Create Trip", href: "/trips/create" },
  { icon: Home, label: "Home Page", href: "/" },
];

const QUICK_ACTIONS = [
  {
    icon: Plus,
    label: "New Trip",
    href: "/trips/create",
    color: "from-violet-500 to-indigo-600",
  },
  {
    icon: Map,
    label: "My Trips",
    href: "/trips",
    color: "from-indigo-400 to-violet-500",
  },
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    color: "from-purple-400 to-violet-500",
  },
  {
    icon: Home,
    label: "Home",
    href: "/",
    color: "from-violet-400 to-purple-500",
  },
];

const CITY_IMAGES = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200&auto=format&fit=crop",
];

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

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-violet-50 hover:shadow-lg hover:shadow-violet-100/50 hover:-translate-y-1 transition-all duration-300">
      <div
        className={`w-10 h-10 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-3 shadow-md`}
      >
        <Icon size={17} className="text-white" />
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-gray-500 text-xs font-medium mt-0.5">{label}</p>
      <p className="text-violet-400 text-[11px] mt-1 flex items-center gap-1">
        <TrendingUp size={10} /> {sub}
      </p>
    </div>
  );
}

function Badge({ status }) {
  const styles = {
    Upcoming: "bg-violet-100 text-violet-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Ongoing: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
        styles[status] || styles.Upcoming
      }`}
    >
      {status}
    </span>
  );
}

function getStatus(trip) {
  if (!trip.start_date || !trip.end_date) return "Upcoming";

  const now = new Date();
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);

  if (end < now) return "Completed";
  if (start <= now && end >= now) return "Ongoing";

  return "Upcoming";
}

function formatDate(value, fallback) {
  if (!value) return fallback;

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("traveloop_user");

    if (!saved) {
      router.push("/auth/login");
      return;
    }

    const currentUser = JSON.parse(saved);
    const timer = setTimeout(() => setUser(currentUser), 0);

    fetch(`/api/trips?userId=${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => setTrips(data.trips || []));

    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data.cities || []));

    return () => clearTimeout(timer);
  }, [router]);

  function logout() {
    localStorage.removeItem("traveloop_user");
    router.push("/auth/login");
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-violet-300 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const recentTrips = trips.slice(0, 3);
  const cityCards = cities.slice(0, 4);
  const totalBudget = trips.reduce(
    (sum, trip) => sum + Number(trip.activity_total || 0),
    0
  );

  const stats = [
    {
      icon: Map,
      label: "Total Trips",
      value: trips.length,
      sub: "Your adventures",
      color: "from-violet-500 to-violet-600",
    },
    {
      icon: Wallet,
      label: "Activity Budget",
      value: `Rs ${totalBudget.toFixed(0)}`,
      sub: "Across all trips",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Building2,
      label: "Cities Available",
      value: cities.length,
      sub: "From the cities API",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Calendar,
      label: "Upcoming Plans",
      value: trips.filter((trip) => getStatus(trip) === "Upcoming").length,
      sub: "Trips coming up",
      color: "from-violet-400 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-violet-100/60 fixed top-0 bottom-0 left-0 z-30">
        <div className="px-6 py-5 border-b border-violet-50">
          <Link href="/" className="flex items-center">
            <PlanzoLogo className="h-16 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ icon: Icon, label, href }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
                    : "text-gray-500 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                <Icon
                  size={17}
                  className={
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-violet-500"
                  }
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-violet-50">
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-violet-50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user.name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {user.email}
              </p>
            </div>
            <button onClick={logout} aria-label="Logout">
              <LogOut
                size={15}
                className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
              />
            </button>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="px-6 py-5 border-b border-violet-50 flex items-center justify-between">
                <div className="flex items-center">
                  <PlanzoLogo className="h-16 w-auto" />
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV.map(({ icon: Icon, label, href }) => {
                  const active = pathname === href;

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                        active
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
                          : "text-gray-500 hover:bg-violet-50 hover:text-violet-700"
                      }`}
                    >
                      <Icon
                        size={17}
                        className={active ? "text-white" : "text-gray-400"}
                      />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-violet-100/50 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-violet-50 text-violet-700"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <h1 className="text-base font-bold text-gray-900">Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
            </button>

            <Link
              href="/trips/create"
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-2xl hover:shadow-lg hover:shadow-violet-200 hover:scale-105 transition-all duration-300"
            >
              <Plus size={15} /> Plan New Trip
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          <Reveal>
            <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 rounded-3xl p-6 sm:p-8">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-violet-200" />
                    <span className="text-violet-200 text-xs font-medium">
                      Ready for your next adventure
                    </span>
                  </div>
                  <h2 className="text-white font-bold text-2xl sm:text-3xl mb-1">
                    Hey, {user.name}!
                  </h2>
                  <p className="text-violet-100/70 text-sm">
                    You have {trips.length} planned trips in Planzo.
                  </p>
                </div>

                <Link
                  href="/trips/create"
                  className="shrink-0 flex items-center gap-2 bg-white text-violet-700 font-semibold text-sm px-5 py-3 rounded-2xl hover:bg-violet-50 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Plus size={15} /> New Trip
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.07}>
                <StatCard {...stat} />
              </Reveal>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
            <Reveal delay={0.1}>
              <div className="bg-white rounded-3xl border border-violet-50 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-violet-50">
                  <div>
                    <h3 className="font-bold text-gray-900">Recent Trips</h3>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Your latest adventures
                    </p>
                  </div>
                  <Link
                    href="/trips"
                    className="flex items-center gap-1 text-violet-600 text-sm font-semibold hover:gap-2 transition-all"
                  >
                    View all <ChevronRight size={15} />
                  </Link>
                </div>

                <div className="divide-y divide-violet-50/60">
                  {recentTrips.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
                        <Compass size={26} className="text-violet-300" />
                      </div>
                      <p className="text-base font-bold text-gray-500">
                        No trips yet
                      </p>
                      <p className="text-sm text-gray-400 mt-1 mb-5">
                        Start planning your first adventure.
                      </p>
                      <Link
                        href="/trips/create"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-2xl transition-all"
                      >
                        <Plus size={15} /> Create Trip
                      </Link>
                    </div>
                  ) : (
                    recentTrips.map((trip, i) => (
                      <motion.div
                        key={trip.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.08 }}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-violet-50/40 transition-colors group"
                      >
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                          <MapPin size={20} className="text-violet-500" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {trip.name}
                            </p>
                            <Badge status={getStatus(trip)} />
                          </div>

                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-gray-400 text-xs">
                              <Calendar size={11} />
                              {formatDate(trip.start_date, "TBD")} to{" "}
                              {formatDate(trip.end_date, "TBD")}
                            </span>
                            <span className="flex items-center gap-1 text-gray-400 text-xs">
                              <MapPin size={11} />
                              {trip.stop_count || 0} stops
                            </span>
                            <span className="flex items-center gap-1 text-violet-600 text-xs font-semibold">
                              Rs {Number(trip.activity_total || 0).toFixed(0)}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/trips/${trip.id}`}
                          className="shrink-0 w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300"
                        >
                          <ArrowRight size={14} />
                        </Link>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="bg-white rounded-3xl border border-violet-50 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Available Cities
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {cities.slice(0, 6).map((city, i) => (
                    <motion.div
                      key={city.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-2xl border border-violet-50 hover:bg-violet-50/40 hover:border-violet-100 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0">
                          <MapPin size={16} className="text-violet-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {city.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {city.country}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 border border-violet-100">
                        Rs {city.cost_index}
                      </span>
                    </motion.div>
                  ))}

                  {cities.length === 0 && (
                    <div className="rounded-2xl border border-violet-50 bg-violet-50/50 p-6 text-center">
                      <p className="text-sm font-bold text-gray-600">
                        No cities available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {QUICK_ACTIONS.map(({ icon: Icon, label, href, color }) => (
                  <Link
                    key={label}
                    href={href}
                    className={`flex flex-col items-center gap-2 p-5 rounded-2xl bg-gradient-to-br ${color} text-white hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-1 transition-all duration-300 group`}
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold text-center leading-tight">
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">City Highlights</h3>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Real city records with the same image-card style
                  </p>
                </div>
              </div>

              {cityCards.length === 0 ? (
                <div className="rounded-3xl bg-white border border-violet-50 p-8 text-center">
                  <p className="font-bold text-gray-700">
                    No destination cards yet
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Seed the cities table to show them here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {cityCards.map((city, i) => (
                    <motion.div
                      key={city.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className="group rounded-2xl overflow-hidden bg-white border border-violet-50 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={CITY_IMAGES[i % CITY_IMAGES.length]}
                          alt={`${city.name}, ${city.country}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-2.5 left-3">
                          <p className="text-white font-bold text-sm">
                            {city.name}
                          </p>
                          <p className="text-white/60 text-[10px]">
                            {city.country}
                          </p>
                        </div>
                      </div>

                      <div className="px-3 py-2.5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">
                          Cost index
                        </span>
                        <span className="text-violet-700 font-bold text-xs">
                          Rs {city.cost_index}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </main>
      </div>
    </div>
  );
}
