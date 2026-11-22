"use client";

import React from "react";
import { MobileA2UIApp } from "./a2ui/MobileA2UIApp";
import BillsAndImpactCard from "./BillsAndImpactCard";
import TelemetryCard from "./TelemetryCard";
import GuardrailLogCard from "./GuardrailLogCard";
import { A2UIWireInspector } from "./A2UIWireInspector";
import { Clock, RotateCcw, Sparkles } from "lucide-react";
import { SurfaceState } from "./a2ui/processor";

interface LiveWorkspaceSectionProps {
  user: any;
  bills: any[];
  trials: any[];
  messages: any[];
  surfaces: Map<string, SurfaceState>;
  telemetryLatest: any;
  telemetryLogs: any[];
  scamLogs: any[];
  latestA2UIMessages: any[];
  latestPiiRedacted: boolean;
  isLoading: boolean;
  activeMode: "live" | "mock";
  onSendMessage: (msg: string) => void;
  onAction: (surfaceId: string, actionName: string, context?: any, dataModel?: any) => void;
  onTriggerCron: () => void;
  onResetDemo: () => void;
}

export const LiveWorkspaceSection: React.FC<LiveWorkspaceSectionProps> = ({
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
    <section id="chapter-01" className="py-16 md:py-20 border-b border-[#383E4E]/60 bg-[#0B0E14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#383E4E]/50">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121620] border border-[#383E4E] text-xs font-mono text-[#3A8EE0] mb-2">
              <span>CHAPTER 01 // LIVE WORKSPACE</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              INTERACTIVE A2UI MOBILE APP &amp; REAL-TIME HUD
            </h2>
            <p className="text-xs sm:text-sm text-[#B6BAC5] font-sans">
              Test live turn interactions below. Experience instant declarative widget updates and zero-cost actions.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <button
              onClick={onTriggerCron}
              className="px-3.5 py-2 rounded-xl bg-[#121620] hover:bg-[#2177D1]/20 hover:border-[#2177D1] border border-[#383E4E] text-slate-200 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              title="Simulate 9 AM Daily Batched SMS Digest & Impact Surface"
            >
              <Clock className="w-3.5 h-3.5 text-[#3A8EE0]" />
              <span>Trigger 9 AM Digest</span>
            </button>

            <button
              onClick={onResetDemo}
              className="px-3.5 py-2 rounded-xl bg-[#121620] hover:bg-slate-800 border border-[#383E4E] text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              title="Reset Database to Clean Demo State"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* 2-Pane Asymmetric Layout (Left 45% Mobile, Right 55% HUD) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Pane (45%): Sleek Dark-Glass iPhone A2UI Mobile App */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <MobileA2UIApp
              messages={messages}
              surfaces={surfaces}
              bills={bills}
              trials={trials}
              isLoading={isLoading}
              activeMode={activeMode}
              onSendMessage={onSendMessage}
              onAction={onAction}
            />
          </div>

          {/* Right Pane (55%): 4 Frosted-Glass HUD Panels */}
          <div className="lg:col-span-7 space-y-6">
            {/* Panel 1: Live Bills & Impact */}
            <BillsAndImpactCard user={user} bills={bills} trials={trials} />

            {/* Panel 2: Telemetry & Unit Economics */}
            <TelemetryCard
              telemetry={telemetryLatest}
              aiMsgsUsed={user?.ai_msgs_used_this_month || 1}
            />

            {/* Panel 3: Guardrail Log & MITRE Traces */}
            <GuardrailLogCard
              scamLogs={scamLogs}
              telemetryLogs={telemetryLogs}
              latestPiiRedacted={latestPiiRedacted}
            />

            {/* Panel 4: A2UI Protocol Wire Inspector */}
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
