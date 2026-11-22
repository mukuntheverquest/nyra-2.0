"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CreditCard,
  Building2,
  BellRing,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

interface UserProfile {
  name: string;
  phone: string;
  plan_tier: string;
  org_code?: string;
  sms_active: number;
  weekly_tip_opt_in: number;
  referral_code: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpdateSettings: (settings: {
    plan_tier?: string;
    org_code?: string;
    sms_active?: number;
    weekly_tip_opt_in?: number;
  }) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  user,
  onUpdateSettings,
}: SettingsModalProps) {
  const [b2bCode, setB2bCode] = useState(user?.org_code || "");
  const [b2bSuccess, setB2bSuccess] = useState(false);
  const [b2bError, setB2bError] = useState("");

  if (!isOpen) return null;

  const handleApplyB2b = (e: React.FormEvent) => {
    e.preventDefault();
    setB2bError("");
    setB2bSuccess(false);

    const code = b2bCode.trim().toUpperCase();
    if (["MCMASTER-2026", "FFE-COHORT-04", "MCMASTER-BETA"].includes(code)) {
      onUpdateSettings({ org_code: code, plan_tier: "b2b_bulk" });
      setB2bSuccess(true);
    } else {
      setB2bError("Invalid institutional code. Try 'MCMASTER-2026' or 'FFE-COHORT-04'.");
    }
  };

  const handleCancelSubscription = () => {
    if (confirm("Are you sure you want to cancel your Nyra subscription?")) {
      onUpdateSettings({ plan_tier: "cancelled" });
    }
  };

  const planDisplayName =
    user?.plan_tier === "b2b_bulk"
      ? `Institutional Bulk Sponsor (${user?.org_code || "Campus"}) — $0/yr`
      : user?.plan_tier === "annual_45"
      ? "$45/yr Annual Supporter (Best Value)"
      : user?.plan_tier === "monthly_5"
      ? "$5/mo Standard"
      : user?.plan_tier === "cancelled"
      ? "Cancelled"
      : "14-Day Free Trial";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              Account, Billing &amp; Privacy Compliance
            </h2>
            <p className="text-xs text-slate-400">
              Canonical Web Endpoint:{" "}
              <span className="font-mono text-emerald-400">https://nyra-app.ca</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Plan & 1-Click Cancellation */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-400" /> Current Plan
            </span>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {planDisplayName}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">
                  Explicit Cancellation Guarantee:
                </span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Deleting your tracked bills will <strong>never</strong> cancel your account or subscription.
                  Cancellation is strictly an explicit 1-click action performed right here.
                </p>
              </div>
            </div>

            {user?.plan_tier !== "cancelled" && (
              <button
                onClick={handleCancelSubscription}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-xs transition"
              >
                1-Click Cancel Subscription
              </button>
            )}
          </div>
        </div>

        {/* Section 2: B2B2C Institutional Code Input */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-purple-400" /> B2B2C Campus / Cohort Access Code
          </span>
          <p className="text-xs text-slate-400">
            If your university student union or FFE workshop cohort provided an institutional code, enter it below to activate $0 access:
          </p>

          <form onSubmit={handleApplyB2b} className="flex gap-2">
            <input
              type="text"
              value={b2bCode}
              onChange={(e) => setB2bCode(e.target.value)}
              placeholder="e.g. MCMASTER-2026 or FFE-COHORT-04"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono uppercase"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition"
            >
              Apply Code
            </button>
          </form>

          {b2bSuccess && (
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Institutional bulk access applied successfully! Sponsored by {user?.org_code}.
            </div>
          )}
          {b2bError && (
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {b2bError}
            </div>
          )}
        </div>

        {/* Section 3: PIPEDA & CASL Preferences */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Privacy &amp; Canadian Compliance
          </span>

          {/* PIPEDA Notice */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-200">
              PIPEDA Privacy Architecture (Zero-PII Risk):
            </span>
            <p>
              Nyra 2.0 operates strictly on text-first manual entry. We <strong>never</strong> request banking passwords, OAuth tokens, statement PDFs, or credit card numbers. Sensitive identifiers like SINs are scrubbed at the edge before AI processing.
            </p>
          </div>

          {/* CASL SMS Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                CASL SMS Reminders Status
              </span>
              <span className="text-[11px] text-slate-400">
                You can reply STOP to any text message at any time to pause alerts.
              </span>
            </div>
            <button
              onClick={() => onUpdateSettings({ sms_active: user?.sms_active ? 0 : 1 })}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                user?.sms_active
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {user?.sms_active ? "ACTIVE" : "PAUSED (STOPPED)"}
            </button>
          </div>

          {/* Weekly Tip Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                Weekly 2-Min Literacy Micro-Tip
              </span>
              <span className="text-[11px] text-slate-400">
                Sunday morning 2-sentence Canadian financial tip from FFE curriculum.
              </span>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({
                  weekly_tip_opt_in: user?.weekly_tip_opt_in ? 0 : 1,
                })
              }
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                user?.weekly_tip_opt_in
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {user?.weekly_tip_opt_in ? "ENABLED" : "MUTED"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
