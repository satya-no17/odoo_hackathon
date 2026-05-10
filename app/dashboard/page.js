// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { MapPin, Wallet, Building2, Plus, LogOut, ArrowRight, Calendar, Compass } from "lucide-react";
// import PlanzoLogo from "@/components/PlanzoLogo";

// export default function DashboardPage() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [trips, setTrips] = useState([]);
//   const [cities, setCities] = useState([]);

//   useEffect(() => {
//     const saved = localStorage.getItem("traveloop_user");
//     if (!saved) { router.push("/auth/login"); return; }
//     const currentUser = JSON.parse(saved);
//     const timer = setTimeout(() => setUser(currentUser), 0);
//     fetch(`/api/trips?userId=${currentUser.id}`)
//       .then((res) => res.json())
//       .then((data) => setTrips(data.trips || []));
//     fetch("/api/cities")
//       .then((res) => res.json())
//       .then((data) => setCities(data.cities || []));
//     return () => clearTimeout(timer);
//   }, [router]);

//   function logout() {
//     localStorage.removeItem("traveloop_user");
//     router.push("/auth/login");
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-[#faf9ff] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 rounded-full border-2 border-violet-300 border-t-transparent animate-spin" />
//           <p className="text-xs text-gray-300 font-bold tracking-widest uppercase">Loading your world...</p>
//         </div>
//       </div>
//     );
//   }

//   const recentTrips = trips.slice(0, 3);
//   const totalBudget = trips.reduce((sum, trip) => sum + Number(trip.activity_total || 0), 0);

//   return (
//     <div className="relative min-h-screen bg-[#faf9ff] overflow-x-hidden font-sans">

//       {/* Blobs */}
//       <div className="absolute -top-40 -left-32 w-[500px] h-[500px] rounded-full bg-violet-300 opacity-[0.15] blur-[110px] pointer-events-none" />
//       <div className="absolute top-[35%] -right-24 w-[360px] h-[360px] rounded-full bg-indigo-300 opacity-[0.13] blur-[90px] pointer-events-none" />
//       <div className="absolute bottom-0 left-[38%] w-[320px] h-[320px] rounded-full bg-sky-200 opacity-[0.12] blur-[90px] pointer-events-none" />

//       {/* Navbar */}
//       <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-2xl border-b border-violet-100/70 px-6 py-3 flex items-center justify-between">
//         <PlanzoLogo className="w-28 h-auto" />
//         <div className="flex items-center gap-2.5">
//           <Link href="/trips/create"
//             className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-[13px] font-extrabold rounded-xl shadow-[0_4px_16px_rgba(109,93,230,0.32)] hover:shadow-[0_6px_20px_rgba(109,93,230,0.42)] hover:-translate-y-0.5 transition-all duration-200"
//           >
//             <Plus size={14} /> New trip
//           </Link>
//           <button onClick={logout}
//             className="flex items-center gap-1.5 px-3.5 py-2 border border-violet-100 text-[13px] font-semibold text-gray-400 rounded-xl hover:bg-violet-50 hover:text-violet-500 hover:border-violet-200 transition-all duration-200"
//           >
//             <LogOut size={13} /> Logout
//           </button>
//         </div>
//       </nav>

//       <div className="mx-auto max-w-6xl px-6 py-10">

//         {/* Hero greeting */}
//         <div className="animate-[fadeUp_0.5s_ease_both] mb-10">
//           <p className="text-[10px] font-black text-violet-300 uppercase tracking-[0.25em] mb-2">Dashboard</p>
//           <h1 className="text-4xl font-black text-indigo-950 tracking-tight leading-tight">
//             Hey, <span className="bg-gradient-to-r from-violet-500 to-indigo-400 bg-clip-text text-transparent">{user.name}.</span>
//           </h1>
//           <p className="text-sm text-gray-400 mt-1.5">Ready for the next adventure?</p>
//         </div>

//         {/* Stat cards */}
//         <div className="animate-[fadeUp_0.5s_ease_both] [animation-delay:0.1s] grid gap-4 sm:grid-cols-3 mb-10">
//           <StatCard icon={<MapPin size={18} className="text-violet-500" />} color="bg-violet-50" label="Trips planned" value={trips.length} />
//           <StatCard icon={<Wallet size={18} className="text-indigo-400" />} color="bg-indigo-50" label="Activity budget" value={`₹${totalBudget.toFixed(0)}`} />
//           <StatCard icon={<Building2 size={18} className="text-sky-400" />} color="bg-sky-50" label="Cities to explore" value={cities.length} />
//         </div>

//         {/* Main grid */}
//         <div className="animate-[fadeUp_0.5s_ease_both] [animation-delay:0.18s] grid gap-6 lg:grid-cols-[3fr_2fr]">

//           {/* Recent trips */}
//           <div className="bg-white/80 backdrop-blur-xl border border-violet-100 rounded-[24px] p-6 shadow-[0_8px_40px_rgba(109,93,230,0.08)]">
//             <div className="flex items-center justify-between mb-5">
//               <div>
//                 <h2 className="text-[15px] font-black text-indigo-950 tracking-tight">Recent trips</h2>
//                 <p className="text-[11px] text-gray-300 mt-0.5">Your latest adventures</p>
//               </div>
//               <Link href="/trips" className="flex items-center gap-1 text-[12px] font-bold text-violet-400 hover:text-violet-600 transition-colors">
//                 View all <ArrowRight size={12} />
//               </Link>
//             </div>

//             <div className="space-y-2.5">
//               {recentTrips.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12 text-center">
//                   <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mb-3">
//                     <Compass size={22} className="text-violet-300" />
//                   </div>
//                   <p className="text-sm font-bold text-gray-400">No trips yet</p>
//                   <p className="text-xs text-gray-300 mt-1 mb-4">The world is waiting for you.</p>
//                   <Link href="/trips/create"
//                     className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-600 text-xs font-extrabold rounded-xl transition-colors"
//                   >
//                     <Plus size={13} /> Plan your first trip
//                   </Link>
//                 </div>
//               ) : (
//                 recentTrips.map((trip, i) => (
//                   <Link key={trip.id} href={`/trips/${trip.id}`}
//                     style={{ animationDelay: `${0.22 + i * 0.07}s` }}
//                     className="animate-[fadeUp_0.4s_ease_both] group flex items-center justify-between gap-4 p-4 rounded-2xl border border-violet-50 hover:border-violet-200 bg-[#faf9ff] hover:bg-white transition-all duration-200"
//                   >
//                     <div className="flex items-center gap-3.5 min-w-0">
//                       <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0">
//                         <MapPin size={15} className="text-violet-500" />
//                       </div>
//                       <div className="min-w-0">
//                         <h3 className="text-sm font-extrabold text-indigo-950 truncate group-hover:text-violet-600 transition-colors">{trip.name}</h3>
//                         <div className="flex items-center gap-1 mt-0.5">
//                           <Calendar size={10} className="text-gray-300 shrink-0" />
//                           <span className="text-[11px] text-gray-400 truncate">
//                             {trip.start_date || "TBD"} → {trip.end_date || "TBD"}
//                           </span>
//                         </div>
//                         <p className="text-[11px] text-gray-300 mt-0.5">
//                           {trip.stop_count} stops · ₹{Number(trip.activity_total || 0).toFixed(0)}
//                         </p>
//                       </div>
//                     </div>
//                     <ArrowRight size={15} className="text-violet-200 group-hover:text-violet-400 shrink-0 transition-colors" />
//                   </Link>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Popular cities */}
//           <div className="bg-white/80 backdrop-blur-xl border border-violet-100 rounded-[24px] p-6 shadow-[0_8px_40px_rgba(109,93,230,0.08)]">
//             <div className="mb-5">
//               <h2 className="text-[15px] font-black text-indigo-950 tracking-tight">Popular cities</h2>
//               <p className="text-[11px] text-gray-300 mt-0.5">Curated for you</p>
//             </div>
//             <div className="space-y-2">
//               {cities.slice(0, 8).map((city, i) => (
//                 <div key={city.id}
//                   style={{ animationDelay: `${0.22 + i * 0.04}s` }}
//                   className="animate-[fadeUp_0.4s_ease_both] flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-violet-50 hover:border-violet-100 hover:bg-violet-50/40 transition-all duration-150 group cursor-default"
//                 >
//                   <div className="flex items-center gap-2.5">
//                     <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0">
//                       <MapPin size={11} className="text-violet-400" />
//                     </div>
//                     <div>
//                       <p className="text-[13px] font-bold text-indigo-900 leading-none">{city.name}</p>
//                       <p className="text-[10px] text-gray-300 mt-0.5">{city.country}</p>
//                     </div>
//                   </div>
//                   <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-violet-50 text-violet-400 border border-violet-100 group-hover:bg-violet-100 transition-colors">
//                     ₹{city.cost_index}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(18px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }

// function StatCard({ icon, color, label, value }) {
//   return (
//     <div className="bg-white/80 backdrop-blur-xl border border-violet-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(109,93,230,0.06)]">
//       <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
//         {icon}
//       </div>
//       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em]">{label}</p>
//       <p className="text-2xl font-black text-indigo-950 mt-1 tracking-tight">{value}</p>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Plus,
  List,
  User,
  Globe,
  CheckSquare,
  FileText,
  BarChart2,
  LogOut,
  Bell,
  Plane,
  MapPin,
  Star,
  ArrowRight,
  TrendingUp,
  Calendar,
  DollarSign,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Package,
  Wallet,
  Building2,
  Compass,
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "My Trips", href: "/trips" },
  { icon: Plus, label: "Create Trip", href: "/trips/create" },
  { icon: Globe, label: "City Search", href: "/search/cities" },
  { icon: List, label: "Activity Search", href: "/search/activities" },
  { icon: CheckSquare, label: "Packing List", href: "/packing" },
  { icon: FileText, label: "Trip Notes", href: "/notes" },
  { icon: BarChart2, label: "Budget", href: "/budget" },
  { icon: User, label: "Profile", href: "/profile" },
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

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("/dashboard");

  useEffect(() => {
    const saved = localStorage.getItem("traveloop_user");

    if (!saved) {
      router.push("/auth/login");
      return;
    }

    const currentUser = JSON.parse(saved);

    setUser(currentUser);

    fetch(`/api/trips?userId=${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => setTrips(data.trips || []));

    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data.cities || []));
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
      value: `₹${totalBudget.toFixed(0)}`,
      sub: "Across all trips",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Building2,
      label: "Cities Available",
      value: cities.length,
      sub: "Ready to explore",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Calendar,
      label: "Upcoming Plans",
      value: recentTrips.length,
      sub: "Trips coming soon",
      color: "from-violet-400 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-violet-100/60 fixed top-0 bottom-0 left-0 z-30">
        <div className="px-6 py-5 border-b border-violet-50">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md shadow-violet-200">
              <Plane size={17} className="text-white" />
            </div>

            <div className="leading-none">
              <p className="text-violet-900 font-bold text-[15px]">
                Traveloop
              </p>
              <p className="text-violet-400 text-[10px]">
                Plan. Explore. Loop.
              </p>
            </div>
          </Link>
        </div>

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

            <button onClick={logout}>
              <LogOut
                size={15}
                className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
              />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE SIDEBAR */}
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
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <Plane size={17} className="text-white" />
                  </div>

                  <p className="text-violet-900 font-bold text-[15px]">
                    Traveloop
                  </p>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV.map(({ icon: Icon, label, href }) => {
                  const active = activeNav === href;

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => {
                        setActiveNav(href);
                        setSidebarOpen(false);
                      }}
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

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-violet-100/50 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-violet-50 text-violet-700"
            >
              <Menu size={18} />
            </button>

            <div>
              <h1 className="text-base font-bold text-gray-900">
                Dashboard
              </h1>
            </div>
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

        {/* PAGE CONTENT */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* HERO */}
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
                    Hey, {user.name}! ✈️
                  </h2>

                  <p className="text-violet-100/70 text-sm">
                    You have {trips.length} planned trips waiting for you.
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

          {/* STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.07}>
                <StatCard {...stat} />
              </Reveal>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
            {/* RECENT TRIPS */}
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
                          <MapPin
                            size={20}
                            className="text-violet-500"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {trip.name}
                            </p>

                            <Badge status="Upcoming" />
                          </div>

                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-gray-400 text-xs">
                              <Calendar size={11} />
                              {trip.start_date || "TBD"} →
                              {trip.end_date || "TBD"}
                            </span>

                            <span className="flex items-center gap-1 text-gray-400 text-xs">
                              <MapPin size={11} />
                              {trip.stop_count} stops
                            </span>

                            <span className="flex items-center gap-1 text-violet-600 text-xs font-semibold">
                              <DollarSign size={11} />₹
                              {Number(
                                trip.activity_total || 0
                              ).toFixed(0)}
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

            {/* POPULAR CITIES */}
            <Reveal delay={0.15}>
              <div className="bg-white rounded-3xl border border-violet-50 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Popular Cities
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Curated for you
                    </p>
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                          <MapPin
                            size={16}
                            className="text-violet-500"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {city.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {city.country}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 border border-violet-100">
                        ₹{city.cost_index}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* QUICK ACTIONS */}
          <Reveal delay={0.2}>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    icon: Plus,
                    label: "New Trip",
                    href: "/trips/create",
                    color: "from-violet-500 to-indigo-600",
                  },
                  {
                    icon: Globe,
                    label: "Search Cities",
                    href: "/search/cities",
                    color: "from-indigo-400 to-violet-500",
                  },
                  {
                    icon: Package,
                    label: "Packing List",
                    href: "/packing",
                    color: "from-purple-400 to-violet-500",
                  },
                  {
                    icon: FileText,
                    label: "Trip Notes",
                    href: "/notes",
                    color: "from-violet-400 to-purple-500",
                  },
                ].map(({ icon: Icon, label, href, color }) => (
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

          {/* DESTINATIONS */}
          <Reveal delay={0.25}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Recommended Destinations
                  </h3>

                  <p className="text-gray-400 text-xs mt-0.5">
                    Trending travel locations
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    city: "Tokyo",
                    country: "Japan",
                    rating: 4.9,
                    price: "₹75k",
                    image:
                      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop",
                  },
                  {
                    city: "Paris",
                    country: "France",
                    rating: 4.8,
                    price: "₹90k",
                    image:
                      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
                  },
                  {
                    city: "Bali",
                    country: "Indonesia",
                    rating: 4.7,
                    price: "₹45k",
                    image:
                      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
                  },
                  {
                    city: "Rome",
                    country: "Italy",
                    rating: 4.8,
                    price: "₹82k",
                    image:
                      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop",
                  },
                ].map((dest, i) => (
                  <motion.div
                    key={dest.city}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="group rounded-2xl overflow-hidden bg-white border border-violet-50 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={dest.image}
                        alt={dest.city}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      <div className="absolute bottom-2.5 left-3">
                        <p className="text-white font-bold text-sm">
                          {dest.city}
                        </p>

                        <p className="text-white/60 text-[10px]">
                          {dest.country}
                        </p>
                      </div>
                    </div>

                    <div className="px-3 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star
                          size={11}
                          className="fill-amber-400 stroke-amber-400"
                        />

                        <span className="text-xs font-semibold text-gray-700">
                          {dest.rating}
                        </span>
                      </div>

                      <span className="text-violet-700 font-bold text-xs">
                        From {dest.price}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </main>
      </div>
    </div>
  );
}

