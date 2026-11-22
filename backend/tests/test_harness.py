import calendar
from datetime import date, timedelta
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.db.database import get_user, update_user, get_bills, get_trial_alerts, get_latest_telemetry
from backend.db.seed_demo import seed_demo_data, calculate_next_due_date
from backend.agent.tools import roll_date_one_month
from backend.agent.scam_rules import evaluate_scam_message
from backend.agent.ontario_calc import calculate_ontario_paycheque_and_rent
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


def test_a2ui_chat_emits_valid_v1_surface_envelopes():
    """11. Verify chat response contains valid A2UI v1.0 envelopes (createSurface, updateComponents, updateDataModel)."""
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
    assert create_env["version"] == "1.0"
    assert create_env["createSurface"]["catalogId"] == "nyra.ffe.mobile.v1"
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


def test_a2ui_catalog_whitelist_rejects_unregistered_components():
    """12. A2UI Catalog rejects unregistered or hostile component discriminators."""
    from backend.a2ui.catalog import is_whitelisted, ALLOWED_COMPONENT_TYPES

    assert is_whitelisted("Card") is True
    assert is_whitelisted("ScamRiskBanner") is True
    assert is_whitelisted("PaychequeGauge") is True
    assert is_whitelisted("BillStatusRow") is True
    assert is_whitelisted("ImpactStatStrip") is True

    # Hostile / unregistered discriminators must be rejected
    assert is_whitelisted("<script>") is False
    assert is_whitelisted("IframeEmbed") is False
    assert is_whitelisted("ArbitraryScript") is False
    assert is_whitelisted("RawHtml") is False


def test_a2ui_bidirectional_mark_paid_action_updates_db_at_zero_llm_cost():
    """13. Bidirectional A2UI actions update DB deterministically at $0.00 LLM cost."""
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


def test_a2ui_pii_block_emits_security_surface_without_llm_call():
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

    # Verify component tree has security confirmation badge
    update_env = next((e for e in envelopes if "updateComponents" in e), None)
    comps = update_env["updateComponents"]["components"]
    card = next((c for c in comps if c["component"] == "Card"), None)
    assert card is not None
    assert (
        card.get("statusBorder") == "success"
        or card.get("props", {}).get("variant") == "success"
    )
