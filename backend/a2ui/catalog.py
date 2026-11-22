from typing import Dict, Any, Set

CATALOG_ID = "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json"
LEGACY_CATALOG_ID = "nyra.ffe.mobile.v1"

# Standard A2UI v0.9 basicCatalog components + domain extensions
WHITELISTED_COMPONENTS: Set[str] = {
    # Standard basicCatalog Primitives
    "Card",
    "Column",
    "Row",
    "Text",
    "Button",
    "Divider",
    "List",
    "Tabs",
    "Modal",
    "TextField",
    "CheckBox",
    "ChoicePicker",
    "Slider",
    "DateTimeInput",
    "Icon",
    "Image",
    # Domain / Legacy extensions
    "Badge",
    "ProgressBar",
    "ScamRiskBanner",
    "PaychequeGauge",
    "BillStatusRow",
    "ImpactStatStrip",
}

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
