import os
import time
from datetime import datetime
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
    get_outreach_leads,
    get_outreach_emails,
    get_outreach_email_by_id,
    update_outreach_email_status,
    get_outreach_summary,
)
from backend.agent.email_sender import dispatch_approved_email
from backend.db.seed_demo import seed_demo_data
from backend.middleware.pii_scrubber import scrub_pii
from backend.middleware.quota_guard import (
    check_casl_or_system_command,
    check_monthly_quota,
)
from backend.agent.router import execute_agent_turn
from backend.agent.tools import execute_mark_bill_paid, execute_add_bill
from backend.scheduler.reminder_cron import run_daily_reminder_digest
from backend.a2ui.compiler import (
    compile_pii_block_surface,
    compile_text_surface,
    compile_digest_surface,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    user = get_user(1)
    if not user:
        seed_demo_data()
    yield


app = FastAPI(
    title="Nyra 2.0 Guardrailed Agent Harness",
    description="Text-First Canadian Bill Guard, Scam Shield & FFE Money Coach (A2UI v1.0 Enabled)",
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


class A2UIActionRequest(BaseModel):
    surfaceId: str
    actionName: Optional[str] = None
    action: Optional[str] = None
    context: Dict[str, Any] = {}
    dataModel: Optional[Dict[str, Any]] = None
    user_id: int = 1


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
        "protocol": "A2UI v1.0",
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
        "outreach_leads": get_outreach_leads("all", limit=20),
        "outreach_emails": get_outreach_emails(limit=20),
        "outreach_summary": get_outreach_summary(),
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

        # Generate A2UI v1.0 security confirmation surface
        a2ui_messages = compile_pii_block_surface(user_id, pii_res["redacted_types"])

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
            "reply_text": reply,
            "skill_used": "pii_block",
            "pii_redacted": True,
            "redacted_types": pii_res["redacted_types"],
            "sanitized_text": sanitized_text,
            "a2ui_mime": "application/a2ui+json",
            "a2ui_messages": a2ui_messages,
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
        a2ui_messages = compile_text_surface(user_id, reply)

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
            "reply_text": reply,
            "skill_used": "casl_zero_token",
            "pii_redacted": False,
            "a2ui_mime": "application/a2ui+json",
            "a2ui_messages": a2ui_messages,
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
        a2ui_messages = compile_text_surface(user_id, reply)

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
            "reply_text": reply,
            "skill_used": "quota_exceeded",
            "pii_redacted": False,
            "a2ui_mime": "application/a2ui+json",
            "a2ui_messages": a2ui_messages,
            "tokens": {"input": 0, "cache_write": 0, "cache_read": 0, "output": 0, "total": 0},
            "cost": {"usd": 0.0, "cad": 0.0},
            "latency_ms": latency_ms,
            "state": get_full_state(user_id),
        }

    # 4. Agent Router (Live Claude Haiku 5.5 or Deterministic Mock)
    agent_res = execute_agent_turn(user_id=user_id, user_message=raw_text, force_mode=mode)
    agent_res["reply_text"] = agent_res.get("reply", "")
    agent_res["a2ui_mime"] = "application/a2ui+json"
    agent_res["state"] = get_full_state(user_id)
    return agent_res


@app.post("/api/a2ui/action")
def process_a2ui_action(req: A2UIActionRequest):
    """
    Bidirectional A2UI user action handler.
    Executes Python tool handlers directly ($0.00 LLM cost) and mutates surface data models.
    """
    start_time = time.time()
    user_id = req.user_id
    action = req.actionName or req.action or "custom_action"
    ctx = req.context or {}
    dm = req.dataModel or {}

    updated_data_model = dict(dm)
    action_note = ""

    if action == "mark_bill_paid":
        b_name = ctx.get("bill_name") or ctx.get("billName") or ctx.get("name") or "Rogers Phone"
        tool_res = execute_mark_bill_paid(user_id, b_name)
        updated_data_model["paid"] = True
        updated_data_model["status"] = "paid"
        if "bill" in updated_data_model and isinstance(updated_data_model["bill"], dict):
            updated_data_model["bill"]["status"] = "paid"
        updated_data_model["streak"] = tool_res.get("streak_months")
        updated_data_model["message"] = tool_res.get("message")
        action_note = f"Marked '{b_name}' as paid ($0.00 LLM cost)"

    elif action == "cancel_trial_alert":
        trial_id = ctx.get("trial_id")
        service_name = ctx.get("service_name", "Trial")
        from backend.db.database import get_db_connection
        if trial_id:
            conn = get_db_connection()
            with conn:
                conn.execute("UPDATE trial_alerts SET status = 'cancelled' WHERE id = ?", (trial_id,))
            conn.close()
        updated_data_model["status"] = "cancelled"
        updated_data_model["cancelled"] = True
        action_note = f"Cancelled alert for '{service_name}'"

    elif action == "snooze_reminder":
        bill_id = ctx.get("bill_id")
        updated_data_model["snoozed"] = True
        action_note = f"Snoozed bill #{bill_id} reminder"

    elif action == "add_rent_as_bill":
        amt = float(ctx.get("amount", 850.0))
        due_day = int(ctx.get("due_day", 1))
        execute_add_bill(user_id=user_id, name="Rent", amount=amt, due_day=due_day, category="rent")
        updated_data_model["rentTracked"] = True
        action_note = f"Added Rent (${amt:.2f}) into Bill Guard"

    elif action == "confirm_scam_blocked":
        updated_data_model["blocked"] = True
        updated_data_model["statusText"] = "Blocked & Reported"
        action_note = "User confirmed scam blocked"

    elif action == "view_ca_antifraud_steps":
        updated_data_model["antifraud_steps"] = (
            "1. File report at antifraudcentre-centreantifraude.ca\n"
            "2. Contact your bank fraud desk if credentials were shared.\n"
            "3. Notify credit bureaus (Equifax / TransUnion)."
        )
        action_note = "Dispatched CAFC anti-fraud steps"

    elif action == "approve_send_outreach_email":
        email_id = int(ctx.get("email_id", 0))
        email_record = get_outreach_email_by_id(email_id) if email_id else None
        if not email_record:
            all_emails = get_outreach_emails(limit=20)
            drafts = [e for e in all_emails if e.get("status") == "drafted"]
            if drafts:
                email_record = drafts[-1]
                email_id = email_record["id"]
        if email_record:
            rec_email = email_record["recipient_email"]
            subj = email_record["subject"]
            body = email_record["body_text"]
            disp_res = dispatch_approved_email(rec_email, subj, body)
            deliv_mode = disp_res.get("delivery_mode", "sandbox_outbox")
            now_iso = datetime.now().isoformat()
            update_outreach_email_status(
                email_id=email_id,
                status="approved_sent",
                delivery_mode=deliv_mode,
                sent_at=now_iso,
            )
            updated_data_model["email"] = updated_data_model.get("email", {})
            updated_data_model["email"]["statusLabel"] = "Sent ✓ (Logged in Outbox · $0.00 AI)"
            updated_data_model["email"]["approved"] = True
            updated_data_model["email"]["sent"] = True
            action_note = f"Approved & sent outreach email #{email_id} to {rec_email} via {deliv_mode}"
        else:
            action_note = f"Email #{email_id} not found"

    elif action == "discard_outreach_email":
        email_id = int(ctx.get("email_id", 0))
        update_outreach_email_status(
            email_id=email_id,
            status="discarded",
            delivery_mode="none",
        )
        updated_data_model["email"] = updated_data_model.get("email", {})
        updated_data_model["email"]["statusLabel"] = "Draft Discarded"
        updated_data_model["email"]["discarded"] = True
        action_note = f"Discarded outreach email draft #{email_id}"

    else:
        updated_data_model["handled"] = True
        action_note = f"Executed generic action: {action}"

    latency_ms = int((time.time() - start_time) * 1000)

    # Log $0.00 telemetry turn
    skill_name = "a2ui_outreach_send" if action == "approve_send_outreach_email" else "a2ui_direct_action"
    add_telemetry(
        user_id=user_id,
        skill_used=skill_name,
        model_used="deterministic-action",
        input_tokens=0,
        cache_write_tokens=0,
        cache_read_tokens=0,
        output_tokens=0,
        est_cost_usd=0.0,
        est_cost_cad=0.0,
        pii_redacted=0,
        tool_calls=[{"name": action, "context": ctx, "note": action_note}],
        latency_ms=latency_ms,
    )

    # Return updated A2UI envelope with in-place data model mutation
    a2ui_messages = [
        {
            "version": "v0.9",
            "updateDataModel": {
                "surfaceId": req.surfaceId,
                "path": "/",
                "value": updated_data_model,
            },
        }
    ]

    return {
        "status": "success",
        "actionName": action,
        "surfaceId": req.surfaceId,
        "a2ui_mime": "application/a2ui+json",
        "a2ui_messages": a2ui_messages,
        "state": get_full_state(user_id),
    }


@app.get("/api/a2ui/catalog")
def get_a2ui_catalog():
    from backend.a2ui.catalog import CATALOG_ID, WHITELISTED_COMPONENTS
    return {
        "catalogId": CATALOG_ID,
        "whitelisted_components": sorted(list(WHITELISTED_COMPONENTS)),
    }


@app.post("/api/settings")
def update_settings(req: SettingsRequest):
    user_id = req.user_id
    updates = {}
    if req.plan_tier is not None:
        updates["plan_tier"] = req.plan_tier
    if req.org_code is not None:
        updates["org_code"] = req.org_code.strip().upper()
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
    a2ui_messages = compile_digest_surface(user_id, result)
    return {
        "status": "success",
        "cron_result": result,
        "a2ui_mime": "application/a2ui+json",
        "a2ui_messages": a2ui_messages,
        "state": get_full_state(user_id),
    }


@app.post("/webhook/twilio")
async def twilio_webhook(request: Request):
    form_data = await request.form()
    incoming_msg = form_data.get("Body", "").strip()

    req = ChatRequest(message=incoming_msg, user_id=1, mode="live")
    result = process_chat(req)
    reply_text = result["reply"]

    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{reply_text}</Message>
</Response>"""
    return Response(content=twiml, media_type="application/xml")
