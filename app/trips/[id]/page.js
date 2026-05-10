"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, MapPin, Calendar, Wallet, Package, StickyNote, ArrowRight, Zap, Globe, ChevronRight } from "lucide-react";
import PlanzoLogo from "@/components/PlanzoLogo";

const quickActivities = [
  { name: "City walking tour", category: "sightseeing", cost: 2000, durationHours: 3 },
  { name: "Local food tasting", category: "food", cost: 1500, durationHours: 2 },
  { name: "Museum visit", category: "culture", cost: 1000, durationHours: 2 },
  { name: "Day adventure", category: "adventure", cost: 3500, durationHours: 5 },
];

const categoryColors = {
  sightseeing: "bg-sky-50 text-sky-500 border-sky-100",
  food: "bg-amber-50 text-amber-500 border-amber-100",
  culture: "bg-violet-50 text-violet-500 border-violet-100",
  adventure: "bg-green-50 text-green-500 border-green-100",
};

export default function TripDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [cities, setCities] = useState([]);
  const [cityQuery, setCityQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [stopForm, setStopForm] = useState({ cityName: "", arrivalDate: "", departureDate: "" });
  const [activityForms, setActivityForms] = useState({});
  const [packingForm, setPackingForm] = useState({ name: "", category: "necessary" });
  const [noteForm, setNoteForm] = useState({ content: "", stopId: "" });
  const [message, setMessage] = useState("");

  const loadTrip = useCallback(async () => {
    const res = await fetch(`/api/trips/${id}`);
    const data = await res.json();
    if (data.success) setTripData(data);
    else setMessage(data.message || "Could not load trip");
  }, [id]);

  useEffect(() => {
    const saved = localStorage.getItem("traveloop_user");
    if (!saved) { router.push("/auth/login"); return; }
    const timer = setTimeout(() => setUser(JSON.parse(saved)), 0);
    fetch(`/api/trips/${id}`).then((r) => r.json()).then((d) => { if (d.success) setTripData(d); else setMessage(d.message || "Could not load trip"); });
    return () => clearTimeout(timer);
  }, [id, router]);

  useEffect(() => {
    fetch(`/api/cities?q=${encodeURIComponent(cityQuery)}`).then((r) => r.json()).then((d) => setCities(d.cities || []));
  }, [cityQuery]);

  function updateStopField(e) { setStopForm({ ...stopForm, [e.target.name]: e.target.value }); }

  function updateActivityForm(stopId, field, value) {
    setActivityForms({ ...activityForms, [stopId]: { name: "", category: "fun", cost: "", durationHours: "", ...(activityForms[stopId] || {}), [field]: value } });
  }

  async function addStop(e) {
    e.preventDefault();
    const payload = { tripId: id, cityId: selectedCity?.id, cityName: selectedCity ? selectedCity.name : stopForm.cityName, arrivalDate: stopForm.arrivalDate, departureDate: stopForm.departureDate, sortOrder: tripData?.stops?.length || 0 };
    const res = await fetch("/api/stops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!data.success) { setMessage(data.message || "Could not add stop"); return; }
    setStopForm({ cityName: "", arrivalDate: "", departureDate: "" }); setSelectedCity(null); setCityQuery(""); loadTrip();
  }

  async function deleteStop(stopId) {
    if (!confirm("Delete this stop and its activities?")) return;
    await fetch(`/api/stops?id=${stopId}`, { method: "DELETE" }); loadTrip();
  }

  async function addActivity(stopId, preset) {
    const form = preset || activityForms[stopId];
    if (!form?.name) return;
    const res = await fetch("/api/activities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stopId, ...form }) });
    const data = await res.json();
    if (!data.success) { setMessage(data.message || "Could not add activity"); return; }
    setActivityForms({ ...activityForms, [stopId]: undefined }); loadTrip();
  }

  async function deleteActivity(activityId) { await fetch(`/api/activities?id=${activityId}`, { method: "DELETE" }); loadTrip(); }

  async function addPacking(e) {
    e.preventDefault();
    const res = await fetch("/api/packing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tripId: id, ...packingForm }) });
    const data = await res.json();
    if (!data.success) { setMessage(data.message || "Could not add packing item"); return; }
    setPackingForm({ name: "", category: "necessary" }); loadTrip();
  }

  async function togglePacking(item) { await fetch("/api/packing", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, isPacked: !item.is_packed }) }); loadTrip(); }
  async function deletePacking(itemId) { await fetch(`/api/packing?id=${itemId}`, { method: "DELETE" }); loadTrip(); }

  async function addNote(e) {
    e.preventDefault();
    const res = await fetch("/api/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tripId: id, ...noteForm }) });
    const data = await res.json();
    if (!data.success) { setMessage(data.message || "Could not add note"); return; }
    setNoteForm({ content: "", stopId: "" }); loadTrip();
  }

  async function deleteNote(noteId) { await fetch(`/api/notes?id=${noteId}`, { method: "DELETE" }); loadTrip(); }

  if (!user || !tripData) {
    return (
      <div className="min-h-screen bg-[#faf9ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-violet-300 border-t-transparent animate-spin" />
          <p className="text-xs text-gray-300 font-bold tracking-widest uppercase">Loading your trip...</p>
        </div>
      </div>
    );
  }

  const { trip, stops, packingItems, notes, budget } = tripData;

  return (
    <div className="relative min-h-screen bg-[#faf9ff] overflow-x-hidden font-sans">

      {/* Blobs */}
      <div className="absolute -top-40 -left-32 w-[500px] h-[500px] rounded-full bg-violet-300 opacity-[0.15] blur-[110px] pointer-events-none" />
      <div className="absolute top-[40%] -right-24 w-[360px] h-[360px] rounded-full bg-indigo-300 opacity-[0.13] blur-[90px] pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-2xl border-b border-violet-100/70 px-6 py-3 flex items-center justify-between">
        <PlanzoLogo className="w-28 h-auto" />
        <Link href={`/trips/public/${trip.id}`}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-violet-100 text-[13px] font-semibold text-gray-400 rounded-xl hover:bg-violet-50 hover:text-violet-500 hover:border-violet-200 transition-all duration-200"
        >
          <Globe size={13} /> Public view
        </Link>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* Header */}
        <div className="animate-[fadeUp_0.5s_ease_both] mb-8">
          <Link href="/trips" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-violet-400 hover:text-violet-600 transition-colors mb-3 uppercase tracking-widest">
            <ArrowLeft size={13} /> Back
          </Link>
          <h1 className="text-3xl font-black text-indigo-950 tracking-tight">{trip.name}</h1>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">{trip.description || "No description — but every great trip starts somewhere."}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-300 font-semibold">
            <Calendar size={11} />
            {trip.start_date || "No start"} → {trip.end_date || "No end"}
          </div>
        </div>

        {/* Error */}
        {message && (
          <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" /> {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">

          {/* LEFT */}
          <div className="space-y-5">

            {/* Add Stop */}
            <div className="animate-[fadeUp_0.5s_ease_both] [animation-delay:0.1s] bg-white/80 backdrop-blur-xl border border-violet-100 rounded-[24px] p-6 shadow-[0_8px_40px_rgba(109,93,230,0.07)]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-xl bg-violet-50 flex items-center justify-center">
                  <MapPin size={14} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-[14px] font-black text-indigo-950 tracking-tight">Add a stop</h2>
                  <p className="text-[10px] text-gray-300">Where to next?</p>
                </div>
              </div>
              <form onSubmit={addStop} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Search city</label>
                    <input
                      className="w-full px-3.5 py-2.5 bg-[#f7f5ff] border border-violet-100 rounded-xl text-sm text-indigo-950 placeholder:text-gray-300 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white"
                      onChange={(e) => { setCityQuery(e.target.value); setSelectedCity(null); }}
                      placeholder="Paris, Tokyo, Bali..."
                      value={cityQuery}
                    />
                    {cities.length > 0 && (
                      <div className="mt-1.5 max-h-40 overflow-auto rounded-xl border border-violet-100 bg-white shadow-[0_4px_20px_rgba(109,93,230,0.08)]">
                        {cities.slice(0, 8).map((city) => (
                          <button
                            key={city.id} type="button"
                            className={`block w-full px-4 py-2.5 text-left text-[13px] hover:bg-violet-50 transition-colors ${selectedCity?.id === city.id ? "bg-violet-50 font-bold text-violet-700" : "text-gray-700"}`}
                            onClick={() => { setSelectedCity(city); setCityQuery(`${city.name}, ${city.country}`); }}
                          >
                            {city.name}, {city.country}
                            <span className="ml-2 text-[10px] text-gray-300">₹{city.cost_index}/day</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Custom city</label>
                      <input
                        className="w-full px-3.5 py-2.5 bg-[#f7f5ff] border border-violet-100 rounded-xl text-sm text-indigo-950 placeholder:text-gray-300 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white"
                        name="cityName" onChange={updateStopField} placeholder="Not in the list?" value={stopForm.cityName}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[["arrivalDate", "Arrival"], ["departureDate", "Departure"]].map(([name, label]) => (
                        <div key={name}>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">{label}</label>
                          <input
                            className="w-full px-3 py-2.5 bg-[#f7f5ff] border border-violet-100 rounded-xl text-sm text-indigo-950 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all"
                            name={name} onChange={updateStopField} type="date" value={stopForm[name]}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-extrabold rounded-xl text-[13px] shadow-[0_4px_16px_rgba(109,93,230,0.32)] hover:shadow-[0_6px_20px_rgba(109,93,230,0.42)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Plus size={14} /> Add stop
                </button>
              </form>
            </div>

            {/* Itinerary */}
            <div className="animate-[fadeUp_0.5s_ease_both] [animation-delay:0.15s] bg-white/80 backdrop-blur-xl border border-violet-100 rounded-[24px] p-6 shadow-[0_8px_40px_rgba(109,93,230,0.07)]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-xl bg-violet-50 flex items-center justify-center">
                  <ChevronRight size={14} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-[14px] font-black text-indigo-950 tracking-tight">Itinerary</h2>
                  <p className="text-[10px] text-gray-300">{stops.length} stop{stops.length !== 1 ? "s" : ""} planned</p>
                </div>
              </div>

              {stops.length === 0 && (
                <p className="text-sm text-gray-300 text-center py-8">Add stops above to start building your route.</p>
              )}

              <div className="space-y-4">
                {stops.map((stop, index) => {
                  const activityForm = activityForms[stop.id] || { name: "", category: "fun", cost: "", durationHours: "" };
                  return (
                    <div key={stop.id} className="rounded-2xl border border-violet-100 bg-[#faf9ff] p-4">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0 text-[11px] font-black text-violet-600">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-[15px] font-black text-indigo-950 tracking-tight">{stop.display_city || stop.city_name}</h3>
                            <p className="text-[11px] text-gray-300">
                              {stop.country || "Custom city"} · {stop.arrival_date || "No arrival"} → {stop.departure_date || "No departure"}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => deleteStop(stop.id)} type="button"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-red-100 text-red-400 text-[11px] font-bold hover:bg-red-50 hover:border-red-200 transition-all"
                        >
                          <Trash2 size={11} /> Remove
                        </button>
                      </div>

                      {/* Activities */}
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Activities</p>
                        <div className="space-y-1.5 mb-3">
                          {stop.activities.map((activity) => {
                            const colorClass = categoryColors[activity.category] || "bg-violet-50 text-violet-500 border-violet-100";
                            return (
                              <div key={activity.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white border border-violet-50">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${colorClass}`}>
                                    {activity.category}
                                  </span>
                                  <span className="text-[13px] font-semibold text-indigo-900 truncate">{activity.name}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[12px] font-black text-violet-500">₹{Number(activity.cost || 0).toFixed(0)}</span>
                                  <button onClick={() => deleteActivity(activity.id)} type="button" className="text-red-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Quick add */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {quickActivities.map((a) => (
                            <button key={a.name} type="button" onClick={() => addActivity(stop.id, a)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-violet-100 text-[11px] font-bold text-violet-500 bg-white hover:bg-violet-50 hover:border-violet-300 transition-all"
                            >
                              <Zap size={10} /> {a.name}
                            </button>
                          ))}
                        </div>

                        {/* Custom form */}
                        <div className="grid gap-2 md:grid-cols-5">
                          <input className="md:col-span-2 px-3 py-2 bg-white border border-violet-100 rounded-xl text-[13px] text-indigo-950 placeholder:text-gray-300 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                            onChange={(e) => updateActivityForm(stop.id, "name", e.target.value)} placeholder="Activity name" value={activityForm.name} />
                          <input className="px-3 py-2 bg-white border border-violet-100 rounded-xl text-[13px] text-indigo-950 placeholder:text-gray-300 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                            onChange={(e) => updateActivityForm(stop.id, "category", e.target.value)} placeholder="Category" value={activityForm.category} />
                          <input className="px-3 py-2 bg-white border border-violet-100 rounded-xl text-[13px] text-indigo-950 placeholder:text-gray-300 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                            onChange={(e) => updateActivityForm(stop.id, "cost", e.target.value)} placeholder="₹ Cost" type="number" value={activityForm.cost} />
                          <button onClick={() => addActivity(stop.id)} type="button"
                            className="px-3 py-2 bg-gradient-to-r from-violet-500 to-indigo-400 text-white font-extrabold rounded-xl text-[13px] hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(109,93,230,0.25)] transition-all"
                          >Add</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <aside className="space-y-5">

            {/* Budget */}
            <div className="animate-[fadeUp_0.5s_ease_both] [animation-delay:0.2s] bg-white/80 backdrop-blur-xl border border-violet-100 rounded-[24px] p-6 shadow-[0_8px_40px_rgba(109,93,230,0.07)]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Wallet size={14} className="text-violet-400" />
                </div>
                <h2 className="text-[14px] font-black text-indigo-950 tracking-tight">Budget breakdown</h2>
              </div>
              <div className="space-y-3 mb-4">
                <BudgetRow label="Activity costs" value={`₹${Number(budget.activityTotal || 0).toFixed(0)}`} />
                <BudgetRow label="Daily city estimate" value={`₹${Number(budget.estimatedDailyBase || 0).toFixed(0)}`} />
              </div>
              <div className="pt-4 border-t border-violet-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total estimate</p>
                <p className="text-3xl font-black bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent tracking-tight">
                  ₹{Number(budget.estimatedTotal || 0).toFixed(0)}
                </p>
              </div>
            </div>

            {/* Packing */}
            <div className="animate-[fadeUp_0.5s_ease_both] [animation-delay:0.25s] bg-white/80 backdrop-blur-xl border border-violet-100 rounded-[24px] p-6 shadow-[0_8px_40px_rgba(109,93,230,0.07)]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Package size={14} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-[14px] font-black text-indigo-950 tracking-tight">Packing list</h2>
                  <p className="text-[10px] text-gray-300">{packingItems.filter(i => i.is_packed).length}/{packingItems.length} packed</p>
                </div>
              </div>
              <form onSubmit={addPacking} className="space-y-2 mb-4">
                <input
                  className="w-full px-3.5 py-2.5 bg-[#f7f5ff] border border-violet-100 rounded-xl text-[13px] text-indigo-950 placeholder:text-gray-300 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all"
                  onChange={(e) => setPackingForm({ ...packingForm, name: e.target.value })}
                  placeholder="What do you need to pack?" required value={packingForm.name}
                />
                <input
                  className="w-full px-3.5 py-2.5 bg-[#f7f5ff] border border-violet-100 rounded-xl text-[13px] text-indigo-950 placeholder:text-gray-300 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all"
                  onChange={(e) => setPackingForm({ ...packingForm, category: e.target.value })}
                  placeholder="Category (documents, clothes...)" value={packingForm.category}
                />
                <button type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-extrabold rounded-xl text-[13px] shadow-[0_4px_16px_rgba(109,93,230,0.28)] hover:-translate-y-0.5 transition-all"
                >Add to list</button>
              </form>
              <div className="space-y-1.5">
                {packingItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-violet-50 hover:border-violet-100 transition-colors bg-white">
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                      <input checked={item.is_packed} onChange={() => togglePacking(item)} type="checkbox" className="accent-violet-500 w-3.5 h-3.5 rounded" />
                      <div className="min-w-0">
                        <p className={`text-[13px] font-semibold truncate ${item.is_packed ? "line-through text-gray-300" : "text-indigo-900"}`}>{item.name}</p>
                        <p className="text-[10px] text-gray-300">{item.category}</p>
                      </div>
                    </label>
                    <button onClick={() => deletePacking(item.id)} className="text-red-200 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="animate-[fadeUp_0.5s_ease_both] [animation-delay:0.3s] bg-white/80 backdrop-blur-xl border border-violet-100 rounded-[24px] p-6 shadow-[0_8px_40px_rgba(109,93,230,0.07)]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-xl bg-violet-50 flex items-center justify-center">
                  <StickyNote size={14} className="text-violet-400" />
                </div>
                <h2 className="text-[14px] font-black text-indigo-950 tracking-tight">Notes</h2>
              </div>
              <form onSubmit={addNote} className="space-y-2 mb-4">
                <select
                  className="w-full px-3.5 py-2.5 bg-[#f7f5ff] border border-violet-100 rounded-xl text-[13px] text-indigo-950 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all"
                  onChange={(e) => setNoteForm({ ...noteForm, stopId: e.target.value })} value={noteForm.stopId}
                >
                  <option value="">Whole trip</option>
                  {stops.map((stop) => (
                    <option key={stop.id} value={stop.id}>{stop.display_city || stop.city_name}</option>
                  ))}
                </select>
                <textarea
                  className="w-full min-h-20 px-3.5 py-2.5 bg-[#f7f5ff] border border-violet-100 rounded-xl text-[13px] text-indigo-950 placeholder:text-gray-300 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all resize-none"
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  placeholder="Reminders, contacts, hotel details..."
                  required value={noteForm.content}
                />
                <button type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-extrabold rounded-xl text-[13px] shadow-[0_4px_16px_rgba(109,93,230,0.28)] hover:-translate-y-0.5 transition-all"
                >Save note</button>
              </form>
              <div className="space-y-2">
                {notes.map((note) => (
                  <div key={note.id} className="px-3.5 py-3 rounded-xl bg-[#f7f5ff] border border-violet-50">
                    <p className="text-[13px] text-indigo-900 leading-relaxed">{note.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-gray-300">{new Date(note.created_at).toLocaleString()}</span>
                      <button onClick={() => deleteNote(note.id)} className="text-red-200 hover:text-red-400 transition-colors">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function BudgetRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1">
      <p className="text-[11px] text-gray-400 font-semibold">{label}</p>
      <p className="text-[14px] font-black text-indigo-950">{value}</p>
    </div>
  );
}