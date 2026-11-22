"use client";

import React, { useState, useEffect } from "react";
import PhoneSimulator from "@/components/PhoneSimulator";
import BillsAndImpactCard from "@/components/BillsAndImpactCard";
import TelemetryCard from "@/components/TelemetryCard";
import GuardrailLogCard from "@/components/GuardrailLogCard";
import SettingsModal from "@/components/SettingsModal";
import {
  Shield,
  RotateCcw,
  Clock,
  Settings,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function Home() {
  const [activeMode, setActiveMode] = useState<"live" | "mock">("mock");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Live state from FastAPI backend
  const [user, setUser] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [trials, setTrials] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [telemetryLatest, setTelemetryLatest] = useState<any>(null);
  const [telemetryLogs, setTelemetryLogs] = useState<any[]>([]);
  const [scamLogs, setScamLogs] = useState<any[]>([]);
  const [latestPiiRedacted, setLatestPiiRedacted] = useState(false);

  // Fetch full state on mount
  const fetchState = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/state`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setBills(data.bills || []);
        setTrials(data.trials || []);
        setMessages(data.messages || []);
        setTelemetryLatest(data.telemetry_latest);
        setTelemetryLogs(data.telemetry_logs || []);
        setScamLogs(data.scam_logs || []);
      }
    } catch (err) {
      console.warn("FastAPI backend not reachable yet or offline:", err);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Send message handler (used by both text input and preset buttons)
  const handleSendMessage = async (msg: string) => {
    setIsLoading(true);
    setLatestPiiRedacted(false);

    // Optimistically show user bubble immediately
    setMessages((prev) => [...prev, { role: "user", content: msg }]);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          user_id: 1,
          mode: activeMode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.pii_redacted) {
          setLatestPiiRedacted(true);
        }

        // Apply updated state from backend
        if (data.state) {
          setUser(data.state.user);
          setBills(data.state.bills || []);
          setTrials(data.state.trials || []);
          setMessages(data.state.messages || []);
          setTelemetryLatest(data.state.telemetry_latest);
          setTelemetryLogs(data.state.telemetry_logs || []);
          setScamLogs(data.state.scam_logs || []);
        } else {
          // Fallback append
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.reply,
              skill_tag: data.skill_used,
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error connecting to Nyra 2.0 backend at localhost:8000.",
          skill_tag: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger 9 AM Cron Digest
  const handleTriggerCron = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/demo/trigger-cron`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          setUser(data.state.user);
          setBills(data.state.bills || []);
          setTrials(data.state.trials || []);
          setMessages(data.state.messages || []);
        }
      }
    } catch (err) {
      console.error("Cron trigger error:", err);
    }
  };

  // Reset Demo to fresh state
  const handleResetDemo = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/demo/reset`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          setUser(data.state.user);
          setBills(data.state.bills || []);
          setTrials(data.state.trials || []);
          setMessages(data.state.messages || []);
          setTelemetryLatest(data.state.telemetry_latest);
          setTelemetryLogs(data.state.telemetry_logs || []);
          setScamLogs(data.state.scam_logs || []);
        }
      }
    } catch (err) {
      console.error("Reset error:", err);
    }
  };

  // Update Settings from Modal
  const handleUpdateSettings = async (settings: any) => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1, ...settings }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Settings update error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
        {/* Brand & Organization */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40 font-black text-lg">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-slate-100">
                Nyra 2.0 — Guardrailed AI Agent Harness
              </h1>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Production Harness
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Financial Futures Education (FFE) • Sanya Bajaj &amp; Aryan Kapur • McMaster Campus Beta
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5">
          {/* Live vs Mock Engine Toggle */}
          <button
            onClick={() => setActiveMode((prev) => (prev === "live" ? "mock" : "live"))}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              activeMode === "live"
                ? "bg-purple-950/40 border-purple-500/40 text-purple-300"
                : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
            }`}
          >
            {activeMode === "live" ? (
              <>
                <ToggleRight className="w-4 h-4 text-purple-400" />
                <span>Live Haiku 5.5 API</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-emerald-400" />
                <span>Offline Demo Mock</span>
              </>
            )}
          </button>

          {/* Trigger 9 AM Digest Cron Button */}
          <button
            onClick={handleTriggerCron}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Trigger 9 AM Digest</span>
          </button>

          {/* Settings & Compliance Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Settings &amp; Compliance</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-rose-300 hover:text-rose-200 transition"
            title="Reset SQLite database to baseline Alex Rivera demo state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane (45% on desktop -> 5 cols or 5.4 cols out of 12) */}
        <section className="lg:col-span-5 flex flex-col">
          <PhoneSimulator
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            activeMode={activeMode}
          />
        </section>

        {/* Right Pane (55% on desktop -> 7 cols out of 12) */}
        <section className="lg:col-span-7 space-y-5 flex flex-col">
          {/* Card 1: Live Bills, Trial Alerts & FFE 20% Impact Pool */}
          <BillsAndImpactCard user={user} bills={bills} trials={trials} />

          {/* Card 2: Haiku 5.5 Token Telemetry & Gross Margin */}
          <TelemetryCard
            telemetry={telemetryLatest}
            aiMsgsUsed={user?.ai_msgs_used || 0}
          />

          {/* Card 3: Middleware Audit & MITRE F3 Logs */}
          <GuardrailLogCard
            scamLogs={scamLogs}
            telemetryLogs={telemetryLogs}
            latestPiiRedacted={latestPiiRedacted}
          />
        </section>
      </main>

      {/* Settings & Compliance Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
