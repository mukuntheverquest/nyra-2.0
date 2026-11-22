import calendar
from datetime import date, datetime, timedelta
from typing import Dict, List, Any, Optional

from backend.db.database import (
    get_user,
    update_user,
    get_bills,
    add_bill as db_add_bill,
    find_bill_by_name,
    update_bill,
    get_trial_alerts,
    add_trial_alert as db_add_trial_alert,
    add_scam_log,
    get_outreach_leads,
    get_outreach_lead_by_id,
    create_outreach_email_draft,
)
from backend.agent.scam_rules import evaluate_scam_message
from backend.agent.ontario_calc import calculate_ontario_paycheque_and_rent
from backend.rag.retriever import search_curriculum
from backend.agent.outreach_guard import validate_and_format_outreach_email


def calculate_next_due_date(due_day: int, base_date: Optional[date] = None) -> str:
    """Calculates upcoming due date; rolls forward to next month if day has passed."""
    today = base_date or date.today()
    year = today.year
    month = today.month

    max_days_current = calendar.monthrange(year, month)[1]
    clamped_day_current = min(due_day, max_days_current)

    if clamped_day_current >= today.day:
        target_year = year
        target_month = month
        target_day = clamped_day_current
    else:
        # Rollover to next month
        if month == 12:
            target_year = year + 1
            target_month = 1
        else:
            target_year = year
            target_month = month + 1
        max_days_next = calendar.monthrange(target_year, target_month)[1]
        target_day = min(due_day, max_days_next)

    return date(target_year, target_month, target_day).isoformat()


def roll_date_one_month(current_iso_date: str) -> str:
    """Advances an ISO date by 1 month, safely clamping end-of-month days."""
    dt = date.fromisoformat(current_iso_date)
    year = dt.year
    month = dt.month
    day = dt.day

    if month == 12:
        new_year = year + 1
        new_month = 1
    else:
        new_year = year
        new_month = month + 1

    max_day_new = calendar.monthrange(new_year, new_month)[1]
    new_day = min(day, max_day_new)
    return date(new_year, new_month, new_day).isoformat()


# Python Tool Implementations

def execute_add_bill(
    user_id: int,
    name: str,
    amount: float,
    due_day: int,
    category: str = "utility",
    remind_days_before: int = 3,
    is_pad: bool = False,
    statement_day: Optional[int] = None,
) -> Dict[str, Any]:
    next_due = calculate_next_due_date(due_day)
    bill_id = db_add_bill(
        user_id=user_id,
        name=name,
        amount=amount,
        due_day=due_day,
        category=category,
        remind_days_before=remind_days_before,
        is_pad=1 if is_pad else 0,
        statement_day=statement_day,
        next_due_date=next_due,
        status="upcoming",
    )
    pad_note = " (Pre-Authorized Debit: Nyra will remind you to keep funds liquid)" if is_pad else ""
    return {
        "success": True,
        "bill_id": bill_id,
        "name": name,
        "amount": amount,
        "next_due_date": next_due,
        "category": category,
        "is_pad": is_pad,
        "message": f"Added '{name}' (${amount:.2f}) due on {next_due}. Reminding {remind_days_before} days prior{pad_note}.",
    }


def execute_add_trial_killswitch(
    user_id: int,
    service_name: str,
    trial_length_days: int,
    alert_hours_before: int = 48,
) -> Dict[str, Any]:
    today = date.today()
    cancel_by = today + timedelta(days=trial_length_days)
    alert_dt = datetime.combine(cancel_by, datetime.min.time()) - timedelta(hours=alert_hours_before)
    alert_date_str = alert_dt.date().isoformat()

    trial_id = db_add_trial_alert(
        user_id=user_id,
        service_name=service_name,
        start_date=today.isoformat(),
        cancel_by_date=cancel_by.isoformat(),
        alert_date=alert_date_str,
        status="active",
    )
    return {
        "success": True,
        "trial_id": trial_id,
        "service_name": service_name,
        "start_date": today.isoformat(),
        "cancel_by_date": cancel_by.isoformat(),
        "alert_date": alert_date_str,
        "alert_hours_before": alert_hours_before,
        "message": (
            f"Trial kill-switch locked for '{service_name}'. "
            f"Charges begin on {cancel_by.isoformat()}. "
            f"Nyra will text you a cancellation reminder on {alert_date_str} ({alert_hours_before}h early)!"
        ),
    }


def execute_mark_bill_paid(user_id: int, bill_name: str) -> Dict[str, Any]:
    bill = find_bill_by_name(user_id, bill_name)
    if not bill:
        return {
            "success": False,
            "message": f"Couldn't find an active bill matching '{bill_name}'. Text 'list bills' to view your tracked bills.",
        }

    # Roll next due date forward by 1 month
    new_due_date = roll_date_one_month(bill["next_due_date"])
    update_bill(bill["id"], next_due_date=new_due_date, status="upcoming")

    # Update user gamification and late fee stats
    user = get_user(user_id)
    new_streak = (user["streak_months"] or 0) + 1
    new_savings = round((user["late_fees_saved"] or 0.0) + 25.0, 2)
    new_impact_mins = (user["impact_minutes_funded"] or 0) + 15
    update_user(
        user_id,
        streak_months=new_streak,
        late_fees_saved=new_savings,
        impact_minutes_funded=new_impact_mins,
    )

    return {
        "success": True,
        "bill_name": bill["name"],
        "previous_due_date": bill["next_due_date"],
        "new_due_date": new_due_date,
        "streak_months": new_streak,
        "late_fees_saved": new_savings,
        "impact_minutes_funded": new_impact_mins,
        "message": (
            f"Nice work! Marked '{bill['name']}' as paid. "
            f"Next due date rolled to {new_due_date}. "
            f"Streak: {new_streak} months | Late fees avoided: ${new_savings:.2f} | "
            f"+15 mins funded for FFE youth workshops!"
        ),
    }


def execute_list_upcoming_bills(user_id: int, days_ahead: int = 14) -> Dict[str, Any]:
    today = date.today()
    cutoff = today + timedelta(days=days_ahead)

    all_bills = get_bills(user_id)
    upcoming_bills = []
    for b in all_bills:
        try:
            due_dt = date.fromisoformat(b["next_due_date"])
            if today <= due_dt <= cutoff:
                upcoming_bills.append(b)
        except Exception:
            upcoming_bills.append(b)

    all_trials = get_trial_alerts(user_id)
    upcoming_trials = []
    for t in all_trials:
        if t["status"] == "active":
            try:
                cancel_dt = date.fromisoformat(t["cancel_by_date"])
                if today <= cancel_dt <= cutoff:
                    upcoming_trials.append(t)
            except Exception:
                upcoming_trials.append(t)

    return {
        "days_ahead": days_ahead,
        "upcoming_bills": upcoming_bills,
        "upcoming_trials": upcoming_trials,
        "total_due_soon": round(sum(b["amount"] for b in upcoming_bills), 2),
    }


def execute_analyze_scam(user_id: int, raw_text: str) -> Dict[str, Any]:
    result = evaluate_scam_message(raw_text)
    # Log incident to DB
    add_scam_log(
        user_id=user_id,
        sanitized_snippet=raw_text[:200],
        risk_level=result["risk_level"],
        scam_type=result["scam_type"],
        mitre_f3_tactic=result["mitre_f3_tactic"],
        red_flags=result["red_flags"],
    )
    return result


def execute_ontario_paycheque(
    hourly_wage: float,
    hours_per_week: float,
    monthly_rent: Optional[float] = None,
) -> Dict[str, Any]:
    return calculate_ontario_paycheque_and_rent(hourly_wage, hours_per_week, monthly_rent)


def execute_search_curriculum(query: str) -> Dict[str, Any]:
    chunks = search_curriculum(query, top_k=2)
    return {"query": query, "results": chunks}


def execute_find_youth_outreach_leads(segment: str = "all", limit: int = 5) -> Dict[str, Any]:
    leads = get_outreach_leads(segment=segment, limit=limit)
    return {
        "segment": segment,
        "count": len(leads),
        "leads": leads,
    }


def execute_draft_outreach_email(
    recipient_name: str,
    recipient_email: str,
    segment: str,
    subject: str,
    body_text: str,
    lead_id: Optional[int] = None,
) -> Dict[str, Any]:
    consent_type = "express_opt_in"
    youth_reach = 1
    org = "Direct Outreach"
    if lead_id:
        lead = get_outreach_lead_by_id(lead_id)
        if lead:
            consent_type = lead.get("casl_consent_type", "express_opt_in")
            youth_reach = lead.get("youth_reach_est", 1)
            org = lead.get("organization", org)

    val = validate_and_format_outreach_email(
        recipient_email=recipient_email,
        subject=subject,
        body_text=body_text,
        casl_consent_type=consent_type,
    )

    email_id = create_outreach_email_draft(
        recipient_name=recipient_name,
        recipient_email=recipient_email,
        segment=segment,
        subject=val["clean_subject"],
        body_text=val["clean_body"],
        casl_verified=1 if val["casl_verified"] else 0,
        lead_id=lead_id,
        delivery_mode="sandbox_outbox",
    )

    return {
        "email_id": email_id,
        "lead_id": lead_id,
        "recipient_name": recipient_name,
        "recipient_email": recipient_email,
        "organization": org,
        "segment": segment,
        "subject": val["clean_subject"],
        "body_preview": val["clean_body"][:250],
        "full_body": val["clean_body"],
        "casl_verified": val["casl_verified"],
        "status": "draft",
        "youth_reach_est": youth_reach,
        "delivery_mode": "sandbox_outbox",
        "checks_passed": val["checks_passed"],
    }


# Anthropic Tool JSON Schemas
TOOL_SCHEMAS = [
    {
        "name": "add_bill",
        "description": "Add a recurring Canadian bill (rent, phone, hydro, credit card) for proactive reminder tracking.",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Name of the bill or provider (e.g. 'Rogers Phone', 'Rent', 'Student Visa')"},
                "amount": {"type": "number", "description": "Bill amount in Canadian dollars (CAD)"},
                "due_day": {"type": "integer", "minimum": 1, "maximum": 31, "description": "Day of the month the bill is due (1-31)"},
                "category": {
                    "type": "string",
                    "enum": ["rent", "utility", "credit_card", "subscription", "other"],
                    "description": "Category of the bill",
                },
                "remind_days_before": {"type": "integer", "default": 3, "description": "Days prior to due date to send SMS reminder"},
                "is_pad": {"type": "boolean", "default": False, "description": "True if bill is paid via Pre-Authorized Debit (PAD) requiring liquid chequing funds"},
                "statement_day": {"type": "integer", "description": "Optional day of the month credit card statement closes"},
            },
            "required": ["name", "amount", "due_day"],
        },
    },
    {
        "name": "add_trial_killswitch",
        "description": "Set a cancellation alert for a free trial (e.g. Adobe, Spotify, Amazon Prime) before it converts to a paid charge.",
        "input_schema": {
            "type": "object",
            "properties": {
                "service_name": {"type": "string", "description": "Name of the subscription service"},
                "trial_length_days": {"type": "integer", "minimum": 1, "description": "Duration of the free trial in days (e.g. 7, 14, 30)"},
                "alert_hours_before": {"type": "integer", "default": 48, "description": "Hours prior to expiry to send the cancellation warning (default 48)"},
            },
            "required": ["service_name", "trial_length_days"],
        },
    },
    {
        "name": "mark_bill_paid",
        "description": "Mark a recurring bill as paid, advancing its next due date by 1 month and recording streak & late fees saved.",
        "input_schema": {
            "type": "object",
            "properties": {
                "bill_name": {"type": "string", "description": "Name or keyword of the bill paid (e.g. 'Rogers', 'Rent')"},
            },
            "required": ["bill_name"],
        },
    },
    {
        "name": "list_upcoming_bills",
        "description": "List all bills and trial alerts scheduled within the upcoming window.",
        "input_schema": {
            "type": "object",
            "properties": {
                "days_ahead": {"type": "integer", "default": 14, "description": "Number of days ahead to look (default 14)"},
            },
        },
    },
    {
        "name": "analyze_scam_message",
        "description": "Analyze an unsolicited text, email, link, or Interac notification using deterministic Canadian fraud patterns and MITRE F3.",
        "input_schema": {
            "type": "object",
            "properties": {
                "raw_text": {"type": "string", "description": "The exact message or link to analyze for fraud indicators"},
            },
            "required": ["raw_text"],
        },
    },
    {
        "name": "ontario_paycheque_and_rent_check",
        "description": "Calculate exact 2026 Ontario take-home pay, CPP, EI, tax deductions, and rent affordability.",
        "input_schema": {
            "type": "object",
            "properties": {
                "hourly_wage": {"type": "number", "description": "Hourly wage in CAD"},
                "hours_per_week": {"type": "number", "description": "Average working hours per week"},
                "monthly_rent": {"type": "number", "description": "Optional monthly rent in CAD to assess rent strain"},
            },
            "required": ["hourly_wage", "hours_per_week"],
        },
    },
    {
        "name": "search_ffe_curriculum",
        "description": "Retrieve verified educational content from Financial Futures Education (FFE) curriculum on Canadian personal finance.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search term or concept (e.g., 'credit score', 'TFSA', 'emergency fund', 'NSF fees')"},
            },
            "required": ["query"],
        },
    },
    {
        "name": "find_youth_outreach_leads",
        "description": "Find prospective Canadian student, campus partner, or youth waitlist leads for educational outreach.",
        "input_schema": {
            "type": "object",
            "properties": {
                "segment": {
                    "type": "string",
                    "enum": ["all", "youth_waitlist", "campus_union", "residence_life", "workshop_alumni"],
                    "default": "all",
                    "description": "Target segment of prospective youth or campus partners",
                },
                "limit": {"type": "integer", "default": 5, "description": "Maximum number of leads to return"},
            },
        },
    },
    {
        "name": "draft_outreach_email",
        "description": "Draft a CASL-compliant outreach email to a youth, campus partner, or student leader for owner 1-tap review.",
        "input_schema": {
            "type": "object",
            "properties": {
                "lead_id": {"type": ["integer", "null"], "description": "Optional lead ID from outreach_leads"},
                "recipient_name": {"type": "string", "description": "Full name of the recipient"},
                "recipient_email": {"type": "string", "description": "Email address of the recipient"},
                "segment": {"type": "string", "description": "Audience segment (e.g., campus_union, residence_life, youth_waitlist)"},
                "subject": {"type": "string", "description": "Concise, non-spammy subject line (<= 90 characters)"},
                "body_text": {"type": "string", "description": "Warm, student-friendly email body text (CASL footer appended automatically)"},
            },
            "required": ["recipient_name", "recipient_email", "segment", "subject", "body_text"],
        },
        # Ephemeral prompt caching on the last tool schema to cache entire toolset
        "cache_control": {"type": "ephemeral"},
    },
]
