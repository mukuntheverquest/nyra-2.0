"use client";

import React, { useState, useEffect, useRef } from "react";
import { NavbarHud } from "@/components/NavbarHud";
import { HeroSection } from "@/components/HeroSection";
import { LiveWorkspaceSection } from "@/components/LiveWorkspaceSection";
import { SkillsBentoSection } from "@/components/SkillsBentoSection";
import { ImpactPricingSection } from "@/components/ImpactPricingSection";
import SettingsModal from "@/components/SettingsModal";
import {
  A2UIMessageProcessor,
  SurfaceState,
  A2UIMessage,
} from "@/components/a2ui/processor";

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

  // A2UI v1.0 Client State Engine
  const processorRef = useRef<A2UIMessageProcessor>(new A2UIMessageProcessor());
  const [surfaces, setSurfaces] = useState<Map<string, SurfaceState>>(new Map());
  const [latestA2UIMessages, setLatestA2UIMessages] = useState<any[]>([]);

  // Sync internal processor state to React state
  const syncSurfacesFromProcessor = () => {
    const all = processorRef.current.getAllSurfaces();
    const newMap = new Map<string, SurfaceState>();
    for (const s of all) {
      newMap.set(s.surfaceId, { ...s });
    }
    setSurfaces(newMap);
  };

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

        // Process any returned A2UI protocol envelopes
        let surfaceIdForMsg: string | undefined = undefined;
        if (Array.isArray(data.a2ui_messages) && data.a2ui_messages.length > 0) {
          setLatestA2UIMessages(data.a2ui_messages);
          processorRef.current.processMessages(data.a2ui_messages);
          syncSurfacesFromProcessor();

          // Extract primary surfaceId
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

        // Update full state
        if (data.state) {
          setUser(data.state.user);
          setBills(data.state.bills || []);
          setTrials(data.state.trials || []);
          setTelemetryLatest(data.state.telemetry_latest);
          setTelemetryLogs(data.state.telemetry_logs || []);
          setScamLogs(data.state.scam_logs || []);

          // Append assistant turn with associated surfaceId
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
    context?: any,
    dataModel?: any
  ) => {
    try {
      const res = await fetch(`${API_BASE}/api/a2ui/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surfaceId,
          actionName,
          context: context || {},
          dataModel: dataModel || {},
          user_id: 1,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // Mutate surface in place with updateDataModel
        if (Array.isArray(data.a2ui_messages)) {
          processorRef.current.processMessages(data.a2ui_messages);
          syncSurfacesFromProcessor();
          setLatestA2UIMessages(data.a2ui_messages);
        }

        // Refresh global state so bills, streak, and telemetry reflect the change
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
          processorRef.current.processMessages(data.a2ui_messages);
          syncSurfacesFromProcessor();
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
        processorRef.current.clear();
        setSurfaces(new Map());
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

  const scrollToWorkspace = () => {
    const el = document.getElementById("chapter-01");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F1F5F9] flex flex-col font-sans selection:bg-[#2177D1]/30 selection:text-[#5BA3EC]">
      {/* 1. Persistent Minimal Top HUD */}
      <NavbarHud
        activeMode={activeMode}
        onToggleMode={() => setActiveMode(activeMode === "live" ? "mock" : "live")}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onScrollToWorkspace={scrollToWorkspace}
      />

      <main className="flex-1 flex flex-col">
        {/* 2. Chapter 00 // INTRO */}
        <HeroSection onScrollToWorkspace={scrollToWorkspace} />

        {/* 3. Chapter 01 // MOBILE + DASHBOARD */}
        <LiveWorkspaceSection
          user={user}
          bills={bills}
          trials={trials}
          messages={messages}
          surfaces={surfaces}
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

        {/* 4. Chapter 02 // ENGINE */}
        <SkillsBentoSection />

        {/* 5. Chapter 03 // ACCESS & IMPACT */}
        <ImpactPricingSection onOpenSettings={() => setIsSettingsOpen(true)} />
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
