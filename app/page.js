"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PlanzoLogo from "@/components/PlanzoLogo";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckSquare,
  Compass,
  FileText,
  Globe,
  MapPin,
  Package,
  Plus,
  Route,
  Sparkles,
  Wallet,
} from "lucide-react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Cities", href: "#cities" },
  { label: "Workflow", href: "#workflow" },
];

const features = [
  {
    icon: Route,
    title: "Multi-city routes",
    text: "Create trips with ordered stops, dates, and city details from the app database.",
  },
  {
    icon: Wallet,
    title: "Budget awareness",
    text: "Keep activity costs visible while shaping an itinerary that fits the plan.",
  },
  {
    icon: CheckSquare,
    title: "Packing built in",
    text: "Track what needs to come with you instead of keeping a separate checklist.",
  },
  {
    icon: FileText,
    title: "Trip notes",
    text: "Save reminders, ideas, and details alongside the trip they belong to.",
  },
];

const workflow = [
  { icon: Globe, title: "Browse cities", text: "Start from real city records already available in Planzo." },
  { icon: Plus, title: "Create a trip", text: "Add your trip name, dates, stops, and activities." },
  { icon: Package, title: "Prepare details", text: "Add packing items and notes before the trip begins." },
  { icon: Compass, title: "Share the plan", text: "Use public itinerary links when others need the same view." },
];

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CitySkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="h-[78px] animate-pulse rounded-2xl border border-violet-50 bg-violet-50/60"
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data.cities || []))
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false));
  }, []);

  const previewCities = cities.slice(0, 4);
  const cityCount = cities.length;

  const lowestCostCity = useMemo(() => {
    return cities.reduce((lowest, city) => {
      if (!lowest) return city;
      return Number(city.cost_index) < Number(lowest.cost_index) ? city : lowest;
    }, null);
  }, [cities]);

  const countryCount = useMemo(() => {
    return new Set(cities.map((city) => city.country).filter(Boolean)).size;
  }, [cities]);

  const stats = [
    { icon: Building2, label: "Cities loaded", value: loadingCities ? "..." : cityCount },
    { icon: Globe, label: "Countries", value: loadingCities ? "..." : countryCount },
    {
      icon: Wallet,
      label: "Lowest cost index",
      value: loadingCities || !lowestCostCity ? "..." : lowestCostCity.cost_index,
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-gray-50 text-gray-900">
      <nav className="sticky top-0 z-30 border-b border-violet-100/60 bg-white/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <PlanzoLogo className="h-16 w-auto" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-violet-50 hover:text-violet-700"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="rounded-2xl px-3 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-violet-50 hover:text-violet-700 sm:px-4"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-200"
            >
              Sign up <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <Reveal>
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-2 text-xs font-medium text-violet-600 shadow-sm">
              <Sparkles size={14} />
              Built from your Planzo data
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Plan multi-city trips from the cities already in your app.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              Planzo brings city stops, activities, packing, notes, budgets,
              and public itinerary links into one clean planner.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-300 hover:scale-105"
              >
                Start planning <Plus size={15} />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl border border-violet-100 bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition-all duration-300 hover:border-violet-200 hover:bg-violet-50"
              >
                Open dashboard <Compass size={15} />
              </Link>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              {stats.map(({ icon: Icon, label, value }, i) => (
                <Reveal key={label} delay={0.1 + i * 0.07}>
                  <div className="rounded-2xl border border-violet-50 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100/50">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-100">
                      <Icon size={17} className="text-white" />
                    </div>
                    <p className="text-sm font-extrabold text-gray-900">{value}</p>
                    <p className="mt-0.5 text-xs font-medium text-gray-400">{label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-2 top-8 z-10 hidden rounded-2xl bg-white px-4 py-3 shadow-xl shadow-violet-100 sm:block"
            >
              <p className="text-[11px] font-semibold text-gray-400">Live source</p>
            </motion.div>

            <div className="overflow-hidden rounded-3xl border border-violet-50 bg-white shadow-2xl shadow-violet-100/70">
              <div className="bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 p-6 text-white sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium text-violet-100">
                      <CalendarDays size={15} />
                      City planner preview
                    </div>
                    <h2 className="text-2xl font-bold">Available destinations</h2>
                    <p className="mt-1 text-sm text-violet-100/80">
                      Sorted by the actual city records returned by the app.
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                    <MapPin size={18} />
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {loadingCities ? (
                  <CitySkeleton />
                ) : previewCities.length > 0 ? (
                  <div className="space-y-3">
                    {previewCities.map((city, i) => (
                      <motion.div
                        key={city.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.08 }}
                        className="flex items-center gap-4 rounded-2xl border border-violet-50 p-4 transition-all duration-300 hover:bg-violet-50/40"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-100">
                          <MapPin size={17} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-gray-900">{city.name}</p>
                          <p className="text-xs text-gray-400">{city.country}</p>
                        </div>
                        <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                          Rs {city.cost_index}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-violet-50 bg-violet-50/50 p-6 text-center">
                    <p className="text-sm font-bold text-gray-600">No cities found</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Connect or seed the cities table to show real destinations here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="about" className="border-y border-violet-100/70 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-20">
          <Reveal>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-500">About</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                A hackathon MVP focused on the actual planning flow.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Demo login and dashboard entry",
                "Trip planning with city stops",
                "Activities, notes, and packing",
                "Public itinerary sharing",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-violet-50 bg-gray-50 p-5">
                  <CheckSquare size={18} className="text-violet-600" />
                  <p className="mt-3 text-sm font-semibold text-gray-800">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-500">Features</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
              Everything on the page points back to working app features.
            </h2>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <div className="h-full rounded-3xl border border-violet-50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/60">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-100">
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="mt-5 text-base font-bold text-gray-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="cities" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-500">Cities</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                  Real destinations from your database.
                </h2>
              </div>
              <Link
                href="/trips/create"
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100"
              >
                Use in a trip <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loadingCities ? (
              [0, 1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-3xl bg-violet-50" />
              ))
            ) : cities.length > 0 ? (
              cities.slice(0, 9).map((city, i) => (
                <Reveal key={city.id} delay={i * 0.04}>
                  <div className="flex items-center justify-between gap-4 rounded-3xl border border-violet-50 bg-gray-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-violet-100/50">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100">
                        <MapPin size={17} className="text-violet-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-950">{city.name}</p>
                        <p className="text-xs text-gray-400">{city.country}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full border border-violet-100 bg-white px-3 py-1 text-xs font-bold text-violet-700">
                      Rs {city.cost_index}
                    </span>
                  </div>
                </Reveal>
              ))
            ) : (
              <div className="rounded-3xl border border-violet-50 bg-gray-50 p-8 text-center sm:col-span-2 lg:col-span-3">
                <p className="font-bold text-gray-700">No city records available.</p>
                <p className="mt-1 text-sm text-gray-400">The page is ready to show them when the API returns data.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-500">Workflow</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
              From city search to a shareable itinerary.
            </h2>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {workflow.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <div className="relative h-full rounded-3xl border border-violet-50 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-extrabold text-violet-200">0{i + 1}</span>
                </div>
                <h3 className="font-bold text-gray-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <Reveal>
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 p-8 text-white shadow-2xl shadow-violet-200 sm:p-10 lg:p-12">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-violet-100">Ready when your next route is.</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Open the dashboard and build with the data already connected.
                </h2>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-violet-50"
              >
                Go to dashboard <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
