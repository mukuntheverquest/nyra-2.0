"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { MessageProcessor } from "@a2ui/web_core/v0_9";
import { basicCatalog } from "@a2ui/web_core/v0_9/basic_catalog";
import { A2uiSurface } from "@a2ui/react/v0_9";
import {
  Send,
  Shield,
  Wifi,
  Battery,
  Signal,
  CheckCircle2,
  Calendar,
  AlertTriangle,
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
  const [engineNonce, setEngineNonce] = useState(0);
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
    let touched = false;
    if (Array.isArray(latestEnvelopes) && latestEnvelopes.length > 0) {
      try {
        processor.processMessages(latestEnvelopes);
        touched = true;
      } catch (err) {
        console.warn("A2UI MessageProcessor error:", err);
      }
    }
    if (touched) setEngineNonce((n) => n + 1);
  }, [latestEnvelopes, processor]);

  // Ensure all message history envelopes are registered
  useEffect(() => {
    let touched = false;
    messages.forEach((m) => {
      if (Array.isArray(m.a2ui_messages) && m.a2ui_messages.length > 0) {
        try {
          processor.processMessages(m.a2ui_messages);
          touched = true;
        } catch (err) {
          console.warn("A2UI MessageProcessor error:", err);
        }
      }
    });
    if (touched) setEngineNonce((n) => n + 1);
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
    <div className="relative mx-auto w-[370px] sm:w-[395px]">
      {/* Protruding Hardware Side Buttons */}
      {/* Left Edge: Action Switch, Volume Up, Volume Down */}
      <div className="absolute -left-[16px] top-24 w-[3.5px] h-8 bg-slate-400 rounded-l-md shadow-xs" />
      <div className="absolute -left-[16px] top-36 w-[3.5px] h-12 bg-slate-400 rounded-l-md shadow-xs" />
      <div className="absolute -left-[16px] top-52 w-[3.5px] h-12 bg-slate-400 rounded-l-md shadow-xs" />
      {/* Right Edge: Power Button */}
      <div className="absolute -right-[16px] top-40 w-[3.5px] h-16 bg-slate-400 rounded-r-md shadow-xs" />

      {/* Titanium Chassis Outer Frame */}
      <div className="rounded-[56px] p-[13px] bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 shadow-[0_32px_70px_-15px_rgba(15,23,42,0.28),0_0_0_1px_rgba(15,23,42,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)]">
        {/* Inner Bezel */}
        <div className="rounded-[44px] bg-slate-950 p-[4px]">
          {/* Bright Screen */}
          <div className="rounded-[40px] h-[720px] bg-white overflow-hidden flex flex-col relative select-none">
            {/* Screen Glass Sheen Overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-40 opacity-25"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 40%)",
              }}
            />

            {/* Top Dynamic Island & iOS Status Bar */}
            <div className="pt-3 px-7 pb-2 flex justify-between items-center text-xs font-mono text-slate-800 z-30 bg-white">
              <span className="font-bold text-slate-900 text-[13px] tracking-tight">
                9:41
              </span>

              {/* Dynamic Island */}
              <div className="w-[116px] h-[30px] rounded-full bg-slate-950 flex items-center justify-between px-3 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-blue-900/40 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-600/80" />
                </div>
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
              </div>

              <div className="flex items-center gap-1.5 text-slate-900">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* App Header */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                      Nyra 2.0
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 block leading-tight">
                    Financial Futures Ed
                  </span>
                </div>
              </div>

              {/* Segmented Pill Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-3 py-1 rounded-lg transition ${
                    activeTab === "chat"
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab("bills")}
                  className={`px-3 py-1 rounded-lg transition ${
                    activeTab === "bills"
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Bills ({bills.length})
                </button>
              </div>
            </div>

            {/* Screen Body */}
            <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50/50">
              {activeTab === "chat" ? (
                <div
                  ref={chatScrollRef}
                  className="flex-1 p-4 overflow-y-auto space-y-3.5"
                >
                  {messages.map((m, idx) => {
                    const isUser = m.role === "user";
                    const hasSurface =
                      Array.isArray(m.a2ui_messages) && m.a2ui_messages.length > 0;
                    const surfaceId = m.surfaceId || (hasSurface ? m.a2ui_messages![0]?.createSurface?.surfaceId : undefined);

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${
                          isUser ? "items-end" : "items-start"
                        }`}
                      >
                        {/* Text Message Bubble */}
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-snug shadow-2xs font-sans ${
                            isUser
                              ? "bg-[#2563EB] text-white rounded-br-xs"
                              : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs"
                          }`}
                        >
                          {m.skill_tag && !isUser && (
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 block mb-1">
                              // {m.skill_tag}
                            </span>
                          )}
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        </div>

                        {/* Declarative A2UI Interactive Surface Card */}
                        {surfaceId && processor.getSurface(surfaceId) && (
                          <div className="w-full mt-2 bg-white rounded-2xl border-2 border-blue-500/30 p-3.5 shadow-md space-y-3">
                            <A2uiSurface surface={processor.getSurface(surfaceId)! as any} />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white border border-slate-200 p-2.5 rounded-xl w-fit shadow-2xs">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                      <span>Nyra is thinking...</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Bills Tab */
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  <div className="text-xs font-mono font-bold uppercase text-slate-500">
                    Active Scheduled Bills
                  </div>
                  {bills.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{b.name}</div>
                        <div className="text-xs text-slate-500 font-mono">
                          Due: {b.next_due_date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-[#2563EB] text-sm">
                          ${b.amount.toFixed(2)}
                        </div>
                        <button
                          onClick={() =>
                            onAction("surf_mobile", "mark_bill_paid", {
                              billName: b.name,
                              amount: b.amount,
                            })
                          }
                          className="mt-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold hover:bg-emerald-100 transition cursor-pointer"
                        >
                          Mark Paid
                        </button>
                      </div>
                    </div>
                  ))}

                  {trials.length > 0 && (
                    <>
                      <div className="text-xs font-mono font-bold uppercase text-amber-600 mt-4">
                        Active Free Trial Kill-Switches
                      </div>
                      {trials.map((t) => (
                        <div
                          key={t.id}
                          className="bg-amber-50/50 border border-amber-200 rounded-xl p-3 shadow-2xs flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              {t.service_name}
                            </div>
                            <div className="text-xs text-amber-700 font-mono">
                              Alert Date: {t.alert_date}
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                            48h Armed
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSubmit}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 z-20"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Text Nyra or tap a scenario on right..."
                  disabled={isLoading}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="w-11 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Bottom iOS Home Indicator */}
            <div className="py-2 flex justify-center bg-white z-30">
              <div className="w-32 h-1.5 rounded-full bg-slate-900/25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
