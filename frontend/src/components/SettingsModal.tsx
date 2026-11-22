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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#121620] border border-[#383E4E] rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6 space-y-6 text-slate-100 custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#383E4E]/60 pb-4">
          <div>
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
              Account, Billing & Privacy Compliance
            </h2>
            <p className="text-xs text-[#B6BAC5] font-mono mt-0.5">
              Canonical Web: <span className="text-[#3A8EE0]">https://nyra-app.ca</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#0B0E14] hover:bg-[#383E4E] border border-[#383E4E] flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Plan & 1-Click Cancellation */}
        <div className="bg-[#0B0E14] border border-[#383E4E]/60 rounded-2xl p-4 space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#B6BAC5] uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#3A8EE0]" /> Current Plan
            </span>
            <span className="text-xs font-bold text-[#34C759] bg-[#34C759]/10 px-2.5 py-0.5 rounded-full border border-[#34C759]/30">
              {planDisplayName}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#121620] border border-[#383E4E]/60 text-xs text-slate-300 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D4AE52] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">
                  Explicit Cancellation Guarantee:
                </span>
                <p className="text-slate-400 text-[11px] mt-0.5 font-sans">
                  Deleting your tracked bills will <strong>never</strong> cancel your account or subscription.
                  Cancellation is strictly an explicit 1-click action performed right here.
                </p>
              </div>
            </div>

            {user?.plan_tier !== "cancelled" && (
              <button
                onClick={handleCancelSubscription}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-[#D04040]/10 hover:bg-[#D04040]/20 text-[#EF4444] border border-[#D04040]/30 font-semibold text-xs transition cursor-pointer"
              >
                1-Click Cancel Subscription
              </button>
            )}
          </div>
        </div>

        {/* Section 2: B2B2C Institutional Code Input */}
        <div className="bg-[#0B0E14] border border-[#383E4E]/60 rounded-2xl p-4 space-y-3 font-mono">
          <span className="text-xs font-semibold text-[#B6BAC5] uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#3A8EE0]" /> B2B2C Campus / Cohort Access Code
          </span>
          <p className="text-xs text-slate-400 font-sans">
            If your university student union or FFE workshop cohort provided an institutional code, enter it below to activate $0 access:
          </p>

          <form onSubmit={handleApplyB2b} className="flex gap-2">
            <input
              type="text"
              value={b2bCode}
              onChange={(e) => setB2bCode(e.target.value)}
              placeholder="e.g. MCMASTER-2026 or FFE-COHORT-04"
              className="flex-1 bg-[#121620] border border-[#383E4E] rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-[#2177D1] outline-none font-mono uppercase"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#2177D1] hover:bg-[#3A8EE0] text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Apply Code
            </button>
          </form>

          {b2bSuccess && (
            <div className="p-2 rounded-lg bg-[#34C759]/10 border border-[#34C759]/30 text-[#34C759] text-xs flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#34C759]" />
              Institutional bulk access applied successfully! Sponsored by {user?.org_code}.
            </div>
          )}
          {b2bError && (
            <div className="p-2 rounded-lg bg-[#D04040]/10 border border-[#D04040]/30 text-[#EF4444] text-xs">
              {b2bError}
            </div>
          )}
        </div>

        {/* Section 3: PIPEDA & CASL Preferences */}
        <div className="bg-[#0B0E14] border border-[#383E4E]/60 rounded-2xl p-4 space-y-4 font-mono">
          <span className="text-xs font-semibold text-[#B6BAC5] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#34C759]" /> Privacy & Canadian Compliance
          </span>

          {/* CASL SMS Active Toggle */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#383E4E]/40">
            <div>
              <span className="font-semibold text-slate-200 block">CASL SMS Alerts Active</span>
              <span className="text-[11px] text-slate-400 font-sans">
                Reply STOP to any SMS to immediately revoke consent.
              </span>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({ sms_active: user?.sms_active ? 0 : 1 })
              }
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                user?.sms_active
                  ? "bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/40"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {user?.sms_active ? "ENABLED" : "DISABLED"}
            </button>
          </div>

          {/* Weekly Tip Opt-In */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#383E4E]/40">
            <div>
              <span className="font-semibold text-slate-200 block">Weekly FFE Financial Tip</span>
              <span className="text-[11px] text-slate-400 font-sans">
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
                  ? "bg-[#2177D1]/20 text-[#3A8EE0] border border-[#2177D1]/40"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {user?.weekly_tip_opt_in ? "OPTED IN" : "MUTED"}
            </button>
          </div>

          {/* PIPEDA Zero-Trust Guarantee */}
          <div className="p-3 rounded-xl bg-[#121620] border border-[#383E4E]/60 text-[11px] text-[#B6BAC5] space-y-1 font-sans">
            <span className="font-semibold text-slate-200 font-mono block">
              PIPEDA Zero-Trust Security Guarantee:
            </span>
            <p>
              Nyra does not link, store, or solicit online banking credentials or Social Insurance Numbers.
              All messages pass through deterministic edge scrubbing before processing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500 font-mono">
            Referral: <strong className="text-[#3A8EE0]">{user?.referral_code || "NYRA-EARLY"}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2177D1] hover:bg-[#3A8EE0] text-white rounded-xl text-xs font-mono font-medium transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
