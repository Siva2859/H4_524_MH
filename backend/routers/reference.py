from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any, Optional
from ..services.reference_store import reference_store

router = APIRouter(prefix="/reference", tags=["Reference Data"])

@router.get("/drugs", response_model=List[Dict[str, Any]])
def get_drugs(search: Optional[str] = None):
    """Retrieves the active drug reference formulary."""
    drugs = reference_store.drug_catalogue
    if search:
        s = search.lower().strip()
        drugs = [
            d for d in drugs
            if s in d.get("genericName", "").lower()
            or s in d.get("drugClass", "").lower()
            or any(s in a.lower() for a in d.get("brandAliases", []))
        ]
    return drugs

@router.get("/interactions", response_model=List[Dict[str, Any]])
def get_interactions(severity: Optional[str] = None):
    """Retrieves curated drug-drug interaction rules."""
    rules = reference_store.interaction_rules
    if severity and severity != "ALL":
        rules = [r for r in rules if r.get("severity", "").lower() == severity.lower()]
    return rules

@router.get("/rules")
def get_all_rules_summary():
    """Retrieves an inventory of all active decision-support clinical rule sets."""
    return {
        "interactionRulesCount": len(reference_store.interaction_rules),
        "duplicateRulesCount": len(reference_store.duplicate_rules),
        "renalRulesCount": len(reference_store.renal_rules),
        "contraindicationRulesCount": len(reference_store.contraindication_rules),
        "totalRules": (
            len(reference_store.interaction_rules) +
            len(reference_store.duplicate_rules) +
            len(reference_store.renal_rules) +
            len(reference_store.contraindication_rules)
        ),
        "officialDataLoaded": reference_store.official_data_loaded
    }

@router.get("/demo-cases", response_model=List[Dict[str, Any]])
def get_demo_cases():
    """Retrieves deterministic hackathon demonstration scenarios."""
    return reference_store.demo_cases
