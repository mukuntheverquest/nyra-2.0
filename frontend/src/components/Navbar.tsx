"use client";

import React from "react";
import { Shield, Sparkles, SlidersHorizontal, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  activeMode: "live" | "mock";
  onToggleMode: () => void;
  onOpenSettings: () => void;
  onScrollToAct: (actId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeMode,
  onToggleMode,
  onOpenSettings,
  onScrollToAct,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Lockup: Static & Crisp */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-sans text-base font-extrabold tracking-tight text-slate-900 block leading-tight">
              Nyra 2.0
            </span>
            <span className="text-[11px] text-slate-500 font-mono block leading-none mt-0.5">
              Financial Futures Education
            </span>
          </div>
        </div>

        {/* Navigation Waypoints */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono">
          <button
            onClick={() => onScrollToAct("live-workspace")}
            className="text-slate-600 hover:text-slate-900 transition cursor-pointer font-medium flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live App Simulator
          </button>
          <button
            onClick={() => onScrollToAct("live-dashboard")}
            className="text-slate-600 hover:text-slate-900 transition cursor-pointer font-medium"
          >
            Telemetry &amp; Outreach
          </button>
          <button
            onClick={() => onScrollToAct("access-impact")}
            className="text-slate-600 hover:text-slate-900 transition cursor-pointer font-medium"
          >
            Access &amp; 20% Pool
          </button>
        </nav>

        {/* Controls & CTA */}
        <div className="flex items-center gap-2.5">
          {/* Live / Mock Mode Switch */}
          <button
            onClick={onToggleMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition cursor-pointer ${
              activeMode === "live"
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeMode === "live" ? "text-emerald-600" : "text-slate-400"}`} />
            <span>{activeMode === "live" ? "Haiku 5.5 Live" : "Offline Mock"}</span>
          </button>

          {/* Settings & Privacy Modal */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
            title="Account, B2B Codes & PIPEDA/CASL Compliance"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => onScrollToAct("live-workspace")}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold font-mono transition cursor-pointer shadow-xs"
          >
            <span>Try Live Simulator</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
