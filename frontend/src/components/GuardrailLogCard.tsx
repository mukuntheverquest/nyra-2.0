"use client";

import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Terminal,
  Clock,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface ScamLog {
  id: number;
  sanitized_snippet: string;
  risk_level: string;
  scam_type: string;
  mitre_f3_tactic: string;
  red_flags: string[];
  created_at: string;
}

interface TelemetryItem {
  id?: number;
  skill_used: string;
  model_used: string;
  pii_redacted: number;
  tool_calls: Array<{ name: string; input?: any; output?: any }>;
  latency_ms: number;
  created_at?: string;
}

interface GuardrailLogCardProps {
  scamLogs: ScamLog[];
  telemetryLogs: TelemetryItem[];
  latestPiiRedacted?: boolean;
}

export default function GuardrailLogCard({
  scamLogs,
  telemetryLogs,
  latestPiiRedacted,
}: GuardrailLogCardProps) {
  const latestScam = scamLogs.length > 0 ? scamLogs[0] : null;
  const latestTurn = telemetryLogs.length > 0 ? telemetryLogs[0] : null;

  return (
    <div className="bg-[#121620]/90 border border-[#383E4E] rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#383E4E]/60 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#3A8EE0]" />
          <h2 className="font-mono font-bold text-xs tracking-wider text-white uppercase">
            GUARDRAIL MIDDLEWARE & TOOL TRACES
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#B6BAC5] bg-[#0B0E14] px-2 py-0.5 rounded border border-[#383E4E]">
          Deterministic Pre-LLM Filters
        </span>
      </div>

      {/* Real-Time Middleware Alerts */}
      <div className="space-y-2">
        {/* PII Scrubbed Alert */}
        {latestPiiRedacted || (latestTurn && latestTurn.pii_redacted === 1) ? (
          <div className="p-3 rounded-xl bg-[#34C759]/10 border border-[#34C759]/50 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#34C759]/20 text-[#34C759] flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#34C759] font-mono block">
                  PII SCRUBBED BEFORE API CALL (0 TOKENS)
                </span>
                <span className="text-[11px] text-[#34C759]/80 font-sans">
                  SIN / Card scrubbed at edge. No data sent to Claude.
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#34C759] bg-[#34C759]/20 px-2 py-0.5 rounded border border-[#34C759]/40">
              GUARD PASS
            </span>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-[#0B0E14] border border-[#383E4E]/60 flex items-center justify-between text-xs text-[#B6BAC5]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#34C759]" />
              <span className="font-mono text-[11px]">PII Invariant: Zero bank tokens or SINs stored</span>
            </div>
            <span className="text-[10px] text-[#34C759] font-mono">ACTIVE</span>
          </div>
        )}

        {/* MITRE F3 Scam Alert */}
        {latestScam && (latestScam.risk_level === "HIGH" || latestScam.risk_level === "CRITICAL_FRAUD") && (
          <div className="p-3 rounded-xl bg-[#D04040]/10 border border-[#D04040]/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#D04040]/20 text-[#D04040] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#EF4444] font-mono block">
                  MITRE F3 SCAM DETECTED: {latestScam.scam_type}
                </span>
                <span className="text-[11px] text-[#EF4444]/90 font-mono">
                  Tactic: {latestScam.mitre_f3_tactic} · Anti-Fraud Alert Dispatched
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#EF4444] bg-[#D04040]/20 px-2 py-0.5 rounded border border-[#D04040]/40">
              BLOCKED
            </span>
          </div>
        )}

        {/* A2UI Direct Action Badge if last turn was direct */}
        {latestTurn && latestTurn.skill_used === "a2ui_direct_action" && (
          <div className="p-2.5 rounded-xl bg-[#2177D1]/10 border border-[#2177D1]/50 flex items-center justify-between text-xs text-[#3A8EE0]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#3A8EE0]" />
              <span className="font-mono text-[11px]">A2UI Direct Action: DB updated deterministically at $0.00</span>
            </div>
            <span className="text-[10px] text-[#3A8EE0] font-mono font-bold">$0.00 COST</span>
          </div>
        )}
      </div>

      {/* Recent Tool Call Traces Terminal */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-[#B6BAC5] block font-semibold">
          RECENT TOOL CALL TRACES (LAST 4 TURNS)
        </span>
        <div className="bg-[#0B0E14] border border-[#383E4E]/60 rounded-xl p-3 font-mono text-xs space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {telemetryLogs.slice(0, 4).map((log, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between pb-1.5 border-b border-[#383E4E]/30 last:border-0 last:pb-0"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500">[{idx + 1}]</span>
                  <span className="text-[#3A8EE0] font-semibold">{log.skill_used}</span>
                  <span className="text-slate-600">via</span>
                  <span className="text-slate-400">{log.model_used}</span>
                </div>
                {Array.isArray(log.tool_calls) && log.tool_calls.length > 0 && (
                  <div className="text-[10px] text-slate-500 pl-4">
                    tool: {log.tool_calls.map((t) => t.name).join(", ")}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">{log.latency_ms}ms</span>
            </div>
          ))}
          {telemetryLogs.length === 0 && (
            <div className="text-slate-600 text-center py-2">
              No recent tool call traces recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
