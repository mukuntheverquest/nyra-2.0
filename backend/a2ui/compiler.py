import uuid
from typing import Dict, Any, List, Optional
from backend.a2ui.catalog import CATALOG_ID, validate_components_list
from backend.db.database import get_user, get_bills


def generate_surface_id(prefix: str = "surf") -> str:
    return f"{prefix}_{uuid.uuid4().hex[:10]}"


def compile_a2ui_envelopes(
    surface_id: str,
    components: List[Dict[str, Any]],
    data_model: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """Generates standard A2UI v1.0 message envelopes."""
    if not validate_components_list(components):
        raise ValueError("Invalid component found in A2UI adjacency list.")

    return [
        {
            "version": "1.0",
            "createSurface": {
                "surfaceId": surface_id,
                "catalogId": CATALOG_ID,
                "sendDataModel": True,
            },
        },
        {
            "version": "1.0",
            "updateComponents": {
                "surfaceId": surface_id,
                "components": components,
            },
        },
        {
            "version": "1.0",
            "updateDataModel": {
                "surfaceId": surface_id,
                "path": "/",
                "value": data_model,
            },
        },
    ]


def compile_bill_or_trial_surface(
    user_id: int,
    tool_name: str,
    tool_result: Dict[str, Any],
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("bill")

    if tool_name == "add_trial_killswitch":
        service = tool_result.get("service_name", "Service")
        cancel_date = tool_result.get("cancel_by_date", "")
        alert_date = tool_result.get("alert_date", "")

        components = [
            {
                "id": "root",
                "component": "Card",
                "props": {"variant": "default"},
                "children": ["header_row", "details_col", "divider", "actions_row"],
            },
            {
                "id": "header_row",
                "component": "Row",
                "props": {"justify": "space-between", "align": "center"},
                "children": ["title", "badge"],
            },
            {
                "id": "title",
                "component": "Text",
                "props": {"variant": "h3", "text": f"{service} Free Trial"},
            },
            {
                "id": "badge",
                "component": "Badge",
                "props": {"variant": "amber", "text": "48h Warning Active"},
            },
            {
                "id": "details_col",
                "component": "Column",
                "props": {"gap": "sm"},
                "children": ["cancel_text", "alert_text"],
            },
            {
                "id": "cancel_text",
                "component": "Text",
                "props": {"variant": "body", "text": f"Charges begin: {cancel_date}"},
            },
            {
                "id": "alert_text",
                "component": "Text",
                "props": {"variant": "caption", "text": f"Nyra SMS reminder scheduled for {alert_date}"},
            },
            {
                "id": "divider",
                "component": "Divider",
                "props": {},
            },
            {
                "id": "actions_row",
                "component": "Row",
                "props": {"justify": "flex-end", "gap": "sm"},
                "children": ["cancel_btn"],
            },
            {
                "id": "cancel_btn",
                "component": "Button",
                "props": {
                    "variant": "danger",
                    "text": "Cancel Trial Early",
                    "action": {
                        "name": "cancel_trial_alert",
                        "context": {"trial_id": tool_result.get("trial_id"), "service_name": service},
                    },
                },
            },
        ]
        data_model = {
            "trial": tool_result,
            "status": "active",
        }
    elif tool_name == "mark_bill_paid":
        b_name = tool_result.get("bill_name", "Bill")
        new_due = tool_result.get("new_due_date", "")
        streak = tool_result.get("streak_months", 0)
        saved = tool_result.get("late_fees_saved", 0)

        components = [
            {
                "id": "root",
                "component": "Card",
                "props": {"variant": "success"},
                "children": ["header_row", "streak_strip", "divider", "next_due_text"],
            },
            {
                "id": "header_row",
                "component": "Row",
                "props": {"justify": "space-between", "align": "center"},
                "children": ["title", "badge"],
            },
            {
                "id": "title",
                "component": "Text",
                "props": {"variant": "h3", "text": f"{b_name} Paid!"},
            },
            {
                "id": "badge",
                "component": "Badge",
                "props": {"variant": "green", "text": "Streak Extended"},
            },
            {
                "id": "streak_strip",
                "component": "ImpactStatStrip",
                "props": {
                    "streakMonths": streak,
                    "lateFeesSaved": saved,
                    "impactMinutesFunded": tool_result.get("impact_minutes_funded", 0),
                },
            },
            {
                "id": "divider",
                "component": "Divider",
                "props": {},
            },
            {
                "id": "next_due_text",
                "component": "Text",
                "props": {"variant": "caption", "text": f"Next billing cycle rolled to {new_due}."},
            },
        ]
        data_model = {"bill": tool_result, "paid": True}
    else:
        # Default add_bill or list_upcoming_bills
        b_name = tool_result.get("name", "Bill")
        amt = tool_result.get("amount", 0.0)
        due_date = tool_result.get("next_due_date", "")
        is_pad = bool(tool_result.get("is_pad", False))

        components = [
            {
                "id": "root",
                "component": "Card",
                "props": {"variant": "default"},
                "children": ["header_row", "status_row", "divider", "actions_row"],
            },
            {
                "id": "header_row",
                "component": "Row",
                "props": {"justify": "space-between", "align": "center"},
                "children": ["title", "badge"],
            },
            {
                "id": "title",
                "component": "Text",
                "props": {"variant": "h3", "text": b_name},
            },
            {
                "id": "badge",
                "component": "Badge",
                "props": {
                    "variant": "amber" if is_pad else "blue",
                    "text": "PAD Auto-Debit" if is_pad else "Scheduled",
                },
            },
            {
                "id": "status_row",
                "component": "BillStatusRow",
                "props": {
                    "billId": tool_result.get("bill_id", 0),
                    "name": b_name,
                    "amount": amt,
                    "nextDueDate": due_date,
                    "category": tool_result.get("category", "utility"),
                    "isPad": 1 if is_pad else 0,
                    "statementDay": tool_result.get("statement_day"),
                    "status": "upcoming",
                },
            },
            {
                "id": "divider",
                "component": "Divider",
                "props": {},
            },
            {
                "id": "actions_row",
                "component": "Row",
                "props": {"justify": "flex-end", "gap": "sm"},
                "children": ["mark_paid_btn"],
            },
            {
                "id": "mark_paid_btn",
                "component": "Button",
                "props": {
                    "variant": "primary",
                    "text": "Mark Paid",
                    "action": {
                        "name": "mark_bill_paid",
                        "context": {"bill_name": b_name, "bill_id": tool_result.get("bill_id")},
                    },
                },
            },
        ]
        data_model = {"bill": tool_result, "status": "upcoming"}

    return compile_a2ui_envelopes(sid, components, data_model)


def compile_scam_shield_surface(
    user_id: int,
    tool_result: Dict[str, Any],
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("scam")
    risk_level = tool_result.get("risk_level", "SUSPICIOUS")
    scam_type = tool_result.get("scam_type", "phishing")
    tactic = tool_result.get("mitre_f3_tactic", "Positioning (FA0001)")
    red_flags = tool_result.get("red_flags", [])
    next_step = tool_result.get("suggested_next_step", "Do not click links.")

    rf_items = []
    children_root = ["risk_banner", "red_flags_label"]
    for i, rf in enumerate(red_flags):
        rf_id = f"rf_{i}"
        rf_items.append({
            "id": rf_id,
            "component": "Text",
            "props": {"variant": "body", "text": f"• {rf}"},
        })
        children_root.append(rf_id)

    children_root.extend(["divider", "next_step_label", "next_step_text", "actions_row"])

    components = [
        {
            "id": "root",
            "component": "Card",
            "props": {"variant": "danger" if risk_level == "HIGH" else "warning"},
            "children": children_root,
        },
        {
            "id": "risk_banner",
            "component": "ScamRiskBanner",
            "props": {
                "riskLevel": risk_level,
                "scamType": scam_type,
                "mitreTactic": tactic,
                "score": tool_result.get("score", 70),
            },
        },
        {
            "id": "red_flags_label",
            "component": "Text",
            "props": {"variant": "caption", "text": "RED FLAGS DETECTED (MITRE F3):"},
        },
        *rf_items,
        {
            "id": "divider",
            "component": "Divider",
            "props": {},
        },
        {
            "id": "next_step_label",
            "component": "Text",
            "props": {"variant": "caption", "text": "RECOMMENDED NEXT STEP:"},
        },
        {
            "id": "next_step_text",
            "component": "Text",
            "props": {"variant": "body", "text": next_step},
        },
        {
            "id": "actions_row",
            "component": "Row",
            "props": {"justify": "flex-end", "gap": "sm"},
            "children": ["block_btn", "antifraud_btn"],
        },
        {
            "id": "block_btn",
            "component": "Button",
            "props": {
                "variant": "primary",
                "text": "Confirm Blocked",
                "action": {
                    "name": "confirm_scam_blocked",
                    "context": {"scam_type": scam_type},
                },
            },
        },
        {
            "id": "antifraud_btn",
            "component": "Button",
            "props": {
                "variant": "secondary",
                "text": "CAFC Guidance",
                "action": {
                    "name": "view_ca_antifraud_steps",
                    "context": {"scam_type": scam_type},
                },
            },
        },
    ]

    data_model = {
        "scam": tool_result,
        "blocked": False,
        "statusText": "Active Warning",
    }
    return compile_a2ui_envelopes(sid, components, data_model)


def compile_paycheque_surface(
    user_id: int,
    tool_result: Dict[str, Any],
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("paycheque")
    net_monthly = tool_result.get("monthly_net", 0.0)
    rent_analysis = tool_result.get("rent_analysis")
    monthly_rent = rent_analysis.get("monthly_rent") if rent_analysis else None
    rent_pct = rent_analysis.get("rent_percent_of_net", 0) if rent_analysis else 0
    status_label = rent_analysis.get("classification", "Calculated") if rent_analysis else "Healthy"

    components = [
        {
            "id": "root",
            "component": "Card",
            "props": {"variant": "default"},
            "children": ["header", "gauge", "breakdown_col", "divider", "disclaimer", "actions_row"],
        },
        {
            "id": "header",
            "component": "Row",
            "props": {"justify": "space-between", "align": "center"},
            "children": ["title", "badge"],
        },
        {
            "id": "title",
            "component": "Text",
            "props": {"variant": "h3", "text": "2026 Ontario Take-Home Pay"},
        },
        {
            "id": "badge",
            "component": "Badge",
            "props": {"variant": "blue", "text": "CRA 2026 Rates"},
        },
        {
            "id": "gauge",
            "component": "PaychequeGauge",
            "props": {
                "monthlyNet": net_monthly,
                "monthlyRent": monthly_rent,
                "rentPct": rent_pct,
                "status": status_label,
            },
        },
        {
            "id": "breakdown_col",
            "component": "Column",
            "props": {"gap": "xs"},
            "children": ["gross_row", "deduct_row", "net_row"],
        },
        {
            "id": "gross_row",
            "component": "Row",
            "props": {"justify": "space-between"},
            "children": ["gross_label", "gross_val"],
        },
        {
            "id": "gross_label",
            "component": "Text",
            "props": {"variant": "caption", "text": "Gross Monthly"},
        },
        {
            "id": "gross_val",
            "component": "Text",
            "props": {"variant": "mono", "text": f"${tool_result.get('monthly_gross', 0):.2f}"},
        },
        {
            "id": "deduct_row",
            "component": "Row",
            "props": {"justify": "space-between"},
            "children": ["deduct_label", "deduct_val"],
        },
        {
            "id": "deduct_label",
            "component": "Text",
            "props": {"variant": "caption", "text": "CPP + EI + Taxes (ON/Fed)"},
        },
        {
            "id": "deduct_val",
            "component": "Text",
            "props": {
                "variant": "mono",
                "text": f"-${tool_result.get('deductions_monthly', {}).get('total_deductions', 0):.2f}",
            },
        },
        {
            "id": "net_row",
            "component": "Row",
            "props": {"justify": "space-between"},
            "children": ["net_label", "net_val"],
        },
        {
            "id": "net_label",
            "component": "Text",
            "props": {"variant": "body", "text": "Estimated Take-Home (Net)"},
        },
        {
            "id": "net_val",
            "component": "Text",
            "props": {"variant": "mono", "text": f"${net_monthly:.2f}"},
        },
        {
            "id": "divider",
            "component": "Divider",
            "props": {},
        },
        {
            "id": "disclaimer",
            "component": "Text",
            "props": {
                "variant": "caption",
                "text": "Approximate 2026 educational estimate only — not official tax or payroll advice.",
            },
        },
        {
            "id": "actions_row",
            "component": "Row",
            "props": {"justify": "flex-end"},
            "children": ["add_rent_btn"],
        },
        {
            "id": "add_rent_btn",
            "component": "Button",
            "props": {
                "variant": "primary",
                "text": "Track Rent in Bill Guard",
                "action": {
                    "name": "add_rent_as_bill",
                    "context": {"amount": monthly_rent or 850.0, "due_day": 1},
                },
            },
        },
    ]

    data_model = {
        "paycheque": tool_result,
        "rentTracked": False,
    }
    return compile_a2ui_envelopes(sid, components, data_model)


def compile_coach_surface(
    user_id: int,
    query: str,
    tool_result: Dict[str, Any],
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("coach")
    chunks = tool_result.get("results", [])
    top_chunk = chunks[0] if chunks else None
    title = top_chunk.get("title", "Financial Literacy Guide") if top_chunk else "Money Coach"
    source = top_chunk.get("filename", "01_budgeting_independent_living.md") if top_chunk else "FFE Core"
    content = top_chunk.get("content", "General personal finance principles.")[:240] if top_chunk else ""

    components = [
        {
            "id": "root",
            "component": "Card",
            "props": {"variant": "default"},
            "children": ["header", "content_text", "divider", "source_text", "disclaimer"],
        },
        {
            "id": "header",
            "component": "Row",
            "props": {"justify": "space-between", "align": "center"},
            "children": ["title_text", "badge"],
        },
        {
            "id": "title_text",
            "component": "Text",
            "props": {"variant": "h3", "text": title},
        },
        {
            "id": "badge",
            "component": "Badge",
            "props": {"variant": "purple", "text": "FFE Curriculum"},
        },
        {
            "id": "content_text",
            "component": "Text",
            "props": {"variant": "body", "text": content + "..."},
        },
        {
            "id": "divider",
            "component": "Divider",
            "props": {},
        },
        {
            "id": "source_text",
            "component": "Text",
            "props": {"variant": "caption", "text": f"Source: FFE KB // {source}"},
        },
        {
            "id": "disclaimer",
            "component": "Text",
            "props": {
                "variant": "caption",
                "text": "Educational info only — not licensed financial, tax, or legal advice.",
            },
        },
    ]

    data_model = {"query": query, "source": source}
    return compile_a2ui_envelopes(sid, components, data_model)


def compile_pii_block_surface(
    user_id: int,
    redacted_types: List[str],
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("pii")
    types_str = ", ".join(redacted_types) if redacted_types else "Sensitive Numbers"

    components = [
        {
            "id": "root",
            "component": "Card",
            "props": {"variant": "success"},
            "children": ["header", "message", "divider", "footer_row"],
        },
        {
            "id": "header",
            "component": "Row",
            "props": {"justify": "space-between", "align": "center"},
            "children": ["title", "badge"],
        },
        {
            "id": "title",
            "component": "Text",
            "props": {"variant": "h3", "text": "Sensitive PII Redacted at Edge"},
        },
        {
            "id": "badge",
            "component": "Badge",
            "props": {"variant": "green", "text": "Zero-Token Pass"},
        },
        {
            "id": "message",
            "component": "Text",
            "props": {
                "variant": "body",
                "text": f"Nyra automatically scrubbed ({types_str}) prior to model dispatch. We never ask for or store SINs, credit card numbers, or bank passwords.",
            },
        },
        {
            "id": "divider",
            "component": "Divider",
            "props": {},
        },
        {
            "id": "footer_row",
            "component": "Row",
            "props": {"justify": "space-between", "align": "center"},
            "children": ["info_text", "cost_badge"],
        },
        {
            "id": "info_text",
            "component": "Text",
            "props": {"variant": "caption", "text": "PIPEDA Compliance Invariant Guaranteed"},
        },
        {
            "id": "cost_badge",
            "component": "Badge",
            "props": {"variant": "green", "text": "$0.00 Spent"},
        },
    ]

    data_model = {"piiRedacted": True, "redactedTypes": redacted_types}
    return compile_a2ui_envelopes(sid, components, data_model)


def compile_digest_surface(
    user_id: int,
    digest_data: Dict[str, Any],
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("digest")
    user = get_user(user_id) or {}
    bills = get_bills(user_id)

    bill_rows = []
    children_root = ["header", "impact_strip", "divider", "bills_label"]
    for i, b in enumerate(bills[:4]):
        row_id = f"b_row_{i}"
        bill_rows.append({
            "id": row_id,
            "component": "BillStatusRow",
            "props": {
                "billId": b["id"],
                "name": b["name"],
                "amount": b["amount"],
                "nextDueDate": b["next_due_date"],
                "category": b["category"],
                "isPad": b["is_pad"],
                "statementDay": b.get("statement_day"),
                "status": b.get("status", "upcoming"),
            },
        })
        children_root.append(row_id)

    components = [
        {
            "id": "root",
            "component": "Card",
            "props": {"variant": "default"},
            "children": children_root,
        },
        {
            "id": "header",
            "component": "Row",
            "props": {"justify": "space-between", "align": "center"},
            "children": ["title", "badge"],
        },
        {
            "id": "title",
            "component": "Text",
            "props": {"variant": "h3", "text": "9 AM Morning Financial Digest"},
        },
        {
            "id": "badge",
            "component": "Badge",
            "props": {"variant": "blue", "text": "Daily Digest"},
        },
        {
            "id": "impact_strip",
            "component": "ImpactStatStrip",
            "props": {
                "streakMonths": user.get("streak_months", 0),
                "lateFeesSaved": user.get("late_fees_saved", 0),
                "impactMinutesFunded": user.get("impact_minutes_funded", 0),
            },
        },
        {
            "id": "divider",
            "component": "Divider",
            "props": {},
        },
        {
            "id": "bills_label",
            "component": "Text",
            "props": {"variant": "caption", "text": "UPCOMING REMINDERS (1-TAP ACTION):"},
        },
        *bill_rows,
    ]

    data_model = {
        "digest": digest_data,
        "itemCount": len(bills),
    }
    return compile_a2ui_envelopes(sid, components, data_model)


def compile_text_surface(
    user_id: int,
    text: str,
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("text")
    components = [
        {
            "id": "root",
            "component": "Card",
            "props": {"variant": "default"},
            "children": ["body_text"],
        },
        {
            "id": "body_text",
            "component": "Text",
            "props": {"variant": "body", "text": text},
        },
    ]
    return compile_a2ui_envelopes(sid, components, {"text": text})
