from typing import Dict, Any, Set

CATALOG_ID = "nyra.ffe.mobile.v1"

# Standard A2UI Primitives + Nyra Custom Financial Widgets
WHITELISTED_COMPONENTS: Set[str] = {
    # Standard Primitives
    "Card",
    "Column",
    "Row",
    "Text",
    "Badge",
    "Divider",
    "List",
    "Button",
    "ProgressBar",
    # Nyra Custom Domain Widgets
    "ScamRiskBanner",
    "PaychequeGauge",
    "BillStatusRow",
    "ImpactStatStrip",
}

# Alias for spec test compatibility
ALLOWED_COMPONENT_TYPES = WHITELISTED_COMPONENTS


def is_component_valid(component_type: str) -> bool:
    return component_type in WHITELISTED_COMPONENTS


is_whitelisted = is_component_valid


def validate_components_list(components: list[Dict[str, Any]]) -> bool:
    """Verifies that all components in the adjacency list belong to the whitelisted catalog."""
    for c in components:
        comp_type = c.get("component")
        if not comp_type or comp_type not in WHITELISTED_COMPONENTS:
            return False
    return True
