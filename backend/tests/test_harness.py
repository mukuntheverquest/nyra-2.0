import calendar
from datetime import date, timedelta
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.db.database import (
    get_user,
    update_user,
    get_bills,
    get_trial_alerts,
    get_latest_telemetry,
    get_outreach_leads,
    get_outreach_emails,
    get_outreach_email_by_id,
)
from backend.db.seed_demo import seed_demo_data, calculate_next_due_date
from backend.agent.tools import roll_date_one_month
from backend.agent.scam_rules import evaluate_scam_message
from backend.agent.ontario_calc import calculate_ontario_paycheque_and_rent
from backend.agent.email_sender import dispatch_approved_email
from backend.middleware.pii_scrubber import scrub_pii
from backend.middleware.quota_guard import check_monthly_quota, check_casl_or_system_command
from backend.scheduler.reminder_cron import run_daily_reminder_digest

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_db_before_test():
    seed_demo_data()


def test_past_due_date_auto_roll():
    """1. Past-due date auto-rolls to next month and clamps month-end days (28/30/31)."""
    # If today is the 15th, due_day=10 should roll to next month on the 10th
    mock_today = date(2026, 3, 15)
    rolled_due = calculate_next_due_date(10, base_date=mock_today)
    assert rolled_due == "2026-04-10"

    # Clamping day 31 when rolling from Jan 31 into Feb
    jan_31 = "2026-01-31"
    feb_rolled = roll_date_one_month(jan_31)
    assert feb_rolled == "2026-02-28"  # 2026 is non-leap year

    # Clamping day 31 when rolling from May 31 into June
    may_31 = "2026-05-31"
    june_rolled = roll_date_one_month(may_31)
    assert june_rolled == "2026-06-30"


def test_trial_killswitch_48hr_alert():
    """2. Trial kill-switch calculates cancel_by_date and alert_date exactly 48h prior."""
    client = TestClient(app)
    resp = client.post(
        "/api/chat",
        json={
            "message": "Just started an Adobe free trial today for 14 days, remind me 2 days before it charges",
            "user_id": 1,
            "mode": "mock",
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "Adobe" in data["reply"]

    # Verify trial in database
    trials = get_trial_alerts(1)
    adobe_trials = [t for t in trials if "Adobe" in t["service_name"]]
    assert len(adobe_trials) >= 1
    t = adobe_trials[0]

    today = date.today()
    expected_cancel = (today + timedelta(days=14)).isoformat()
    expected_alert = (today + timedelta(days=12)).isoformat()

    assert t["cancel_by_date"] == expected_cancel
    assert t["alert_date"] == expected_alert


def test_credit_card_statement_and_due_dates():
    """3. Storing credit card bills tracks statement closing day distinctly from payment due day."""
    client = TestClient(app)
    resp = client.get("/api/state?user_id=1")
    assert resp.status_code == 200
    state = resp.json()

    bills = state["bills"]
    visa_bills = [b for b in bills if b["name"] == "Student Visa"]
    assert len(visa_bills) == 1
    visa = visa_bills[0]
    assert visa["category"] == "credit_card"
    assert visa["statement_day"] == 10
    assert visa["due_day"] == 28


def test_canadian_scam_shield_high_risk_interac_osap():
    """4. Canadian Scam Shield flags fake Interac OSAP/CRA phishing texts as HIGH RISK with MITRE F3 tags."""
    suspicious_text = (
        "INTERAC: You received $240 from OSAP Refund. "
        "Claim now at bit.ly/osap-refund-ca before it expires in 24 hours!"
    )
    res = evaluate_scam_message(suspicious_text)
    assert res["risk_level"] == "HIGH"
    assert res["score"] >= 60
    assert res["scam_type"] in ["interac", "cra_osap"]
    assert len(res["red_flags"]) == 3
    assert "Monetization" in res["mitre_f3_tactic"] or "Positioning" in res["mitre_f3_tactic"]
    assert any("shortened" in rf.lower() or "bit.ly" in rf.lower() or "link" in rf.lower() for rf in res["red_flags"])


def test_ontario_2026_paycheque_and_rent_math():
    """5. Deterministic 2026 Ontario payroll deductions & rent strain calculations."""
    # Test $18/hr * 20 hrs/week = $18,720 annual gross
    result = calculate_ontario_paycheque_and_rent(hourly_wage=18.0, hours_per_week=20.0, monthly_rent=850.0)
    assert result["annual_gross"] == 18720.00
    assert result["monthly_gross"] == 1560.00

    # Base CPP: (18720 - 3500) * 0.0595 = 905.59
    assert abs(result["deductions_annual"]["cpp"] - 905.59) < 1.0

    # EI: 18720 * 0.0163 = 305.14
    assert abs(result["deductions_annual"]["ei"] - 305.14) < 1.0

    # Low income check: Federal Tax after BPA credit should be $0 or very small
    # Monthly net should be approx $1400-$1450
    assert 1380.00 <= result["monthly_net"] <= 1450.00

    # Rent strain check: $850 / monthly_net > 45% -> High Strain
    assert "rent_analysis" in result
    rent_analysis = result["rent_analysis"]
    assert rent_analysis["rent_percent_of_net"] > 45.0
    assert "High Strain" in rent_analysis["classification"]
    assert "disclaimer" in result


def test_pii_scrubber_blocks_sin_and_card_before_llm():
    """6. PII scrubber sanitizes Canadian SIN and credit card numbers, blocking LLM dispatch."""
    sin_msg = "My SIN is 123-456-789, can you check my CRA tax return?"
    scrub_res = scrub_pii(sin_msg)
    assert scrub_res["pii_detected"] is True
    assert "[REDACTED_SIN]" in scrub_res["sanitized_text"]
    assert "123-456-789" not in scrub_res["sanitized_text"]

    client = TestClient(app)
    resp = client.post("/api/chat", json={"message": sin_msg, "user_id": 1})
    assert resp.status_code == 200
    data = resp.json()
    assert data["pii_redacted"] is True
    assert data["tokens"]["total"] == 0
    assert data["cost"]["usd"] == 0.0
    assert "scrubbed sensitive info" in data["reply"]


def test_non_advisory_stock_picking_refusal():
    """7. Refuses specific stock or crypto recommendations with non-advisory educational disclaimer."""
    client = TestClient(app)
    resp = client.post(
        "/api/chat",
        json={"message": "Which stock should I buy today to double my money?", "user_id": 1, "mode": "mock"},
    )
    assert resp.status_code == 200
    data = resp.json()
    reply = data["reply"]
    assert "can't recommend specific stocks" in reply.lower() or "not licensed" in reply.lower()
    assert "Educational info only — not licensed financial, tax, or legal advice." in reply


def test_quota_cap_26th_message_blocks_coach_allows_bill_guard():
    """8. Hard quota (25 msgs) blocks Money Coach but leaves Bill & Trial Guard active."""
    # Set user to 25 messages used
    update_user(1, ai_msgs_used=25)

    client = TestClient(app)

    # 1. Money Coach query -> BLOCKED
    coach_resp = client.post(
        "/api/chat",
        json={"message": "How does an Ontario TFSA work?", "user_id": 1, "mode": "mock"},
    )
    assert coach_resp.status_code == 200
    coach_data = coach_resp.json()
    assert "You've used all 25 AI Coach/Scam checks for this month!" in coach_data["reply"]
    assert coach_data["tokens"]["total"] == 0

    # 2. Bill Guard query -> ALLOWED
    bill_resp = client.post(
        "/api/chat",
        json={"message": "Add hydro bill $45 due on the 20th", "user_id": 1, "mode": "mock"},
    )
    assert bill_resp.status_code == 200
    bill_data = bill_resp.json()
    assert "Hydro" in bill_data["reply"] or "45" in bill_data["reply"]
    assert bill_data["skill_used"] == "bill_guard"


def test_casl_stop_and_start_zero_tokens():
    """9. Zero-token CASL STOP unsubscribes user and START resumes alerts at $0.00 cost."""
    client = TestClient(app)

    # STOP
    stop_resp = client.post("/api/chat", json={"message": "STOP", "user_id": 1})
    assert stop_resp.status_code == 200
    stop_data = stop_resp.json()
    assert "unsubscribed" in stop_data["reply"]
    assert stop_data["tokens"]["total"] == 0
    assert stop_data["cost"]["usd"] == 0.0

    user_after_stop = get_user(1)
    assert user_after_stop["sms_active"] == 0

    # START
    start_resp = client.post("/api/chat", json={"message": "START", "user_id": 1})
    assert start_resp.status_code == 200
    start_data = start_resp.json()
    assert "Welcome back" in start_data["reply"]
    assert start_data["tokens"]["total"] == 0

    user_after_start = get_user(1)
    assert user_after_start["sms_active"] == 1


def test_sms_digest_batches_multiple_bills_into_one_text():
    """10. 9 AM cron digest batches multiple upcoming bills and PAD warnings into a single SMS."""
    # Ensure bills are in reminder window
    today_iso = date.today().isoformat()
    bills = get_bills(1)
    for b in bills:
        from backend.db.database import update_bill
        update_bill(b["id"], next_due_date=today_iso)

    cron_result = run_daily_reminder_digest(user_id=1)
    assert cron_result["status"] == "sent"
    digest = cron_result["digest"]

    # Verify multiple bills are present in one message
    assert "Rent" in digest
    assert "Rogers Phone" in digest
    assert "Student Visa" in digest
    # Verify PAD warning is consolidated
    assert "PAD" in digest


def test_a2ui_v09_chat_emits_create_update_components_and_data_model():
    """11. Verify chat response contains valid A2UI v0.9 envelopes (createSurface, updateComponents, updateDataModel)."""
    seed_demo_data()
    resp = client.post(
        "/api/chat",
        json={
            "message": "Just started an Adobe free trial today for 14 days, remind me 2 days before it charges",
            "user_id": 1,
            "mode": "mock",
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["a2ui_mime"] == "application/a2ui+json"
    envelopes = data.get("a2ui_messages", [])
    assert len(envelopes) >= 2

    # Verify createSurface
    create_env = next((e for e in envelopes if "createSurface" in e), None)
    assert create_env is not None
    assert create_env["version"] in ["v0.9", "v0.9.1", "1.0"]
    surface_id = create_env["createSurface"]["surfaceId"]

    # Verify updateComponents starts at id: "root"
    update_env = next((e for e in envelopes if "updateComponents" in e), None)
    assert update_env is not None
    comps = update_env["updateComponents"]["components"]
    assert any(c["id"] == "root" for c in comps)
    assert update_env["updateComponents"]["surfaceId"] == surface_id

    # Verify updateDataModel pointer
    data_env = next((e for e in envelopes if "updateDataModel" in e), None)
    assert data_env is not None
    assert data_env["updateDataModel"]["path"] == "/"
    assert data_env["updateDataModel"]["surfaceId"] == surface_id


def test_a2ui_v09_bidirectional_mark_paid_mutates_db_at_zero_llm_cost():
    """12. Bidirectional A2UI actions update DB deterministically at $0.00 LLM cost."""
    seed_demo_data()
    action_resp = client.post(
        "/api/a2ui/action",
        json={
            "surfaceId": "surf_test_bill_1",
            "actionName": "mark_bill_paid",
            "context": {"billName": "Student Visa", "amount": 240.0},
            "dataModel": {"bill": {"status": "scheduled", "name": "Student Visa"}},
            "user_id": 1,
        },
    )
    assert action_resp.status_code == 200
    data = action_resp.json()
    assert data["status"] == "success"
    assert data["a2ui_mime"] == "application/a2ui+json"

    # Verify in-place updateDataModel response
    a2ui_messages = data["a2ui_messages"]
    assert len(a2ui_messages) == 1
    assert "updateDataModel" in a2ui_messages[0]
    updated_val = a2ui_messages[0]["updateDataModel"]["value"]
    assert updated_val["bill"]["status"] == "paid"

    # Verify DB bill state rolled or marked paid
    bills = get_bills(1)
    visa_bill = next((b for b in bills if "Student Visa" in b["name"]), None)
    assert visa_bill is not None
    assert visa_bill["next_due_date"] == "2026-12-28"

    # Verify user streak incremented
    user = get_user(1)
    assert user["streak_months"] == 5

    # Verify telemetry logged at zero cost
    telemetry = get_latest_telemetry(1)
    assert telemetry["skill_used"] == "a2ui_direct_action"
    assert telemetry["est_cost_usd"] == 0.0
    assert telemetry["est_cost_cad"] == 0.0


def test_a2ui_v09_add_rent_as_bill_action_creates_bill_at_zero_llm_cost():
    """13. Bidirectional A2UI action adds tested rent into DB deterministically at $0.00 LLM cost."""
    seed_demo_data()
    action_resp = client.post(
        "/api/a2ui/action",
        json={
            "surfaceId": "surf_test_rent_1",
            "actionName": "add_rent_as_bill",
            "context": {"amount": 850.0, "due_day": 1},
            "dataModel": {"rent": 850.0},
            "user_id": 1,
        },
    )
    assert action_resp.status_code == 200
    data = action_resp.json()
    assert data["status"] == "success"

    # Verify Rent is in bills table
    bills = get_bills(1)
    rent_bills = [b for b in bills if "Rent" in b["name"]]
    assert any(b["amount"] == 850.0 for b in rent_bills)

    # Verify zero cost telemetry
    telemetry = get_latest_telemetry(1)
    assert telemetry["skill_used"] == "a2ui_direct_action"
    assert telemetry["est_cost_usd"] == 0.0


def test_a2ui_v09_pii_block_emits_security_surface_without_llm_call():
    """14. PII detection emits zero-token A2UI security confirmation surface without LLM call."""
    seed_demo_data()
    resp = client.post(
        "/api/chat",
        json={
            "message": "Here is my SIN 123-456-789 for tax check",
            "user_id": 1,
            "mode": "mock",
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["pii_redacted"] is True
    assert data["cost"]["usd"] == 0.0
    assert data["tokens"]["total"] == 0

    # Verify security surface was generated
    envelopes = data.get("a2ui_messages", [])
    assert len(envelopes) >= 2
    create_env = next((e for e in envelopes if "createSurface" in e), None)
    assert create_env is not None
    assert "pii_" in create_env["createSurface"]["surfaceId"]

    # Verify component tree has Card at root
    update_env = next((e for e in envelopes if "updateComponents" in e), None)
    comps = update_env["updateComponents"]["components"]
    card = next((c for c in comps if c["id"] == "root"), None)
    assert card is not None
    assert card["component"] == "Card"


def test_outreach_agent_drafts_casl_compliant_email_without_auto_sending():
    """15. 4th Agent drafts CASL-compliant email without auto-sending (draft status, CASL footer, sent_at is None)."""
    seed_demo_data()
    resp = client.post(
        "/api/chat",
        json={
            "message": "Find our top prospective youth campus lead and draft a personalized CASL-compliant outreach email introducing Nyra 2.0's bill guard and scam shield.",
            "user_id": 1,
            "mode": "mock",
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["skill_used"] == "outreach_agent"

    # Verify drafted emails in database
    drafts = get_outreach_emails(limit=5)
    assert len(drafts) >= 1
    d = drafts[0]
    assert d["status"] == "draft"
    assert d["sent_at"] is None
    assert d["casl_verified"] == 1
    assert "Sent by Financial Futures Education (FFE)" in d["body_text"]
    assert "Opt out anytime" in d["body_text"]

    # Verify A2UI Surface 7 generated with approve button
    envelopes = data.get("a2ui_messages", [])
    assert len(envelopes) >= 2
    update_env = next((e for e in envelopes if "updateComponents" in e), None)
    assert update_env is not None
    comps = update_env["updateComponents"]["components"]
    btn = next((c for c in comps if c["id"] == "approve_btn"), None)
    assert btn is not None
    assert btn["action"]["event"]["name"] == "approve_send_outreach_email"


def test_a2ui_v09_approve_send_outreach_email_dispatches_at_zero_llm_cost():
    """16. Owner 1-tap Approve & Send marks email approved_sent, updates lead to sent, and logs $0.00 LLM cost."""
    seed_demo_data()
    # First, generate a draft
    chat_resp = client.post(
        "/api/chat",
        json={
            "message": "Draft an outreach email to Priya Nair at McMaster Residence Life",
            "user_id": 1,
            "mode": "mock",
        },
    )
    assert chat_resp.status_code == 200
    drafts = get_outreach_emails(limit=1)
    assert len(drafts) == 1
    email_id = drafts[0]["id"]
    lead_id = drafts[0]["lead_id"]

    # Action: Approve & Send
    action_resp = client.post(
        "/api/a2ui/action",
        json={
            "surfaceId": "surf_outreach_test",
            "actionName": "approve_send_outreach_email",
            "context": {"email_id": email_id},
            "dataModel": {"email": {"email_id": email_id}},
            "user_id": 1,
        },
    )
    assert action_resp.status_code == 200
    res_data = action_resp.json()
    assert res_data["status"] == "success"

    # Verify email status updated to approved_sent and sent_at recorded
    email = get_outreach_email_by_id(email_id)
    assert email["status"] == "approved_sent"
    assert email["sent_at"] is not None

    # Verify lead status updated to sent
    leads = get_outreach_leads(limit=10)
    matching_lead = next((l for l in leads if l["id"] == lead_id), None)
    assert matching_lead is not None
    assert matching_lead["status"] == "sent"

    # Verify $0.00 cost telemetry
    telemetry = get_latest_telemetry(1)
    assert telemetry["skill_used"] == "a2ui_outreach_send"
    assert telemetry["est_cost_usd"] == 0.0
    assert telemetry["est_cost_cad"] == 0.0

    # Verify updateDataModel message envelope
    envelopes = res_data.get("a2ui_messages", [])
    update_model = next((e for e in envelopes if "updateDataModel" in e), None)
    assert update_model is not None
    val = update_model["updateDataModel"]["value"]
    assert "Sent ✓" in val["email"]["statusLabel"]


def test_outreach_sandbox_prevents_unapproved_external_smtp_send():
    """17. Default sandbox_outbox mode makes zero external SMTP calls."""
    res = dispatch_approved_email(
        recipient_email="student@mcmaster.ca",
        subject="Test Safe Outreach",
        body_text="Hello, this is a test.",
    )
    assert res["delivered"] is True
    assert res["delivery_mode"] == "sandbox_outbox"
    assert "Sandbox Mode" in res["note"]

