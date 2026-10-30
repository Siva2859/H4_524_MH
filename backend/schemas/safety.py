from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from .patient import ClinicalContext
from .medication import MedicationInput, ResolvedMedication

CLINICAL_DISCLAIMER_TEXT = (
    "MediGuardAI is a medication safety decision-support prototype. It does not replace a qualified clinician's judgment. "
    "All alerts must be verified by a clinician before any medication changes are made. "
    "The absence of detected alerts does not guarantee that the medication list is safe or complete."
)

class AlertItem(BaseModel):
    id: str
    rule_code: str = Field(alias="ruleCode")
    severity: str  # "Critical", "High", "Moderate", "Low"
    category: str  # "Drug-Drug Interaction", "Duplicate Therapy", "Kidney-Related Dose Concern", "Contraindication Flag", "Uncertain Medication Identity"
    title: str
    involved_medicines: List[str] = Field(alias="involvedMedicines")
    matched_rule: str = Field(alias="matchedRule")
    why_flagged: str = Field(alias="whyFlagged")
    evidence: str
    confidence: str
    limitations: str
    suggested_action: str = Field(alias="suggestedAction")
    source_reference: Optional[str] = Field(None, alias="sourceReference")
    mechanism: Optional[str] = None
    patient_egfr: Optional[float] = Field(None, alias="patientEgfr")
    threshold: Optional[float] = None
    requires_human_confirmation: Optional[bool] = Field(False, alias="requiresHumanConfirmation")
    resolved_generic: Optional[str] = Field(None, alias="resolvedGeneric")
    official_issue_type: Optional[str] = Field(None, alias="officialIssueType")
    official_severity: Optional[str] = Field(None, alias="officialSeverity")
    drugs_involved: Optional[str] = Field(None, alias="drugsInvolved")

    class Config:
        populate_by_name = True

class SafetyReviewRequest(BaseModel):
    clinical_context: ClinicalContext = Field(..., alias="clinicalContext")
    medications: List[MedicationInput] = Field(default_factory=list)
    options: Optional[Dict[str, Any]] = None

    class Config:
        populate_by_name = True

class SafetyReviewResponse(BaseModel):
    evaluated_at: str = Field(alias="evaluatedAt")
    clinical_context: ClinicalContext = Field(alias="clinicalContext")
    medications_count: int = Field(alias="medicationsCount")
    resolved_medications: List[ResolvedMedication] = Field(alias="resolvedMedications")
    alerts: List[AlertItem]
    severity_counts: Dict[str, int] = Field(alias="severityCounts")
    category_counts: Dict[str, int] = Field(alias="categoryCounts")
    has_critical_alerts: bool = Field(alias="hasCriticalAlerts")
    has_high_alerts: bool = Field(alias="hasHighAlerts")
    total_alerts: int = Field(alias="totalAlerts")
    has_no_alerts: bool = Field(alias="hasNoAlerts")
    status_message: str = Field(alias="statusMessage")
    clinical_disclaimer: str = Field(CLINICAL_DISCLAIMER_TEXT, alias="clinicalDisclaimer")

    class Config:
        populate_by_name = True
