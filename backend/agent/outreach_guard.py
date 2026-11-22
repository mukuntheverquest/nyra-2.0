import re
from typing import Dict, Any, List

CASL_FOOTER = """---
Sent by Financial Futures Education (FFE) · Ontario, Canada · https://nyra-app.ca
20% of Nyra 2.0 net profits fund free youth financial literacy workshops across Canada.
Opt out anytime: reply UNSUBSCRIBE to this email."""

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")


def validate_and_format_outreach_email(
    recipient_email: str,
    subject: str,
    body_text: str,
    casl_consent_type: str,
) -> Dict[str, Any]:
    """
    Validates recipient consent, formatting, and mandatory CASL statutory requirements.
    Ensures safe, non-spammy email drafting.
    """
    checks_passed: List[str] = []
    errors: List[str] = []

    # 1. CASL Consent check
    valid_consents = ("express_opt_in", "implied_b2b_inquiry")
    if casl_consent_type in valid_consents:
        checks_passed.append(f"Valid CASL consent: {casl_consent_type}")
    else:
        errors.append(f"Invalid or missing CASL consent type: {casl_consent_type}")

    # 2. Email format validation
    clean_email = recipient_email.strip()
    if EMAIL_REGEX.match(clean_email):
        checks_passed.append("Valid recipient email syntax")
    else:
        errors.append("Invalid recipient email syntax")

    # 3. PII / Redaction markers check
    if "[REDACTED_" in body_text or "[REDACTED_" in subject:
        errors.append("Contains unredacted or raw [REDACTED_] marker in copy")
    else:
        checks_passed.append("No sensitive PII markers in copy")

    # 4. Subject sanitization (<= 90 chars, no full ALL-CAPS spam)
    clean_subject = subject.strip()
    if len(clean_subject) > 90:
        clean_subject = clean_subject[:87] + "..."
        checks_passed.append("Subject clamped to <= 90 characters")
    else:
        checks_passed.append("Subject length within 90 char limit")

    # If subject is ALL CAPS (and longer than 4 chars), title-case it
    if clean_subject.isupper() and len(clean_subject) > 4:
        clean_subject = clean_subject.title()
        checks_passed.append("Normalized ALL-CAPS subject to Title Case")

    # 5. Mandatory CASL Footer
    clean_body = body_text.strip()
    if "Sent by Financial Futures Education (FFE)" not in clean_body:
        clean_body = f"{clean_body}\n\n{CASL_FOOTER}"
        checks_passed.append("Appended mandatory CASL identification & unsubscribe footer")
    else:
        checks_passed.append("CASL footer already present")

    casl_verified = len(errors) == 0

    return {
        "casl_verified": casl_verified,
        "clean_subject": clean_subject,
        "clean_body": clean_body,
        "checks_passed": checks_passed,
        "errors": errors,
    }
