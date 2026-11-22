"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  BellRing,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CalendarCheck,
  Calculator,
  Lock,
  MailCheck,
  CreditCard,
} from "lucide-react";
import { useScrollCraft } from "@/lib/scrollCraftEngine";

const A2UIMobileRuntime = dynamic(
  () =>
    import("@/components/a2ui/A2UIMobileRuntime").then(
      (mod) => mod.A2UIMobileRuntime
    ),
  { ssr: false }
);

interface LiveSimulatorSectionProps {
  user: any;
  bills: any[];
  trials: any[];
  messages: any[];
  latestA2UIMessages: any[];
  isLoading: boolean;
  activeMode: "live" | "mock";
  onToggleMode: () => void;
  onOpenSettings: () => void;
  onSendMessage: (msg: string) => void;
  onAction: (surfaceId: string, actionName: string, context?: any, dataModel?: any) => void;
  onTriggerCron: () => void;
  onResetDemo: () => void;
}

export const LiveSimulatorSection: React.FC<LiveSimulatorSectionProps> = ({
  user,
  bills,
  trials,
  messages,
  latestA2UIMessages,
  isLoading,
  activeMode,
  onToggleMode,
  onOpenSettings,
  onSendMessage,
  onAction,
  onTriggerCron,
  onResetDemo,
}) => {
  // Activate scroll-craft tilt & magnet listeners
  useScrollCraft([activeMode, isLoading]);

  const triggerCards = [
    {
      id: "trial",
      num: "01",
      title: "Trial Kill-Switch",
      desc: "Start a 14-day Adobe free trial and lock in a 48-hour auto-cancel SMS alert.",
      prompt: "Just started an Adobe free trial today for 14 days, remind me 2 days before it charges",
      icon: CalendarCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: "scam",
      num: "02",
      title: "Canadian Scam Shield",
      desc: "Forward a fake Interac / OSAP refund text to trigger MITRE F3 fraud detection.",
      prompt: "INTERAC: You received $240 from OSAP Refund. Claim now at bit.ly/osap-refund-ca before it expires in 24 hours!",
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      id: "paycheque",
      num: "03",
      title: "2026 Ontario Paycheque",
      desc: "Calculate deterministic 2026 net take-home pay ($18/hr, 20h/wk) vs. $850 rent.",
      prompt: "I make $18/hr working 20 hours a week in Ontario. Can I afford $850 rent?",
      icon: Calculator,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      id: "pii",
      num: "04",
      title: "Zero-Trust PII Guardrail",
      desc: "Send test SIN 123-456-789 — watch it scrub locally before touching the AI ($0.00).",
      prompt: "My SIN is 123-456-789, can you check my CRA tax return?",
      icon: Lock,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      id: "paid",
      num: "05",
      title: "Mark Bill Paid + Streak",
      desc: "Pay Rogers Phone ($55) to auto-roll next month's due date and boost your streak.",
      prompt: "Just paid my Rogers Phone bill!",
      icon: CreditCard,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      id: "outreach",
      num: "06",
      title: "Youth Outreach & Email Agent",
      desc: "Find our top prospective Ontario youth/campus lead, draft a CASL-compliant email, and approve & send in 1 tap.",
      prompt: "Find our top prospective youth campus lead and draft a personalized CASL-compliant outreach email introducing Nyra 2.0's bill guard and scam shield.",
      icon: MailCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
      isOwnerAgent: true,
    },
  ];

  return (
    <section
      id="live-workspace"
      data-sc-act="flow"
      data-sc-section="simulator"
      className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 3.1 Clean Popping Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-sm font-mono font-bold uppercase tracking-widest text-blue-600 block">
            Interactive Mobile Experience
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-sans">
            Test Nyra 2.0 Live.
          </h2>
          <p className="text-lg text-slate-600 font-sans leading-relaxed">
            Tap any scenario on the right or text Nyra directly inside the phone
            to trigger interactive cards, scam defense, and owner outreach
            approval.
          </p>
        </div>

        {/* 2-Column Split: Titanium Phone Left + 6-Card Command Deck Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (5 Cols): Titanium Smartphone */}
          <div className="lg:col-span-5 w-full flex justify-center sticky top-24">
            <A2UIMobileRuntime
              messages={messages}
              bills={bills}
              trials={trials}
              isLoading={isLoading}
              activeMode={activeMode}
              onSendMessage={onSendMessage}
              onAction={onAction}
              latestEnvelopes={latestA2UIMessages}
            />
          </div>

          {/* Right Column (7 Cols): Interactive 6-Card Command Deck */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Control Strip */}
            <div className="flex items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-semibold text-slate-700">
                  FastAPI Connected (:8000)
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Live / Mock Mode Switch */}
                <button
                  onClick={onToggleMode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition cursor-pointer bg-white text-slate-800 border-slate-200 hover:bg-slate-100 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {activeMode === "live" ? "Live Haiku 5.5" : "Offline Mock"}
                  </span>
                </button>

                {/* Simulate 9 AM Digest */}
                <button
                  onClick={onTriggerCron}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-700 transition cursor-pointer shadow-2xs"
                >
                  <BellRing className="w-3.5 h-3.5 text-blue-600" />
                  <span>Simulate 9 AM Digest</span>
                </button>

                {/* Reset State */}
                <button
                  onClick={onResetDemo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-700 transition cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Demo</span>
                </button>

                {/* Settings & Compliance */}
                <button
                  onClick={onOpenSettings}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition cursor-pointer shadow-2xs"
                  title="Settings & CASL / PIPEDA Compliance"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 6 Bold Popping Trigger Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {triggerCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <button
                    key={card.id}
                    data-sc-tilt="5"
                    data-sc-magnet="0.10"
                    onClick={() => onSendMessage(card.prompt)}
                    disabled={isLoading}
                    className="text-left bg-white border-2 border-slate-200 hover:border-blue-500 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-blue-600/10 active:scale-[0.98] transition-all duration-200 group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white">
                            {card.num}
                          </span>
                          {card.isOwnerAgent && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                              OWNER AGENT
                            </span>
                          )}
                        </div>
                        <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      <span>Run Scenario</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
