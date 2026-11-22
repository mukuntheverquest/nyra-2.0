"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Smartphone,
  Lock,
  ArrowRight,
} from "lucide-react";

interface Message {
  id?: number;
  role: "user" | "assistant" | "system_cron";
  content: string;
  skill_tag?: string;
  created_at?: string;
}

interface PhoneSimulatorProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
  activeMode: string;
}

const PRESET_QUICK_TESTS = [
  {
    id: 1,
    title: "1. Trial Kill-Switch",
    text: "Just started an Adobe free trial today for 14 days, remind me 2 days before it charges",
    tag: "Bill Guard",
    color: "border-sky-500/30 text-sky-300 hover:bg-sky-950/40",
  },
  {
    id: 2,
    title: "2. Canadian Scam Shield",
    text: "INTERAC: You received $240 from OSAP Refund. Claim now at bit.ly/osap-refund-ca before it expires in 24 hours!",
    tag: "MITRE F3",
    color: "border-rose-500/30 text-rose-300 hover:bg-rose-950/40",
  },
  {
    id: 3,
    title: "3. Ontario Paycheque Check",
    text: "I make $18/hr working 20 hours a week in Ontario. Can I afford $850 rent?",
    tag: "2026 CRA/ON",
    color: "border-amber-500/30 text-amber-300 hover:bg-amber-950/40",
  },
  {
    id: 4,
    title: "4. Privacy Guardrail Test",
    text: "My SIN is 123-456-789, can you check my CRA tax return?",
    tag: "PII Scrubber",
    color: "border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/40",
  },
  {
    id: 5,
    title: "5. Mark Paid + Streak",
    text: "Just paid my Rogers Phone bill!",
    tag: "Streak + FFE",
    color: "border-purple-500/30 text-purple-300 hover:bg-purple-950/40",
  },
];

export default function PhoneSimulator({
  messages,
  onSendMessage,
  isLoading,
  activeMode,
}: PhoneSimulatorProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const renderBubbleContent = (content: string, role: string, skill_tag?: string) => {
    // Check for Scam Verdict formatting
    const isHighRisk = content.includes("HIGH RISK") || content.includes("🚨");
    const isSuspicious = content.includes("SUSPICIOUS");
    const isLikelySafe = content.includes("LIKELY SAFE");

    return (
      <div className="space-y-2">
        {skill_tag === "pii_block" && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-1">
            <Lock className="w-3 h-3" /> PII Redacted at Edge
          </div>
        )}

        {isHighRisk && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            MITRE F3: HIGH RISK PHISHING DETECTED
          </div>
        )}

        {isSuspicious && !isHighRisk && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            SUSPICIOUS PATTERN DETECTED
          </div>
        )}

        {isLikelySafe && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            LIKELY SAFE
          </div>
        )}

        <div className="whitespace-pre-line text-sm leading-relaxed">{content}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Phone Shell */}
      <div className="relative mx-auto w-full max-w-[430px] rounded-[42px] border-[7px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col h-[640px]">
        {/* Dynamic Island / Notch */}
        <div className="bg-slate-950 px-6 pt-3 pb-2 flex justify-between items-center text-xs text-slate-400 border-b border-slate-800/80">
          <span className="font-semibold text-slate-200">9:41 AM</span>
          <div className="w-20 h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* SMS Header */}
        <div className="bg-slate-950/90 backdrop-blur px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white shadow-md text-sm">
              N2
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-slate-100">Nyra 2.0</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                  FFE GUARD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Zero Bank Linking • SMS Safe
              </p>
            </div>
          </div>
          <div className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
            {activeMode === "live" ? "Claude Haiku 5.5" : "Offline Mock"}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 text-sm">
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            const isCron = m.role === "system_cron";

            if (isCron) {
              return (
                <div key={idx} className="my-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    9 AM Automated Digest
                  </div>
                  <div className="whitespace-pre-line text-slate-200">{m.content}</div>
                </div>
              );
            }

            return (
              <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                    isUser
                      ? "bg-emerald-600 text-white rounded-br-xs"
                      : "bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-bl-xs"
                  }`}
                >
                  {renderBubbleContent(m.content, m.role, m.skill_tag)}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 font-mono text-[11px]">Nyra is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* SMS Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Text a bill, scam, or money question..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* 5 One-Click Quick-Test Presets */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-md max-w-[430px] mx-auto w-full">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            1-Click Preset Quick-Tests
          </span>
          <span className="text-[10px] text-slate-500">Click to run immediately</span>
        </div>
        <div className="space-y-1.5">
          {PRESET_QUICK_TESTS.map((p) => (
            <button
              key={p.id}
              onClick={() => onSendMessage(p.text)}
              disabled={isLoading}
              className={`w-full text-left p-2 rounded-xl border text-xs transition flex items-center justify-between group disabled:opacity-50 ${p.color}`}
            >
              <div className="truncate pr-2">
                <span className="font-semibold block">{p.title}</span>
                <span className="text-[11px] opacity-80 truncate block">{p.text}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
