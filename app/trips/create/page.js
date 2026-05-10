"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Calendar, FileText, Image, Save, ArrowLeft,
  Sparkles, Upload, X, Check, ChevronRight, Globe
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }),
};

const steps = ["Basic Info", "Dates", "Details"];

export default function CreateTripPage() {
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    cover: null,
  });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, cover: file }));
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const canNext = () => {
    if (step === 0) return form.name.trim().length > 0;
    if (step === 1) return form.startDate && form.endDate;
    return true;
  };

  return (
    <div className="min-h-screen bg-[#f0efff] font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-[#e8e6ff] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-[#7c6ff7] hover:text-[#5a4fcf] transition-colors">
          <ArrowLeft size={20} />
          <span className="font-semibold text-sm">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c6ff7] to-[#5ae8d5] flex items-center justify-center">
            <Globe size={16} className="text-white" />
          </div>
          <span className="font-bold text-[#1a1240] text-lg tracking-tight">Planzo</span>
        </div>
        <div className="text-xs text-[#9b95c9] font-medium">Step {step + 1} of 3</div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#ede9ff] text-[#7c6ff7] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={12} />
            Plan a New Trip
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1a1240] leading-tight">
            Create Your<br />
            <span className="text-[#7c6ff7]">Dream Journey</span>
          </h1>
          <p className="text-[#6b6490] text-sm mt-2">Fill in the details to start planning your adventure</p>
        </motion.div>

        {/* Stepper */}
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="flex items-center justify-center gap-0 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  i === step
                    ? "bg-[#7c6ff7] text-white shadow-lg shadow-[#7c6ff7]/30"
                    : i < step
                    ? "bg-[#d4f0eb] text-[#2dba9e] cursor-pointer"
                    : "bg-white text-[#b0abc8]"
                }`}
              >
                {i < step ? <Check size={12} /> : <span>{i + 1}</span>}
                {s}
              </button>
              {i < steps.length - 1 && (
                <div className={`w-6 h-0.5 mx-1 rounded transition-all duration-500 ${i < step ? "bg-[#7c6ff7]" : "bg-[#e0deff]"}`} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl shadow-xl shadow-[#7c6ff7]/10 border border-[#ede9ff] p-6 md:p-8"
          >
            {/* Step 0: Basic Info */}
            {step === 0 && (
              <div className="space-y-6">
                <SectionHeader icon={<MapPin size={18} />} title="Trip Name" />
                <div className="relative">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Europe Summer 2025"
                    className="w-full bg-[#f7f5ff] border border-[#e0deff] rounded-2xl px-4 py-3.5 text-[#1a1240] placeholder:text-[#c0bce0] focus:outline-none focus:ring-2 focus:ring-[#7c6ff7]/40 focus:border-[#7c6ff7] transition-all text-sm font-medium"
                  />
                  {form.name && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7c6ff7]"
                    >
                      <Check size={16} />
                    </motion.span>
                  )}
                </div>

                {/* Cover Photo */}
                <div>
                  <SectionHeader icon={<Image size={18} />} title="Cover Photo" subtitle="Optional" />
                  <div
                    onClick={() => fileRef.current.click()}
                    className="relative mt-3 cursor-pointer group rounded-2xl border-2 border-dashed border-[#d0cafe] bg-[#f7f5ff] hover:bg-[#ede9ff] transition-all overflow-hidden"
                    style={{ height: coverPreview ? "180px" : "120px" }}
                  >
                    {coverPreview ? (
                      <>
                        <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">Change Photo</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setCoverPreview(null); setForm(f => ({ ...f, cover: null })); }}
                          className="absolute top-2 right-2 bg-white/90 rounded-full p-1 text-red-400 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-[#9b90d8]">
                        <Upload size={22} />
                        <span className="text-xs font-medium">Click to upload a cover image</span>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Dates */}
            {step === 1 && (
              <div className="space-y-6">
                <SectionHeader icon={<Calendar size={18} />} title="Travel Dates" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DateField
                    label="Start Date"
                    value={form.startDate}
                    onChange={(v) => setForm((f) => ({ ...f, startDate: v }))}
                  />
                  <DateField
                    label="End Date"
                    value={form.endDate}
                    min={form.startDate}
                    onChange={(v) => setForm((f) => ({ ...f, endDate: v }))}
                  />
                </div>
                {form.startDate && form.endDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#ede9ff] rounded-2xl p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#7c6ff7] flex items-center justify-center flex-shrink-0">
                      <Calendar size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#9b90d8] font-medium">Trip Duration</p>
                      <p className="text-[#1a1240] font-bold text-sm">
                        {Math.max(1, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000))} days
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 2: Description */}
            {step === 2 && (
              <div className="space-y-6">
                <SectionHeader icon={<FileText size={18} />} title="Trip Description" subtitle="Tell the story of your trip" />
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your trip — goals, vibe, must-dos…"
                  rows={5}
                  className="w-full bg-[#f7f5ff] border border-[#e0deff] rounded-2xl px-4 py-3.5 text-[#1a1240] placeholder:text-[#c0bce0] focus:outline-none focus:ring-2 focus:ring-[#7c6ff7]/40 focus:border-[#7c6ff7] transition-all text-sm font-medium resize-none"
                />
                <p className="text-xs text-[#b0abc8] text-right">{form.description.length} characters</p>

                {/* Summary Card */}
                {(form.name || form.startDate) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#7c6ff7] to-[#5ae8d5] rounded-2xl p-4 text-white"
                  >
                    <p className="text-xs font-semibold opacity-80 mb-1">Trip Summary</p>
                    <p className="font-black text-lg leading-tight">{form.name || "Unnamed Trip"}</p>
                    {form.startDate && form.endDate && (
                      <p className="text-xs opacity-80 mt-1">
                        {new Date(form.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} —{" "}
                        {new Date(form.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          variants={fadeUp} custom={3} initial="hidden" animate="show"
          className="flex items-center justify-between mt-6 gap-4"
        >
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#e0deff] text-[#7c6ff7] font-semibold text-sm hover:bg-[#ede9ff] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => canNext() && setStep((s) => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#7c6ff7] text-white font-semibold text-sm hover:bg-[#6a5ee0] shadow-lg shadow-[#7c6ff7]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#7c6ff7] to-[#5ae8d5] text-white font-bold text-sm shadow-lg shadow-[#7c6ff7]/30 hover:opacity-90 transition-all"
            >
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                    <Check size={16} /> Saved!
                  </motion.span>
                ) : (
                  <motion.span key="save" className="flex items-center gap-2">
                    <Save size={16} /> Save Trip
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div className="text-[#7c6ff7]">{icon}</div>
      <h2 className="text-[#1a1240] font-bold text-base">{title}</h2>
      {subtitle && <span className="text-xs text-[#b0abc8] font-medium ml-1">({subtitle})</span>}
    </div>
  );
}

function DateField({ label, value, min, onChange }) {
  return (
    <div>
      <label className="block text-xs text-[#9b90d8] font-semibold mb-1.5 pl-1">{label}</label>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#f7f5ff] border border-[#e0deff] rounded-2xl px-4 py-3 text-[#1a1240] focus:outline-none focus:ring-2 focus:ring-[#7c6ff7]/40 focus:border-[#7c6ff7] transition-all text-sm font-medium"
      />
    </div>
  );
}