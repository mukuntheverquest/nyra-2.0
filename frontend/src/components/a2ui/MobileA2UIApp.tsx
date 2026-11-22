"use client";

import React, { useState, useRef, useEffect } from "react";
import { SurfaceState } from "./processor";
import { A2UISurfaceRenderer } from "./A2UISurfaceRenderer";
import {
  Send,
  Sparkles,
  Shield,
  Smartphone,
  Calendar,
  CheckCircle2,
  Clock,
  Zap,
  RotateCcw,
} from "lucide-react";

export interface MobileA2UIAppProps {
  messages: Array<{
    role: string;
    content: string;
    skill_tag?: string;
    surfaceId?: string;
    a2ui_messages?: any[];
  }>;
  surfaces: Map<string, SurfaceState>;
  bills: any[];
  trials: any[];
  isLoading: boolean;
  activeMode: "live" | "mock";
  onSendMessage: (msg: string) => void;
  onAction: (surfaceId: string, actionName: string, context?: any, dataModel?: any) => void;
}

export const PRESET_CHIPS = [
  {
    id: "trial",
    label: "1. Trial Kill-Switch",
    prompt: "Just started an Adobe free trial today for 14 days, remind me 2 days before it charges",
  },
  {
    id: "scam",
    label: "2. Scam Shield",
    prompt: "INTERAC: You received $240 from OSAP Refund. Claim now at bit.ly/osap-refund-ca before it expires in 24 hours!",
  },
  {
    id: "paycheque",
    label: "3. 2026 Paycheque Check",
    prompt: "I make $18/hr working 20 hours a week in Ontario. Can I afford $850 rent?",
  },
  {
    id: "pii",
    label: "4. PII Guardrail",
    prompt: "My SIN is 123-456-789, can you check my CRA tax return?",
  },
  {
    id: "paid",
    label: "5. Mark Paid + Streak",
    prompt: "Just paid my Rogers Phone bill!",
  },
];

export const MobileA2UIApp: React.FC<MobileA2UIAppProps> = ({
  messages,
  surfaces,
  bills,
  trials,
  isLoading,
  activeMode,
  onSendMessage,
  onAction,
}) => {
  const [activeTab, setActiveTab] = useState<"chat" | "bills">("chat");
  const [inputText, setInputText] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, surfaces, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {/* Sleek Dark-Glass iPhone Device Mockup */}
      <div className="w-full bg-[#0B0E14] border-4 border-[#383E4E] rounded-[42px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(33,119,209,0.15)] overflow-hidden flex flex-col h-[650px] relative">
        {/* Notch & Top Speaker */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center items-center z-30 pointer-events-none">
          <div className="w-28 h-4 bg-[#121620] rounded-b-xl border-b border-x border-[#383E4E]/60 flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#0B0E14] border border-[#383E4E]/40" />
            <div className="w-8 h-1 rounded-full bg-[#383E4E]/60" />
          </div>
        </div>

        {/* Status Bar */}
        <div className="pt-3 px-6 pb-1 flex justify-between items-center text-[10px] font-mono text-[#B6BAC5] z-20 bg-[#0B0E14]/80 backdrop-blur-md">
          <span className="font-semibold text-slate-200">9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-[#64748B]">A2UI v1.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
          </div>
        </div>

        {/* App Header & Navigation Tabs */}
        <div className="px-4 py-2 border-b border-[#383E4E]/50 bg-[#121620]/90 backdrop-blur-md flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#2177D1] flex items-center justify-center shadow-[0_0_10px_rgba(33,119,209,0.4)]">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold tracking-tight text-white block leading-none">NYRA</span>
              <span className="text-[9px] text-[#3A8EE0] font-mono">Financial Futures Ed</span>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="flex bg-[#0B0E14] p-0.5 rounded-lg border border-[#383E4E]/60 text-[11px] font-mono">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${
                activeTab === "chat" ? "bg-[#2177D1] text-white font-medium" : "text-[#B6BAC5] hover:text-white"
              }`}
            >
              Chat & Cards
            </button>
            <button
              onClick={() => setActiveTab("bills")}
              className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${
                activeTab === "bills" ? "bg-[#2177D1] text-white font-medium" : "text-[#B6BAC5] hover:text-white"
              }`}
            >
              My Bills ({bills.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Chat & A2UI Declarative Cards Stream */}
        {activeTab === "chat" ? (
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-gradient-to-b from-[#0B0E14] via-[#0E121A] to-[#0B0E14] custom-scrollbar"
          >
            {/* Introductory Guardrail Badge */}
            <div className="text-center py-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121620] border border-[#383E4E]/60 text-[10px] font-mono text-[#B6BAC5]">
                <Shield className="w-3 h-3 text-[#3A8EE0]" />
                <span>Zero Bank Linking · CASL STOP · A2UI v1.0</span>
              </span>
            </div>

            {messages.map((m, idx) => {
              const isUser = m.role === "user";

              // Check if there is an associated A2UI surface for this message
              let surface: SurfaceState | undefined;
              if (m.surfaceId) {
                surface = surfaces.get(m.surfaceId);
              }

              return (
                <div key={idx} className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full`}>
                  {isUser ? (
                    <div className="max-w-[85%] bg-[#2177D1] text-white px-3.5 py-2 rounded-2xl rounded-tr-sm text-xs leading-relaxed shadow-[0_2px_10px_rgba(33,119,209,0.3)]">
                      {m.content}
                    </div>
                  ) : (
                    <div className="w-full max-w-full space-y-2">
                      {/* If A2UI surface exists, render interactive declarative components */}
                      {surface ? (
                        <div className="w-full">
                          <A2UISurfaceRenderer surface={surface} onAction={onAction} />
                        </div>
                      ) : (
                        /* Fallback SMS bubble */
                        <div className="max-w-[90%] bg-[#121620] border border-[#383E4E]/70 text-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-xs leading-relaxed">
                          {m.skill_tag && (
                            <span className="font-mono text-[9px] uppercase tracking-wider text-[#3A8EE0] block mb-1">
                              // {m.skill_tag}
                            </span>
                          )}
                          <p className="whitespace-pre-wrap">{m.content}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-[#121620]/80 rounded-xl border border-[#383E4E]/40 text-xs text-[#3A8EE0] font-mono animate-pulse w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nyra reasoning via {activeMode === "live" ? "Haiku 5.5" : "Mock Engine"}...</span>
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: Native Mobile 'My Bills' View */
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#0B0E14] text-xs">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pb-1 border-b border-[#383E4E]/40">
              <span>TRACKED BILLS ({bills.length})</span>
              <span className="text-[#34C759]">Auto-rolls monthly</span>
            </div>

            {bills.map((b) => (
              <div
                key={b.id}
                className="p-2.5 rounded-xl bg-[#121620] border border-[#383E4E]/60 flex items-center justify-between font-mono"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-200">{b.name}</span>
                    {b.is_pad && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-[#C39A35]/20 text-[#D4AE52]">PAD</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">Due {b.next_due_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">${Number(b.amount).toFixed(2)}</span>
                  <button
                    onClick={() => onAction("surf_mobile", "mark_bill_paid", { billName: b.name, amount: b.amount })}
                    className="px-2 py-1 rounded bg-[#2177D1] hover:bg-[#3A8EE0] text-white text-[10px] transition cursor-pointer"
                  >
                    Paid
                  </button>
                </div>
              </div>
            ))}

            {trials.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-mono text-[#D4AE52] uppercase block mb-1.5">
                  Free Trial Kill-Switches ({trials.length})
                </span>
                {trials.map((t) => (
                  <div
                    key={t.id}
                    className="p-2 rounded-lg bg-[#C39A35]/10 border border-[#C39A35]/30 text-[11px] font-mono flex items-center justify-between"
                  >
                    <div>
                      <span className="text-slate-200 font-medium">{t.service_name}</span>
                      <span className="text-[10px] text-slate-400 block">Alert: {t.alert_date}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C39A35]/20 text-[#D4AE52]">
                      48h Warning
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-2.5 bg-[#121620] border-t border-[#383E4E]/60 flex items-center gap-2 z-20"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or test a chip below..."
            className="flex-1 bg-[#0B0E14] border border-[#383E4E] focus:border-[#2177D1] text-xs text-slate-200 rounded-lg px-3 py-2 outline-none font-sans placeholder:text-slate-600 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-8 h-8 rounded-lg bg-[#2177D1] hover:bg-[#3A8EE0] disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer shadow-[0_0_10px_rgba(33,119,209,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Bottom Home Indicator */}
        <div className="h-4 bg-[#0B0E14] flex justify-center items-center pb-1">
          <div className="w-24 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>

      {/* 5 Monospace Test Chips Pinned Below Phone */}
      <div className="w-full mt-3 flex flex-col gap-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold px-1">
          Interactive Test Chips (1-Tap):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => onSendMessage(chip.prompt)}
              disabled={isLoading}
              className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#121620] hover:bg-[#2177D1]/20 hover:border-[#2177D1] border border-[#383E4E] text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-40"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
