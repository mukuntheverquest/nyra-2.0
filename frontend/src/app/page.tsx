"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroAct } from "@/components/scroll/HeroAct";
import { InterceptAct } from "@/components/scroll/InterceptAct";
import { WorkspaceAct } from "@/components/scroll/WorkspaceAct";
import { AccessAct } from "@/components/scroll/AccessAct";
import SettingsModal from "@/components/SettingsModal";

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
  const [latestA2UIMessages, setLatestA2UIMessages] = useState<any[]>([]);

  // Fetch initial state on mount
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
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("sc-ready");
      (window as any).ScrollCraft = (window as any).ScrollCraft || { instances: [] };
    }
  }, []);

  // Send message handler (used by both text input and preset chips)
  const handleSendMessage = async (msg: string) => {
    setIsLoading(true);
    setLatestPiiRedacted(false);

    // Optimistically show user message immediately
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

        let surfaceIdForMsg: string | undefined = undefined;
        if (Array.isArray(data.a2ui_messages) && data.a2ui_messages.length > 0) {
          setLatestA2UIMessages(data.a2ui_messages);
          for (const m of data.a2ui_messages) {
            if (m.createSurface) {
              surfaceIdForMsg = m.createSurface.surfaceId;
              break;
            } else if (m.updateComponents) {
              surfaceIdForMsg = m.updateComponents.surfaceId;
              break;
            }
          }
        }

        // Update global state
        if (data.state) {
          setUser(data.state.user);
          setBills(data.state.bills || []);
          setTrials(data.state.trials || []);
          setTelemetryLatest(data.state.telemetry_latest);
          setTelemetryLogs(data.state.telemetry_logs || []);
          setScamLogs(data.state.scam_logs || []);

          // Append assistant turn
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.reply_text || data.reply,
              skill_tag: data.skill_used,
              surfaceId: surfaceIdForMsg,
              a2ui_messages: data.a2ui_messages,
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

  // Bidirectional A2UI Action Handler ($0.00 LLM cost)
  const handleA2UIAction = async (
    surfaceId: string,
    actionName: string,
    context?: any
  ) => {
    try {
      const res = await fetch(`${API_BASE}/api/a2ui/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surfaceId,
          actionName,
          context: context || {},
          user_id: 1,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.a2ui_messages)) {
          setLatestA2UIMessages(data.a2ui_messages);
        }

        if (data.state) {
          setUser(data.state.user);
          setBills(data.state.bills || []);
          setTrials(data.state.trials || []);
          setTelemetryLatest(data.state.telemetry_latest);
          setTelemetryLogs(data.state.telemetry_logs || []);
        }
      }
    } catch (err) {
      console.error("A2UI Action execution failed:", err);
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
        let surfaceIdForDigest: string | undefined = undefined;
        if (Array.isArray(data.a2ui_messages) && data.a2ui_messages.length > 0) {
          setLatestA2UIMessages(data.a2ui_messages);
          for (const m of data.a2ui_messages) {
            if (m.createSurface) {
              surfaceIdForDigest = m.createSurface.surfaceId;
              break;
            }
          }
        }

        if (data.state) {
          setUser(data.state.user);
          setBills(data.state.bills || []);
          setTrials(data.state.trials || []);
        }

        // Add digest notification message to mobile app
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "9:00 AM EST Batched Digest: Summary of upcoming bills & youth impact.",
            skill_tag: "sms_daily_digest",
            surfaceId: surfaceIdForDigest,
            a2ui_messages: data.a2ui_messages,
          },
        ]);
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
        setLatestA2UIMessages([]);
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

  const scrollToAct = (actId: string) => {
    const el = document.getElementById(actId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#2177D1]/15 selection:text-[#2177D1]">
      {/* 1. Translucent Frosted Navbar */}
      <Navbar
        activeMode={activeMode}
        onToggleMode={() => setActiveMode(activeMode === "live" ? "mock" : "live")}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onScrollToAct={scrollToAct}
      />

      <main className="flex-1 flex flex-col">
        {/* Act 1: Layered White Editorial Hero */}
        <HeroAct
          onScrollToWorkspace={() => scrollToAct("act-workspace")}
          onScrollToIntercept={() => scrollToAct("act-intercept")}
        />

        {/* Act 2: Scroll-Scrubbed Intercept & Pinned Morph */}
        <InterceptAct onScrollToWorkspace={() => scrollToAct("act-workspace")} />

        {/* Act 3: The Engineered Peak (Real @a2ui/react Mobile App + Light HUD) */}
        <WorkspaceAct
          user={user}
          bills={bills}
          trials={trials}
          messages={messages}
          telemetryLatest={telemetryLatest}
          telemetryLogs={telemetryLogs}
          scamLogs={scamLogs}
          latestA2UIMessages={latestA2UIMessages}
          latestPiiRedacted={latestPiiRedacted}
          isLoading={isLoading}
          activeMode={activeMode}
          onSendMessage={handleSendMessage}
          onAction={handleA2UIAction}
          onTriggerCron={handleTriggerCron}
          onResetDemo={handleResetDemo}
        />

        {/* Act 4: Grounded Close (Mission, Pricing & Youth Impact) */}
        <AccessAct onOpenSettings={() => setIsSettingsOpen(true)} />
      </main>

      {/* Settings & CASL Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
