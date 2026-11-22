CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    plan_tier TEXT NOT NULL DEFAULT 'trial', -- 'trial' | 'monthly_5' | 'annual_45' | 'b2b_bulk' | 'cancelled'
    trial_ends_at TEXT,
    org_code TEXT,                           -- e.g., 'MCMASTER-2026', 'FFE-COHORT-04'
    ai_msgs_used INTEGER NOT NULL DEFAULT 0,
    streak_months INTEGER NOT NULL DEFAULT 0,
    late_fees_saved REAL NOT NULL DEFAULT 0.0,
    impact_minutes_funded INTEGER NOT NULL DEFAULT 0,
    weekly_tip_opt_in INTEGER NOT NULL DEFAULT 1,
    sms_active INTEGER NOT NULL DEFAULT 1,   -- 0 if user texted STOP (CASL compliance)
    pipeda_consent_at TEXT,
    referral_code TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL DEFAULT 'utility', -- 'rent' | 'utility' | 'credit_card' | 'subscription' | 'other'
    statement_day INTEGER,                    -- Nullable; used when category = 'credit_card'
    due_day INTEGER NOT NULL,                 -- 1..31
    next_due_date TEXT NOT NULL,              -- ISO YYYY-MM-DD (auto-rolled forward if due_day passed)
    remind_days_before INTEGER NOT NULL DEFAULT 3,
    is_pad INTEGER NOT NULL DEFAULT 0,        -- 1 = Pre-Authorized Debit (triggers low-balance warning)
    status TEXT NOT NULL DEFAULT 'upcoming',  -- 'upcoming' | 'paid'
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trial_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    service_name TEXT NOT NULL,
    start_date TEXT NOT NULL,
    cancel_by_date TEXT NOT NULL,
    alert_date TEXT NOT NULL,                 -- Default: 48 hours before cancel_by_date
    alert_sent INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',    -- 'active' | 'cancelled'
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scam_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    sanitized_snippet TEXT NOT NULL,
    risk_level TEXT NOT NULL,                 -- 'LOW' | 'SUSPICIOUS' | 'HIGH'
    scam_type TEXT NOT NULL,                  -- 'interac' | 'cra_osap' | 'rental' | 'job' | 'delivery' | 'other'
    mitre_f3_tactic TEXT,                     -- e.g., 'Phishing / Brand Impersonation'
    red_flags_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usage_telemetry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    skill_used TEXT NOT NULL,                 -- 'bill_guard' | 'scam_shield' | 'money_coach' | 'casl_zero_token' | 'pii_block'
    model_used TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    cache_write_tokens INTEGER NOT NULL DEFAULT 0,
    cache_read_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    est_cost_usd REAL NOT NULL DEFAULT 0.0,
    est_cost_cad REAL NOT NULL DEFAULT 0.0,
    pii_redacted INTEGER NOT NULL DEFAULT 0,
    tool_calls_json TEXT,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    role TEXT NOT NULL,                       -- 'user' | 'assistant' | 'system_cron'
    content TEXT NOT NULL,
    skill_tag TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outreach_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    organization TEXT NOT NULL,
    segment TEXT NOT NULL,                   -- 'youth_waitlist' | 'campus_union' | 'residence_life' | 'workshop_alumni'
    casl_consent_type TEXT NOT NULL,         -- 'express_opt_in' | 'implied_b2b_inquiry'
    youth_reach_est INTEGER NOT NULL DEFAULT 1, -- 1 for individual youth, 100-1200+ for campus partners
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new',      -- 'new' | 'drafted' | 'sent' | 'replied'
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outreach_emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER REFERENCES outreach_leads(id),
    recipient_name TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    segment TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_text TEXT NOT NULL,
    casl_verified INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'draft',    -- 'draft' | 'approved_sent' | 'discarded'
    delivery_mode TEXT NOT NULL DEFAULT 'sandbox_outbox', -- 'sandbox_outbox' | 'smtp_live'
    sent_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
