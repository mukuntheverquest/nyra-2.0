"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  Sparkles,
  RotateCcw,
  BellRing,
  ShieldCheck,
  Cpu,
  Layers,
} from "lucide-react";
import BillsAndImpactCard from "../BillsAndImpactCard";
import TelemetryCard from "../TelemetryCard";
import GuardrailLogCard from "../GuardrailLogCard";
import { A2UIWireInspector } from "../A2UIWireInspector";
import { SurfaceState } from "../a2ui/processor";

// Dynamically import A2UIMobileRuntime with ssr: false so Node SSR does not fail on HTMLElement
const A2UIMobileRuntime = dynamic(
  () => import("../a2ui/A2UIMobileRuntime").then((mod) => mod.A2UIMobileRuntime),
  { ssr: false }
);

interface WorkspaceActProps {
  user: any;
  bills: any[];
  trials: any[];
  messages: any[];
  surfaces?: Map<string, SurfaceState>;
  telemetryLatest: any;
  telemetryLogs: any[];
  scamLogs: any[];
  latestA2UIMessages: any[];
  latestPiiRedacted?: boolean;
  isLoading: boolean;
  activeMode: "live" | "mock";
  onSendMessage: (msg: string) => void;
  onAction: (surfaceId: string, actionName: string, context?: any, dataModel?: any) => void;
  onTriggerCron: () => void;
  onResetDemo: () => void;
}

export const WorkspaceAct: React.FC<WorkspaceActProps> = ({
  user,
  bills,
  trials,
  messages,
  surfaces,
  telemetryLatest,
  telemetryLogs,
  scamLogs,
  latestA2UIMessages,
  latestPiiRedacted,
  isLoading,
  activeMode,
  onSendMessage,
  onAction,
  onTriggerCron,
  onResetDemo,
}) => {
  return (
    <section
      id="act-workspace"
      data-sc-act="workspace"
      className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Control Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2177D1] flex items-center justify-center text-white shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-mono font-bold text-slate-900 uppercase">
                  ACT 3: THE ENGINEERED PEAK — LIVE A2UI RUNTIME
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  FastAPI :8000 Connected
                </span>
              </div>
              <span className="text-xs text-slate-500 font-sans">
                Real declarative surfaces compiled by Python & rendered by @a2ui/react v0.9
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Trigger 9 AM Cron Digest Button */}
            <button
              onClick={onTriggerCron}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-700 transition cursor-pointer shadow-2xs"
            >
              <BellRing className="w-3.5 h-3.5 text-[#2177D1]" />
              <span>Simulate 9 AM Digest</span>
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={onResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-700 transition cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Two-Column Engineered Workspace Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 Cols): Real @a2ui/react Mobile Simulator */}
          <div className="lg:col-span-5 w-full flex justify-center sticky top-20">
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

          {/* Right Column (7 Cols): The 4 Light Companion Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Live Bills, Trial Kill-Switches & Youth Impact */}
            <BillsAndImpactCard user={user} bills={bills} trials={trials} />

            {/* 2. Claude Haiku 5.5 Telemetry & Cost Breakdown */}
            <TelemetryCard
              telemetry={telemetryLatest}
              aiMsgsUsed={user?.ai_messages_used_this_month || 0}
            />

            {/* 3. Guardrail Middleware & Traces Terminal */}
            <GuardrailLogCard
              scamLogs={scamLogs}
              telemetryLogs={telemetryLogs}
              latestPiiRedacted={latestPiiRedacted}
            />

            {/* 4. Collapsible A2UI Wire Inspector */}
            <A2UIWireInspector
              surfaces={surfaces}
              latestA2UIMessages={latestA2UIMessages}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
