from typing import Dict, Any, Optional
from backend.config import TAX_2026


def calculate_ontario_paycheque_and_rent(
    hourly_wage: float,
    hours_per_week: float,
    monthly_rent: Optional[float] = None,
) -> Dict[str, Any]:
    """
    Deterministic 2026 CRA and Ontario payroll deduction & rent affordability calculator.
    Uses official 2026 federal bracket (14% entry) and CPP2 rates.
    """
    annual_gross = round(hourly_wage * hours_per_week * 52, 2)

    # 1. CPP Calculation (Base + CPP2)
    cpp_exempt = TAX_2026["cpp_exemption"]
    cpp_ympe = TAX_2026["cpp_ympe"]
    if annual_gross > cpp_exempt:
        pensionable = min(annual_gross, cpp_ympe) - cpp_exempt
        base_cpp = min(pensionable * TAX_2026["cpp_rate"], TAX_2026["cpp_max"])
    else:
        base_cpp = 0.0

    cpp2 = 0.0
    if annual_gross > cpp_ympe:
        cpp2_earnings = min(annual_gross, TAX_2026["cpp2_yampe"]) - cpp_ympe
        cpp2 = min(cpp2_earnings * TAX_2026["cpp2_rate"], TAX_2026["cpp2_max"])

    total_cpp = round(base_cpp + cpp2, 2)

    # 2. EI Calculation
    ei_insurable = min(annual_gross, TAX_2026["ei_mie"])
    total_ei = round(min(ei_insurable * TAX_2026["ei_rate"], TAX_2026["ei_max"]), 2)

    # 3. Federal Tax Calculation
    prev_limit = 0.0
    fed_tax_gross = 0.0
    for limit, rate in TAX_2026["fed_brackets"]:
        if annual_gross > prev_limit:
            taxable_slice = min(annual_gross - prev_limit, limit - prev_limit)
            fed_tax_gross += taxable_slice * rate
            prev_limit = limit
        else:
            break

    # Federal Non-Refundable Basic Personal Amount credit
    fed_bpa_credit = TAX_2026["fed_bpa"] * 0.14
    total_fed_tax = round(max(0.0, fed_tax_gross - fed_bpa_credit), 2)

    # 4. Ontario Tax Calculation
    prev_limit = 0.0
    on_tax_gross = 0.0
    for limit, rate in TAX_2026["on_brackets"]:
        if annual_gross > prev_limit:
            taxable_slice = min(annual_gross - prev_limit, limit - prev_limit)
            on_tax_gross += taxable_slice * rate
            prev_limit = limit
        else:
            break

    # Ontario Non-Refundable Basic Personal Amount credit
    on_bpa_credit = TAX_2026["on_bpa"] * 0.0505
    total_on_tax = round(max(0.0, on_tax_gross - on_bpa_credit), 2)

    # Summary
    total_deductions = round(total_cpp + total_ei + total_fed_tax + total_on_tax, 2)
    annual_net = round(max(0.0, annual_gross - total_deductions), 2)
    monthly_gross = round(annual_gross / 12, 2)
    monthly_net = round(annual_net / 12, 2)
    biweekly_net = round(annual_net / 26, 2)

    result: Dict[str, Any] = {
        "annual_gross": annual_gross,
        "monthly_gross": monthly_gross,
        "monthly_net": monthly_net,
        "biweekly_net": biweekly_net,
        "deductions_monthly": {
            "cpp": round(total_cpp / 12, 2),
            "ei": round(total_ei / 12, 2),
            "federal_tax": round(total_fed_tax / 12, 2),
            "ontario_tax": round(total_on_tax / 12, 2),
            "total_deductions": round(total_deductions / 12, 2),
        },
        "deductions_annual": {
            "cpp": total_cpp,
            "ei": total_ei,
            "federal_tax": total_fed_tax,
            "ontario_tax": total_on_tax,
            "total_deductions": total_deductions,
        },
        "disclaimer": "Approximate educational estimate only — not official tax or payroll advice.",
    }

    # Rent strain analysis
    if monthly_rent is not None:
        rent_pct = round((monthly_rent / monthly_net) * 100, 1) if monthly_net > 0 else 100.0
        if rent_pct <= 30.0:
            classification = "Healthy (<=30%)"
            advice = f"At {rent_pct}%, this rent is well within the recommended 30% guideline."
        elif rent_pct <= 45.0:
            classification = "Tight (31-45%)"
            advice = (
                f"At {rent_pct}%, this rent exceeds standard guidelines but is common for Ontario urban areas. "
                "Keep utilities and discretionary spending strictly budgeted."
            )
        else:
            classification = "High Strain (>45%)"
            advice = (
                f"Caution: At {rent_pct}%, rent takes over half your take-home pay, leaving very little margin for "
                "groceries, emergency savings, or debt payments. Consider roommates or lower-cost arrangements."
            )

        result["rent_analysis"] = {
            "monthly_rent": monthly_rent,
            "rent_percent_of_net": rent_pct,
            "classification": classification,
            "advice": advice,
        }

    return result
