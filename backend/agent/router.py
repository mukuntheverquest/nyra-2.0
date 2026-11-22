import json
import os
import time
from pathlib import Path
from typing import Dict, Any, List, Optional

from backend.config import (
    MODEL_PRIMARY,
    MODEL_TEMPERATURE,
    MAX_OUTPUT_TOKENS,
    MAX_TOOL_LOOP_STEPS,
    HAIKU_PRICING_PER_MTOK,
    USD_TO_CAD,
)
from backend.db.database import (
    get_user,
    increment_ai_quota,
    add_telemetry,
    add_message,
)
from backend.agent.tools import (
    TOOL_SCHEMAS,
    execute_add_bill,
    execute_add_trial_killswitch,
    execute_mark_bill_paid,
    execute_list_upcoming_bills,
    execute_analyze_scam,
    execute_ontario_paycheque,
    execute_search_curriculum,
)
from backend.agent.mock_engine import run_mock_turn
from backend.a2ui.compiler import (
    compile_bill_or_trial_surface,
    compile_scam_shield_surface,
    compile_paycheque_surface,
    compile_coach_surface,
    compile_text_surface,
)

SYSTEM_PROMPT_PATH = Path(__file__).resolve().parent / "system_prompt.md"


def load_system_prompt() -> str:
    with open(SYSTEM_PROMPT_PATH, "r", encoding="utf-8") as f:
        return f.read().strip()


def dispatch_tool(user_id: int, tool_name: str, tool_args: Dict[str, Any]) -> Dict[str, Any]:
    if tool_name == "add_bill":
        return execute_add_bill(
            user_id=user_id,
            name=tool_args.get("name", "Bill"),
            amount=float(tool_args.get("amount", 0.0)),
            due_day=int(tool_args.get("due_day", 1)),
            category=tool_args.get("category", "utility"),
            remind_days_before=int(tool_args.get("remind_days_before", 3)),
            is_pad=bool(tool_args.get("is_pad", False)),
            statement_day=tool_args.get("statement_day"),
        )
    elif tool_name == "add_trial_killswitch":
        return execute_add_trial_killswitch(
            user_id=user_id,
            service_name=tool_args.get("service_name", "Subscription"),
            trial_length_days=int(tool_args.get("trial_length_days", 14)),
            alert_hours_before=int(tool_args.get("alert_hours_before", 48)),
        )
    elif tool_name == "mark_bill_paid":
        return execute_mark_bill_paid(
            user_id=user_id,
            bill_name=tool_args.get("bill_name", ""),
        )
    elif tool_name == "list_upcoming_bills":
        return execute_list_upcoming_bills(
            user_id=user_id,
            days_ahead=int(tool_args.get("days_ahead", 14)),
        )
    elif tool_name == "analyze_scam_message":
        return execute_analyze_scam(
            user_id=user_id,
            raw_text=tool_args.get("raw_text", ""),
        )
    elif tool_name == "ontario_paycheque_and_rent_check":
        return execute_ontario_paycheque(
            hourly_wage=float(tool_args.get("hourly_wage", 17.20)),
            hours_per_week=float(tool_args.get("hours_per_week", 20.0)),
            monthly_rent=float(tool_args.get("monthly_rent")) if tool_args.get("monthly_rent") is not None else None,
        )
    elif tool_name == "search_ffe_curriculum":
        return execute_search_curriculum(
            query=tool_args.get("query", ""),
        )
    else:
        return {"error": f"Unknown tool: {tool_name}"}


def execute_agent_turn(
    user_id: int,
    user_message: str,
    force_mode: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Main orchestration router for Claude Haiku 5.5 with prompt caching,
    bounded tool execution loop, and deterministic fallback.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    is_live = bool(api_key and not api_key.startswith("mock_") and force_mode != "mock")

    if not is_live:
        mock_result = run_mock_turn(user_id, user_message)
        skill_used = mock_result["skill_used"]
        # Increment quota only for Coach & Scam Shield
        if skill_used in ["scam_shield", "money_coach"]:
            increment_ai_quota(user_id, 1)

        # Log telemetry and messages
        add_telemetry(
            user_id=user_id,
            skill_used=skill_used,
            model_used=mock_result["model_used"],
            input_tokens=mock_result["tokens"]["input"],
            cache_write_tokens=mock_result["tokens"]["cache_write"],
            cache_read_tokens=mock_result["tokens"]["cache_read"],
            output_tokens=mock_result["tokens"]["output"],
            est_cost_usd=mock_result["cost"]["usd"],
            est_cost_cad=mock_result["cost"]["cad"],
            pii_redacted=0,
            tool_calls=mock_result["tool_calls"],
            latency_ms=mock_result["latency_ms"],
        )
        add_message(user_id, "user", user_message)
        add_message(user_id, "assistant", mock_result["reply"], skill_tag=skill_used)
        return mock_result

    # Live Anthropic API path
    import anthropic
    client = anthropic.Anthropic(api_key=api_key)
    system_prompt = load_system_prompt()
    start_time = time.time()

    messages: List[Dict[str, Any]] = [{"role": "user", "content": user_message}]
    tool_calls_record: List[Dict[str, Any]] = []
    final_reply = ""
    skill_used = "money_coach"

    total_input = 0
    total_output = 0
    total_cache_write = 0
    total_cache_read = 0

    for step in range(MAX_TOOL_LOOP_STEPS):
        response = client.messages.create(
            model=MODEL_PRIMARY,
            max_tokens=MAX_OUTPUT_TOKENS,
            temperature=MODEL_TEMPERATURE,
            system=[
                {
                    "type": "text",
                    "text": system_prompt,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            tools=TOOL_SCHEMAS,
            messages=messages,
        )

        usage = response.usage
        total_input += getattr(usage, "input_tokens", 0)
        total_output += getattr(usage, "output_tokens", 0)
        total_cache_write += getattr(usage, "cache_creation_input_tokens", 0)
        total_cache_read += getattr(usage, "cache_read_input_tokens", 0)

        tool_use_blocks = [b for b in response.content if b.type == "tool_use"]
        text_blocks = [b for b in response.content if b.type == "text"]

        if text_blocks:
            final_reply = "".join(b.text for b in text_blocks)

        if response.stop_reason != "tool_use" or not tool_use_blocks:
            break

        # Process tool calls
        messages.append({"role": "assistant", "content": response.content})
        tool_results_content = []

        for tb in tool_use_blocks:
            t_name = tb.name
            t_args = tb.input
            t_res = dispatch_tool(user_id, t_name, t_args)

            if t_name in ["add_bill", "add_trial_killswitch", "mark_bill_paid", "list_upcoming_bills"]:
                skill_used = "bill_guard"
            elif t_name == "analyze_scam_message":
                skill_used = "scam_shield"
            else:
                skill_used = "money_coach"

            tool_calls_record.append({"name": t_name, "input": t_args, "output": t_res})
            tool_results_content.append({
                "type": "tool_result",
                "tool_use_id": tb.id,
                "content": json.dumps(t_res),
            })

        messages.append({"role": "user", "content": tool_results_content})

    latency_ms = int((time.time() - start_time) * 1000)

    # Cost calculation via 2026 Haiku 5.5 rates
    cost_usd = (
        (total_input * HAIKU_PRICING_PER_MTOK["input"] / 1_000_000)
        + (total_cache_write * HAIKU_PRICING_PER_MTOK["cache_write_5m"] / 1_000_000)
        + (total_cache_read * HAIKU_PRICING_PER_MTOK["cache_read"] / 1_000_000)
        + (total_output * HAIKU_PRICING_PER_MTOK["output"] / 1_000_000)
    )
    cost_cad = cost_usd * USD_TO_CAD

    # Increment quota only for Coach & Scam Shield
    if skill_used in ["scam_shield", "money_coach"]:
        increment_ai_quota(user_id, 1)

    # Compile A2UI v1.0 surface messages
    a2ui_messages = []
    if tool_calls_record:
        last_tool = tool_calls_record[-1]
        t_name = last_tool["name"]
        t_out = last_tool["output"]
        if t_name in ["add_bill", "add_trial_killswitch", "mark_bill_paid", "list_upcoming_bills"]:
            a2ui_messages = compile_bill_or_trial_surface(user_id, t_name, t_out)
        elif t_name == "analyze_scam_message":
            a2ui_messages = compile_scam_shield_surface(user_id, t_out)
        elif t_name == "ontario_paycheque_and_rent_check":
            a2ui_messages = compile_paycheque_surface(user_id, t_out)
        elif t_name == "search_ffe_curriculum":
            a2ui_messages = compile_coach_surface(user_id, user_message, t_out)
        else:
            a2ui_messages = compile_text_surface(user_id, final_reply)
    else:
        a2ui_messages = compile_text_surface(user_id, final_reply)

    # Log telemetry and messages
    add_telemetry(
        user_id=user_id,
        skill_used=skill_used,
        model_used=MODEL_PRIMARY,
        input_tokens=total_input,
        cache_write_tokens=total_cache_write,
        cache_read_tokens=total_cache_read,
        output_tokens=total_output,
        est_cost_usd=round(cost_usd, 6),
        est_cost_cad=round(cost_cad, 6),
        pii_redacted=0,
        tool_calls=tool_calls_record,
        latency_ms=latency_ms,
    )
    add_message(user_id, "user", user_message)
    add_message(user_id, "assistant", final_reply, skill_tag=skill_used)

    return {
        "reply": final_reply,
        "skill_used": skill_used,
        "model_used": MODEL_PRIMARY,
        "tool_calls": tool_calls_record,
        "a2ui_mime": "application/a2ui+json",
        "a2ui_messages": a2ui_messages,
        "tokens": {
            "input": total_input,
            "cache_write": total_cache_write,
            "cache_read": total_cache_read,
            "output": total_output,
            "total": total_input + total_output,
        },
        "cost": {
            "usd": round(cost_usd, 6),
            "cad": round(cost_cad, 6),
        },
        "latency_ms": latency_ms,
    }
