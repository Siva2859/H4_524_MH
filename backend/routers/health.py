from fastapi import APIRouter
from datetime import datetime, timezone
from ..config import settings
from ..services.reference_store import reference_store

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.app_title,
        "version": settings.app_version,
        "official_data_loaded": reference_store.official_data_loaded,
        "catalogue_size": len(reference_store.drug_catalogue),
        "rules_count": (
            len(reference_store.interaction_rules) +
            len(reference_store.duplicate_rules) +
            len(reference_store.renal_rules) +
            len(reference_store.contraindication_rules)
        ),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
