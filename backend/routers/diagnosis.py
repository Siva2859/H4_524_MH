"""
MediGuard AI - Diagnosis Normalization Router
Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
The Medication Safety Second Pair of Eyes
Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List
from ..schemas.diagnosis import (
    DiagnosisNormalizationRequest,
    DiagnosisNormalizationBatchRequest,
    DiagnosisNormalizationResponse
)
from ..services.diagnosis_matcher import (
    resolve_single_diagnosis,
    resolve_multiple_diagnoses
)

router = APIRouter(prefix="/diagnoses", tags=["Diagnosis Normalization"])

@router.post("/normalize", response_model=DiagnosisNormalizationResponse)
def normalize_single_diagnosis_endpoint(payload: DiagnosisNormalizationRequest):
    """
    Normalizes a single clinical diagnosis name against official H4 condition reference.
    Executes sequence: exact -> case-insensitive -> punctuation -> synonym/alias -> fuzzy -> unresolved.
    """
    if not payload.term or not payload.term.strip():
        raise HTTPException(status_code=422, detail="Diagnosis term cannot be empty")
    return resolve_single_diagnosis(payload.term)

@router.get("/normalize", response_model=DiagnosisNormalizationResponse)
def normalize_diagnosis_query_endpoint(term: str = Query(..., min_length=1)):
    """GET query endpoint for real-time frontend diagnosis search inputs."""
    return resolve_single_diagnosis(term)

@router.post("/normalize-batch", response_model=List[DiagnosisNormalizationResponse])
def normalize_batch_diagnoses_endpoint(payload: DiagnosisNormalizationBatchRequest):
    """Batch normalizes an array of diagnosis names."""
    return resolve_multiple_diagnoses(payload.terms)

