"use client";

import React from "react";
import { Shield, Sparkles, Settings, ArrowDown, Activity } from "lucide-react";
import { ScrambleText } from "./ui/ScrambleText";

interface NavbarHudProps {
  activeMode: "live" | "mock";
  onToggleMode: () => void;
  onOpenSettings: () => void;
  onScrollToWorkspace: () => void;
}

export const NavbarHud: React.FC<NavbarHudProps> = ({
  activeMode,
  onToggleMode,
  onOpenSettings,
  onScrollToWorkspace,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#383E4E]/80 bg-[#0B0E14]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Geometric Emblem + Brand + FFE sub-label */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2177D1] to-[#3A8EE0] flex items-center justify-center shadow-[0_0_15px_rgba(33,119,209,0.4)]">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-tight text-white">
                <ScrambleText text="NYRA 2.0" />
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2177D1]/15 text-[#3A8EE0] border border-[#2177D1]/30">
                A2UI v1.0
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#B6BAC5] block leading-none mt-0.5">
              Financial Futures Education // Guardrailed Harness
            </span>
          </div>
        </div>

        {/* Center: Scroll-Synced Waypoint Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-[#B6BAC5]">
          <a
            href="#chapter-00"
            className="hover:text-white transition hover:text-[#3A8EE0]"
          >
            00 // INTRO
          </a>
          <a
            href="#chapter-01"
            className="hover:text-white transition hover:text-[#3A8EE0]"
          >
            01 // MOBILE + DASHBOARD
          </a>
          <a
            href="#chapter-02"
            className="hover:text-white transition hover:text-[#3A8EE0]"
          >
            02 // ENGINE
          </a>
          <a
            href="#chapter-03"
            className="hover:text-white transition hover:text-[#3A8EE0]"
          >
            03 // ACCESS
          </a>
        </nav>

        {/* Right: Controls + CTA */}
        <div className="flex items-center gap-2.5">
          {/* Live / Mock Mode Toggle */}
          <button
            onClick={onToggleMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs border transition cursor-pointer ${
              activeMode === "live"
                ? "bg-[#2177D1]/20 border-[#2177D1] text-[#3A8EE0]"
                : "bg-[#121620] border-[#383E4E] text-slate-300 hover:text-white"
            }`}
            title="Toggle between Live Claude Haiku 5.5 and Offline Mock Engine"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeMode === "live"
                  ? "bg-[#34C759] animate-pulse"
                  : "bg-slate-500"
              }`}
            />
            <span>{activeMode === "live" ? "LIVE HAIKU 5.5" : "OFFLINE MOCK"}</span>
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg border border-[#383E4E] bg-[#121620] hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title="Settings & CASL Compliance"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Launch Workspace CTA */}
          <button
            onClick={onScrollToWorkspace}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2177D1] hover:bg-[#3A8EE0] text-white font-mono text-xs font-medium transition cursor-pointer shadow-[0_0_15px_rgba(33,119,209,0.3)]"
          >
            <span>LAUNCH WORKSPACE</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
