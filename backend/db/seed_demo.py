import calendar
from datetime import date, datetime, timedelta
from typing import Optional
from backend.db.database import get_db_connection, init_db


def calculate_next_due_date(due_day: int, base_date: Optional[date] = None) -> str:
    today = base_date or date.today()
    year = today.year
    month = today.month

    # Check if due_day is still upcoming this month
    max_days_current_month = calendar.monthrange(year, month)[1]
    clamped_day_current = min(due_day, max_days_current_month)

    if clamped_day_current >= today.day:
        target_year = year
        target_month = month
        target_day = clamped_day_current
    else:
        # Roll to next month
        if month == 12:
            target_year = year + 1
            target_month = 1
        else:
            target_year = year
            target_month = month + 1
        max_days_next_month = calendar.monthrange(target_year, target_month)[1]
        target_day = min(due_day, max_days_next_month)

    return date(target_year, target_month, target_day).isoformat()


def seed_demo_data(db_path: Optional[str] = None) -> None:
    init_db(db_path)
    conn = get_db_connection(db_path)

    with conn:
        # Clear existing data for clean idempotent reseeding
        conn.execute("DELETE FROM messages")
        conn.execute("DELETE FROM usage_telemetry")
        conn.execute("DELETE FROM scam_logs")
        conn.execute("DELETE FROM trial_alerts")
        conn.execute("DELETE FROM bills")
        conn.execute("DELETE FROM users")

        # 1. Seed Alex Rivera
        conn.execute(
            """
            INSERT INTO users (
                id, name, phone, plan_tier, trial_ends_at, org_code,
                ai_msgs_used, streak_months, late_fees_saved, impact_minutes_funded,
                weekly_tip_opt_in, sms_active, pipeda_consent_at, referral_code
            ) VALUES (
                1, 'Alex Rivera', '+19055550199', 'annual_45', NULL, 'MCMASTER-BETA',
                2, 4, 105.00, 60,
                1, 1, '2026-09-01T10:00:00Z', 'NYRA-ALEX26'
            )
            """
        )

        # 2. Seed 3 Bills with dynamic next_due_date calculation
        rent_due = calculate_next_due_date(1)
        rogers_due = calculate_next_due_date(18)
        visa_due = calculate_next_due_date(28)

        conn.execute(
            """
            INSERT INTO bills (user_id, name, amount, category, statement_day, due_day, next_due_date, remind_days_before, is_pad, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (1, "Rent", 950.00, "rent", None, 1, rent_due, 5, 0, "upcoming"),
        )
        conn.execute(
            """
            INSERT INTO bills (user_id, name, amount, category, statement_day, due_day, next_due_date, remind_days_before, is_pad, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (1, "Rogers Phone", 55.00, "utility", None, 18, rogers_due, 3, 1, "upcoming"),
        )
        conn.execute(
            """
            INSERT INTO bills (user_id, name, amount, category, statement_day, due_day, next_due_date, remind_days_before, is_pad, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (1, "Student Visa", 240.00, "credit_card", 10, 28, visa_due, 3, 0, "upcoming"),
        )

        # 3. Seed Welcome Message
        conn.execute(
            """
            INSERT INTO messages (user_id, role, content, skill_tag)
            VALUES (?, ?, ?, ?)
            """,
            (
                1,
                "assistant",
                "Hey Alex! I'm Nyra 2.0 — your text-first Canadian bill guard, scam shield, and money buddy. Text me a bill, forward a sketchy message, or ask any money question. Zero bank logins needed.",
                "welcome",
            ),
        )

        # 4. Seed baseline telemetry
        conn.execute(
            """
            INSERT INTO usage_telemetry (
                user_id, skill_used, model_used, input_tokens, cache_write_tokens,
                cache_read_tokens, output_tokens, est_cost_usd, est_cost_cad,
                pii_redacted, tool_calls_json, latency_ms
            ) VALUES (
                1, 'system_welcome', 'claude-haiku-5-5', 280, 0, 0, 65, 0.00006, 0.00008, 0, '[]', 120
            )
            """
        )

    conn.close()
    print("Demo data seeded successfully for Alex Rivera (user_id=1).")


if __name__ == "__main__":
    seed_demo_data()
