"use client";

import React from "react";
import {
  Calendar,
  Flame,
  ShieldAlert,
  GraduationCap,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Bill {
  id: number;
  name: string;
  amount: number;
  category: string;
  due_day: number;
  statement_day?: number | null;
  next_due_date: string;
  is_pad: number;
  status: string;
}

interface TrialAlert {
  id: number;
  service_name: string;
  start_date: string;
  cancel_by_date: string;
  alert_date: string;
  status: string;
}

interface UserProfile {
  name: string;
  streak_months: number;
  late_fees_saved: number;
  impact_minutes_funded: number;
  plan_tier: string;
  org_code?: string;
}

interface BillsAndImpactCardProps {
  user: UserProfile | null;
  bills: Bill[];
  trials: TrialAlert[];
}

export default function BillsAndImpactCard({
  user,
  bills,
  trials,
}: BillsAndImpactCardProps) {
  const streak = user?.streak_months || 0;
  const feesSaved = user?.late_fees_saved || 0;
  const impactMins = user?.impact_minutes_funded || 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-sm tracking-wide text-slate-100 uppercase">
            Live Bills, Trial Kill-Switches & Youth Impact
          </h2>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          20% Net Profit &rarr; FFE Youth Pool
        </span>
      </div>

      {/* 3 Top KPI Tiles */}
      <div className="grid grid-cols-3 gap-3">
        {/* KPI 1 */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Payment Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-300">{streak}</span>
            <span className="text-xs text-slate-400">months</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Zero missed dates</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Late Fees Saved</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-300">
              ${feesSaved.toFixed(0)}
            </span>
            <span className="text-xs text-slate-400">CAD</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">$25 / on-time payment</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Youth Pool</span>
            <GraduationCap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-purple-300">{impactMins}</span>
            <span className="text-xs text-slate-400">mins</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Free workshops funded</p>
        </div>
      </div>

      {/* Tracked Bills Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tracked Recurring Bills ({bills.length})
          </h3>
          <span className="text-[10px] text-slate-500">Auto-rolls upon payment</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Bill Name</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Next Due</th>
                <th className="py-2.5 px-3">Details / PAD</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-500">
                    No bills tracked. Text Nyra to add one!
                  </td>
                </tr>
              ) : (
                bills.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      {b.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-emerald-400">
                      ${b.amount.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      {b.next_due_date}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {Boolean(b.is_pad) && (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded inline-flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> PAD Auto-Debit
                          </span>
                        )}
                        {b.statement_day && (
                          <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-medium px-1.5 py-0.2 rounded inline-flex items-center gap-1">
                            <CreditCard className="w-2.5 h-2.5" /> Stmt: {b.statement_day}th
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Scheduled
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trial Kill-Switches Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Free Trial Kill-Switches ({trials.length})
          </h3>
          <span className="text-[10px] text-slate-500">48h advance warning</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Charges Begin</th>
                <th className="py-2.5 px-3">Alert Date</th>
                <th className="py-2.5 px-3 text-right">Kill-Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {trials.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-3 text-center text-slate-500">
                    No active free trials. Text Preset #1 to lock in a kill-switch!
                  </td>
                </tr>
              ) : (
                trials.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      {t.service_name}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-rose-300">
                      {t.cancel_by_date}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">
                      {t.alert_date} (48h early)
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ACTIVE SHIELD
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
