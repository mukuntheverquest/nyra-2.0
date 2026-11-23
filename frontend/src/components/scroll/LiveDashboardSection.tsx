"use client";

import React, { useState } from "react";
import {
  Flame,
  ShieldCheck,
  GraduationCap,
  Calendar,
  Clock,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  Mail,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { AnimatedNumber, useScrollCraft } from "@/lib/scrollCraftEngine";

interface LiveDashboardSectionProps {
  user: any;
  bills: any[];
  trials: any[];
  telemetryLatest: any;
  telemetryLogs: any[];
  scamLogs: any[];
  latestA2UIMessages: any[];
  latestPiiRedacted?: boolean;
  outreachLeads?: any[];
  outreachEmails?: any[];
  outreachSummary?: any;
  onSelectLeadToDraft?: (leadName: string, organization: string) => void;
  onAddLead?: (leadData: {
    name: string;
    email: string;
    organization: string;
    segment?: string;
    youth_reach_est?: number;
    casl_consent_type?: string;
    notes?: string;
  }) => void;
  onDeleteLead?: (leadId: number) => void;
  onDraftForLead?: (leadId: number) => void;
  onEmailAction?: (emailId: number, action: "approve_send" | "discard") => void;
}

export const LiveDashboardSection: React.FC<LiveDashboardSectionProps> = ({
  user,
  bills,
  trials,
  telemetryLatest,
  telemetryLogs,
  scamLogs,
  latestA2UIMessages,
  latestPiiRedacted,
  outreachLeads = [],
  outreachEmails = [],
  outreachSummary,
  onSelectLeadToDraft,
  onAddLead,
  onDeleteLead,
  onDraftForLead,
  onEmailAction,
}) => {
  useScrollCraft([user, bills, trials, outreachEmails]);

  const [expandedEmailId, setExpandedEmailId] = useState<number | null>(null);
  const [showA2UIInspector, setShowA2UIInspector] = useState(false);

  // Inline Lead Creator State
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadOrg, setNewLeadOrg] = useState("");
  const [newLeadReach, setNewLeadReach] = useState(250);
  const [newLeadSegment, setNewLeadSegment] = useState("campus_union");
  const [newLeadConsent, setNewLeadConsent] = useState("implied_b2b_inquiry");
  const [newLeadNotes, setNewLeadNotes] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const streak = user?.streak_months ?? 4;
  const feesSaved = user?.late_fees_saved ?? 105;
  const impactMins = user?.impact_minutes_funded ?? 60;
  const aiMsgsUsed = user?.ai_msgs_used ?? 2;
  const maxQuota = 25;
  const quotaPct = Math.min(100, Math.round((aiMsgsUsed / maxQuota) * 100));

  const inputTokens = telemetryLatest?.input_tokens ?? 320;
  const cacheReadTokens = telemetryLatest?.cache_read_tokens ?? 280;
  const outputTokens = telemetryLatest?.output_tokens ?? 52;
  const costCad = telemetryLatest?.est_cost_cad ?? 0.000085;
  const modelName = telemetryLatest?.model_used ?? "claude-haiku-5-5";
  const latency = telemetryLatest?.latency_ms ?? 120;

  const totalLeads = outreachSummary?.total_leads ?? outreachLeads.length;
  const emailsSent = outreachSummary?.emails_sent ?? 0;
  const estYouthReached = outreachSummary?.est_youth_reached ?? 0;
  const outreachMode = outreachSummary?.outreach_mode ?? "sandbox";

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadEmail.trim() || !newLeadOrg.trim()) return;
    setIsSubmittingLead(true);
    if (onAddLead) {
      await onAddLead({
        name: newLeadName.trim(),
        email: newLeadEmail.trim(),
        organization: newLeadOrg.trim(),
        youth_reach_est: Number(newLeadReach) || 250,
        segment: newLeadSegment,
        casl_consent_type: newLeadConsent,
        notes: newLeadNotes.trim() || undefined,
      });
    }
    setNewLeadName("");
    setNewLeadEmail("");
    setNewLeadOrg("");
    setNewLeadReach(250);
    setNewLeadNotes("");
    setIsSubmittingLead(false);
    setIsAddLeadOpen(false);
  };

  return (
    <section
      id="live-dashboard"
      data-sc-act="flow"
      data-sc-section="dashboard"
      className="w-full bg-[#F8FAFC] py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* 4.1 Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-sm font-mono font-bold uppercase tracking-widest text-blue-600 block">
              Live System Telemetry, Impact &amp; Outreach
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-sans">
              Everything Happening Under the Hood.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-sans">
              Watch deterministic bill schedules, Claude Haiku 5.5 prompt caching,
              zero-trust PII scrubbing, and owner outreach pipelines operate in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-300 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              20% Net Profit &rarr; FFE Youth Workshops
            </span>
          </div>
        </div>

        {/* 4.2 Four Full-Width Animated Dashboard Tiers */}

        {/* TIER 1: 3 Oversized Animated Hero KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Streak */}
          <div
            data-sc-tilt="6"
            className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg hover:shadow-2xl hover:border-blue-400/60 transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-slate-500">
                Payment Streak
              </span>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="text-5xl font-black text-amber-500 tracking-tight flex items-baseline gap-2">
                <AnimatedNumber value={streak} />
                <span className="text-2xl font-bold text-slate-600 font-sans">
                  months
                </span>
              </div>
              <p className="text-sm font-mono text-slate-500 mt-2">
                0 missed dates · Auto-advancing on-time record
              </p>
            </div>
          </div>

          {/* Late Fees Saved */}
          <div
            data-sc-tilt="6"
            className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg hover:shadow-2xl hover:border-emerald-400/60 transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-slate-500">
                Late Fees Saved
              </span>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="text-5xl font-black text-emerald-600 tracking-tight flex items-baseline gap-2">
                <AnimatedNumber value={feesSaved} prefix="$" />
                <span className="text-2xl font-bold text-slate-600 font-sans">
                  CAD
                </span>
              </div>
              <p className="text-sm font-mono text-slate-500 mt-2">
                $25 per on-time payment · Zero bank account logins
              </p>
            </div>
          </div>

          {/* Youth Impact Pool */}
          <div
            data-sc-tilt="6"
            className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg hover:shadow-2xl hover:border-blue-400/60 transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-slate-500">
                Youth Impact Pool
              </span>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="text-5xl font-black text-blue-600 tracking-tight flex items-baseline gap-2">
                <AnimatedNumber value={impactMins} />
                <span className="text-2xl font-bold text-slate-600 font-sans">
                  mins
                </span>
              </div>
              <p className="text-sm font-mono text-slate-500 mt-2">
                Free Ontario student financial literacy seminars funded
              </p>
            </div>
          </div>
        </div>

        {/* TIER 2: Tracked Recurring Bills & Active Trial Kill-Switches */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg space-y-8">
          {/* Bills Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Tracked Recurring Bills ({bills.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Auto-rolls forward upon payment confirmation
            </span>
          </div>

          {/* Bills Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-mono text-slate-500 uppercase">
                  <th className="pb-3 font-semibold">Bill Name</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Next Due Date</th>
                  <th className="pb-3 font-semibold">Details / Alerts</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {bills.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 font-bold text-slate-900 text-base">
                      {b.name}
                    </td>
                    <td className="py-4 font-extrabold text-blue-600 text-base font-mono">
                      ${b.amount.toFixed(2)} CAD
                    </td>
                    <td className="py-4 font-mono text-slate-700">{b.next_due_date}</td>
                    <td className="py-4">
                      {b.is_pad ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-semibold">
                          <Clock className="w-3.5 h-3.5" /> PAD Auto-Debit Warning
                        </span>
                      ) : b.statement_day ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-semibold">
                          Stmt Closing: Day {b.statement_day}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs">Standard</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Scheduled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trials Section */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h4 className="text-xl font-extrabold text-slate-900">
                  Active Free Trial Kill-Switches ({trials.length})
                </h4>
              </div>
              <span className="text-xs font-mono text-amber-700 font-semibold">
                Automatic 48-Hour Cancellation Alert Trigger
              </span>
            </div>

            {trials.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-sm text-slate-500 font-mono">
                No active free trials tracked yet. Tap Trigger #1 on the simulator to arm an Adobe 48h kill-switch!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trials.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-lg font-extrabold text-slate-900">
                        {t.service_name}
                      </div>
                      <div className="text-xs text-slate-600 font-mono mt-1">
                        Charges Begin:{" "}
                        <span className="font-bold text-slate-800">
                          {t.cancel_by_date}
                        </span>
                      </div>
                      <div className="text-xs text-amber-800 font-mono font-semibold mt-0.5">
                        Alert Date: {t.alert_date} (48h advance warning)
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold">
                      ARMED (48H)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TIER 3: 2-Column Split: Haiku 5.5 Unit Economics + Guardrail & A2UI Audit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Unit Economics */}
          <div
            data-sc-tilt="4"
            className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg space-y-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Claude Haiku 5.5 Unit Economics
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                  {modelName} · {latency}ms
                </span>
              </div>

              {/* 4 Big Metric Boxes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <span className="text-xs font-mono font-bold uppercase text-slate-500 block mb-1">
                    Input Tokens
                  </span>
                  <div className="text-3xl font-black text-slate-900 font-mono">
                    <AnimatedNumber value={inputTokens} />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    $0.10 / 1M tokens
                  </span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-800 block mb-1">
                    Cache Read (90% Off)
                  </span>
                  <div className="text-3xl font-black text-emerald-600 font-mono">
                    <AnimatedNumber value={cacheReadTokens} />
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                    Ephemeral Prompt Cache
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <span className="text-xs font-mono font-bold uppercase text-slate-500 block mb-1">
                    Output Tokens
                  </span>
                  <div className="text-3xl font-black text-slate-900 font-mono">
                    <AnimatedNumber value={outputTokens} />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Max 300 SMS Budget
                  </span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
                  <span className="text-xs font-mono font-bold uppercase text-blue-800 block mb-1">
                    Reply Cost
                  </span>
                  <div className="text-3xl font-black text-blue-600 font-mono">
                    &lt; $0.0001
                  </div>
                  <span className="text-[11px] font-mono text-blue-700 font-semibold">
                    ${costCad.toFixed(6)} CAD
                  </span>
                </div>
              </div>
            </div>

            {/* Monthly AI Quota Progress Bar */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs font-mono font-semibold text-slate-700">
                <span>Free Tier Quota (Coach &amp; Scam Shield)</span>
                <span>
                  {aiMsgsUsed} / {maxQuota} msgs used
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${quotaPct}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-500 block text-right">
                Bill Guard stays 100% unlimited
              </span>
            </div>
          </div>

          {/* Right: Guardrail Log & A2UI Inspector */}
          <div
            data-sc-tilt="4"
            className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg space-y-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Guardrail Log &amp; Live Traces
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Pre-LLM Deterministic Filter
                </span>
              </div>

              {/* Status Indicator Badges */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-extrabold text-emerald-900">
                      PII SCRUBBED ($0.00)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-semibold">
                    PIPEDA Zero-Trust Regex
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-extrabold text-red-900">
                      MITRE F3 SCAM INTERCEPT
                    </span>
                  </div>
                  <span className="text-xs font-mono text-red-700 font-semibold">
                    CRA / Interac Pattern Match
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-extrabold text-blue-900">
                      A2UI DIRECT ACTION ($0.00)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-blue-700 font-semibold">
                    In-Place DataModel Mutation
                  </span>
                </div>
              </div>
            </div>

            {/* Collapsible A2UI v0.9 Wire Inspector */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowA2UIInspector(!showA2UIInspector)}
                className="w-full p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-mono font-bold text-slate-800 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Inspect Live A2UI v0.9 JSON Messages</span>
                </div>
                {showA2UIInspector ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showA2UIInspector && (
                <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(latestA2UIMessages, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TIER 4: Youth Outreach Pipeline & Live Email Outbox */}
        <div
          data-sc-tilt="3"
          className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  4th Agent: Youth Outreach Pipeline &amp; Email Outbox
                </h3>
                <span className="text-xs font-mono text-slate-500 block">
                  Deterministic CASL compliance guard + Safe sandbox dispatcher
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Mode: {outreachMode === "live" ? "Live SMTP Mode" : "Sandbox Outbox Mode"}
              </span>
            </div>
          </div>

          {/* 3 Animated Popping Counters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
              <span className="text-xs font-mono font-bold uppercase text-slate-500 block mb-2">
                Prospective Leads
              </span>
              <div className="text-4xl font-black text-slate-900 font-mono">
                <AnimatedNumber value={totalLeads} />
              </div>
              <span className="text-xs font-mono text-slate-500 mt-1 block">
                Ontario Campus Unions &amp; Waitlist
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800 block mb-2">
                Emails Sent
              </span>
              <div className="text-4xl font-black text-emerald-600 font-mono">
                <AnimatedNumber value={emailsSent} />
              </div>
              <span className="text-xs font-mono text-emerald-700 mt-1 block">
                Approved by Owner via 1-Tap A2UI
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
              <span className="text-xs font-mono font-bold uppercase text-blue-800 block mb-2">
                Est. Youth Reached
              </span>
              <div className="text-4xl font-black text-blue-600 font-mono">
                <AnimatedNumber value={estYouthReached} />
              </div>
              <span className="text-xs font-mono text-blue-700 mt-1 block">
                Campus Students &amp; Cohorts
              </span>
            </div>
          </div>

          {/* 2-Column Live Outreach Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-6">
            {/* Left: Prospective Youth & Campus Leads Queue */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Prospective Youth &amp; Campus Leads Queue ({outreachLeads.length})
                </h4>
                <button
                  onClick={() => setIsAddLeadOpen(!isAddLeadOpen)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddLeadOpen ? "Close" : "+ Add Campus Lead"}</span>
                </button>
              </div>

              {/* Inline Add Lead Form */}
              {isAddLeadOpen && (
                <form
                  onSubmit={handleSubmitLead}
                  className="p-5 bg-blue-50/50 border-2 border-blue-200 rounded-2xl shadow-sm space-y-4 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                    <span className="text-xs font-mono font-bold uppercase text-blue-900">
                      Add New Prospective Campus / Youth Lead
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddLeadOpen(false)}
                      className="text-slate-400 hover:text-slate-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newLeadName}
                        onChange={(e) => setNewLeadName(e.target.value)}
                        placeholder="e.g. Devon Brooks"
                        className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                        Organization *
                      </label>
                      <input
                        type="text"
                        required
                        value={newLeadOrg}
                        onChange={(e) => setNewLeadOrg(e.target.value)}
                        placeholder="e.g. McMaster Students Union"
                        className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={newLeadEmail}
                        onChange={(e) => setNewLeadEmail(e.target.value)}
                        placeholder="e.g. vp.finance@msu.mcmaster.ca"
                        className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                        Est. Youth Reach
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newLeadReach}
                        onChange={(e) => setNewLeadReach(Number(e.target.value))}
                        className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                        Segment
                      </label>
                      <select
                        value={newLeadSegment}
                        onChange={(e) => setNewLeadSegment(e.target.value)}
                        className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900"
                      >
                        <option value="campus_union">Campus Student Union</option>
                        <option value="residence_life">Residence Life &amp; Housing</option>
                        <option value="student_club">Student Financial Club</option>
                        <option value="financial_aid">Financial Aid Office</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                        CASL Consent Type
                      </label>
                      <select
                        value={newLeadConsent}
                        onChange={(e) => setNewLeadConsent(e.target.value)}
                        className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900"
                      >
                        <option value="implied_b2b_inquiry">Implied B2B Inquiry</option>
                        <option value="express_opt_in">Express Opt-In</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={newLeadNotes}
                      onChange={(e) => setNewLeadNotes(e.target.value)}
                      placeholder="e.g. Met at campus leadership fair; interested in first-year financial wellness"
                      className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 text-slate-900"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-blue-200">
                    <button
                      type="button"
                      onClick={() => setIsAddLeadOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isSubmittingLead ? "Adding..." : "Add Lead to Pipeline"}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Leads List or Clean Empty State */}
              {outreachLeads.length === 0 && !isAddLeadOpen ? (
                <div className="p-8 rounded-2xl bg-white border-2 border-dashed border-slate-200 text-center space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Users className="w-5 h-5" />
                  </div>
                  <h5 className="font-extrabold text-slate-900 text-base">Pipeline Ready for Live Pitch Contacts</h5>
                  <p className="text-xs font-mono text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Zero dummy leads pre-seeded. Add your real campus leaders or test contacts to verify live CASL email drafting and 1-tap dispatch.
                  </p>
                  <button
                    onClick={() => setIsAddLeadOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add First Campus Lead</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {outreachLeads.map((lead) => {
                    const isSent = lead.status === "sent";
                    const isDrafted = lead.status === "drafted" || lead.status === "contacted";
                    return (
                      <div
                        key={lead.id}
                        className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-blue-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-bold text-slate-900">
                              {lead.name}
                            </span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                              ~{lead.youth_reach_est} reach
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                              {lead.casl_consent_type}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 font-mono">
                            {lead.organization} · {lead.email}
                          </div>
                          {lead.notes && (
                            <div className="text-xs text-slate-500 italic">
                              &ldquo;{lead.notes}&rdquo;
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 sm:self-center">
                          <span
                            className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                              isSent
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isDrafted
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {isSent ? "Sent ✓" : isDrafted ? "Drafted" : "New"}
                          </span>

                          <button
                            onClick={() => {
                              if (onDraftForLead) {
                                onDraftForLead(lead.id);
                              } else if (onSelectLeadToDraft) {
                                onSelectLeadToDraft(lead.name, lead.organization);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-semibold transition cursor-pointer shadow-xs flex items-center gap-1 active:scale-95"
                          >
                            <span>Draft Email</span>
                            <Send className="w-3 h-3" />
                          </button>

                          {onDeleteLead && (
                            <button
                              onClick={() => onDeleteLead(lead.id)}
                              title="Delete Lead"
                              className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Sent & Pending Email Outbox */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  Sent &amp; Pending Email Outbox ({outreachEmails.length})
                </h4>
                <span className="text-xs font-mono text-slate-500">
                  CASL Verified Log
                </span>
              </div>

              {outreachEmails.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-sm text-slate-500 font-mono leading-relaxed">
                  No outreach emails drafted or sent yet. Add a campus lead on the left and tap &ldquo;Draft Email&rdquo; to generate a CASL-verified draft!
                </div>
              ) : (
                <div className="space-y-3">
                  {outreachEmails.map((email) => {
                    const isExpanded = expandedEmailId === email.id;
                    const isApproved = email.status === "approved_sent";
                    const isDiscarded = email.status === "discarded";
                    return (
                      <div
                        key={email.id}
                        className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-extrabold text-slate-900">
                                {email.subject}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                CASL Verified ✓
                              </span>
                            </div>
                            <div className="text-xs font-mono text-slate-600 mt-1">
                              To: {email.recipient_name} &lt;{email.recipient_email}&gt;
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                                isApproved
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : isDiscarded
                                  ? "bg-slate-100 text-slate-500 border-slate-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {isApproved ? "Sent ✓" : isDiscarded ? "Discarded" : "Pending Draft"}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {email.delivery_mode}
                            </span>
                          </div>
                        </div>

                        {/* Direct 1-Tap Action Deck for Pending Drafts */}
                        {!isApproved && !isDiscarded && (
                          <div className="flex gap-2 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => onEmailAction && onEmailAction(email.id, "approve_send")}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve &amp; Send Email
                            </button>
                            <button
                              onClick={() => onEmailAction && onEmailAction(email.id, "discard")}
                              className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Discard
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-mono text-slate-400">
                            {email.sent_at || email.created_at}
                          </span>
                          <button
                            onClick={() =>
                              setExpandedEmailId(isExpanded ? null : email.id)
                            }
                            className="text-xs font-mono font-medium text-blue-600 hover:text-blue-800 transition cursor-pointer flex items-center gap-1"
                          >
                            <span>{isExpanded ? "Hide Preview" : "Preview Email"}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Expandable Preview */}
                        {isExpanded && (
                          <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                            {email.body_text}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
