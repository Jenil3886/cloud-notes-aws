import React from "react";
import { Outlet } from "react-router-dom";
import { Cloud, Lock, ShieldCheck, Sparkles } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-mesh font-sans relative overflow-hidden">
      {/* Dynamic glow backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Brand Side (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative z-10 border-r border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl shadow-lg shadow-purple-500/20">
            <Cloud size={28} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
            CloudNotes
          </span>
        </div>

        <div className="my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold tracking-wide">
            <Sparkles size={12} className="animate-pulse" /> AWS Secured Storage Enabled
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight text-left">
            Your ideas, secured in the{" "}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Cloud
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed text-left">
            Create, manage, and scale your personal notes with high performance. Synced with AWS cloud infrastructure for maximum security and availability.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3">
              <Lock size={18} className="text-purple-400" />
              <span className="text-sm font-medium text-slate-300">JWT Authenticated</span>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3">
              <ShieldCheck size={18} className="text-blue-400" />
              <span className="text-sm font-medium text-slate-300">S3 Secure Storage</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} CloudNotes Inc. All rights reserved.
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        {/* Mobile Header */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <div className="p-1.5 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg">
            <Cloud size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            CloudNotes
          </span>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
