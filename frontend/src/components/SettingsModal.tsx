"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CreditCard,
  Building2,
  AlertTriangle,
  CheckCircle,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-[0_20px_50px_rgba(15,23,42,0.15)] p-6 space-y-6 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-mono uppercase tracking-wide">
              Account, Billing & Privacy Compliance
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Canonical Web: <span className="text-[#2177D1] font-semibold">https://nyra-app.ca</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Plan & 1-Click Cancellation */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#2177D1]" /> Current Plan
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {planDisplayName}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">
                  Explicit Cancellation Guarantee:
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5 font-sans">
                  Deleting your tracked bills will <strong>never</strong> cancel your account or subscription.
                  Cancellation is strictly an explicit 1-click action performed right here.
                </p>
              </div>
            </div>

            {user?.plan_tier !== "cancelled" && (
              <button
                onClick={handleCancelSubscription}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs transition cursor-pointer"
              >
                1-Click Cancel Subscription
              </button>
            )}
          </div>
        </div>

        {/* Section 2: B2B2C Institutional Code Input */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 font-mono">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#2177D1]" /> B2B2C Campus / Cohort Access Code
          </span>
          <p className="text-xs text-slate-500 font-sans">
            If your university student union or FFE workshop cohort provided an institutional code, enter it below to activate $0 access:
          </p>

          <form onSubmit={handleApplyB2b} className="flex gap-2">
            <input
              type="text"
              value={b2bCode}
              onChange={(e) => setB2bCode(e.target.value)}
              placeholder="e.g. MCMASTER-2026 or FFE-COHORT-04"
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2177D1] outline-none font-mono uppercase"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#2177D1] hover:bg-[#3A8EE0] text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Apply Code
            </button>
          </form>

          {b2bSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Institutional bulk access applied successfully! Sponsored by {user?.org_code}.
            </div>
          )}
          {b2bError && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {b2bError}
            </div>
          )}
        </div>

        {/* Section 3: PIPEDA & CASL Preferences */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-4 font-mono">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Privacy & Canadian Compliance
          </span>

          {/* CASL SMS Active Toggle */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
            <div>
              <span className="font-semibold text-slate-900 block">CASL SMS Alerts Active</span>
              <span className="text-[11px] text-slate-500 font-sans">
                Reply STOP to any SMS to immediately revoke consent.
              </span>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({ sms_active: user?.sms_active ? 0 : 1 })
              }
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                user?.sms_active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}
            >
              {user?.sms_active ? "ENABLED" : "DISABLED"}
            </button>
          </div>

          {/* Weekly Tip Opt-In */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
            <div>
              <span className="font-semibold text-slate-900 block">Weekly FFE Financial Tip</span>
              <span className="text-[11px] text-slate-500 font-sans">
                Sunday 6 PM educational summary from FFE curriculum.
              </span>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({
                  weekly_tip_opt_in: user?.weekly_tip_opt_in ? 0 : 1,
                })
              }
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                user?.weekly_tip_opt_in
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}
            >
              {user?.weekly_tip_opt_in ? "OPTED IN" : "MUTED"}
            </button>
          </div>

          {/* PIPEDA Zero-Trust Guarantee */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 space-y-1 font-sans">
            <span className="font-semibold text-slate-900 font-mono block">
              PIPEDA Zero-Trust Security Guarantee:
            </span>
            <p>
              Nyra does not link, store, or solicit online banking credentials or Social Insurance Numbers.
              All messages pass through deterministic edge scrubbing before processing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 font-mono">
            Referral: <strong className="text-[#2177D1]">{user?.referral_code || "NYRA-EARLY"}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2177D1] hover:bg-[#3A8EE0] text-white rounded-xl text-xs font-mono font-medium transition cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
