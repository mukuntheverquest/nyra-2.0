"use client";

import React from "react";
import { Check, ShieldCheck, Heart, Sparkles, Building, ExternalLink } from "lucide-react";

interface ImpactPricingSectionProps {
  onOpenSettings: () => void;
}

export const ImpactPricingSection: React.FC<ImpactPricingSectionProps> = ({
  onOpenSettings,
}) => {
  return (
    <section id="chapter-03" className="py-20 border-b border-[#383E4E]/60 bg-[#0B0E14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121620] border border-[#383E4E] text-xs font-mono text-[#3A8EE0]">
            <span>CHAPTER 03 // ACCESS & SOCIAL IMPACT</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            ACCESSIBLE PRICING. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2177D1] via-[#3A8EE0] to-[#5BA3EC]">
              EVERY DOLLAR FUNDS YOUTH EDUCATION.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#B6BAC5] font-sans max-w-xl">
            20% of net proceeds directly sponsor Financial Futures Education workshops in high schools and community centres across Ontario.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Monthly */}
          <div className="rounded-2xl p-6 bg-[#121620]/70 border border-[#383E4E] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                FLEXIBLE MONTHLY
              </span>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-3xl font-black text-white">$5</span>
                <span className="text-sm text-slate-400">CAD / mo</span>
              </div>
              <p className="text-xs text-[#B6BAC5] leading-relaxed font-sans">
                Full access to SMS Bill Guard, Free Trial Kill-Switches, and Canadian Scam Shield. Cancel anytime in 1 tap.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-mono pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>Unlimited Bill Tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>Scam Shield Edge Checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>Zero Bank Linking Required</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenSettings}
              className="w-full py-2.5 rounded-xl bg-[#0B0E14] hover:bg-slate-800 border border-[#383E4E] text-xs font-mono text-slate-200 transition cursor-pointer"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Card 2: Annual (Featured Nyra Blue) */}
          <div className="relative rounded-2xl p-6 bg-[#121620] border-2 border-[#2177D1] shadow-[0_0_35px_rgba(33,119,209,0.3)] flex flex-col justify-between space-y-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#2177D1] text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(33,119,209,0.5)]">
              ★ MOST POPULAR & IMPACTFUL
            </div>
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#3A8EE0] uppercase tracking-wider font-semibold">
                  ANNUAL SUPPORTER
                </span>
                <span className="text-[10px] font-mono text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded border border-[#34C759]/30">
                  Save 25%
                </span>
              </div>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-4xl font-black text-white">$45</span>
                <span className="text-sm text-slate-400">CAD / yr</span>
              </div>
              <p className="text-xs text-[#B6BAC5] leading-relaxed font-sans">
                Equivalent to <span className="text-white font-medium">$3.75/mo</span>. Includes an automatic 20% contribution directly funding free financial literacy workshops for underserved youth.
              </p>
              <ul className="space-y-2 text-xs text-slate-200 font-mono pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>All Standard Bill & Scam Protections</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>20% Donated to FFE Youth Workshop Pool</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>Annual Youth Impact Certificate</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenSettings}
              className="w-full py-2.5 rounded-xl bg-[#2177D1] hover:bg-[#3A8EE0] text-white text-xs font-mono font-bold tracking-wider uppercase transition cursor-pointer shadow-[0_0_20px_rgba(33,119,209,0.4)]"
            >
              Get Annual ($45/yr)
            </button>
          </div>

          {/* Card 3: Institutional Campus Bulk */}
          <div className="rounded-2xl p-6 bg-[#121620]/70 border border-[#383E4E] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono text-[#D4AE52] uppercase tracking-wider block">
                CAMPUS &amp; COHORT BULK
              </span>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-3xl font-black text-white">$10</span>
                <span className="text-sm text-slate-400">CAD / seat / yr</span>
              </div>
              <p className="text-xs text-[#B6BAC5] leading-relaxed font-sans">
                For Canadian student unions, universities, colleges, and youth charities sponsoring cohorts of 100+ students with $0 out-of-pocket cost to the student.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-mono pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>B2B2C Instant Cohort Code</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>Aggregate Anonymized Impact Metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>Dedicated Campus Onboarding Workshop</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenSettings}
              className="w-full py-2.5 rounded-xl bg-[#0B0E14] hover:bg-slate-800 border border-[#383E4E] text-xs font-mono text-slate-200 transition cursor-pointer"
            >
              Enter Campus Code
            </button>
          </div>
        </div>

        {/* Regulatory & Compliance Badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-6 text-xs font-mono text-[#B6BAC5]">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121620] border border-[#383E4E]/60">
            <ShieldCheck className="w-4 h-4 text-[#34C759]" />
            <span>PIPEDA Compliant · No Bank Linking</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121620] border border-[#383E4E]/60">
            <span className="w-2 h-2 rounded-full bg-[#34C759]" />
            <span>CASL Anti-Spam Act · Reply STOP Anytime</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121620] border border-[#383E4E]/60">
            <Heart className="w-4 h-4 text-[#EF4444]" />
            <span>20% Net Profit &rarr; FFE High School Literacy Pool</span>
          </div>
        </div>

        {/* Minimal Architectural Footer */}
        <footer className="mt-16 pt-8 border-t border-[#383E4E]/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <div>
            <span>Canonical Platform: </span>
            <a
              href="https://www.nyra-app.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3A8EE0] hover:underline"
            >
              https://www.nyra-app.ca
            </a>
          </div>
          <div className="text-center sm:text-right">
            <span>Co-founders: Sanya Bajaj &amp; Aryan Kapur</span>
            <span className="block mt-0.5 text-[11px] text-slate-600">
              © 2026 Financial Futures Education (FFE). All rights reserved.
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
};
