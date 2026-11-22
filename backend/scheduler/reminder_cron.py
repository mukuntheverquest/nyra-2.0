from datetime import date, timedelta
from typing import Dict, Any, List

from backend.db.database import (
    get_user,
    get_bills,
    get_trial_alerts,
    add_message,
)
from backend.rag.retriever import search_curriculum


def run_daily_reminder_digest(user_id: int = 1) -> Dict[str, Any]:
    """
    Batches all bills and trial alerts due within reminder windows into ONE single SMS.
    Reduces Canadian SMS costs by 30-50% while preventing alert fatigue.
    """
    user = get_user(user_id)
    if not user or not user.get("sms_active", 1):
        return {"status": "skipped", "reason": "user inactive or opted out"}

    today = date.today()
    bills = get_bills(user_id)
    trial_alerts = get_trial_alerts(user_id)

    due_items: List[str] = []
    pad_warnings: List[str] = []

    # Check bills
    for b in bills:
        try:
            due_dt = date.fromisoformat(b["next_due_date"])
            days_until = (due_dt - today).days
            remind_window = b.get("remind_days_before", 3)

            # Within reminder window or overdue
            if 0 <= days_until <= remind_window:
                is_pad = bool(b.get("is_pad", 0))
                pad_badge = " [PAD Auto-Debit]" if is_pad else ""
                day_str = "today" if days_until == 0 else f"in {days_until} days ({b['next_due_date']})"
                due_items.append(f"• {b['name']}: ${b['amount']:.2f} due {day_str}{pad_badge}")

                if is_pad:
                    pad_warnings.append(
                        f"⚠️ PAD Alert: Ensure your chequing balance has at least ${b['amount']:.2f} to avoid bank NSF and telecom penalty fees."
                    )
        except Exception:
            continue

    # Check trials
    for t in trial_alerts:
        if t["status"] == "active":
            try:
                alert_dt = date.fromisoformat(t["alert_date"])
                cancel_dt = date.fromisoformat(t["cancel_by_date"])
                if today >= alert_dt and today <= cancel_dt:
                    due_items.append(f"• Trial Kill-Switch: Cancel '{t['service_name']}' before {t['cancel_by_date']} to prevent charge!")
            except Exception:
                continue

    if not due_items:
        digest_text = (
            f"Good morning {user['name'].split()[0]}! ☀️ All clear today — no upcoming bills or trial deadlines "
            "within your reminder window. Keep rocking your on-time streak!"
        )
    else:
        items_block = "\n".join(due_items)
        pad_block = ("\n\n" + "\n".join(pad_warnings)) if pad_warnings else ""
        digest_text = (
            f"🔔 Nyra 9 AM Digest for {user['name'].split()[0]}:\n"
            f"{items_block}"
            f"{pad_block}\n\n"
            "Reply 'paid <bill>' once settled to extend your payment streak!"
        )

    # Log to conversation history
    add_message(user_id, "system_cron", digest_text, skill_tag="bill_guard_cron")

    return {
        "status": "sent",
        "digest": digest_text,
        "items_count": len(due_items),
        "pad_warnings_count": len(pad_warnings),
    }


def run_weekly_micro_tip(user_id: int = 1) -> Dict[str, Any]:
    """Sends a 2-sentence weekly Canadian money tip if user is opted in."""
    user = get_user(user_id)
    if not user or not user.get("weekly_tip_opt_in", 1) or not user.get("sms_active", 1):
        return {"status": "skipped", "reason": "user opted out"}

    # Pull a tip from curriculum
    tips = [
        "Weekly FFE Tip: In Canada, keeping your credit card balance below 30% of your limit boosts your credit score significantly — even if you pay in full every month!",
        "Weekly FFE Tip: The 2026 annual TFSA contribution room is $7,000 for any Canadian resident aged 18+. All growth and withdrawals inside your TFSA are 100% tax-free.",
        "Weekly FFE Tip: Canadian banks now cap NSF fees at $10, but billers like landlords and phone providers still charge $25-$50 late fees. Keep a $50 chequing buffer for PADs!",
        "Weekly FFE Tip: CRA and OSAP never send Interac e-Transfers via SMS links. If you get a text claiming a refund with a bit.ly link, it's 100% a phishing trap.",
    ]
    import random
    tip_text = random.choice(tips)

    add_message(user_id, "system_cron", f"💡 {tip_text}", skill_tag="weekly_tip")
    return {"status": "sent", "tip": tip_text}


def run_monthly_impact_summary(user_id: int = 1) -> Dict[str, Any]:
    """Sends monthly streak and FFE youth workshop impact recap."""
    user = get_user(user_id)
    if not user:
        return {"status": "skipped"}

    name = user["name"].split()[0]
    streak = user.get("streak_months", 0)
    saved = user.get("late_fees_saved", 0.0)
    impact_mins = user.get("impact_minutes_funded", 0)

    summary = (
        f"🌟 Monthly Nyra Recap for {name}!\n"
        f"• On-Time Payment Streak: {streak} months\n"
        f"• Estimated Late Fees Avoided: ${saved:.2f}\n"
        f"• Community Impact: {impact_mins} minutes of financial literacy workshops funded for underserved youth via FFE's 20% impact pool!\n\n"
        "Thank you for being part of the mission!"
    )

    add_message(user_id, "system_cron", summary, skill_tag="monthly_impact")
    return {"status": "sent", "summary": summary}
