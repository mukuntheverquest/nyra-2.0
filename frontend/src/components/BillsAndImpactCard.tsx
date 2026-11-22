"use client";

import React from "react";
import {
  Calendar,
  Flame,
  ShieldCheck,
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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] space-y-5">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2177D1]" />
          <h2 className="font-mono font-bold text-xs tracking-wider text-slate-900 uppercase">
            LIVE BILLS, TRIAL KILL-SWITCHES & YOUTH IMPACT
          </h2>
        </div>
        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
          20% Net Profit &rarr; FFE Youth Pool
        </span>
      </div>

      {/* 3 Top KPI Tiles */}
      <div className="grid grid-cols-3 gap-3">
        {/* KPI 1: Payment Streak */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 text-xs mb-1">
            <span className="font-mono text-[11px] font-medium">Payment Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-black text-amber-600">{streak}</span>
            <span className="text-xs text-slate-500 font-medium">months</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">Zero missed dates</p>
        </div>

        {/* KPI 2: Late Fees Saved */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 text-xs mb-1">
            <span className="font-mono text-[11px] font-medium">Late Fees Saved</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-black text-emerald-600">
              ${feesSaved.toFixed(0)}
            </span>
            <span className="text-xs text-slate-500 font-medium">CAD</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">$25 / on-time payment</p>
        </div>

        {/* KPI 3: Youth Pool Minutes */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 text-xs mb-1">
            <span className="font-mono text-[11px] font-medium">Youth Pool</span>
            <GraduationCap className="w-4 h-4 text-[#2177D1]" />
          </div>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-black text-[#2177D1]">{impactMins}</span>
            <span className="text-xs text-slate-500 font-medium">mins</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">Free workshops funded</p>
        </div>
      </div>

      {/* Tracked Recurring Bills Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
          <span className="font-semibold text-slate-800">
            TRACKED RECURRING BILLS ({bills.length})
          </span>
          <span className="text-slate-400">Auto-rolls upon payment</span>
        </div>

        {bills.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-mono">
            No bills tracked yet. Text Preset #5 to track your first bill!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-[10px] text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Bill Name</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Next Due</th>
                  <th className="py-2.5 px-3">Details / PAD</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {bills.map((bill) => {
                  const isPaid = bill.status === "paid";
                  return (
                    <tr key={bill.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {bill.name}
                      </td>
                      <td className="py-2.5 px-3 text-[#2177D1] font-bold">
                        ${Number(bill.amount).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {bill.next_due_date}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {bill.statement_day && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                              <CreditCard className="w-3 h-3" />
                              Stmt: {bill.statement_day}th
                            </span>
                          )}
                          {bill.is_pad ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                              <AlertCircle className="w-3 h-3" />
                              PAD Auto-Debit
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-medium">
                            <Clock className="w-3 h-3" />
                            Scheduled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Free Trial Kill-Switches */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
          <span className="font-semibold text-slate-800">
            ACTIVE FREE TRIAL KILL-SWITCHES ({trials.length})
          </span>
          <span className="text-slate-400">48h advance warning</span>
        </div>

        {trials.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-mono">
            No active free trials. Text Preset #1 to lock in a kill-switch!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-[10px] text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Service</th>
                  <th className="py-2 px-3">Charges Begin</th>
                  <th className="py-2 px-3">Alert Date</th>
                  <th className="py-2 px-3 text-right">Kill-Switch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {trials.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {t.service_name}
                    </td>
                    <td className="py-2.5 px-3 text-amber-700 font-medium">{t.cancel_by_date}</td>
                    <td className="py-2.5 px-3 text-slate-600">{t.alert_date}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                        ARMED (48h)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
