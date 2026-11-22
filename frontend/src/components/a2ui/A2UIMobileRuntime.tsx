"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { MessageProcessor } from "@a2ui/web_core/v0_9";
import { basicCatalog } from "@a2ui/web_core/v0_9/basic_catalog";
import { A2uiSurface } from "@a2ui/react/v0_9";
import {
  Send,
  Sparkles,
  Shield,
  Calendar,
  CheckCircle2,
  Lock,
  Clock,
  Code,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Building,
  Check,
  ArrowRight,
} from "lucide-react";

export interface A2UIMobileRuntimeProps {
  messages: Array<{
    role: string;
    content: string;
    skill_tag?: string;
    surfaceId?: string;
    a2ui_messages?: any[];
  }>;
  bills: any[];
  trials: any[];
  isLoading: boolean;
  activeMode: "live" | "mock";
  onSendMessage: (msg: string) => void;
  onAction: (surfaceId: string, actionName: string, context?: any, dataModel?: any) => void;
  latestEnvelopes: any[];
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

export const A2UIMobileRuntime: React.FC<A2UIMobileRuntimeProps> = ({
  messages,
  bills,
  trials,
  isLoading,
  activeMode,
  onSendMessage,
  onAction,
  latestEnvelopes,
}) => {
  const [activeTab, setActiveTab] = useState<"chat" | "bills">("chat");
  const [inputText, setInputText] = useState("");
  const [expandedWire, setExpandedWire] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Initialize real official @a2ui/web_core/v0_9 MessageProcessor with basicCatalog
  const processor = useMemo(() => {
    return new MessageProcessor([basicCatalog], (actionEvent: any) => {
      if (actionEvent?.action) {
        const name = actionEvent.action.name || actionEvent.action;
        const ctx = actionEvent.action.context || {};
        onAction(actionEvent.surfaceId, name, ctx);
      }
    });
  }, [onAction]);

  // Feed incoming envelopes into MessageProcessor
  useEffect(() => {
    if (Array.isArray(latestEnvelopes) && latestEnvelopes.length > 0) {
      try {
        processor.processMessages(latestEnvelopes);
      } catch (err) {
        console.warn("A2UI MessageProcessor error:", err);
      }
    }
  }, [latestEnvelopes, processor]);

  // Ensure all message history envelopes are registered
  useEffect(() => {
    messages.forEach((m) => {
      if (Array.isArray(m.a2ui_messages) && m.a2ui_messages.length > 0) {
        try {
          processor.processMessages(m.a2ui_messages);
        } catch (err) {
          console.warn("A2UI MessageProcessor error:", err);
        }
      }
    });
  }, [messages, processor]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {/* Light Precision Mobile Viewport */}
      <div className="w-full bg-white border border-slate-300 rounded-[40px] shadow-[0_20px_50px_rgba(15,23,42,0.12),0_1px_3px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col h-[650px] relative">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center items-center z-30 pointer-events-none">
          <div className="w-24 h-4 bg-slate-100 rounded-b-xl border-b border-x border-slate-200 flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <div className="w-6 h-1 rounded-full bg-slate-300" />
          </div>
        </div>

        {/* Status Bar */}
        <div className="pt-3 px-6 pb-1 flex justify-between items-center text-[10px] font-mono text-slate-500 z-20 bg-white border-b border-slate-100">
          <span className="font-semibold text-slate-700">9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-blue-600 font-medium">@a2ui/react v0.9</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Mobile App Header */}
        <div className="px-4 py-2 border-b border-slate-200 bg-white flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2177D1] flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-sans text-xs font-bold tracking-tight text-slate-900 block leading-none">
                Nyra 2.0
              </span>
              <span className="text-[9px] text-blue-600 font-mono">Financial Futures Ed</span>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-mono">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${
                activeTab === "chat"
                  ? "bg-white text-blue-700 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("bills")}
              className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${
                activeTab === "bills"
                  ? "bg-white text-blue-700 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bills ({bills.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Chat Stream with Real A2UI Surfaces */}
        {activeTab === "chat" ? (
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/70"
          >
            {/* Edge Security Pill */}
            <div className="text-center py-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-mono text-slate-600 shadow-xs">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Zero Bank Linking · CASL STOP · A2UI v0.9</span>
              </span>
            </div>

            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              const surfaceModel = m.surfaceId ? processor.getSurface(m.surfaceId) : null;

              return (
                <div key={idx} className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full`}>
                  {isUser ? (
                    <div className="max-w-[85%] bg-[#2177D1] text-white px-3.5 py-2 rounded-2xl rounded-tr-xs text-xs leading-relaxed shadow-sm">
                      {m.content}
                    </div>
                  ) : (
                    <div className="w-full max-w-full space-y-2">
                      {/* Real A2UI v0.9 Surface rendering */}
                      {surfaceModel ? (
                        <div className="w-full bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-slate-800 text-xs">
                          <A2uiSurface surface={surfaceModel as any} />
                        </div>
                      ) : (
                        /* Fallback SMS Bubble */
                        <div className="max-w-[90%] bg-white border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-tl-xs text-xs leading-relaxed shadow-xs">
                          {m.skill_tag && (
                            <span className="font-mono text-[9px] uppercase tracking-wider text-blue-600 block mb-1 font-semibold">
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
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-blue-600 font-mono shadow-xs animate-pulse w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nyra reasoning via {activeMode === "live" ? "Haiku 5.5" : "Mock Engine"}...</span>
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: My Bills */
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/70 text-xs">
            <div className="flex items-center justify-between text-slate-500 font-mono text-[11px] pb-1 border-b border-slate-200">
              <span className="font-semibold text-slate-700">TRACKED RECURRING BILLS ({bills.length})</span>
              <span className="text-emerald-600 font-medium">Auto-rolls</span>
            </div>

            {bills.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between font-mono"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900">{b.name}</span>
                    {b.is_pad ? (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                        PAD
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[10px] text-slate-500">Due {b.next_due_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">${Number(b.amount).toFixed(2)}</span>
                  <button
                    onClick={() => onAction("surf_mobile", "mark_bill_paid", { billName: b.name, amount: b.amount })}
                    className="px-2 py-1 rounded bg-[#2177D1] hover:bg-[#3A8EE0] text-white text-[10px] font-medium transition cursor-pointer"
                  >
                    Paid
                  </button>
                </div>
              </div>
            ))}

            {trials.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-mono text-amber-700 uppercase font-semibold block mb-1.5">
                  Free Trial Kill-Switches ({trials.length})
                </span>
                {trials.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] font-mono flex items-center justify-between"
                  >
                    <div>
                      <span className="text-slate-900 font-medium">{t.service_name}</span>
                      <span className="text-[10px] text-slate-500 block">Alert: {t.alert_date}</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
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
          className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 z-20"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Text Nyra or tap a test chip..."
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#2177D1] focus:bg-white text-xs text-slate-900 rounded-lg px-3 py-2 outline-none font-sans placeholder:text-slate-400 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-8 h-8 rounded-lg bg-[#2177D1] hover:bg-[#3A8EE0] disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Home Indicator */}
        <div className="h-4 bg-white flex justify-center items-center pb-1">
          <div className="w-20 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>

      {/* 5 One-Click Test Chips Pinned Below Phone in Crisp Monospace */}
      <div className="w-full mt-3 flex flex-col gap-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold px-1">
          One-Click Test Chips (A2UI Triggers):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => onSendMessage(chip.prompt)}
              disabled={isLoading}
              className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-slate-700 hover:text-blue-900 transition cursor-pointer disabled:opacity-40 shadow-2xs"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
