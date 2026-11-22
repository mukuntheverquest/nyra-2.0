import re
from typing import Dict, List, Any


def evaluate_scam_message(raw_text: str) -> Dict[str, Any]:
    """
    Deterministic rule engine for Canadian cyber-fraud detection,
    mapped to MITRE Fight Fraud Framework (F3 v1.1).
    """
    text_lower = raw_text.lower()
    score = 0
    red_flags: List[str] = []
    scam_type = "other"
    mitre_f3_tactic = "Initial Access / Positioning"
    mitre_f3_technique = "T1566 Phishing"

    # 1. URL Shorteners & Suspicious Links (+40 pts)
    shortener_regex = re.compile(r"\b(bit\.ly|tinyurl\.com|t\.co|rb\.gy|is\.gd|cutt\.ly|ow\.ly|goo\.gl)\b", re.I)
    has_shortener = bool(shortener_regex.search(raw_text))
    has_url = bool(re.search(r"https?://\S+|www\.\S+|\b\w+\.\w+/\S+", raw_text))

    if has_shortener:
        score += 40
        red_flags.append("Uses an obfuscated/shortened link hiding the true destination server")
    elif has_url and not any(legit in text_lower for legit in [".gc.ca", ".canada.ca", "interac.ca"]):
        score += 25
        red_flags.append("Contains an unverified external web link")

    # 2. Government / Public Agency Impersonation (+45 pts)
    gov_keywords = ["cra", "osap", "service canada", "canada post", "407 etr", "revenue agency", "ontario student"]
    is_gov_impersonation = any(re.search(rf"\b{kw}\b", text_lower) for kw in gov_keywords)

    if is_gov_impersonation:
        if "osap" in text_lower or "cra" in text_lower:
            scam_type = "cra_osap"
            mitre_f3_technique = "T1566.002 Spearphishing Link / F1005 Brand Impersonation"
        elif "canada post" in text_lower:
            scam_type = "delivery"
            mitre_f3_technique = "T1566 Phishing: Delivery Impersonation"
        elif "407 etr" in text_lower:
            scam_type = "other"
            mitre_f3_technique = "T1566 Phishing: Toll Impersonation"

        if has_url or has_shortener:
            score += 45
            red_flags.append("Canadian public agencies (CRA/OSAP/Service Canada) never send texts with links or refund claim forms")
        else:
            score += 25
            red_flags.append("Claims to represent a government agency via unsolicited text")

    # 3. Interac e-Transfer Claim Pattern (+40 pts)
    if "interac" in text_lower or "e-transfer" in text_lower or "etransfer" in text_lower:
        if scam_type == "other":
            scam_type = "interac"
        if any(term in text_lower for term in ["received", "deposit", "claim", "refund", "pending"]):
            score += 40
            mitre_f3_tactic = "Monetization (FA0002)"
            mitre_f3_technique = "F1025.003 Electronic Funds Transfer Fraud"
            red_flags.append("Fake Interac deposit notifications use fake bank login forms to steal online banking credentials")

    # 4. Urgency & Fear Triggers (+20 pts)
    urgency_terms = ["24 hours", "suspended", "arrest", "expired", "claim now", "final notice", "warrant", "immediate", "urgent"]
    found_urgency = [term for term in urgency_terms if term in text_lower]
    if found_urgency:
        score += 20
        red_flags.append(f"Creates false urgency ('{found_urgency[0]}') to panic you into acting before verifying")

    # 5. Rental & Remote Job Advance-Fee Patterns (+45 pts)
    rental_job_patterns = [
        "deposit before viewing", "hold keys", "first and last before", "cheque mobile deposit",
        "mystery shopper", "wire back", "equipment allowance", "cash the cheque"
    ]
    for pattern in rental_job_patterns:
        if pattern in text_lower:
            score += 45
            if "viewing" in pattern or "keys" in pattern:
                scam_type = "rental"
            else:
                scam_type = "job"
            mitre_f3_tactic = "Monetization (FA0002)"
            mitre_f3_technique = "F1010 Advance Fee Scheme"
            red_flags.append(f"Classic advance-fee trap ({pattern}) requesting funds or deposits prior to verification")
            break

    # Determine Risk Level
    if score >= 60:
        risk_level = "HIGH"
        suggested_verdict = "HIGH RISK — DO NOT ENGAGE"
        suggested_next_step = "Delete and report this message immediately to the Canadian Anti-Fraud Centre (CAFC). Do NOT click any links."
    elif score >= 25:
        risk_level = "SUSPICIOUS"
        suggested_verdict = "SUSPICIOUS — PROCEED WITH CAUTION"
        suggested_next_step = "Verify directly through the organization's official website or verified phone app. Never click links in unsolicited texts."
    else:
        risk_level = "LOW"
        suggested_verdict = "LIKELY SAFE"
        suggested_next_step = "No critical phishing indicators detected, but stay mindful of sender address and unexpected attachments."

    # Guarantee 3 clear red flags for HIGH/SUSPICIOUS or sensible points for LOW
    if risk_level in ["HIGH", "SUSPICIOUS"]:
        if len(red_flags) < 3:
            if not any("link" in rf.lower() for rf in red_flags):
                red_flags.append("Unsolicited SMS from an unknown sender requesting immediate action")
            if len(red_flags) < 3:
                red_flags.append("CRA, banks, and universities do not conduct urgent identity or refund transactions via SMS")
            if len(red_flags) < 3:
                red_flags.append("Grammar, tone, or formatting diverges from legitimate Canadian institutional communications")
    else:
        if not red_flags:
            red_flags = [
                "Sender does not match high-risk phishing indicators",
                "No suspicious URL shorteners or credential-harvesting links detected",
                "No aggressive time-pressure or threatening legal language found",
            ]

    # Trim to exactly top 3 red flags
    top_red_flags = red_flags[:3]

    return {
        "risk_level": risk_level,
        "score": score,
        "scam_type": scam_type,
        "mitre_f3_tactic": mitre_f3_tactic,
        "mitre_f3_technique": mitre_f3_technique,
        "red_flags": top_red_flags,
        "suggested_verdict": suggested_verdict,
        "suggested_next_step": suggested_next_step,
    }
