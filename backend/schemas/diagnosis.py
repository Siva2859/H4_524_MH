"""
MediGuard AI - Diagnosis Normalization Schemas
Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
The Medication Safety Second Pair of Eyes
Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
"""

from pydantic import BaseModel, Field
from typing import Optional, List

class DiagnosisNormalizationRequest(BaseModel):
    term: str

class DiagnosisNormalizationBatchRequest(BaseModel):
    terms: List[str]

class DiagnosisNormalizationResponse(BaseModel):
    raw_input: str = Field(..., alias="rawInput")
    canonical_name: Optional[str] = Field(None, alias="canonicalName")
    condition_id: Optional[str] = Field(None, alias="conditionId")
    confidence: int
    match_type: str = Field(..., alias="matchType")
    reason: str
    requires_confirmation: bool = Field(..., alias="requiresConfirmation")
    is_canonical: bool = Field(..., alias="isCanonical")
    is_known: bool = Field(..., alias="isKnown")

    class Config:
        populate_by_name = True

