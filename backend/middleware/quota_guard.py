from typing import Dict, Any, Optional
from backend.db.database import get_user, update_user
from backend.config import MAX_AI_MESSAGES_PER_MONTH

BILL_GUARD_KEYWORDS = ["add", "bill", "paid", "trial", "due", "upcoming", "rent", "reminder", "subscription", "pad"]


def check_casl_or_system_command(user_id: int, message_text: str) -> Optional[Dict[str, Any]]:
    """
    Zero-token interceptor for CASL compliance and system commands.
    Returns response dict if handled deterministically, or None to proceed.
    """
    clean = message_text.strip().upper()
    user = get_user(user_id)
    if not user:
        return None

    referral_code = user.get("referral_code", "NYRA-FFE")

    if clean in ["STOP", "UNSUBSCRIBE", "CANCEL SMS", "QUIT"]:
        update_user(user_id, sms_active=0)
        return {
            "handled": True,
            "skill_tag": "casl_zero_token",
            "reply": "You've been unsubscribed from Nyra 2.0 SMS alerts (CASL compliant). Reply START anytime to resume.",
            "is_zero_token": True,
        }

    if clean in ["START", "RESUME", "SUBSCRIBE"]:
        update_user(user_id, sms_active=1)
        return {
            "handled": True,
            "skill_tag": "casl_zero_token",
            "reply": "Welcome back! Your Nyra 2.0 bill & trial alerts are active again.",
            "is_zero_token": True,
        }

    if clean in ["HELP", "INFO", "COMMANDS"]:
        return {
            "handled": True,
            "skill_tag": "casl_zero_token",
            "reply": (
                "Nyra 2.0 Commands:\n"
                "1. Bill Guard: Text bills/trials ('Rogers $55 due 18th', 'Adobe trial 14 days', 'Paid rent')\n"
                "2. Scam Shield: Forward any sketchy text/link for an instant safety check\n"
                "3. Money Coach: Ask about Ontario paycheques, taxes, rent, or credit scores\n"
                "Reply STOP to unsubscribe, or REFER for your youth workshop invite link."
            ),
            "is_zero_token": True,
        }

    if clean in ["REFER", "REFERRAL", "SHARE"]:
        return {
            "handled": True,
            "skill_tag": "casl_zero_token",
            "reply": (
                f"Save a Friend, Fund a Youth: Share your link https://nyra-app.ca/r/{referral_code} — "
                "both of you get 1 free month and add +15 mins to FFE's youth workshop pool!"
            ),
            "is_zero_token": True,
        }

    return None


def is_bill_guard_query(message_text: str) -> bool:
    """Checks if message contains Bill or Trial Guard intent keywords."""
    lower = message_text.lower()
    return any(kw in lower for kw in BILL_GUARD_KEYWORDS)


def check_monthly_quota(user_id: int, message_text: str) -> Dict[str, Any]:
    """
    Checks the 25 AI messages/month quota.
    Allows Bill Guard actions through without quota limits.
    Blocks Money Coach & Scam Shield once quota is reached.
    """
    user = get_user(user_id)
    if not user:
        return {"allowed": True, "quota_exceeded": False}

    ai_msgs_used = user.get("ai_msgs_used", 0)

    if ai_msgs_used >= MAX_AI_MESSAGES_PER_MONTH:
        # Check if query is a Bill or Trial Guard action
        if is_bill_guard_query(message_text):
            return {"allowed": True, "quota_exceeded": False, "is_bill_guard": True}

        # Quota exceeded for AI Coach / Scam Shield
        return {
            "allowed": False,
            "quota_exceeded": True,
            "reply": (
                "You've used all 25 AI Coach/Scam checks for this month! "
                "Your Bill & Trial Reminders keep running automatically, and your AI checks reset on the 1st."
            ),
        }

    return {"allowed": True, "quota_exceeded": False, "is_bill_guard": is_bill_guard_query(message_text)}
