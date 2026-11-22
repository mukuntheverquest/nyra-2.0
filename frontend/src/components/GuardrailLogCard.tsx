"use client";

import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Terminal,
  Clock,
  CheckCircle2,
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-sm tracking-wide text-slate-100 uppercase">
            Guardrail Middleware &amp; Tool Traces
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          Deterministic Pre-LLM Filters
        </span>
      </div>

      {/* Real-Time Middleware Alerts */}
      <div className="space-y-2">
        {/* PII Scrubbed Alert */}
        {(latestPiiRedacted || (latestTurn && latestTurn.pii_redacted === 1)) ? (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-300 block">
                  PII SCRUBBED BEFORE API CALL (0 TOKENS)
                </span>
                <span className="text-[11px] text-emerald-400/90">
                  SIN / Card scrubbed at edge. No data sent to Anthropic Claude.
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded">
              GUARD PASS
            </span>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PII Invariant: Zero bank tokens or SINs ever stored</span>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-mono">ACTIVE</span>
          </div>
        )}

        {/* MITRE F3 Scam Alert */}
        {latestScam && latestScam.risk_level === "HIGH" && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-300 block">
                  MITRE F3 SCAM FLAG: HIGH RISK
                </span>
                <span className="text-[11px] text-rose-300/80">
                  Tactic: {latestScam.mitre_f3_tactic} • Impersonation Phishing
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded font-bold">
              FA0002
            </span>
          </div>
        )}
      </div>

      {/* Real-Time Tool-Call Audit Stream */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Recent Tool Calls &amp; Latency Trace
        </span>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {telemetryLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">
              No recent tool executions logged yet.
            </p>
          ) : (
            telemetryLogs.map((log, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {log.skill_used}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{log.latency_ms} ms</span>
                  </div>
                </div>

                {log.tool_calls && log.tool_calls.length > 0 && (
                  <div className="pt-1 border-t border-slate-900 text-[11px] text-slate-300">
                    {log.tool_calls.map((tc, tcIdx) => (
                      <div key={tcIdx} className="truncate">
                        <span className="text-purple-400 font-bold">tool:</span>{" "}
                        <span className="text-slate-100">{tc.name}()</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
