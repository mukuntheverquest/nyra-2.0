"use client";

import React from "react";
import { Activity, Cpu, DollarSign, TrendingUp, Zap } from "lucide-react";

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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#2177D1]" />
          <h2 className="font-mono font-bold text-xs tracking-wider text-slate-900 uppercase">
            HAIKU 5.5 TELEMETRY & UNIT ECONOMICS
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          <Cpu className="w-3.5 h-3.5 text-[#2177D1]" />
          <span className="font-mono text-[11px] text-slate-800 font-medium">{modelName}</span>
          <span className="text-slate-400">•</span>
          <span className="font-mono text-[11px] text-emerald-600 font-semibold">{latency}ms</span>
        </div>
      </div>

      {/* Token Breakdown Grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-mono text-slate-500 block font-medium">
            Input Tokens
          </span>
          <span className="text-base font-bold text-slate-900 font-mono">
            {inputTokens}
          </span>
          <span className="text-[9px] text-slate-400 font-mono block">$0.10 / 1M</span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-mono text-emerald-700 block flex items-center justify-center gap-1 font-medium">
            <Zap className="w-2.5 h-2.5" /> Cache Read
          </span>
          <span className="text-base font-bold text-emerald-600 font-mono">
            {cacheReadTokens}
          </span>
          <span className="text-[9px] text-emerald-600/80 font-mono block font-medium">90% Discount</span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-mono text-slate-500 block font-medium">
            Output Tokens
          </span>
          <span className="text-base font-bold text-slate-900 font-mono">
            {outputTokens}
          </span>
          <span className="text-[9px] text-slate-400 font-mono block">Max 300 SMS</span>
        </div>

        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-mono text-blue-700 block font-medium">
            Reply Cost
          </span>
          <span className="text-xs font-bold text-blue-700 font-mono block mt-1">
            {costCad < 0.0001 ? "< $0.0001" : `$${costCad.toFixed(5)}`} CAD
          </span>
          <span className="text-[9px] text-slate-400 font-mono block">
            (${costUsd.toFixed(6)} USD)
          </span>
        </div>
      </div>

      {/* Monthly Quota Cap & Economics Summary */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-600 font-medium">
            Monthly Free-Tier AI Quota ({aiMsgsUsed} / {maxQuota} messages)
          </span>
          <span className="text-slate-900 font-bold">{quotaPct}%</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              quotaPct > 80 ? "bg-red-500" : quotaPct > 50 ? "bg-amber-500" : "bg-[#2177D1]"
            }`}
            style={{ width: `${quotaPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
          <span>*Bill Guard & PII Scrubber always active at $0.00 cost</span>
          <span>Resets on 1st of month</span>
        </div>
      </div>

      {/* Subscription Gross Margin Strip */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 block">Est. LLM Cost / User / Mo</span>
            <span className="font-bold text-emerald-600">&lt; $0.02 CAD</span>
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 block">Gross Margin on $45/yr</span>
            <span className="font-bold text-[#2177D1]">~84% (post-Twilio)</span>
          </div>
          <DollarSign className="w-4 h-4 text-[#2177D1]" />
        </div>
      </div>
    </div>
  );
}
