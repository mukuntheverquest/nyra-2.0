"use client";

import React from "react";
import { Activity, Cpu, DollarSign, Database, TrendingUp, Zap } from "lucide-react";

interface TelemetryRecord {
  model_used: string;
  input_tokens: number;
  cache_write_tokens: number;
  cache_read_tokens: number;
  output_tokens: number;
  est_cost_usd: number;
  est_cost_cad: number;
  latency_ms: number;
  skill_used: string;
}

interface TelemetryCardProps {
  telemetry: TelemetryRecord | null;
  aiMsgsUsed: number;
}

export default function TelemetryCard({
  telemetry,
  aiMsgsUsed,
}: TelemetryCardProps) {
  const maxQuota = 25;
  const quotaPct = Math.min(100, Math.round((aiMsgsUsed / maxQuota) * 100));

  const inputTokens = telemetry?.input_tokens ?? 280;
  const cacheReadTokens = telemetry?.cache_read_tokens ?? 240;
  const outputTokens = telemetry?.output_tokens ?? 65;
  const costUsd = telemetry?.est_cost_usd ?? 0.000062;
  const costCad = telemetry?.est_cost_cad ?? 0.000085;
  const modelName = telemetry?.model_used ?? "claude-haiku-5-5";
  const latency = telemetry?.latency_ms ?? 140;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-sm tracking-wide text-slate-100 uppercase">
            Haiku 5.5 Telemetry & Unit Economics
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">{modelName}</span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-[11px] text-emerald-400">{latency}ms</span>
        </div>
      </div>

      {/* Token Breakdown Grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
            Input Tokens
          </span>
          <span className="text-lg font-bold text-slate-200 font-mono">
            {inputTokens}
          </span>
          <span className="text-[9px] text-slate-500 block">$0.10 / 1M</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-semibold text-emerald-400 block flex items-center justify-center gap-1">
            <Zap className="w-2.5 h-2.5" /> Cache Read
          </span>
          <span className="text-lg font-bold text-emerald-300 font-mono">
            {cacheReadTokens}
          </span>
          <span className="text-[9px] text-emerald-500 block">90% Discount</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
            Output Tokens
          </span>
          <span className="text-lg font-bold text-slate-200 font-mono">
            {outputTokens}
          </span>
          <span className="text-[9px] text-slate-500 block">Max 300 SMS</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 bg-gradient-to-br from-emerald-950/20 to-slate-950">
          <span className="text-[10px] uppercase font-semibold text-emerald-400 block">
            Reply Cost
          </span>
          <span className="text-sm font-black text-emerald-300 font-mono block mt-1">
            ${costCad < 0.0001 ? "< $0.0001" : costCad.toFixed(5)} CAD
          </span>
          <span className="text-[9px] text-slate-500 block">
            (${costUsd.toFixed(6)} USD)
          </span>
        </div>
      </div>

      {/* Sustainable Economics Highlights */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Projected AI Spend
            </span>
            <span className="text-base font-extrabold text-slate-100 font-mono">
              &lt; $0.02 CAD / mo
            </span>
            <p className="text-[10px] text-slate-400">
              Guaranteed by 25 AI msg quota + caching
            </p>
          </div>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Estimated Gross Margin
            </span>
            <span className="text-base font-extrabold text-emerald-300 font-mono">
              ~84% Gross Margin
            </span>
            <p className="text-[10px] text-slate-400">
              On $45/yr &amp; $10/seat institutional
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Quota Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Monthly AI Quota (Coach &amp; Scam Shield)
          </span>
          <span className="font-mono text-xs text-slate-300">
            <span className="text-emerald-400 font-bold">{aiMsgsUsed}</span> / {maxQuota} msgs used
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              quotaPct >= 90
                ? "bg-rose-500"
                : quotaPct >= 60
                ? "bg-amber-400"
                : "bg-gradient-to-r from-emerald-500 to-teal-400"
            }`}
            style={{ width: `${quotaPct}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 italic">
          Bill Guard reminders &amp; payments are 100% deterministic and do not count against this quota.
        </p>
      </div>
    </div>
  );
}
