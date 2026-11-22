import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = os.getenv("NYRA_DB_PATH", str(BASE_DIR / "db" / "nyra.db"))

# Anthropic Claude Haiku 5.5 Pricing (2026, prompts <= 100K tokens)
MODEL_PRIMARY = os.getenv("ANTHROPIC_MODEL", "claude-haiku-5-5")
MODEL_ESCALATION = "claude-sonnet-5-5"
USD_TO_CAD = float(os.getenv("USD_TO_CAD", "1.38"))

HAIKU_PRICING_PER_MTOK = {
    "input": 0.10,           # $0.10 / 1M input tokens
    "output": 0.50,          # $0.50 / 1M output tokens
    "cache_write_5m": 0.125, # $0.125 / 1M cache write tokens
    "cache_read": 0.01,      # $0.01 / 1M cache hit tokens (90% discount)
}

# Harness Guardrails
MAX_AI_MESSAGES_PER_MONTH = 25   # Hard quota for Coach & Scam Shield; Bill Guard stays unlimited
MAX_OUTPUT_TOKENS = 300          # Enforces SMS-friendly brevity
MODEL_TEMPERATURE = 0.2          # Deterministic JSON tool calling
MAX_TOOL_LOOP_STEPS = 3          # Prevents runaway agent loops
MONTHLY_CONSOLE_SPEND_CAP_USD = 20.00

# 2026 CRA & Ontario Payroll Constants (2026 Tax Year)
TAX_2026 = {
    "fed_bpa": 16452.00,         # 2026 Federal Basic Personal Amount
    "fed_brackets": [
        (58523.00, 0.14),        # 2026 reduced lowest federal rate: 14%
        (117045.00, 0.205),
        (181440.00, 0.26),
        (258482.00, 0.29),
        (float("inf"), 0.33),
    ],
    "on_bpa": 12989.00,          # 2026 Ontario Basic Personal Amount
    "on_brackets": [
        (53891.00, 0.0505),
        (107785.00, 0.0915),
        (150000.00, 0.1116),
        (220000.00, 0.1216),
        (float("inf"), 0.1316),
    ],
    "cpp_rate": 0.0595,          # 2026 CPP employee rate
    "cpp_exemption": 3500.00,
    "cpp_ympe": 74600.00,
    "cpp_max": 4230.45,
    "cpp2_rate": 0.04,
    "cpp2_yampe": 85000.00,
    "cpp2_max": 416.00,
    "ei_rate": 0.0163,           # 2026 EI employee rate (outside Quebec)
    "ei_mie": 68900.00,
    "ei_max": 1123.07,
}

# 4th Agent: Owner Youth Outreach & Safe Dispatcher
OUTREACH_MODE = os.getenv("OUTREACH_MODE", "sandbox")  # "sandbox" | "live"
OUTREACH_ALLOWLIST = [e.strip().lower() for e in os.getenv("OUTREACH_ALLOWLIST", "").split(",") if e.strip()]
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
SMTP_FROM = os.getenv("SMTP_FROM", "outreach@nyra-app.ca")

