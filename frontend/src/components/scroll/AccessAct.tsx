"use client";

import React from "react";
import {
  Check,
  Shield,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
} from "lucide-react";

interface AccessActProps {
  onOpenSettings: () => void;
}

export const AccessAct: React.FC<AccessActProps> = ({ onOpenSettings }) => {
  return (
    <section
      id="act-access"
      data-sc-act="access"
      className="w-full bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-[#2177D1] font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Mission & Transparent Economics</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-sans">
            Affordable for students. <br />
            20% invested back into Ontario youth.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans">
            Every subscription directly funds free financial literacy workshops in high schools
            and community colleges across Canada through Financial Futures Education.
          </p>
        </div>

        {/* 3 Clean White Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Tier 1: $5 / Month */}
          <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_4px_25px_rgba(15,23,42,0.04)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                  Monthly Freedom
                </span>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-4xl font-extrabold text-slate-900">$5</span>
                  <span className="text-sm text-slate-500">CAD / mo</span>
                </div>
                <p className="text-xs text-slate-500 font-sans">
                  Zero commitment. Cancel anytime with a single click.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-sans pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2177D1] shrink-0" />
                  <span>Unlimited SMS bill tracking & auto-roll</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2177D1] shrink-0" />
                  <span>48-hour free trial kill-switch alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2177D1] shrink-0" />
                  <span>Canadian Scam Shield (MITRE F3)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2177D1] shrink-0" />
                  <span>Zero bank credential linking (PIPEDA)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenSettings}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs font-semibold transition cursor-pointer"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Tier 2: $45 / Year (Featured Supporter) */}
          <div className="bg-white border-2 border-[#2177D1] rounded-3xl p-7 shadow-[0_12px_35px_rgba(33,119,209,0.1)] flex flex-col justify-between space-y-6 relative">
            {/* Value Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2177D1] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
              Most Popular · Saves 25%
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-semibold text-[#2177D1] uppercase">
                  Annual Supporter
                </span>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-4xl font-extrabold text-slate-900">$45</span>
                  <span className="text-sm text-slate-500">CAD / yr</span>
                </div>
                <p className="text-xs text-slate-500 font-sans">
                  Equals just $3.75/month. Funds 60 mins of youth workshops.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-sans pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2177D1] shrink-0" />
                  <span className="font-semibold text-slate-900">All features of Monthly plan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2177D1] shrink-0" />
                  <span>20% net profit routed directly to FFE youth pool</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2177D1] shrink-0" />
                  <span>Priority Claude Haiku 5.5 reasoning tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2177D1] shrink-0" />
                  <span>Personal payment streak milestone certificate</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenSettings}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2177D1] hover:bg-[#3A8EE0] text-white font-mono text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              Get Annual Supporter ($45/yr)
            </button>
          </div>

          {/* Tier 3: $10 / Seat / Year Campus Bulk */}
          <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_4px_25px_rgba(15,23,42,0.04)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                  Campus / Cohort Bulk
                </span>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-4xl font-extrabold text-slate-900">$10</span>
                  <span className="text-sm text-slate-500">CAD / seat / yr</span>
                </div>
                <p className="text-xs text-slate-500 font-sans">
                  Sponsor cohorts of 100+ students with $0 cost to the student.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-sans pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2177D1] shrink-0" />
                  <span>Branded campus promo code (e.g. MCMASTER-2026)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2177D1] shrink-0" />
                  <span>Aggregated student cohort late-fee savings report</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2177D1] shrink-0" />
                  <span>FFE live financial wellness campus workshop</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#2177D1] shrink-0" />
                  <span>Dedicated institutional onboarding</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenSettings}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs font-semibold transition cursor-pointer"
            >
              Enter Institutional Code
            </button>
          </div>
        </div>

        {/* 20% Net Profit Youth Literacy Callout */}
        <div className="bg-white border border-emerald-200 rounded-3xl p-8 shadow-[0_4px_25px_rgba(16,185,129,0.06)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>THE 20% SOCIAL COVENANT</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
              Financial Futures Education (FFE) Non-Profit Pledge
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl leading-relaxed">
              We pledge 20% of net profits from all subscriptions directly to support free high school and
              college financial literacy seminars. Every bill paid on time contributes minutes of free education.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center font-mono">
              <span className="text-3xl font-extrabold text-emerald-700 block">60</span>
              <span className="text-[11px] text-slate-600">Minutes Funded Per Sub</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-12 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            <span>© 2026 Nyra 2.0 · Financial Futures Education</span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              Founded by Sanya Bajaj & Aryan Kapur · Canonical site:{" "}
              <a
                href="https://www.nyra-app.ca/"
                target="_blank"
                rel="noreferrer"
                className="text-[#2177D1] hover:underline"
              >
                nyra-app.ca
              </a>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Lock className="w-3.5 h-3.5" /> PIPEDA & CASL Verified
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
};
