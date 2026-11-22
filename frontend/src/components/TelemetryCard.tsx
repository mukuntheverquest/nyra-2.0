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
    <div className="bg-[#121620]/90 border border-[#383E4E] rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#383E4E]/60 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#3A8EE0]" />
          <h2 className="font-mono font-bold text-xs tracking-wider text-white uppercase">
            HAIKU 5.5 TELEMETRY & UNIT ECONOMICS
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#0B0E14] px-2.5 py-1 rounded-lg border border-[#383E4E]">
          <Cpu className="w-3.5 h-3.5 text-[#3A8EE0]" />
          <span className="font-mono text-[11px] text-slate-200">{modelName}</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-[11px] text-[#34C759]">{latency}ms</span>
        </div>
      </div>

      {/* Token Breakdown Grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-[#0B0E14] border border-[#383E4E]/60 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-mono text-[#B6BAC5] block">
            Input Tokens
          </span>
          <span className="text-base font-bold text-slate-100 font-mono">
            {inputTokens}
          </span>
          <span className="text-[9px] text-slate-500 font-mono block">$0.10 / 1M</span>
        </div>

        <div className="bg-[#0B0E14] border border-[#383E4E]/60 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-mono text-[#34C759] block flex items-center justify-center gap-1">
            <Zap className="w-2.5 h-2.5" /> Cache Read
          </span>
          <span className="text-base font-bold text-[#34C759] font-mono">
            {cacheReadTokens}
          </span>
          <span className="text-[9px] text-[#34C759]/80 font-mono block">90% Discount</span>
        </div>

        <div className="bg-[#0B0E14] border border-[#383E4E]/60 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-mono text-[#B6BAC5] block">
            Output Tokens
          </span>
          <span className="text-base font-bold text-slate-100 font-mono">
            {outputTokens}
          </span>
          <span className="text-[9px] text-slate-500 font-mono block">Max 300 SMS</span>
        </div>

        <div className="bg-[#0B0E14] border border-[#383E4E]/60 rounded-xl p-2.5 bg-gradient-to-br from-[#2177D1]/10 to-[#0B0E14]">
          <span className="text-[10px] uppercase font-mono text-[#3A8EE0] block">
            Reply Cost
          </span>
          <span className="text-xs font-bold text-[#3A8EE0] font-mono block mt-1">
            {costCad < 0.0001 ? "< $0.0001" : `$${costCad.toFixed(5)}`} CAD
          </span>
          <span className="text-[9px] text-slate-500 font-mono block">
            (${costUsd.toFixed(6)} USD)
          </span>
        </div>
      </div>

      {/* Monthly Quota Cap & Economics Summary */}
      <div className="bg-[#0B0E14] border border-[#383E4E]/60 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#B6BAC5]">
            Monthly Free-Tier AI Quota ({aiMsgsUsed} / {maxQuota} messages)
          </span>
          <span className="text-slate-300 font-semibold">{quotaPct}%</span>
        </div>
        <div className="w-full bg-[#121620] h-2 rounded-full overflow-hidden border border-[#383E4E]/60">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              quotaPct > 80 ? "bg-[#D04040]" : quotaPct > 50 ? "bg-[#C39A35]" : "bg-[#2177D1]"
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
        <div className="bg-[#0B0E14] border border-[#383E4E]/60 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 block">Est. LLM Cost / User / Mo</span>
            <span className="font-bold text-[#34C759]">&lt; $0.02 CAD</span>
          </div>
          <TrendingUp className="w-4 h-4 text-[#34C759]" />
        </div>
        <div className="bg-[#0B0E14] border border-[#383E4E]/60 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 block">Gross Margin on $45/yr</span>
            <span className="font-bold text-[#3A8EE0]">~84% (post-Twilio)</span>
          </div>
          <DollarSign className="w-4 h-4 text-[#3A8EE0]" />
        </div>
      </div>
    </div>
  );
}
