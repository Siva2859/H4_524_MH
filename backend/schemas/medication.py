from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class MedicationInput(BaseModel):
    name: Optional[str] = None
    generic_name: Optional[str] = Field(None, alias="genericName")
    strength: Optional[str] = ""
    dose: Optional[str] = ""
    route: Optional[str] = "Oral"
    frequency: Optional[str] = "Daily"

    @property
    def raw_name(self) -> str:
        return (self.generic_name or self.name or "").strip()

    class Config:
        populate_by_name = True

class ResolvedMedication(BaseModel):
    original_index: int = Field(alias="originalIndex")
    raw_input: str = Field(alias="rawInput")
    strength: str = ""
    dose: str = ""
    route: str = "Oral"
    frequency: str = "Daily"
    resolved_generic: str = Field(alias="resolvedGeneric")
    canonical_drug: Optional[Dict[str, Any]] = Field(None, alias="canonicalDrug")
    drug_class: str = Field("Unknown Class", alias="drugClass")
    rxnorm_id: str = Field("UNKNOWN", alias="rxNormId")
    confidence: float = 0.0
    match_type: str = Field("Unresolved", alias="matchType")
    requires_confirmation: bool = Field(False, alias="requiresConfirmation")
    reasoning: str = ""
    is_combination: bool = Field(False, alias="isCombination")
    combination_ingredients: List[str] = Field(default_factory=list, alias="combinationIngredients")

    class Config:
        populate_by_name = True

class NormalizationRequest(BaseModel):
    term: str = Field(..., min_length=1, description="Medication or brand name to normalize")
    context: Optional[Dict[str, Any]] = None

class NormalizationBatchRequest(BaseModel):
    terms: List[str] = Field(..., min_items=1)

class NormalizationResponse(BaseModel):
    original_input: str = Field(alias="originalInput")
    resolved_name: Optional[str] = Field(None, alias="resolvedName")
    matching_method: str = Field(alias="matchingMethod")
    confidence: float
    resolution_status: str = Field(alias="resolutionStatus")  # "Resolved", "Ambiguous", "Unresolved"
    requires_confirmation: bool = Field(False, alias="requiresConfirmation")
    drug_class: Optional[str] = Field(None, alias="drugClass")
    rxnorm_id: Optional[str] = Field(None, alias="rxNormId")
    reasoning: str
    canonical_drug: Optional[Dict[str, Any]] = Field(None, alias="canonicalDrug")
    suggested_alternatives: List[Dict[str, Any]] = Field(default_factory=list, alias="suggestedAlternatives")
    is_combination: bool = Field(False, alias="isCombination")
    combination_ingredients: List[str] = Field(default_factory=list, alias="combinationIngredients")

    class Config:
        populate_by_name = True
