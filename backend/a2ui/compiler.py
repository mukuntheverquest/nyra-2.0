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
    """Generates standard A2UI v0.9 message envelopes."""
    if not validate_components_list(components):
        raise ValueError("Invalid component found in A2UI adjacency list.")

    return [
        {
            "version": "v0.9",
            "createSurface": {
                "surfaceId": surface_id,
                "catalogId": CATALOG_ID,
                "sendDataModel": True,
            },
        },
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": surface_id,
                "components": components,
            },
        },
        {
            "version": "v0.9",
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
                "child": "col_root",
            },
            {
                "id": "col_root",
                "component": "Column",
                "children": ["header_row", "details_col", "divider", "actions_row"],
            },
            {
                "id": "header_row",
                "component": "Row",
                "children": ["title", "status_tag"],
            },
            {
                "id": "title",
                "component": "Text",
                "text": f"Trial Kill-Switch: {service}",
                "variant": "h3",
            },
            {
                "id": "status_tag",
                "component": "Text",
                "text": "48h Warning Armed",
                "variant": "caption",
            },
            {
                "id": "details_col",
                "component": "Column",
                "children": ["cancel_by_text", "alert_date_text"],
            },
            {
                "id": "cancel_by_text",
                "component": "Text",
                "text": f"Charges Begin: {cancel_date}",
                "variant": "body",
            },
            {
                "id": "alert_date_text",
                "component": "Text",
                "text": f"Cancellation Reminder: {alert_date}",
                "variant": "caption",
            },
            {
                "id": "divider",
                "component": "Divider",
            },
            {
                "id": "actions_row",
                "component": "Row",
                "children": ["cancel_btn"],
            },
            {
                "id": "cancel_btn",
                "component": "Button",
                "child": "cancel_btn_txt",
                "variant": "danger",
                "action": {
                    "event": {
                        "name": "cancel_trial_alert",
                        "context": {"trial_id": tool_result.get("trial_id"), "service_name": service},
                    }
                },
            },
            {
                "id": "cancel_btn_txt",
                "component": "Text",
                "text": "Cancel Trial Early",
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
                "child": "col_root",
            },
            {
                "id": "col_root",
                "component": "Column",
                "children": ["header_row", "stats_row", "divider", "next_due_text"],
            },
            {
                "id": "header_row",
                "component": "Row",
                "children": ["title", "badge_txt"],
            },
            {
                "id": "title",
                "component": "Text",
                "text": f"{b_name} Paid!",
                "variant": "h3",
            },
            {
                "id": "badge_txt",
                "component": "Text",
                "text": "Streak Extended ✓",
                "variant": "caption",
            },
            {
                "id": "stats_row",
                "component": "Row",
                "children": ["streak_txt", "savings_txt"],
            },
            {
                "id": "streak_txt",
                "component": "Text",
                "text": f"Payment Streak: {streak} months",
                "variant": "body",
            },
            {
                "id": "savings_txt",
                "component": "Text",
                "text": f"Late Fees Avoided: ${saved:.2f} CAD",
                "variant": "body",
            },
            {
                "id": "divider",
                "component": "Divider",
            },
            {
                "id": "next_due_text",
                "component": "Text",
                "text": f"Next cycle rolled forward to {new_due}.",
                "variant": "caption",
            },
        ]
        data_model = {
            "bill_name": b_name,
            "status": "paid",
            "new_due_date": new_due,
            "streak": streak,
            "saved": saved,
        }

    else:
        # Default add_bill
        b_name = tool_result.get("name", "Bill")
        amount = tool_result.get("amount", 0.0)
        due_date = tool_result.get("next_due_date", "")
        is_pad = tool_result.get("is_pad", False)

        components = [
            {
                "id": "root",
                "component": "Card",
                "child": "col_root",
            },
            {
                "id": "col_root",
                "component": "Column",
                "children": ["header_row", "due_text", "divider", "actions_row"],
            },
            {
                "id": "header_row",
                "component": "Row",
                "children": ["title", "amt_txt"],
            },
            {
                "id": "title",
                "component": "Text",
                "text": f"Tracked: {b_name}" + (" (PAD)" if is_pad else ""),
                "variant": "h3",
            },
            {
                "id": "amt_txt",
                "component": "Text",
                "text": f"${amount:.2f} CAD",
                "variant": "body",
            },
            {
                "id": "due_text",
                "component": "Text",
                "text": f"Due on {due_date}. Auto-rolls upon payment.",
                "variant": "caption",
            },
            {
                "id": "divider",
                "component": "Divider",
            },
            {
                "id": "actions_row",
                "component": "Row",
                "children": ["pay_btn"],
            },
            {
                "id": "pay_btn",
                "component": "Button",
                "child": "pay_btn_txt",
                "action": {
                    "event": {
                        "name": "mark_bill_paid",
                        "context": {"billName": b_name, "amount": amount},
                    }
                },
            },
            {
                "id": "pay_btn_txt",
                "component": "Text",
                "text": "Mark Paid",
            },
        ]
        data_model = {
            "bill": tool_result,
            "status": "scheduled",
        }

    return compile_a2ui_envelopes(sid, components, data_model)


def compile_scam_shield_surface(
    user_id: int,
    tool_result: Dict[str, Any],
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("scam")
    risk_level = tool_result.get("risk_level", "SUSPICIOUS")
    scam_type = tool_result.get("scam_type", "Suspicious Activity")
    tactic = tool_result.get("mitre_f3_tactic", "Urgency / Impersonation")
    red_flags = tool_result.get("red_flags", [])
    next_step = tool_result.get("recommended_action", "Do not click links or reply with credentials.")

    rf_items = []
    children_root = ["header_row", "scam_type_txt", "red_flags_label"]

    for idx, rf in enumerate(red_flags):
        rf_id = f"flag_{idx}"
        rf_items.append({
            "id": rf_id,
            "component": "Text",
            "text": f"• {rf}",
            "variant": "body",
        })
        children_root.append(rf_id)

    children_root.extend(["divider", "next_step_label", "next_step_text", "actions_row"])

    components = [
        {
            "id": "root",
            "component": "Card",
            "child": "col_root",
        },
        {
            "id": "col_root",
            "component": "Column",
            "children": children_root,
        },
        {
            "id": "header_row",
            "component": "Row",
            "children": ["risk_title", "tactic_badge"],
        },
        {
            "id": "risk_title",
            "component": "Text",
            "text": f"Canadian Scam Shield // {risk_level}",
            "variant": "h3",
        },
        {
            "id": "tactic_badge",
            "component": "Text",
            "text": tactic,
            "variant": "caption",
        },
        {
            "id": "scam_type_txt",
            "component": "Text",
            "text": f"Identified Pattern: {scam_type}",
            "variant": "body",
        },
        {
            "id": "red_flags_label",
            "component": "Text",
            "text": "RED FLAGS DETECTED (MITRE F3):",
            "variant": "caption",
        },
        *rf_items,
        {
            "id": "divider",
            "component": "Divider",
        },
        {
            "id": "next_step_label",
            "component": "Text",
            "text": "RECOMMENDED NEXT STEP:",
            "variant": "caption",
        },
        {
            "id": "next_step_text",
            "component": "Text",
            "text": next_step,
            "variant": "body",
        },
        {
            "id": "actions_row",
            "component": "Row",
            "children": ["block_btn", "cafc_btn"],
        },
        {
            "id": "block_btn",
            "component": "Button",
            "child": "block_btn_txt",
            "variant": "danger",
            "action": {
                "event": {
                    "name": "confirm_scam_blocked",
                    "context": {"risk_level": risk_level, "scam_type": scam_type},
                }
            },
        },
        {
            "id": "block_btn_txt",
            "component": "Text",
            "text": "Confirm Scam Blocked",
        },
        {
            "id": "cafc_btn",
            "component": "Button",
            "child": "cafc_btn_txt",
            "action": {
                "event": {
                    "name": "view_ca_antifraud_steps",
                    "context": {"reference": "CAFC"},
                }
            },
        },
        {
            "id": "cafc_btn_txt",
            "component": "Text",
            "text": "CAFC Steps",
        },
    ]

    data_model = {
        "risk_level": risk_level,
        "scam_type": scam_type,
        "tactic": tactic,
        "red_flags": red_flags,
        "blocked": False,
    }

    return compile_a2ui_envelopes(sid, components, data_model)


def compile_paycheque_surface(
    user_id: int,
    tool_result: Dict[str, Any],
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("paycheque")

    net_monthly = tool_result.get("monthly_net_take_home", 1358.0)
    monthly_rent = tool_result.get("monthly_rent_tested", 850.0)
    rent_pct = tool_result.get("rent_pct_of_net", 63)
    status_label = tool_result.get("affordability_verdict", "STRETCH")
    gross = tool_result.get("monthly_gross", 1560.0)
    deductions = tool_result.get("deductions_monthly", {}).get("total_deductions", 202.0)

    components = [
        {
            "id": "root",
            "component": "Card",
            "child": "col_root",
        },
        {
            "id": "col_root",
            "component": "Column",
            "children": [
                "header_row",
                "breakdown_col",
                "verdict_txt",
                "disclaimer",
                "actions_row",
            ],
        },
        {
            "id": "header_row",
            "component": "Row",
            "children": ["title", "rate_tag"],
        },
        {
            "id": "title",
            "component": "Text",
            "text": "2026 Ontario Take-Home & Rent",
            "variant": "h3",
        },
        {
            "id": "rate_tag",
            "component": "Text",
            "text": "CRA 2026 Rates",
            "variant": "caption",
        },
        {
            "id": "breakdown_col",
            "component": "Column",
            "children": ["gross_row", "deduct_row", "net_row", "rent_row"],
        },
        {
            "id": "gross_row",
            "component": "Row",
            "children": ["gross_label", "gross_val"],
        },
        {
            "id": "gross_label",
            "component": "Text",
            "text": "Gross Monthly:",
            "variant": "caption",
        },
        {
            "id": "gross_val",
            "component": "Text",
            "text": f"${gross:.2f} CAD",
            "variant": "body",
        },
        {
            "id": "deduct_row",
            "component": "Row",
            "children": ["deduct_label", "deduct_val"],
        },
        {
            "id": "deduct_label",
            "component": "Text",
            "text": "CPP + EI + Taxes (ON/Fed):",
            "variant": "caption",
        },
        {
            "id": "deduct_val",
            "component": "Text",
            "text": f"-${deductions:.2f} CAD",
            "variant": "body",
        },
        {
            "id": "net_row",
            "component": "Row",
            "children": ["net_label", "net_val"],
        },
        {
            "id": "net_label",
            "component": "Text",
            "text": "Est. Net Take-Home:",
            "variant": "caption",
        },
        {
            "id": "net_val",
            "component": "Text",
            "text": f"${net_monthly:.2f} CAD",
            "variant": "body",
        },
        {
            "id": "rent_row",
            "component": "Row",
            "children": ["rent_label", "rent_val"],
        },
        {
            "id": "rent_label",
            "component": "Text",
            "text": "Tested Monthly Rent:",
            "variant": "caption",
        },
        {
            "id": "rent_val",
            "component": "Text",
            "text": f"${monthly_rent:.2f} CAD ({rent_pct}% of net)",
            "variant": "body",
        },
        {
            "id": "verdict_txt",
            "component": "Text",
            "text": f"Affordability Verdict: {status_label}",
            "variant": "h4",
        },
        {
            "id": "disclaimer",
            "component": "Text",
            "text": "Approximate 2026 educational estimate only — not official tax or payroll advice.",
            "variant": "caption",
        },
        {
            "id": "actions_row",
            "component": "Row",
            "children": ["track_rent_btn"],
        },
        {
            "id": "track_rent_btn",
            "component": "Button",
            "child": "track_rent_txt",
            "action": {
                "event": {
                    "name": "add_rent_as_bill",
                    "context": {"amount": monthly_rent, "due_day": 1},
                }
            },
        },
        {
            "id": "track_rent_txt",
            "component": "Text",
            "text": f"Track ${monthly_rent:.0f} Rent in Bill Guard",
        },
    ]

    data_model = {
        "gross": gross,
        "net": net_monthly,
        "rent": monthly_rent,
        "rent_pct": rent_pct,
        "verdict": status_label,
        "rentTracked": False,
    }

    return compile_a2ui_envelopes(sid, components, data_model)


def compile_coach_surface(
    user_id: int,
    query: str,
    title: str,
    content: str,
    source: str,
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("coach")

    components = [
        {
            "id": "root",
            "component": "Card",
            "child": "col_root",
        },
        {
            "id": "col_root",
            "component": "Column",
            "children": ["header_row", "content_text", "divider", "source_text", "disclaimer"],
        },
        {
            "id": "header_row",
            "component": "Row",
            "children": ["title_text", "badge_txt"],
        },
        {
            "id": "title_text",
            "component": "Text",
            "text": title,
            "variant": "h3",
        },
        {
            "id": "badge_txt",
            "component": "Text",
            "text": "FFE Curriculum",
            "variant": "caption",
        },
        {
            "id": "content_text",
            "component": "Text",
            "text": content,
            "variant": "body",
        },
        {
            "id": "divider",
            "component": "Divider",
        },
        {
            "id": "source_text",
            "component": "Text",
            "text": f"Source: FFE KB // {source}",
            "variant": "caption",
        },
        {
            "id": "disclaimer",
            "component": "Text",
            "text": "Educational info only — not licensed financial, tax, or legal advice.",
            "variant": "caption",
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
            "child": "col_root",
        },
        {
            "id": "col_root",
            "component": "Column",
            "children": ["header_row", "msg_txt", "divider", "footer_row"],
        },
        {
            "id": "header_row",
            "component": "Row",
            "children": ["title", "guard_tag"],
        },
        {
            "id": "title",
            "component": "Text",
            "text": "Zero-Trust PII Invariant Activated",
            "variant": "h3",
        },
        {
            "id": "guard_tag",
            "component": "Text",
            "text": "Blocked At Edge",
            "variant": "caption",
        },
        {
            "id": "msg_txt",
            "component": "Text",
            "text": f"Detected sensitive data ({types_str}). Scrubbed before Anthropic API call ($0.00 spent).",
            "variant": "body",
        },
        {
            "id": "divider",
            "component": "Divider",
        },
        {
            "id": "footer_row",
            "component": "Row",
            "children": ["compliance_txt", "status_txt"],
        },
        {
            "id": "compliance_txt",
            "component": "Text",
            "text": "PIPEDA Guarantee: Zero bank credentials or SINs stored.",
            "variant": "caption",
        },
        {
            "id": "status_txt",
            "component": "Text",
            "text": "$0.00 Spent · 0 Tokens",
            "variant": "caption",
        },
    ]

    data_model = {
        "redacted_types": redacted_types,
        "blocked": True,
        "cost_usd": 0.0,
    }

    return compile_a2ui_envelopes(sid, components, data_model)


def compile_digest_surface(
    user_id: int,
    cron_result: Dict[str, Any],
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("digest")
    user = get_user(user_id)
    streak = user.get("streak_months", 4)
    fees_saved = user.get("late_fees_saved", 105.0)
    impact_mins = user.get("impact_minutes_funded", 60)
    bills = get_bills(user_id)

    bill_components = []
    bill_children = []

    for b in bills[:3]:
        row_id = f"bill_{b['id']}"
        title_id = f"bt_{b['id']}"
        btn_id = f"bb_{b['id']}"
        btn_txt_id = f"bbt_{b['id']}"

        bill_children.append(row_id)
        bill_components.extend([
            {
                "id": row_id,
                "component": "Row",
                "children": [title_id, btn_id],
            },
            {
                "id": title_id,
                "component": "Text",
                "text": f"{b['name']} (${b['amount']:.2f}) due {b['next_due_date']}",
                "variant": "body",
            },
            {
                "id": btn_id,
                "component": "Button",
                "child": btn_txt_id,
                "action": {
                    "event": {
                        "name": "mark_bill_paid",
                        "context": {"billName": b["name"], "amount": b["amount"]},
                    }
                },
            },
            {
                "id": btn_txt_id,
                "component": "Text",
                "text": "Paid ✓",
            },
        ])

    components = [
        {
            "id": "root",
            "component": "Card",
            "child": "col_root",
        },
        {
            "id": "col_root",
            "component": "Column",
            "children": [
                "header_row",
                "stats_row",
                "divider",
                "summary_txt",
                *bill_children,
            ],
        },
        {
            "id": "header_row",
            "component": "Row",
            "children": ["title", "time_txt"],
        },
        {
            "id": "title",
            "component": "Text",
            "text": "9:00 AM Batched Reminder Digest",
            "variant": "h3",
        },
        {
            "id": "time_txt",
            "component": "Text",
            "text": "Daily Batch",
            "variant": "caption",
        },
        {
            "id": "stats_row",
            "component": "Row",
            "children": ["streak_txt", "fees_txt", "pool_txt"],
        },
        {
            "id": "streak_txt",
            "component": "Text",
            "text": f"Streak: {streak}m",
            "variant": "body",
        },
        {
            "id": "fees_txt",
            "component": "Text",
            "text": f"Saved: ${fees_saved:.0f} CAD",
            "variant": "body",
        },
        {
            "id": "pool_txt",
            "component": "Text",
            "text": f"Youth Pool: {impact_mins}m",
            "variant": "body",
        },
        {
            "id": "divider",
            "component": "Divider",
        },
        {
            "id": "summary_txt",
            "component": "Text",
            "text": "Upcoming Recurring Bills:",
            "variant": "caption",
        },
        *bill_components,
    ]

    data_model = {
        "streak": streak,
        "fees_saved": fees_saved,
        "impact_mins": impact_mins,
    }

    return compile_a2ui_envelopes(sid, components, data_model)


def compile_text_surface(
    user_id: int,
    text: str,
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("txt")
    components = [
        {
            "id": "root",
            "component": "Card",
            "child": "col_root",
        },
        {
            "id": "col_root",
            "component": "Column",
            "children": ["msg_text"],
        },
        {
            "id": "msg_text",
            "component": "Text",
            "text": text,
            "variant": "body",
        },
    ]
    data_model = {"message": text}
    return compile_a2ui_envelopes(sid, components, data_model)


def compile_outreach_draft_surface(
    user_id: int,
    tool_result: Dict[str, Any],
    surface_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    sid = surface_id or generate_surface_id("outreach")
    email_id = tool_result.get("email_id")
    recipient_name = tool_result.get("recipient_name", "Lead")
    recipient_email = tool_result.get("recipient_email", "")
    organization = tool_result.get("organization", "Prospective Partner")
    youth_reach = tool_result.get("youth_reach_est", 1)
    subject = tool_result.get("subject", "Nyra 2.0 Introduction")
    body_preview = tool_result.get("body_preview", tool_result.get("full_body", ""))

    reach_label = f"~{youth_reach} youth reach" if youth_reach > 1 else "1 individual youth"
    header_badge = f"{organization} · {reach_label}"

    components = [
        {
            "id": "root",
            "component": "Card",
            "child": "col_root",
        },
        {
            "id": "col_root",
            "component": "Column",
            "children": [
                "header_row",
                "badge_row",
                "to_row",
                "subject_row",
                "divider_1",
                "body_preview_text",
                "divider_2",
                "status_row",
                "actions_row",
            ],
        },
        {
            "id": "header_row",
            "component": "Row",
            "children": ["title_text"],
        },
        {
            "id": "title_text",
            "component": "Text",
            "text": "OUTREACH DRAFT · CASL VERIFIED ✓",
            "variant": "h3",
        },
        {
            "id": "badge_row",
            "component": "Row",
            "children": ["org_badge_text"],
        },
        {
            "id": "org_badge_text",
            "component": "Text",
            "text": header_badge,
            "variant": "caption",
        },
        {
            "id": "to_row",
            "component": "Row",
            "children": ["to_text"],
        },
        {
            "id": "to_text",
            "component": "Text",
            "text": f"To: {recipient_name} <{recipient_email}>",
            "variant": "body",
        },
        {
            "id": "subject_row",
            "component": "Row",
            "children": ["subject_text"],
        },
        {
            "id": "subject_text",
            "component": "Text",
            "text": f"Subject: {subject}",
            "variant": "body",
        },
        {
            "id": "divider_1",
            "component": "Divider",
        },
        {
            "id": "body_preview_text",
            "component": "Text",
            "text": body_preview,
            "variant": "caption",
        },
        {
            "id": "divider_2",
            "component": "Divider",
        },
        {
            "id": "status_row",
            "component": "Row",
            "children": ["status_label_text"],
        },
        {
            "id": "status_label_text",
            "component": "Text",
            "text": {"path": "/email/statusLabel"},
            "variant": "caption",
        },
        {
            "id": "actions_row",
            "component": "Row",
            "children": ["approve_btn", "discard_btn"],
        },
        {
            "id": "approve_btn",
            "component": "Button",
            "child": "approve_btn_txt",
            "variant": "primary",
            "action": {
                "event": {
                    "name": "approve_send_outreach_email",
                    "context": {"email_id": email_id},
                }
            },
        },
        {
            "id": "approve_btn_txt",
            "component": "Text",
            "text": "Approve & Send Email",
        },
        {
            "id": "discard_btn",
            "component": "Button",
            "child": "discard_btn_txt",
            "variant": "default",
            "action": {
                "event": {
                    "name": "discard_outreach_email",
                    "context": {"email_id": email_id},
                }
            },
        },
        {
            "id": "discard_btn_txt",
            "component": "Text",
            "text": "Discard Draft",
        },
    ]

    data_model = {
        "email": {
            "email_id": email_id,
            "recipient": f"{recipient_name} <{recipient_email}>",
            "subject": subject,
            "body": body_preview,
            "statusLabel": "Pending Owner Approval",
            "approved": False,
            "sent": False,
        }
    }

    return compile_a2ui_envelopes(sid, components, data_model)

