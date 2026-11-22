import re
import time
from typing import Dict, Any, List

from backend.agent.tools import (
    execute_add_bill,
    execute_add_trial_killswitch,
    execute_mark_bill_paid,
    execute_list_upcoming_bills,
    execute_analyze_scam,
    execute_ontario_paycheque,
    execute_search_curriculum,
)
from backend.config import HAIKU_PRICING_PER_MTOK, USD_TO_CAD


def run_mock_turn(user_id: int, user_message: str) -> Dict[str, Any]:
    """
    Deterministic offline engine mirroring Claude Haiku 5.5 tool dispatch and telemetry.
    Ensures pitch demos and tests run reliably with zero API keys or external network dependencies.
    """
    start_time = time.time()
    text = user_message.strip()
    text_lower = text.lower()

    tool_calls: List[Dict[str, Any]] = []
    assistant_reply = ""
    skill_used = "money_coach"

    # 1. Non-Advisory Stock/Crypto Refusal check
    investment_keywords = ["should i buy", "stock to buy", "invest in crypto", "bitcoin", "penny stock", "which stock"]
    if any(kw in text_lower for kw in investment_keywords):
        skill_used = "money_coach"
        assistant_reply = (
            "I can't recommend specific stocks, crypto, or individual investments! "
            "Nyra focuses on financial safety and literacy. Instead, look into building an emergency fund "
            "or understanding how a Tax-Free Savings Account (TFSA) shelters broad index funds from taxes.\n\n"
            "Educational info only — not licensed financial, tax, or legal advice."
        )

    # 2. Preset 1 / Trial Kill-switch
    elif "trial" in text_lower:
        skill_used = "bill_guard"
        # Extract service name
        service_match = re.search(r"(\w+)\s+(?:free\s+)?trial", text, re.I)
        service = service_match.group(1).title() if service_match else "Subscription"
        # Extract days
        days_match = re.search(r"(\d+)\s*days?", text, re.I)
        days = int(days_match.group(1)) if days_match else 14
        # Extract alert hours / days
        alert_hours = 48
        if "day" in text_lower and re.search(r"(\d+)\s*days?\s*before", text_lower):
            alert_days = int(re.search(r"(\d+)\s*days?\s*before", text_lower).group(1))
            alert_hours = alert_days * 24

        tool_result = execute_add_trial_killswitch(user_id, service, days, alert_hours)
        tool_calls.append({
            "name": "add_trial_killswitch",
            "input": {"service_name": service, "trial_length_days": days, "alert_hours_before": alert_hours},
            "output": tool_result,
        })
        assistant_reply = (
            f"Locked in your trial kill-switch for {service}! "
            f"Charges begin on {tool_result['cancel_by_date']}. "
            f"I'll text you on {tool_result['alert_date']} ({alert_hours}h early) so you can cancel before paying a dime."
        )

    # 3. Preset 2 / Canadian Scam Shield
    elif any(kw in text_lower for kw in ["osap", "cra", "interac", "refund", "bit.ly", "scam", "suspicious", "etransfer"]):
        skill_used = "scam_shield"
        tool_result = execute_analyze_scam(user_id, text)
        tool_calls.append({
            "name": "analyze_scam_message",
            "input": {"raw_text": text},
            "output": tool_result,
        })
        flags_formatted = "\n".join(f"• {rf}" for rf in tool_result["red_flags"])
        assistant_reply = (
            f"🚨 **Verdict: {tool_result['suggested_verdict']}**\n\n"
            f"**Red Flags:**\n{flags_formatted}\n\n"
            f"**Exact Next Step:** {tool_result['suggested_next_step']}"
        )

    # 4. Preset 3 / Ontario Paycheque & Rent Check
    elif any(kw in text_lower for kw in ["/hr", "wage", "rent", "paycheque", "afford"]):
        skill_used = "money_coach"
        wage_match = re.search(r"\$(\d+(?:\.\d+)?)(?:/hr)?|\b(\d+(?:\.\d+)?)\s*(?:an hour|/hr|hr)", text_lower)
        hours_match = re.search(r"(\d+(?:\.\d+)?)\s*hours?", text_lower)
        rent_match = re.search(r"\$(\d+(?:\.\d+)?)\s*rent|rent\s*(?:of\s*)?\$(\d+(?:\.\d+)?)", text_lower)

        wage = float(wage_match.group(1) or wage_match.group(2)) if wage_match else 18.0
        hours = float(hours_match.group(1)) if hours_match else 20.0
        rent = float(rent_match.group(1) or rent_match.group(2)) if rent_match else None

        tool_result = execute_ontario_paycheque(wage, hours, rent)
        tool_calls.append({
            "name": "ontario_paycheque_and_rent_check",
            "input": {"hourly_wage": wage, "hours_per_week": hours, "monthly_rent": rent},
            "output": tool_result,
        })

        rent_text = ""
        if rent and "rent_analysis" in tool_result:
            ra = tool_result["rent_analysis"]
            rent_text = f"\n\n**Rent Strain ({ra['classification']}):** {ra['rent_percent_of_net']}% of take-home pay. {ra['advice']}"

        assistant_reply = (
            f"At ${wage:.2f}/hr working {hours:g} hrs/week in Ontario:\n"
            f"• Monthly Gross: ${tool_result['monthly_gross']:.2f}\n"
            f"• 2026 Deductions (CPP + EI + Tax): ${tool_result['deductions_monthly']['total_deductions']:.2f}/mo\n"
            f"• **Estimated Take-Home (Net): ${tool_result['monthly_net']:.2f}/mo**"
            f"{rent_text}\n\n"
            f"Educational info only — not licensed financial, tax, or legal advice."
        )

    # 5. Preset 5 / Mark Bill Paid
    elif "paid" in text_lower:
        skill_used = "bill_guard"
        # Extract bill name
        bill_match = re.search(r"paid\s+(?:my\s+)?([a-zA-Z\s]+?)(?:\s+bill)?(?:!|\.|$)", text, re.I)
        bill_name = bill_match.group(1).strip() if bill_match else "Rogers Phone"

        tool_result = execute_mark_bill_paid(user_id, bill_name)
        tool_calls.append({
            "name": "mark_bill_paid",
            "input": {"bill_name": bill_name},
            "output": tool_result,
        })
        assistant_reply = tool_result["message"]

    # 6. Add Bill
    elif "add" in text_lower and any(kw in text_lower for kw in ["bill", "rent", "hydro", "phone", "wifi", "$"]):
        skill_used = "bill_guard"
        amt_match = re.search(r"\$(\d+(?:\.\d+)?)", text)
        amount = float(amt_match.group(1)) if amt_match else 50.0
        due_match = re.search(r"(\d{1,2})(?:st|nd|rd|th)?", text)
        due_day = int(due_match.group(1)) if due_match else 15
        is_pad = "pad" in text_lower or "auto" in text_lower

        # Extract title
        name = "New Bill"
        for candidate in ["Hydro", "Internet", "Enbridge", "Fido", "Gym", "Insurance", "Spotify"]:
            if candidate.lower() in text_lower:
                name = candidate
                break

        tool_result = execute_add_bill(user_id, name, amount, due_day, is_pad=is_pad)
        tool_calls.append({
            "name": "add_bill",
            "input": {"name": name, "amount": amount, "due_day": due_day, "is_pad": is_pad},
            "output": tool_result,
        })
        assistant_reply = tool_result["message"]

    # 7. List bills
    elif any(kw in text_lower for kw in ["list", "upcoming", "show bills", "what bills"]):
        skill_used = "bill_guard"
        tool_result = execute_list_upcoming_bills(user_id, 14)
        tool_calls.append({
            "name": "list_upcoming_bills",
            "input": {"days_ahead": 14},
            "output": tool_result,
        })
        b_list = tool_result["upcoming_bills"]
        b_lines = "\n".join(f"• {b['name']}: ${b['amount']:.2f} due {b['next_due_date']}" for b in b_list)
        assistant_reply = f"Here are your upcoming bills (next 14 days):\n{b_lines or 'No bills due in next 14 days!'}"

    # 8. Default Money Coach RAG lookup
    else:
        skill_used = "money_coach"
        rag_res = execute_search_curriculum(text)
        tool_calls.append({
            "name": "search_ffe_curriculum",
            "input": {"query": text},
            "output": rag_res,
        })
        chunks = rag_res["results"]
        if chunks:
            top_snippet = chunks[0]["content"][:280].strip()
            assistant_reply = (
                f"{top_snippet}...\n\n"
                f"Source: FFE Curriculum ({chunks[0]['filename']})\n"
                f"Educational info only — not licensed financial, tax, or legal advice."
            )
        else:
            assistant_reply = (
                "I'm here to help with Canadian budgeting, bills, scam prevention, and money basics. "
                "Text me a bill to track, paste a suspicious link to scan, or ask about Ontario taxes and credit!\n\n"
                "Educational info only — not licensed financial, tax, or legal advice."
            )

    latency_ms = int((time.time() - start_time) * 1000)

    # Simulated Haiku 5.5 token usage with ephemeral prompt caching
    input_tokens = 320
    cache_read_tokens = 280
    cache_write_tokens = 0
    output_tokens = min(len(assistant_reply.split()) * 2, 280)

    # Calculate simulated cost via HAIKU_PRICING_PER_MTOK
    cost_usd = (
        (input_tokens * HAIKU_PRICING_PER_MTOK["input"] / 1_000_000)
        + (cache_read_tokens * HAIKU_PRICING_PER_MTOK["cache_read"] / 1_000_000)
        + (output_tokens * HAIKU_PRICING_PER_MTOK["output"] / 1_000_000)
    )
    cost_cad = cost_usd * USD_TO_CAD

    return {
        "reply": assistant_reply,
        "skill_used": skill_used,
        "model_used": "claude-haiku-5-5 (offline-mock)",
        "tool_calls": tool_calls,
        "tokens": {
            "input": input_tokens,
            "cache_write": cache_write_tokens,
            "cache_read": cache_read_tokens,
            "output": output_tokens,
            "total": input_tokens + output_tokens,
        },
        "cost": {
            "usd": round(cost_usd, 6),
            "cad": round(cost_cad, 6),
        },
        "latency_ms": latency_ms,
    }
