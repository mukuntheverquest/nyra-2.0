"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Calendar,
  Clock,
  ArrowRight,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface HeroActProps {
  onScrollToWorkspace: () => void;
  onScrollToIntercept: () => void;
}

export const HeroAct: React.FC<HeroActProps> = ({
  onScrollToWorkspace,
  onScrollToIntercept,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section
      id="act-hero"
      data-sc-act="hero"
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[92vh] flex flex-col justify-center items-center bg-white px-4 sm:px-6 lg:px-8 py-16 overflow-hidden"
    >
      {/* Background Architectural Grid & Sky Blue Wash */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#F1F5F9_1px,transparent_1px),linear-gradient(to_bottom,#F1F5F9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-100/40 via-sky-50/50 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* Editorial Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#2177D1] animate-pulse" />
          <span className="font-semibold text-slate-900">Nyra 2.0</span>
          <span className="text-slate-300">|</span>
          <span>Canadian Financial Safety & Youth Literacy</span>
        </div>

        {/* Big Editorial Headline */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 font-sans leading-[1.08]">
            NEVER MISS A BILL. <br />
            <span className="text-[#2177D1]">NEVER FALL FOR A SCAM.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
            Deterministic SMS financial guardrails, automated trial kill-switches, and zero-bank-linking privacy.
            Powered by Claude Haiku 5.5 and open-standard <strong>A2UI declarative surfaces</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onScrollToWorkspace}
            className="px-6 py-3 rounded-xl bg-[#2177D1] hover:bg-[#3A8EE0] text-white font-mono font-semibold text-sm transition shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>Launch Live A2UI Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onScrollToIntercept}
            className="px-6 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 font-mono font-medium text-sm transition cursor-pointer"
          >
            See Guardrails in Action
          </button>
        </div>

        {/* 3 Floating Depth Planes (Tension Cards) with Parallax */}
        <div className="w-full pt-10 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl">
          {/* Card 1: Trial Kill-Switch Alert */}
          <div
            style={{
              transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -8}px)`,
              transition: "transform 0.15s ease-out",
            }}
            className="bg-white border border-amber-200/80 rounded-2xl p-4 shadow-[0_10px_25px_rgba(217,119,6,0.06)] space-y-2.5 relative group hover:border-amber-300"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" /> 48h Advance Kill-Switch
              </span>
              <span className="text-slate-400 font-semibold">$34.99/mo</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Adobe Creative Cloud</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Charges start Dec 2. Auto-reminds you 2 days prior with a 1-tap cancellation workflow.
              </p>
            </div>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero recurring charge surprise</span>
            </div>
          </div>

          {/* Card 2: MITRE F3 Scam Shield Intercept */}
          <div
            style={{
              transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 12}px)`,
              transition: "transform 0.15s ease-out",
            }}
            className="bg-white border border-red-200/80 rounded-2xl p-4 shadow-[0_10px_25px_rgba(220,38,38,0.06)] space-y-2.5 relative group hover:border-red-300"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-600" /> High Risk Scam Intercept
              </span>
              <span className="text-red-700 font-bold font-mono">BLOCKED</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Fake Interac / OSAP Refund</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Urgent &quot;24-hour expiry&quot; lure caught by MITRE F3 rule before any credentials compromised.
              </p>
            </div>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-600">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>CAFC safety protocol dispatched</span>
            </div>
          </div>

          {/* Card 3: Auto-Rolling Student Bill */}
          <div
            style={{
              transform: `translate(${mousePos.x * -8}px, ${mousePos.y * 14}px)`,
              transition: "transform 0.15s ease-out",
            }}
            className="bg-white border border-blue-200/80 rounded-2xl p-4 shadow-[0_10px_25px_rgba(33,119,209,0.06)] space-y-2.5 relative group hover:border-blue-300"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600" /> Auto-Rolls on Payment
              </span>
              <span className="text-blue-700 font-bold font-mono">$55.00 CAD</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Rogers Student Phone</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Auto-rolled from Nov 18 to Dec 18. Streak maintained, saving $25 late fee.
              </p>
            </div>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>PAD safety balance warning</span>
            </div>
          </div>
        </div>

        {/* Monospace Architectural Trust Bar */}
        <div className="w-full pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>PIPEDA Compliant · Zero Bank Account Linking</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2177D1]" />
            <span>Claude Haiku 5.5 · Cost &lt; $0.02 CAD / mo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>20% Net Profit Funds Youth Literacy</span>
          </div>
        </div>
      </div>
    </section>
  );
};
