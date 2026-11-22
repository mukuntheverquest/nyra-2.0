import re
from typing import Dict, List, Any


def scrub_pii(text: str) -> Dict[str, Any]:
    """
    Deterministically scrubs Canadian PII before any persistence or LLM invocation.
    - Canadian SIN (with contextual verification or explicit SIN keyword): [REDACTED_SIN]
    - Credit/Debit Card numbers (13-19 digits): [REDACTED_CARD]
    - Bank Account / Transit numbers: [REDACTED_BANK_INFO]
    """
    sanitized = text
    redacted_types: List[str] = []
    pii_detected = False

    # 1. Bank Account / Transit pattern
    # Looks for transit/institution/account followed by numbers
    bank_pattern = re.compile(
        r"(?i)\b(transit|institution|bank\s*acc(?:ount)?|acc(?:ount)?\s*(?:no|num|number|#)?)\s*[:#-]?\s*(\d{3,12})\b"
    )
    if bank_pattern.search(sanitized):
        sanitized = bank_pattern.sub(r"\1 [REDACTED_BANK_INFO]", sanitized)
        redacted_types.append("Bank Account / Transit Info")
        pii_detected = True

    # 2. Payment Card pattern (13 to 19 digits with optional spaces or dashes)
    # Check for 13-19 digits that look like cards (VISA starts 4, MC 5, AMEX 3, etc.)
    # Avoid replacing single year numbers or short quantities
    card_pattern = re.compile(r"\b(?:\d[ -]?){13,19}\b")
    for match in card_pattern.finditer(sanitized):
        raw_digits = re.sub(r"\D", "", match.group(0))
        if 13 <= len(raw_digits) <= 19:
            sanitized = sanitized.replace(match.group(0), "[REDACTED_CARD]")
            if "Payment Card" not in redacted_types:
                redacted_types.append("Payment Card")
            pii_detected = True

    # 3. Canadian Social Insurance Number (SIN)
    # Format: 3 groups of 3 digits e.g. 123-456-789 or 123 456 789 or 123456789
    # Contextual check: text contains sin, social insurance, cra, tax, s.i.n, or direct declaration
    sin_pattern = re.compile(r"\b\d{3}[-\s]?\d{3}[-\s]?\d{3}\b")
    text_lower = text.lower()
    has_sin_context = any(
        kw in text_lower
        for kw in ["sin", "social insurance", "cra", "tax", "s.i.n", "social ins", "my sin is"]
    )

    for match in sin_pattern.finditer(sanitized):
        # If there is explicit SIN context OR the pattern has hyphens/spaces like standard SIN format
        raw_match = match.group(0)
        digits = re.sub(r"\D", "", raw_match)
        if len(digits) == 9:
            # If SIN context present, or formatted with hyphens/spaces, flag as SIN
            if has_sin_context or "-" in raw_match or " " in raw_match:
                sanitized = sanitized.replace(raw_match, "[REDACTED_SIN]")
                if "Social Insurance Number (SIN)" not in redacted_types:
                    redacted_types.append("Social Insurance Number (SIN)")
                pii_detected = True

    return {
        "sanitized_text": sanitized,
        "pii_detected": pii_detected,
        "redacted_types": redacted_types,
        "warning_message": (
            f"Heads up — I automatically scrubbed sensitive info ({', '.join(redacted_types)}) "
            f"before processing. Nyra 2.0 never asks for or stores SINs, card numbers, or bank logins. "
            f"Ask your question again without private numbers and I'll gladly help!"
            if pii_detected
            else None
        ),
    }
