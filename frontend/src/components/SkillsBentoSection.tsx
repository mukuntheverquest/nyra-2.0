"use client";

import React from "react";
import {
  Calendar,
  ShieldAlert,
  GraduationCap,
  Layers,
  Sparkles,
  Lock,
  ArrowRight,
  Zap,
} from "lucide-react";

export const SkillsBentoSection: React.FC = () => {
  return (
    <section id="chapter-02" className="py-20 border-b border-[#383E4E]/60 bg-[#0B0E14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121620] border border-[#383E4E] text-xs font-mono text-[#3A8EE0]">
            <span>CHAPTER 02 // GUARDRAILED ENGINE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            FOUR CORE CAPABILITIES. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2177D1] to-[#5BA3EC]">
              ZERO COMPROMISES ON USER TRUST.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#B6BAC5] font-sans max-w-2xl">
            Engineered specifically for Canadian youth and post-secondary students facing complex bills, subscription lock-ins, and sophisticated fraud tactics.
          </p>
        </div>

        {/* 4-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Bill & Trial Guard */}
          <div className="group relative rounded-2xl p-6 bg-[#121620]/80 border border-[#383E4E] hover:border-[#2177D1] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#2177D1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#2177D1]/15 text-[#3A8EE0] border border-[#2177D1]/30 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#3A8EE0] uppercase tracking-wider block">
                01 // BILL & TRIAL GUARD
              </span>
              <h3 className="text-lg font-bold text-white font-sans">
                Predictive Kill-Switches & Auto-Rolling Dates
              </h3>
              <p className="text-xs text-[#B6BAC5] leading-relaxed font-sans">
                Text any receipt or trial note. Nyra tracks due dates, alerts 48h prior to recurring credit card charges, and automatically advances bill cycles upon payment confirmation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#383E4E]/40 font-mono text-[11px] text-[#34C759] flex items-center gap-1.5">
              <span>Auto-Roll Invariant</span>
              <span className="text-slate-600">&bull;</span>
              <span>PAD Auto-Debit Sync</span>
            </div>
          </div>

          {/* Card 2: Canadian Scam Shield */}
          <div className="group relative rounded-2xl p-6 bg-[#121620]/80 border border-[#383E4E] hover:border-[#D04040] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D04040] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#D04040]/15 text-[#EF4444] border border-[#D04040]/30 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#EF4444] uppercase tracking-wider block">
                02 // CANADIAN SCAM SHIELD
              </span>
              <h3 className="text-lg font-bold text-white font-sans">
                MITRE F3 Edge Fraud Detection
              </h3>
              <p className="text-xs text-[#B6BAC5] leading-relaxed font-sans">
                Evaluates incoming texts against documented Canadian threat vectors: urgent Interac e-transfers, CRA tax refunds, fake OSAP deposits, and student rental scams before any link is opened.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#383E4E]/40 font-mono text-[11px] text-[#EF4444] flex items-center gap-1.5">
              <span>CAFC Taxonomies</span>
              <span className="text-slate-600">&bull;</span>
              <span>Zero-Link Isolation</span>
            </div>
          </div>

          {/* Card 3: FFE Money Coach */}
          <div className="group relative rounded-2xl p-6 bg-[#121620]/80 border border-[#383E4E] hover:border-[#D4AE52] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C39A35] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#C39A35]/15 text-[#D4AE52] border border-[#C39A35]/30 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#D4AE52] uppercase tracking-wider block">
                03 // FFE MONEY COACH
              </span>
              <h3 className="text-lg font-bold text-white font-sans">
                2026 Ontario Tax & Rent Affordability
              </h3>
              <p className="text-xs text-[#B6BAC5] leading-relaxed font-sans">
                Provides precise net take-home estimates based on 2026 Ontario minimum wage ($17.20+), CPP/EI deductions, and 50/30/20 guidelines — strictly grounded in verified FFE curriculum.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#383E4E]/40 font-mono text-[11px] text-[#D4AE52] flex items-center gap-1.5">
              <span>Non-Advisory Bound</span>
              <span className="text-slate-600">&bull;</span>
              <span>Grounded Citations</span>
            </div>
          </div>

          {/* Card 4: A2UI Trust Boundary */}
          <div className="group relative rounded-2xl p-6 bg-[#121620]/80 border border-[#383E4E] hover:border-[#2177D1] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#2177D1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#2177D1]/15 text-[#3A8EE0] border border-[#2177D1]/30 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#3A8EE0] uppercase tracking-wider block">
                04 // A2UI TRUST BOUNDARY
              </span>
              <h3 className="text-lg font-bold text-white font-sans">
                Declarative UI &amp; $0.00 Direct Actions
              </h3>
              <p className="text-xs text-[#B6BAC5] leading-relaxed font-sans">
                AI cannot execute arbitrary code or scripts. Components render strictly through a hardened React catalog (`application/a2ui+json`), and buttons dispatch deterministic DB actions at $0.00 LLM cost.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#383E4E]/40 font-mono text-[11px] text-[#3A8EE0] flex items-center gap-1.5">
              <span>v1.0 Spec Contract</span>
              <span className="text-slate-600">&bull;</span>
              <span>Zero-Token Actions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
