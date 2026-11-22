import os
import time
from typing import Dict, Any, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.db.database import (
    init_db,
    get_user,
    update_user,
    get_bills,
    get_trial_alerts,
    get_latest_telemetry,
    get_telemetry_logs,
    get_scam_logs,
    get_messages,
    add_message,
    add_telemetry,
)
from backend.db.seed_demo import seed_demo_data
from backend.middleware.pii_scrubber import scrub_pii
from backend.middleware.quota_guard import (
    check_casl_or_system_command,
    check_monthly_quota,
)
from backend.agent.router import execute_agent_turn
from backend.scheduler.reminder_cron import run_daily_reminder_digest


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-initialize and seed if not present
    init_db()
    user = get_user(1)
    if not user:
        seed_demo_data()
    yield


app = FastAPI(
    title="Nyra 2.0 Guardrailed Agent Harness",
    description="Text-First Canadian Bill Guard, Scam Shield & FFE Money Coach",
    version="2.0.0",
    lifespan=lifespan,
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    user_id: int = 1
    mode: Optional[str] = "mock"  # "live" | "mock"


class SettingsRequest(BaseModel):
    user_id: int = 1
    plan_tier: Optional[str] = None
    org_code: Optional[str] = None
    sms_active: Optional[int] = None
    weekly_tip_opt_in: Optional[int] = None


@app.get("/")
def read_root():
    return {
        "system": "Nyra 2.0 Guardrailed Agent Harness",
        "organization": "Financial Futures Education (FFE)",
        "status": "operational",
        "demo_user": "Alex Rivera",
    }


@app.get("/api/state")
def get_full_state(user_id: int = 1):
    user = get_user(user_id)
    if not user:
        seed_demo_data()
        user = get_user(user_id)

    bills = get_bills(user_id)
    trials = get_trial_alerts(user_id)
    telemetry_latest = get_latest_telemetry(user_id)
    telemetry_logs = get_telemetry_logs(user_id, limit=10)
    scam_logs = get_scam_logs(user_id)
    messages = get_messages(user_id, limit=30)

    return {
        "user": user,
        "bills": bills,
        "trials": trials,
        "telemetry_latest": telemetry_latest,
        "telemetry_logs": telemetry_logs,
        "scam_logs": scam_logs,
        "messages": messages,
    }


@app.post("/api/chat")
def process_chat(req: ChatRequest):
    user_id = req.user_id
    raw_text = req.message.strip()
    mode = req.mode or "mock"

    if not raw_text:
        raise HTTPException(status_code=400, detail="Message text cannot be empty.")

    start_time = time.time()

    # 1. Deterministic PII Scrubber Middleware
    pii_res = scrub_pii(raw_text)
    if pii_res["pii_detected"]:
        sanitized_text = pii_res["sanitized_text"]
        reply = pii_res["warning_message"]
        latency_ms = int((time.time() - start_time) * 1000)

        # Log zero-token, zero-cost PII block turn
        add_telemetry(
            user_id=user_id,
            skill_used="pii_block",
            model_used="deterministic-guardrail",
            input_tokens=0,
            cache_write_tokens=0,
            cache_read_tokens=0,
            output_tokens=0,
            est_cost_usd=0.0,
            est_cost_cad=0.0,
            pii_redacted=1,
            tool_calls=[{"name": "pii_scrubber", "redacted_types": pii_res["redacted_types"]}],
            latency_ms=latency_ms,
        )
        add_message(user_id, "user", raw_text)
        add_message(user_id, "assistant", reply, skill_tag="pii_block")

        return {
            "reply": reply,
            "skill_used": "pii_block",
            "pii_redacted": True,
            "redacted_types": pii_res["redacted_types"],
            "sanitized_text": sanitized_text,
            "tokens": {"input": 0, "cache_write": 0, "cache_read": 0, "output": 0, "total": 0},
            "cost": {"usd": 0.0, "cad": 0.0},
            "latency_ms": latency_ms,
            "state": get_full_state(user_id),
        }

    # 2. CASL & System Command Zero-Token Interceptor
    casl_res = check_casl_or_system_command(user_id, raw_text)
    if casl_res:
        reply = casl_res["reply"]
        latency_ms = int((time.time() - start_time) * 1000)

        add_telemetry(
            user_id=user_id,
            skill_used="casl_zero_token",
            model_used="deterministic-interceptor",
            input_tokens=0,
            cache_write_tokens=0,
            cache_read_tokens=0,
            output_tokens=0,
            est_cost_usd=0.0,
            est_cost_cad=0.0,
            pii_redacted=0,
            tool_calls=[{"name": "casl_guard", "command": raw_text}],
            latency_ms=latency_ms,
        )
        add_message(user_id, "user", raw_text)
        add_message(user_id, "assistant", reply, skill_tag="casl_zero_token")

        return {
            "reply": reply,
            "skill_used": "casl_zero_token",
            "pii_redacted": False,
            "tokens": {"input": 0, "cache_write": 0, "cache_read": 0, "output": 0, "total": 0},
            "cost": {"usd": 0.0, "cad": 0.0},
            "latency_ms": latency_ms,
            "state": get_full_state(user_id),
        }

    # 3. Monthly AI Quota Guard (25 msgs)
    quota_res = check_monthly_quota(user_id, raw_text)
    if not quota_res["allowed"]:
        reply = quota_res["reply"]
        latency_ms = int((time.time() - start_time) * 1000)

        add_telemetry(
            user_id=user_id,
            skill_used="quota_exceeded",
            model_used="deterministic-guardrail",
            input_tokens=0,
            cache_write_tokens=0,
            cache_read_tokens=0,
            output_tokens=0,
            est_cost_usd=0.0,
            est_cost_cad=0.0,
            pii_redacted=0,
            tool_calls=[{"name": "quota_guard", "status": "blocked"}],
            latency_ms=latency_ms,
        )
        add_message(user_id, "user", raw_text)
        add_message(user_id, "assistant", reply, skill_tag="quota_exceeded")

        return {
            "reply": reply,
            "skill_used": "quota_exceeded",
            "pii_redacted": False,
            "tokens": {"input": 0, "cache_write": 0, "cache_read": 0, "output": 0, "total": 0},
            "cost": {"usd": 0.0, "cad": 0.0},
            "latency_ms": latency_ms,
            "state": get_full_state(user_id),
        }

    # 4. Agent Router (Live Claude Haiku 5.5 or Deterministic Mock)
    agent_res = execute_agent_turn(user_id=user_id, user_message=raw_text, force_mode=mode)
    agent_res["state"] = get_full_state(user_id)
    return agent_res


@app.post("/api/settings")
def update_settings(req: SettingsRequest):
    user_id = req.user_id
    updates = {}
    if req.plan_tier is not None:
        updates["plan_tier"] = req.plan_tier
    if req.org_code is not None:
        updates["org_code"] = req.org_code.strip().upper()
        # If valid institutional code, set plan to b2b_bulk
        if updates["org_code"] in ["MCMASTER-2026", "FFE-COHORT-04", "MCMASTER-BETA"]:
            updates["plan_tier"] = "b2b_bulk"
    if req.sms_active is not None:
        updates["sms_active"] = req.sms_active
    if req.weekly_tip_opt_in is not None:
        updates["weekly_tip_opt_in"] = req.weekly_tip_opt_in

    user = update_user(user_id, **updates)
    return {"status": "success", "user": user}


@app.post("/api/demo/reset")
def reset_demo():
    seed_demo_data()
    return {"status": "success", "state": get_full_state(1)}


@app.post("/api/demo/trigger-cron")
def trigger_cron_job(user_id: int = 1):
    result = run_daily_reminder_digest(user_id)
    return {"status": "success", "cron_result": result, "state": get_full_state(user_id)}


@app.post("/webhook/twilio")
async def twilio_webhook(request: Request):
    """
    Twilio SMS Webhook handler for production integration.
    Accepts application/x-www-form-urlencoded data from Twilio.
    """
    form_data = await request.form()
    incoming_msg = form_data.get("Body", "").strip()
    from_phone = form_data.get("From", "")

    req = ChatRequest(message=incoming_msg, user_id=1, mode="live")
    result = process_chat(req)
    reply_text = result["reply"]

    # Format TwiML XML response
    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{reply_text}</Message>
</Response>"""
    return Response(content=twiml, media_type="application/xml")
