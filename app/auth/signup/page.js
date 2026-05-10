"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import PlanzoLogo from "../PlanzoLogo";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // TODO: connect to backend auth
    console.log("Signup:", formData);
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10 overflow-hidden font-sans">

      {/* Background blobs */}
      <div className="absolute -top-36 -left-28 w-[480px] h-[480px] rounded-full bg-violet-400 opacity-15 blur-[90px] animate-pulse" />
      <div className="absolute -bottom-24 -right-20 w-[340px] h-[340px] rounded-full bg-purple-400 opacity-15 blur-[80px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-1/2 left-[62%] w-[200px] h-[200px] rounded-full bg-sky-300 opacity-10 blur-[70px] animate-pulse [animation-delay:4s]" />

      {/* Logo */}
      <div className="animate-[fadeUp_0.5s_ease_both] mb-2">
        <PlanzoLogo className="w-48 h-auto" />
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-[440px] bg-white/70 backdrop-blur-2xl border border-violet-200/50 rounded-3xl px-8 py-8 shadow-[0_8px_48px_rgba(109,93,230,0.10)] animate-[fadeUp_0.6s_ease_both] [animation-delay:0.1s]">

        {/* Tabs */}
        <div className="flex gap-1 bg-violet-50/70 rounded-xl p-1 mb-6">
          <Link
            href="/auth/login"
            className="flex-1 text-center py-2 rounded-[10px] text-sm font-semibold text-gray-500 hover:text-violet-600 transition-colors"
          >
            Login
          </Link>
          <span className="flex-1 text-center py-2 rounded-[10px] text-sm font-semibold text-violet-700 bg-white shadow-sm cursor-default">
            Sign Up
          </span>
        </div>

        <h1 className="text-[22px] font-bold text-indigo-950 mb-1">Create Account</h1>
        <p className="text-sm text-gray-500 mb-6">Start planning your dream trips today</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Name Row */}
          <div className="flex gap-3 animate-[fadeUp_0.45s_ease_both] [animation-delay:0.18s]">
            <div className="flex-1">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                First Name
              </label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3 text-violet-400 pointer-events-none" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="Priya"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-violet-50/40 border border-violet-200/50 rounded-xl text-sm text-indigo-950 placeholder:text-gray-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:bg-violet-50/70"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Last Name
              </label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3 text-violet-400 pointer-events-none" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Sharma"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-violet-50/40 border border-violet-200/50 rounded-xl text-sm text-indigo-950 placeholder:text-gray-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:bg-violet-50/70"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="animate-[fadeUp_0.45s_ease_both] [animation-delay:0.24s]">
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3 text-violet-400 pointer-events-none" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-violet-50/40 border border-violet-200/50 rounded-xl text-sm text-indigo-950 placeholder:text-gray-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:bg-violet-50/70"
              />
            </div>
          </div>

          {/* Password */}
          <div className="animate-[fadeUp_0.45s_ease_both] [animation-delay:0.30s]">
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-violet-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-10 py-2.5 bg-violet-50/40 border border-violet-200/50 rounded-xl text-sm text-indigo-950 placeholder:text-gray-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:bg-violet-50/70"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-violet-500 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="animate-[fadeUp_0.45s_ease_both] [animation-delay:0.36s]">
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-violet-400 pointer-events-none" />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-10 py-2.5 bg-violet-50/40 border border-violet-200/50 rounded-xl text-sm text-indigo-950 placeholder:text-gray-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:bg-violet-50/70"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 text-gray-400 hover:text-violet-500 transition-colors"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="animate-[fadeUp_0.45s_ease_both] [animation-delay:0.42s] w-full py-3 mt-1 bg-gradient-to-r from-violet-500 to-indigo-400 hover:from-violet-600 hover:to-indigo-500 text-white font-bold rounded-xl text-[15px] shadow-[0_4px_18px_rgba(109,93,230,0.30)] hover:shadow-[0_6px_22px_rgba(109,93,230,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Create Account
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2.5 animate-[fadeUp_0.45s_ease_both] [animation-delay:0.48s]">
            <span className="flex-1 h-px bg-violet-100" />
            <span className="text-xs text-gray-400">or continue with</span>
            <span className="flex-1 h-px bg-violet-100" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="animate-[fadeUp_0.45s_ease_both] [animation-delay:0.54s] w-full flex items-center justify-center gap-2.5 py-2.5 bg-white border border-violet-200/60 rounded-xl text-sm font-semibold text-gray-700 hover:bg-violet-50 hover:shadow-md transition-all duration-200"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <p className="text-center text-[13px] text-gray-500 mt-5">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-violet-600 font-bold hover:underline">
            Sign in
          </Link>
        </p>
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
