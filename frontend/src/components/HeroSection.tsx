"use client";

import React from "react";
import { FloatingShieldVisual } from "./ui/FloatingShieldVisual";
import { ArrowDown, ShieldCheck, Sparkles, Zap, Lock } from "lucide-react";
import { ScrambleText } from "./ui/ScrambleText";

interface HeroSectionProps {
  onScrollToWorkspace: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToWorkspace }) => {
  return (
    <section id="chapter-00" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-[#383E4E]/60">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#2177D1]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Value Prop */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121620] border border-[#383E4E] text-xs font-mono text-[#3A8EE0]">
              <span className="w-2 h-2 rounded-full bg-[#2177D1] animate-ping" />
              <span>CHAPTER 00 // ARCHITECTURAL INTRO</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] uppercase">
              NEVER MISS A BILL. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2177D1] via-[#3A8EE0] to-[#5BA3EC]">
                NEVER FALL FOR A SCAM.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#B6BAC5] font-sans leading-relaxed max-w-2xl">
              Nyra 2.0 is Canada’s first guardrailed financial agent harness built on the{" "}
              <span className="text-white font-medium">A2UI Protocol v1.0</span>. It safeguards post-secondary students and young adults from missed bills, predatory subscription traps, and urgent CRA/Interac refund scams — with{" "}
              <span className="text-[#34C759] font-medium">zero bank login requirements</span> and{" "}
              <span className="text-white font-medium">&lt; $0.02 CAD/month</span> LLM operating cost.
            </p>

            {/* CTAs & Quick Micro-Stats */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onScrollToWorkspace}
                className="px-6 py-3 rounded-xl bg-[#2177D1] hover:bg-[#3A8EE0] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200 inline-flex items-center gap-2 shadow-[0_0_25px_rgba(33,119,209,0.4)] cursor-pointer"
              >
                <span>TEST INTERACTIVE HARNESS</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#121620]/80 border border-[#383E4E] text-xs font-mono text-[#B6BAC5]">
                <ShieldCheck className="w-4 h-4 text-[#34C759]" />
                <span>Zero Bank Credentials · PIPEDA Compliant</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Shield Prism Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <FloatingShieldVisual />
          </div>
        </div>

        {/* Bottom Monospace Telemetry Strip */}
        <div className="mt-14 pt-6 border-t border-[#383E4E]/50">
          <div className="flex flex-wrap justify-between items-center gap-4 text-xs font-mono text-[#B6BAC5]">
            <div className="flex items-center gap-2">
              <span className="text-[#2177D1]">◆</span>
              <span>A2UI NATIVE MOBILE WIDGETS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#34C759]">◆</span>
              <span>ZERO BANK LINKING</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#3A8EE0]">◆</span>
              <span>&lt; $0.02/MO AI COST (HAIKU 5.5 CACHE)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#D4AE52]">◆</span>
              <span>20% YOUTH IMPACT POOL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
