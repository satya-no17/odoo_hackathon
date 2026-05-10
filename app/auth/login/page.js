"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import PlanzoLogo from "@/components/PlanzoLogo";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) { setMessage(data.message || "Login failed"); return; }
    localStorage.setItem("traveloop_user", JSON.stringify(data.user));
    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-[#faf9ff] flex flex-col items-center justify-center px-4 py-10 overflow-hidden font-sans">

      {/* Blobs */}
      <div className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-violet-300 opacity-[0.18] blur-[110px] animate-pulse" />
      <div className="absolute -bottom-28 -right-24 w-[400px] h-[400px] rounded-full bg-indigo-300 opacity-[0.18] blur-[100px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-1/3 left-[62%] w-[240px] h-[240px] rounded-full bg-sky-200 opacity-[0.15] blur-[80px] animate-pulse [animation-delay:4s]" />

      {/* Floating dots */}
      <div className="absolute top-16 right-20 w-2 h-2 rounded-full bg-violet-300 opacity-50" />
      <div className="absolute top-28 right-36 w-1.5 h-1.5 rounded-full bg-indigo-200 opacity-40" />
      <div className="absolute bottom-24 left-16 w-2.5 h-2.5 rounded-full bg-violet-200 opacity-40" />
      <div className="absolute bottom-40 left-32 w-1 h-1 rounded-full bg-sky-300 opacity-50" />

      {/* Logo + tagline */}
      <div className="animate-[fadeUp_0.5s_ease_both] mb-0.5">
        <PlanzoLogo className="h-24 w-auto" />
      </div>
      <p className="animate-[fadeUp_0.5s_ease_both] [animation-delay:0.05s] text-[10px] text-violet-300 font-bold tracking-[0.25em] uppercase mb-7">
        All plans. One journey.
      </p>

      {/* Card */}
      <div className="w-full max-w-[420px] bg-white/85 backdrop-blur-3xl border border-violet-100 rounded-[30px] px-8 py-8 shadow-[0_16px_64px_rgba(109,93,230,0.13)] animate-[fadeUp_0.6s_ease_both] [animation-delay:0.1s]">

        {/* Tabs */}
        <div className="flex gap-1 bg-[#f3f1ff] rounded-2xl p-1 mb-7">
          <span className="flex-1 text-center py-2.5 rounded-xl text-[13px] font-extrabold text-violet-700 bg-white shadow-sm cursor-default tracking-tight">
            Sign In
          </span>
          <Link href="/auth/signup" className="flex-1 text-center py-2.5 rounded-xl text-[13px] font-semibold text-gray-400 hover:text-violet-500 transition-colors">
            Create Account
          </Link>
        </div>

        {/* Heading */}
        <h1 className="text-[26px] font-black text-indigo-950 tracking-tight leading-tight mb-0.5">
          Good to see you again.
        </h1>
        <p className="text-[13px] text-gray-400 mb-6">Pick up right where you left off.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div className="animate-[fadeUp_0.45s_ease_both] [animation-delay:0.18s]">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Email</label>
            <div className="relative flex items-center">
              <Mail size={14} className="absolute left-3.5 text-violet-300 pointer-events-none" />
              <input
                type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={updateField} required
                className="w-full pl-9 pr-4 py-3 bg-[#f7f5ff] border border-violet-100 rounded-2xl text-sm text-indigo-950 placeholder:text-gray-300 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="animate-[fadeUp_0.45s_ease_both] [animation-delay:0.25s]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Password</label>
              <Link href="/auth/forgot-password" className="text-[11px] font-bold text-violet-400 hover:text-violet-600 transition-colors">Forgot it?</Link>
            </div>
            <div className="relative flex items-center">
              <Lock size={14} className="absolute left-3.5 text-violet-300 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"} name="password" placeholder="••••••••"
                value={form.password} onChange={updateField} required
                className="w-full pl-9 pr-10 py-3 bg-[#f7f5ff] border border-violet-100 rounded-2xl text-sm text-indigo-950 placeholder:text-gray-300 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-300 hover:text-violet-400 transition-colors" aria-label="Toggle password">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {message && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-100">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <p className="text-xs text-red-500 font-semibold">{message}</p>
            </div>
          )}

          {/* CTA */}
          <button type="submit" disabled={loading}
            className="animate-[fadeUp_0.45s_ease_both] [animation-delay:0.32s] relative w-full py-3.5 mt-0.5 bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-500 text-white font-extrabold rounded-2xl text-[14px] tracking-tight shadow-[0_8px_28px_rgba(109,93,230,0.38)] hover:shadow-[0_10px_32px_rgba(109,93,230,0.48)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
          >
            <span className="relative z-10">{loading ? "Signing in..." : "Let's go →"}</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
          </button>
        </form>

        <p className="text-center text-[12px] text-gray-400 mt-6">
          New to Planzo?{" "}
          <Link href="/auth/signup" className="text-violet-500 font-extrabold hover:text-violet-700 transition-colors">
            Create a free account
          </Link>
        </p>
      </div>

      <p className="animate-[fadeUp_0.6s_ease_both] [animation-delay:0.5s] text-[10px] text-gray-300 font-medium mt-6 tracking-widest uppercase">
        Secure · Private · No ads, ever.
      </p>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
