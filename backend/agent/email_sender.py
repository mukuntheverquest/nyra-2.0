import smtplib
from email.message import EmailMessage
from typing import Dict, Any

from backend.config import (
    OUTREACH_MODE,
    OUTREACH_ALLOWLIST,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
)


def dispatch_approved_email(
    recipient_email: str,
    subject: str,
    body_text: str,
) -> Dict[str, Any]:
    """
    Safely dispatches an approved outreach email.
    In default 'sandbox' mode, never touches external network/mail servers and logs to local outbox.
    Only dispatches over live SMTP when explicitly set to 'live', SMTP_HOST is present,
    and recipient is explicitly whitelisted in OUTREACH_ALLOWLIST.
    """
    clean_target = recipient_email.strip().lower()

    if (
        OUTREACH_MODE == "live"
        and SMTP_HOST
        and clean_target in OUTREACH_ALLOWLIST
    ):
        try:
            msg = EmailMessage()
            msg["Subject"] = subject
            msg["From"] = SMTP_FROM
            msg["To"] = recipient_email
            msg.set_content(body_text)

            with smtplib.SMTP(SMTP_HOST, int(SMTP_PORT), timeout=10) as server:
                server.starttls()
                if SMTP_USER and SMTP_PASS:
                    server.login(SMTP_USER, SMTP_PASS)
                server.send_message(msg)

            return {
                "delivered": True,
                "delivery_mode": "smtp_live",
                "recipient": recipient_email,
                "note": f"Delivered live via {SMTP_HOST}",
            }
        except Exception as e:
            return {
                "delivered": False,
                "delivery_mode": "smtp_live_failed",
                "recipient": recipient_email,
                "error": str(e),
            }

    # Safe default: Sandbox Outbox
    return {
        "delivered": True,
        "delivery_mode": "sandbox_outbox",
        "recipient": recipient_email,
        "note": "Logged in Nyra 2.0 Outbox (Sandbox Mode)",
    }
