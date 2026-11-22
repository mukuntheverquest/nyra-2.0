import sqlite3
import json
from pathlib import Path
from typing import Any, Dict, List, Optional
from datetime import datetime
from backend.config import DB_PATH

SCHEMA_PATH = Path(__file__).resolve().parent / "schema.sql"


def get_db_connection(db_path: Optional[str] = None) -> sqlite3.Connection:
    target_path = db_path or DB_PATH
    Path(target_path).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(target_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_db(db_path: Optional[str] = None) -> None:
    conn = get_db_connection(db_path)
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    with conn:
        conn.executescript(schema_sql)
    conn.close()


def get_user(user_id: int = 1, db_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def update_user(user_id: int, db_path: Optional[str] = None, **kwargs) -> Optional[Dict[str, Any]]:
    if not kwargs:
        return get_user(user_id, db_path)
    fields = [f"{k} = ?" for k in kwargs.keys()]
    values = list(kwargs.values()) + [user_id]
    query = f"UPDATE users SET {', '.join(fields)} WHERE id = ?"
    conn = get_db_connection(db_path)
    with conn:
        conn.execute(query, values)
    conn.close()
    return get_user(user_id, db_path)


def increment_ai_quota(user_id: int = 1, count: int = 1, db_path: Optional[str] = None) -> int:
    conn = get_db_connection(db_path)
    with conn:
        conn.execute("UPDATE users SET ai_msgs_used = ai_msgs_used + ? WHERE id = ?", (count, user_id))
    user = get_user(user_id, db_path)
    return user["ai_msgs_used"] if user else 0


def get_bills(user_id: int = 1, db_path: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.execute("SELECT * FROM bills WHERE user_id = ? ORDER BY next_due_date ASC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def add_bill(
    user_id: int,
    name: str,
    amount: float,
    due_day: int,
    category: str = "utility",
    remind_days_before: int = 3,
    is_pad: int = 0,
    statement_day: Optional[int] = None,
    next_due_date: str = "",
    status: str = "upcoming",
    db_path: Optional[str] = None,
) -> int:
    conn = get_db_connection(db_path)
    with conn:
        cursor = conn.execute(
            """
            INSERT INTO bills (user_id, name, amount, category, statement_day, due_day, next_due_date, remind_days_before, is_pad, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (user_id, name, amount, category, statement_day, due_day, next_due_date, remind_days_before, is_pad, status),
        )
        bill_id = cursor.lastrowid
    conn.close()
    return bill_id


def find_bill_by_name(user_id: int, bill_name: str, db_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    bills = get_bills(user_id, db_path)
    clean_target = bill_name.lower().strip()
    # 1. Exact match
    for b in bills:
        if b["name"].lower().strip() == clean_target:
            return b
    # 2. Substring match
    for b in bills:
        name_lower = b["name"].lower()
        if clean_target in name_lower or name_lower in clean_target:
            return b
    return None


def update_bill(bill_id: int, db_path: Optional[str] = None, **kwargs) -> None:
    if not kwargs:
        return
    fields = [f"{k} = ?" for k in kwargs.keys()]
    values = list(kwargs.values()) + [bill_id]
    query = f"UPDATE bills SET {', '.join(fields)} WHERE id = ?"
    conn = get_db_connection(db_path)
    with conn:
        conn.execute(query, values)
    conn.close()


def delete_bill(bill_id: int, db_path: Optional[str] = None) -> None:
    conn = get_db_connection(db_path)
    with conn:
        conn.execute("DELETE FROM bills WHERE id = ?", (bill_id,))
    conn.close()


def get_trial_alerts(user_id: int = 1, db_path: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.execute("SELECT * FROM trial_alerts WHERE user_id = ? ORDER BY cancel_by_date ASC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def add_trial_alert(
    user_id: int,
    service_name: str,
    start_date: str,
    cancel_by_date: str,
    alert_date: str,
    status: str = "active",
    db_path: Optional[str] = None,
) -> int:
    conn = get_db_connection(db_path)
    with conn:
        cursor = conn.execute(
            """
            INSERT INTO trial_alerts (user_id, service_name, start_date, cancel_by_date, alert_date, status)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (user_id, service_name, start_date, cancel_by_date, alert_date, status),
        )
        trial_id = cursor.lastrowid
    conn.close()
    return trial_id


def add_scam_log(
    user_id: int,
    sanitized_snippet: str,
    risk_level: str,
    scam_type: str,
    mitre_f3_tactic: str,
    red_flags: List[str],
    db_path: Optional[str] = None,
) -> int:
    conn = get_db_connection(db_path)
    with conn:
        cursor = conn.execute(
            """
            INSERT INTO scam_logs (user_id, sanitized_snippet, risk_level, scam_type, mitre_f3_tactic, red_flags_json)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (user_id, sanitized_snippet, risk_level, scam_type, mitre_f3_tactic, json.dumps(red_flags)),
        )
        log_id = cursor.lastrowid
    conn.close()
    return log_id


def get_scam_logs(user_id: int = 1, db_path: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.execute("SELECT * FROM scam_logs WHERE user_id = ? ORDER BY id DESC LIMIT 10", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    results = []
    for r in rows:
        d = dict(r)
        d["red_flags"] = json.loads(d["red_flags_json"]) if d.get("red_flags_json") else []
        results.append(d)
    return results


def add_telemetry(
    user_id: int,
    skill_used: str,
    model_used: str,
    input_tokens: int = 0,
    cache_write_tokens: int = 0,
    cache_read_tokens: int = 0,
    output_tokens: int = 0,
    est_cost_usd: float = 0.0,
    est_cost_cad: float = 0.0,
    pii_redacted: int = 0,
    tool_calls: Optional[List[Dict[str, Any]]] = None,
    latency_ms: int = 0,
    db_path: Optional[str] = None,
) -> int:
    conn = get_db_connection(db_path)
    with conn:
        cursor = conn.execute(
            """
            INSERT INTO usage_telemetry (
                user_id, skill_used, model_used, input_tokens, cache_write_tokens,
                cache_read_tokens, output_tokens, est_cost_usd, est_cost_cad,
                pii_redacted, tool_calls_json, latency_ms
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                skill_used,
                model_used,
                input_tokens,
                cache_write_tokens,
                cache_read_tokens,
                output_tokens,
                est_cost_usd,
                est_cost_cad,
                pii_redacted,
                json.dumps(tool_calls or []),
                latency_ms,
            ),
        )
        telemetry_id = cursor.lastrowid
    conn.close()
    return telemetry_id


def get_latest_telemetry(user_id: int = 1, db_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.execute("SELECT * FROM usage_telemetry WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d["tool_calls"] = json.loads(d["tool_calls_json"]) if d.get("tool_calls_json") else []
    return d


def get_telemetry_logs(user_id: int = 1, limit: int = 15, db_path: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.execute("SELECT * FROM usage_telemetry WHERE user_id = ? ORDER BY id DESC LIMIT ?", (user_id, limit))
    rows = cursor.fetchall()
    conn.close()
    res = []
    for r in rows:
        d = dict(r)
        d["tool_calls"] = json.loads(d["tool_calls_json"]) if d.get("tool_calls_json") else []
        res.append(d)
    return res


def add_message(
    user_id: int,
    role: str,
    content: str,
    skill_tag: Optional[str] = None,
    db_path: Optional[str] = None,
) -> int:
    conn = get_db_connection(db_path)
    with conn:
        cursor = conn.execute(
            "INSERT INTO messages (user_id, role, content, skill_tag) VALUES (?, ?, ?, ?)",
            (user_id, role, content, skill_tag),
        )
        msg_id = cursor.lastrowid
    conn.close()
    return msg_id


def get_messages(user_id: int = 1, limit: int = 50, db_path: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.execute("SELECT * FROM messages WHERE user_id = ? ORDER BY id ASC LIMIT ?", (user_id, limit))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ==============================================================================
# Phase 1: 4th Agent (Owner Outreach) Database CRUD Helpers
# ==============================================================================

def get_outreach_leads(
    segment: str = "all",
    status: Optional[str] = None,
    limit: int = 10,
    db_path: Optional[str] = None,
) -> List[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    query = "SELECT * FROM outreach_leads WHERE 1=1"
    params: List[Any] = []
    if segment and segment != "all":
        query += " AND segment = ?"
        params.append(segment)
    if status:
        query += " AND status = ?"
        params.append(status)
    query += " ORDER BY youth_reach_est DESC, id ASC LIMIT ?"
    params.append(limit)
    cursor = conn.execute(query, tuple(params))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_outreach_lead_by_id(lead_id: int, db_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.execute("SELECT * FROM outreach_leads WHERE id = ?", (lead_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def get_outreach_lead_by_email(email: str, db_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.execute("SELECT * FROM outreach_leads WHERE LOWER(email) = LOWER(?)", (email.strip(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def create_outreach_email_draft(
    recipient_name: str,
    recipient_email: str,
    segment: str,
    subject: str,
    body_text: str,
    casl_verified: int = 1,
    lead_id: Optional[int] = None,
    delivery_mode: str = "sandbox_outbox",
    db_path: Optional[str] = None,
) -> int:
    conn = get_db_connection(db_path)
    with conn:
        cursor = conn.execute(
            """
            INSERT INTO outreach_emails (
                lead_id, recipient_name, recipient_email, segment,
                subject, body_text, casl_verified, status, delivery_mode
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?)
            """,
            (
                lead_id,
                recipient_name,
                recipient_email,
                segment,
                subject,
                body_text,
                casl_verified,
                delivery_mode,
            ),
        )
        email_id = cursor.lastrowid
        if lead_id:
            conn.execute("UPDATE outreach_leads SET status = 'drafted' WHERE id = ?", (lead_id,))
    conn.close()
    return email_id


def get_outreach_emails(limit: int = 20, db_path: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.execute("SELECT * FROM outreach_emails ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_outreach_email_by_id(email_id: int, db_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.execute("SELECT * FROM outreach_emails WHERE id = ?", (email_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def update_outreach_email_status(
    email_id: int,
    status: str,
    delivery_mode: str,
    sent_at: Optional[str] = None,
    db_path: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    with conn:
        cursor = conn.execute("SELECT lead_id FROM outreach_emails WHERE id = ?", (email_id,))
        row = cursor.fetchone()
        lead_id = row["lead_id"] if row else None

        conn.execute(
            """
            UPDATE outreach_emails
            SET status = ?, delivery_mode = ?, sent_at = ?
            WHERE id = ?
            """,
            (status, delivery_mode, sent_at, email_id),
        )
        if status == "approved_sent" and lead_id:
            conn.execute("UPDATE outreach_leads SET status = 'sent' WHERE id = ?", (lead_id,))
    conn.close()
    return get_outreach_email_by_id(email_id, db_path)


def get_outreach_summary(db_path: Optional[str] = None) -> Dict[str, Any]:
    from backend.config import OUTREACH_MODE
    conn = get_db_connection(db_path)
    cursor = conn.execute("SELECT COUNT(*) as cnt FROM outreach_leads")
    total_leads = cursor.fetchone()["cnt"]

    cursor = conn.execute("SELECT COUNT(*) as cnt FROM outreach_emails WHERE status = 'draft'")
    drafts_pending = cursor.fetchone()["cnt"]

    cursor = conn.execute("SELECT COUNT(*) as cnt FROM outreach_emails WHERE status = 'approved_sent'")
    emails_sent = cursor.fetchone()["cnt"]

    # Calculate estimated youth reached: sum of youth_reach_est for leads with status='sent'
    cursor = conn.execute(
        "SELECT COALESCE(SUM(youth_reach_est), 0) as total_reach FROM outreach_leads WHERE status = 'sent'"
    )
    est_youth_reached = cursor.fetchone()["total_reach"]

    conn.close()
    return {
        "total_leads": total_leads,
        "drafts_pending": drafts_pending,
        "emails_sent": emails_sent,
        "est_youth_reached": est_youth_reached,
        "outreach_mode": OUTREACH_MODE,
    }

