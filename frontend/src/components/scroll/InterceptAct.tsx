"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  RefreshCw,
  FileCheck,
} from "lucide-react";

interface InterceptActProps {
  onScrollToWorkspace: () => void;
}

const THREAT_STEPS = [
  {
    id: "pii",
    title: "1. Zero-Trust PII Edge Scrubber",
    tag: "PIPEDA / PRE-LLM FILTER",
    cost: "$0.00 LLM Cost",
    rawText: "My SIN is 123-456-789 and student card is 4500-1234-5678-9010. Can you check my CRA refund?",
    scrubbedText: "My SIN is [REDACTED_SIN] and student card is [REDACTED_CARD]. Can you check my CRA refund?",
    ruleResult: "Edge regex filter intercepted SIN & Card tokens before Anthropic API call. Est. cost: 0 tokens.",
    a2uiTitle: "Zero-Trust Privacy Shield",
    a2uiStatus: "Scrubbed at Edge",
    a2uiStatusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    a2uiButton: "Acknowledge Zero-Trust Invariant",
  },
  {
    id: "scam",
    title: "2. Canadian Scam Shield (MITRE F3)",
    tag: "CAFC ANTI-FRAUD / CACHE MATCH",
    cost: "Cached Edge Rule",
    rawText: "INTERAC: You received $240 from OSAP Refund. Claim now at bit.ly/osap-refund-ca before it expires in 24 hours!",
    scrubbedText: "INTERAC: You received $240 from OSAP Refund. Claim now at bit.ly/osap-refund-ca [HIGH RISK DOMAIN]",
    ruleResult: "Flagged MITRE F3 Tactic: Phishing via SMS with artificial 24h urgency. Interac e-Transfers never expire in 24h.",
    a2uiTitle: "High Risk Scam Intercepted",
    a2uiStatus: "CRITICAL FRAUD",
    a2uiStatusColor: "text-red-800 bg-red-50 border-red-200",
    a2uiButton: "Confirm Scam Blocked",
  },
  {
    id: "calc",
    title: "3. 2026 Ontario Paycheque & Rent Guard",
    tag: "DETERMINISTIC STATUTORY FORMULA",
    cost: "Exact Math Engine",
    rawText: "I make $18/hr working 20 hours a week in Ontario. Can I afford $850 rent?",
    scrubbedText: "Gross: $1,560.00/mo | CRA & ON Tax: $109.20 | CPP & EI: $124.80 | Net: $1,326.00/mo",
    ruleResult: "Rent is 64.1% of net income (exceeds 30% healthy threshold). Dispatched educational breakdown.",
    a2uiTitle: "Ontario 2026 Paycheque Breakdown",
    a2uiStatus: "64.1% Rent Ratio",
    a2uiStatusColor: "text-amber-800 bg-amber-50 border-amber-200",
    a2uiButton: "Track $850 Rent as Bill",
  },
];

export const InterceptAct: React.FC<InterceptActProps> = ({ onScrollToWorkspace }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isMorphed, setIsMorphed] = useState(false);

  const current = THREAT_STEPS[activeStep];

  return (
    <section
      id="act-intercept"
      data-sc-act="intercept"
      className="w-full bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-200"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-[#2177D1] font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Deterministic Guardrail Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
            Scrubbed at the edge. <br className="hidden sm:inline" />
            Zero tokens wasted on raw threats.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans">
            Incoming SMS texts never hit raw LLMs unfiltered. Every inbound message flows through
            deterministic pre-LLM middleware to sanitize PII, neutralize scams, and run statutory math.
          </p>
        </div>

        {/* Step Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {THREAT_STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => {
                setActiveStep(idx);
                setIsMorphed(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border transition cursor-pointer flex items-center gap-2 ${
                activeStep === idx
                  ? "bg-[#2177D1] text-white border-[#2177D1] shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeStep === idx ? "bg-white" : "bg-[#2177D1]"}`} />
              <span>{step.title}</span>
            </button>
          ))}
        </div>

        {/* Bespoke Signature Move: Threat-to-Surface Interactive Morph Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
          {/* Left Column: Raw Threat Scrubbed in Real-Time */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono font-bold text-slate-900 uppercase">
                {current.tag}
              </span>
              <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {current.cost}
              </span>
            </div>

            {/* Inbound Raw Text Simulation */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold block">
                Inbound Raw Text:
              </span>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed">
                {current.rawText}
              </div>
            </div>

            {/* Edge Scrubber Output */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold block flex items-center justify-between">
                <span>Deterministic Edge Scrubbing:</span>
                <span className="text-emerald-600 font-bold">100% Deterministic</span>
              </span>
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 text-xs font-mono text-slate-900 leading-relaxed">
                {current.scrubbedText}
              </div>
            </div>

            {/* Guardrail Policy Explanation */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5 font-sans">
              <CheckCircle2 className="w-4 h-4 text-[#2177D1] shrink-0 mt-0.5" />
              <span>{current.ruleResult}</span>
            </div>

            {/* Morph Button Trigger */}
            <div className="pt-2">
              <button
                onClick={() => setIsMorphed(!isMorphed)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-mono text-xs font-semibold border border-slate-200 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isMorphed ? "rotate-180" : ""} transition-transform duration-300 text-[#2177D1]`} />
                <span>{isMorphed ? "Reset to Raw SMS View" : "Morph Into A2UI Declarative Card"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Morph Target — Crystallized A2UI Card */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50/70 rounded-2xl border border-slate-200 min-h-[380px] relative overflow-hidden transition-all">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-3">
              A2UI Protocol Crystallization Target
            </span>

            {/* The Morphed A2UI Card Component */}
            <div
              className={`w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_25px_rgba(15,23,42,0.06)] space-y-4 transition-all duration-500 transform ${
                isMorphed
                  ? "scale-100 opacity-100 shadow-[0_12px_35px_rgba(33,119,209,0.12)] border-[#2177D1]/50"
                  : "scale-95 opacity-90"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#2177D1] flex items-center justify-center text-white">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-sans text-xs font-bold text-slate-900">
                    {current.a2uiTitle}
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${current.a2uiStatusColor}`}>
                  {current.a2uiStatus}
                </span>
              </div>

              {/* Data Model Body */}
              <div className="space-y-2 text-xs font-sans text-slate-600 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                <p className="text-slate-800 font-medium">{current.ruleResult}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200">
                  <span>Surface ID: surf_{current.id}_morph</span>
                  <span>A2UI v0.9 basicCatalog</span>
                </div>
              </div>

              {/* Interactive Action Button */}
              <button
                onClick={onScrollToWorkspace}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2177D1] hover:bg-[#3A8EE0] text-white text-xs font-mono font-semibold transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{current.a2uiButton}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] font-mono text-slate-400 mt-4 text-center">
              Tap the button above to execute this action in the live mobile simulator below.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
