"use client";

import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Lock,
  Building,
  Check,
  Zap,
} from "lucide-react";
import { resolveDynamicValue } from "./processor";

export interface ComponentRenderProps {
  component: any;
  dataModel: Record<string, any>;
  renderChild: (childId: string) => React.ReactNode;
  onAction: (actionName: string, context?: any) => void;
}

// -------------------------------------------------------------
// STANDARD COMPONENT CATALOG
// -------------------------------------------------------------

export function A2UICard({ component, renderChild }: ComponentRenderProps) {
  const status = component.statusBorder || component.props?.variant;
  let borderColor = "border-[#383E4E]";
  let glowEffect = "";

  if (status === "danger") {
    borderColor = "border-[#D04040]/70";
    glowEffect = "shadow-[0_0_20px_rgba(208,64,64,0.18)]";
  } else if (status === "warning") {
    borderColor = "border-[#C39A35]/70";
    glowEffect = "shadow-[0_0_20px_rgba(195,154,53,0.18)]";
  } else if (status === "success") {
    borderColor = "border-[#34C759]/70";
    glowEffect = "shadow-[0_0_20px_rgba(52,199,89,0.18)]";
  } else if (status === "accent") {
    borderColor = "border-[#2177D1]/70";
    glowEffect = "shadow-[0_0_20px_rgba(33,119,209,0.22)]";
  }

  return (
    <div
      className={`rounded-xl p-4 bg-[#121620]/90 backdrop-blur-md border ${borderColor} ${glowEffect} transition-all duration-200 text-slate-100 flex flex-col gap-3`}
    >
      {Array.isArray(component.children) &&
        component.children.map((childId: string) => (
          <React.Fragment key={childId}>{renderChild(childId)}</React.Fragment>
        ))}
    </div>
  );
}

export function A2UIColumn({ component, renderChild }: ComponentRenderProps) {
  const gap = component.gap === "sm" ? "gap-1.5" : component.gap === "lg" ? "gap-4" : "gap-2.5";
  return (
    <div className={`flex flex-col ${gap} w-full`}>
      {Array.isArray(component.children) &&
        component.children.map((childId: string) => (
          <React.Fragment key={childId}>{renderChild(childId)}</React.Fragment>
        ))}
    </div>
  );
}

export function A2UIRow({ component, renderChild }: ComponentRenderProps) {
  const justify =
    component.justify === "start"
      ? "justify-start"
      : component.justify === "center"
      ? "justify-center"
      : "justify-between";
  const items = component.items === "start" ? "items-start" : "items-center";
  return (
    <div className={`flex flex-row ${items} ${justify} gap-2 w-full`}>
      {Array.isArray(component.children) &&
        component.children.map((childId: string) => (
          <React.Fragment key={childId}>{renderChild(childId)}</React.Fragment>
        ))}
    </div>
  );
}

export function A2UIText({ component, dataModel }: ComponentRenderProps) {
  const rawText = resolveDynamicValue(
    component.text !== undefined ? component.text : component.props?.text,
    dataModel
  );
  const variant = component.variant || component.props?.variant || "body";
  const color = component.color || component.props?.color || "primary";

  let colorClass = "text-slate-100";
  if (color === "secondary") colorClass = "text-[#B6BAC5]";
  if (color === "muted") colorClass = "text-[#64748B]";
  if (color === "accent" || color === "blue") colorClass = "text-[#3A8EE0]";
  if (color === "warning" || color === "amber" || color === "gold") colorClass = "text-[#D4AE52]";
  if (color === "danger" || color === "red") colorClass = "text-[#EF4444]";
  if (color === "success" || color === "green") colorClass = "text-[#34C759]";

  if (variant === "title" || variant === "h1" || variant === "h2" || variant === "h3") {
    return <h4 className={`text-base font-semibold tracking-tight ${colorClass}`}>{rawText}</h4>;
  }
  if (variant === "subtitle") {
    return <h5 className={`text-sm font-medium ${colorClass}`}>{rawText}</h5>;
  }
  if (variant === "caption") {
    return <p className={`text-xs ${colorClass}`}>{rawText}</p>;
  }
  if (variant === "mono") {
    return <p className={`font-mono text-xs tracking-wider ${colorClass}`}>{rawText}</p>;
  }
  return <p className={`text-sm leading-relaxed ${colorClass}`}>{rawText}</p>;
}

export function A2UIBadge({ component, dataModel }: ComponentRenderProps) {
  const text = resolveDynamicValue(
    component.text !== undefined ? component.text : component.props?.text,
    dataModel
  );
  const variant = component.variant || component.props?.variant || "neutral";

  let style = "bg-slate-800 text-slate-300 border-slate-700";
  if (variant === "danger" || variant === "red") style = "bg-[#D04040]/15 text-[#F87171] border-[#D04040]/30";
  if (variant === "warning" || variant === "amber" || variant === "gold") style = "bg-[#C39A35]/15 text-[#FBBF24] border-[#C39A35]/30";
  if (variant === "success" || variant === "green") style = "bg-[#34C759]/15 text-[#4ADE80] border-[#34C759]/30";
  if (variant === "accent" || variant === "blue" || variant === "purple") style = "bg-[#2177D1]/15 text-[#60A5FA] border-[#2177D1]/30";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${style}`}
    >
      {text}
    </span>
  );
}

export function A2UIDivider() {
  return <hr className="border-t border-[#383E4E]/50 my-1 w-full" />;
}

export function A2UIProgressBar({ component, dataModel }: ComponentRenderProps) {
  const value = Number(
    resolveDynamicValue(
      component.value !== undefined ? component.value : component.props?.value,
      dataModel
    )
  ) || 0;
  const max = Number(
    resolveDynamicValue(
      component.max !== undefined ? component.max : component.props?.max,
      dataModel
    )
  ) || 100;
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color = component.color || component.props?.color || "accent";

  let barColor = "bg-[#2177D1]";
  if (color === "danger") barColor = "bg-[#D04040]";
  if (color === "warning") barColor = "bg-[#C39A35]";
  if (color === "success") barColor = "bg-[#34C759]";

  return (
    <div className="w-full bg-[#0B0E14] h-2 rounded-full overflow-hidden border border-[#383E4E]/60">
      <div
        className={`h-full ${barColor} transition-all duration-300 rounded-full`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function A2UIButton({ component, dataModel, onAction }: ComponentRenderProps) {
  const text = resolveDynamicValue(
    component.text !== undefined ? component.text : component.props?.text,
    dataModel
  );
  const variant = component.variant || component.props?.variant || "primary";
  const action = component.action || component.props?.action;
  const disabled = Boolean(
    resolveDynamicValue(
      component.disabled !== undefined ? component.disabled : component.props?.disabled,
      dataModel
    )
  );

  let style = "bg-[#2177D1] hover:bg-[#3A8EE0] text-white shadow-[0_0_15px_rgba(33,119,209,0.3)]";
  if (variant === "outline") {
    style = "bg-transparent border border-[#383E4E] hover:border-[#3A8EE0] text-slate-200 hover:text-white";
  } else if (variant === "ghost") {
    style = "bg-transparent hover:bg-slate-800/60 text-[#B6BAC5] hover:text-white";
  } else if (variant === "danger") {
    style = "bg-[#D04040] hover:bg-[#E05050] text-white shadow-[0_0_15px_rgba(208,64,64,0.3)]";
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || !action) return;
    onAction(action.name, action.context);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-150 inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${style}`}
    >
      {text}
    </button>
  );
}

// -------------------------------------------------------------
// CUSTOM HIGH-IMPACT NYRA WIDGETS
// -------------------------------------------------------------

export function A2UIScamRiskBanner({ component, dataModel, onAction }: ComponentRenderProps) {
  const riskLevel = resolveDynamicValue(component.risk_level, dataModel) || "SUSPICIOUS";
  const summary = resolveDynamicValue(component.analysis_summary, dataModel) || "";
  const flags = resolveDynamicValue(component.red_flags, dataModel) || [];
  const caRef = resolveDynamicValue(component.ca_reference, dataModel) || "Canadian Anti-Fraud Centre (CAFC)";
  const blockedNotice =
    resolveDynamicValue(component.blocked_action_notice, dataModel) || "Auto-transfer and SMS links blocked.";

  const isCritical = riskLevel === "CRITICAL_FRAUD" || riskLevel === "HIGH";

  return (
    <div
      className={`rounded-xl p-4 border transition-all ${
        isCritical
          ? "bg-[#181116] border-[#D04040]/70 shadow-[0_0_24px_rgba(208,64,64,0.22)]"
          : "bg-[#161412] border-[#C39A35]/70 shadow-[0_0_24px_rgba(195,154,53,0.18)]"
      } flex flex-col gap-3 text-slate-100`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <ShieldAlert className="w-5 h-5 text-[#EF4444] animate-pulse" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
          )}
          <span className="font-mono text-xs uppercase tracking-wider font-bold text-slate-100">
            {isCritical ? "CANADIAN SCAM SHIELD // CRITICAL" : "CANADIAN SCAM SHIELD // SUSPICIOUS"}
          </span>
        </div>
        <span
          className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
            isCritical ? "bg-[#D04040]/25 text-[#FCA5A5]" : "bg-[#C39A35]/25 text-[#FCD34D]"
          }`}
        >
          {riskLevel}
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed font-sans">{summary}</p>

      {Array.isArray(flags) && flags.length > 0 && (
        <div className="flex flex-col gap-1 bg-[#0B0E14]/70 p-2.5 rounded-lg border border-[#383E4E]/50">
          <span className="text-[10px] font-mono text-[#B6BAC5] uppercase">Detected Red Flags:</span>
          {flags.map((flag: string, idx: number) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
              <span className="text-[#EF4444] mt-0.5">&bull;</span>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-[#383E4E]/40 text-[11px] text-[#B6BAC5]">
        <div className="flex items-center gap-1 font-mono">
          <Lock className="w-3 h-3 text-[#34C759]" />
          <span>{blockedNotice}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">{caRef}</span>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => onAction("confirm_scam_blocked", { riskLevel })}
          className="flex-1 py-1.5 px-3 rounded-lg bg-[#D04040] hover:bg-[#E05050] text-white text-xs font-mono font-medium transition cursor-pointer"
        >
          Confirm Block
        </button>
        <button
          onClick={() => onAction("view_ca_antifraud_steps", { reference: caRef })}
          className="py-1.5 px-3 rounded-lg border border-[#383E4E] hover:border-slate-500 text-slate-300 text-xs font-mono transition cursor-pointer"
        >
          CAFC Steps
        </button>
      </div>
    </div>
  );
}

export function A2UIPaychequeGauge({ component, dataModel, onAction }: ComponentRenderProps) {
  const gross = Number(resolveDynamicValue(component.gross_monthly, dataModel)) || 1560;
  const net = Number(resolveDynamicValue(component.net_monthly, dataModel)) || 1358;
  const rent = Number(resolveDynamicValue(component.rent_amount, dataModel)) || 850;
  const ratio = Number(resolveDynamicValue(component.rent_ratio_pct, dataModel)) || Math.round((rent / net) * 100);
  const verdict = resolveDynamicValue(component.affordability_verdict, dataModel) || "STRETCH";

  let verdictColor = "text-[#34C759] border-[#34C759]/30 bg-[#34C759]/15";
  if (verdict === "STRETCH") verdictColor = "text-[#D4AE52] border-[#C39A35]/30 bg-[#C39A35]/15";
  if (verdict === "UNSUSTAINABLE") verdictColor = "text-[#EF4444] border-[#D04040]/30 bg-[#D04040]/15";

  return (
    <div className="rounded-xl p-4 bg-[#121620]/95 border border-[#383E4E] shadow-[0_0_20px_rgba(33,119,209,0.14)] flex flex-col gap-3 text-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-[#3A8EE0]" />
          <span className="font-mono text-xs uppercase tracking-wider font-bold">2026 ONTARIO TAKE-HOME CHECK</span>
        </div>
        <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold border ${verdictColor}`}>
          {verdict} ({ratio}% Net)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-[#0B0E14] p-3 rounded-lg border border-[#383E4E]/50 font-mono text-xs">
        <div>
          <span className="text-[10px] text-slate-500 block">Est. Gross / Mo</span>
          <span className="text-slate-200 font-semibold">${gross.toLocaleString()} CAD</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block">Net Take-Home</span>
          <span className="text-[#34C759] font-bold">${net.toLocaleString()} CAD</span>
        </div>
        <div className="pt-2 border-t border-[#383E4E]/40">
          <span className="text-[10px] text-slate-500 block">Monthly Rent</span>
          <span className="text-slate-200 font-semibold">${rent.toLocaleString()} CAD</span>
        </div>
        <div className="pt-2 border-t border-[#383E4E]/40">
          <span className="text-[10px] text-slate-500 block">Rent / Net Ratio</span>
          <span className={`font-bold ${ratio > 50 ? "text-[#D04040]" : "text-[#D4AE52]"}`}>{ratio}%</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 italic">
        Approximate 2026 educational estimate only — not official tax or payroll advice.
      </p>

      <button
        onClick={() => onAction("add_rent_as_bill", { amount: rent, due_day: 1 })}
        className="w-full py-1.5 px-3 rounded-lg bg-[#2177D1] hover:bg-[#3A8EE0] text-white text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(33,119,209,0.3)]"
      >
        <span>Track ${rent} Rent in Bill Guard</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function A2UIBillStatusRow({ component, dataModel, onAction }: ComponentRenderProps) {
  const name = resolveDynamicValue(component.bill_name, dataModel) || "Bill";
  const amount = Number(resolveDynamicValue(component.amount, dataModel)) || 0;
  const dueDate = resolveDynamicValue(component.due_date, dataModel) || "";
  const status = resolveDynamicValue(component.status, dataModel) || "scheduled";
  const isPad = Boolean(resolveDynamicValue(component.is_pad, dataModel));
  const isPaid = status === "paid";

  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0B0E14] border border-[#383E4E]/50 font-mono text-xs">
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-md flex items-center justify-center ${
            isPaid ? "bg-[#34C759]/20 text-[#34C759]" : "bg-[#2177D1]/20 text-[#3A8EE0]"
          }`}
        >
          {isPaid ? <Check className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-200">{name}</span>
            {isPad && (
              <span className="text-[9px] px-1 py-0.2 rounded bg-[#C39A35]/20 text-[#D4AE52] border border-[#C39A35]/30">
                PAD
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500">Due {dueDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="font-semibold text-slate-200">${amount.toFixed(2)}</span>
        {isPaid ? (
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/30">
            PAID
          </span>
        ) : (
          <button
            onClick={() => onAction("mark_bill_paid", { billName: name, amount })}
            className="py-1 px-2.5 rounded bg-[#2177D1] hover:bg-[#3A8EE0] text-white text-[11px] font-medium transition cursor-pointer"
          >
            Mark Paid
          </button>
        )}
      </div>
    </div>
  );
}

export function A2UIImpactStatStrip({ component, dataModel }: ComponentRenderProps) {
  const streak = Number(resolveDynamicValue(component.streak_months, dataModel)) || 4;
  const saved = Number(resolveDynamicValue(component.fees_saved_cad, dataModel)) || 105;
  const mins = Number(resolveDynamicValue(component.youth_workshop_mins, dataModel)) || 60;

  return (
    <div className="grid grid-cols-3 gap-2 bg-[#0B0E14] p-3 rounded-lg border border-[#383E4E]/60 text-center font-mono">
      <div>
        <span className="text-[10px] text-slate-500 block">Streak</span>
        <span className="text-sm font-bold text-[#D4AE52]">{streak} mos</span>
      </div>
      <div>
        <span className="text-[10px] text-slate-500 block">Saved Fees</span>
        <span className="text-sm font-bold text-[#34C759]">${saved} CAD</span>
      </div>
      <div>
        <span className="text-[10px] text-slate-500 block">Youth Pool</span>
        <span className="text-sm font-bold text-[#3A8EE0]">{mins}m</span>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// CATALOG REGISTRY & WHITELIST
// -------------------------------------------------------------

export const WIDGET_REGISTRY: Record<string, React.FC<ComponentRenderProps>> = {
  Card: A2UICard,
  Column: A2UIColumn,
  Row: A2UIRow,
  Text: A2UIText,
  Badge: A2UIBadge,
  Divider: A2UIDivider,
  Button: A2UIButton,
  ProgressBar: A2UIProgressBar,
  ScamRiskBanner: A2UIScamRiskBanner,
  PaychequeGauge: A2UIPaychequeGauge,
  BillStatusRow: A2UIBillStatusRow,
  ImpactStatStrip: A2UIImpactStatStrip,
};

/**
 * Whitelist checker: rejects unregistered component types safely.
 */
export function isComponentWhitelisted(componentName: string): boolean {
  return Boolean(WIDGET_REGISTRY[componentName]);
}
