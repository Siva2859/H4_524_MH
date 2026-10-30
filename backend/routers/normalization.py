from fastapi import APIRouter, HTTPException, Query
from typing import List
from ..schemas.medication import (
    NormalizationRequest,
    NormalizationBatchRequest,
    NormalizationResponse
)
from ..services.normalization import normalize_medication_name

router = APIRouter(prefix="/medications", tags=["Medication Normalization"])

@router.post("/normalize", response_model=NormalizationResponse)
def normalize_single_medication(payload: NormalizationRequest):
    """
    Normalizes a single medication name against the canonical catalogue.
    Performs case normalization, exact generic, brand alias, and fuzzy Levenshtein matching.
    """
    if not payload.term or not payload.term.strip():
        raise HTTPException(status_code=422, detail="Medication term cannot be empty")
    return normalize_medication_name(payload.term)

@router.get("/normalize", response_model=NormalizationResponse)
def normalize_medication_query(term: str = Query(..., min_length=1)):
    """GET query endpoint for real-time frontend search inputs."""
    return normalize_medication_name(term)

@router.post("/normalize-batch", response_model=List[NormalizationResponse])
def normalize_batch_medications(payload: NormalizationBatchRequest):
    """Batch normalizes an array of medication names."""
    results = [normalize_medication_name(term) for term in payload.terms]
    return results
