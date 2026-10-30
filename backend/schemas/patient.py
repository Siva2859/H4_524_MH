from pydantic import BaseModel, Field
from typing import Optional, List

class ClinicalContext(BaseModel):
    patient_id: Optional[str] = Field(None, alias="patientId")
    patient_name: Optional[str] = Field(None, alias="patientName")
    age: Optional[float] = None
    sex: Optional[str] = None
    weight: Optional[float] = None
    egfr: Optional[float] = Field(None, alias="eGfr")
    pregnancy_status: Optional[str] = Field("Not Applicable", alias="pregnancyStatus")
    diagnoses: List[str] = Field(default_factory=list)
    known_allergies: List[str] = Field(default_factory=list, alias="knownAllergies")
    allergies: List[str] = Field(default_factory=list)

    @property
    def is_pregnant(self) -> bool:
        return str(self.pregnancy_status or "").strip().lower() in {"confirmed", "positive", "pregnant", "y", "yes"}

    class Config:
        populate_by_name = True

class PatientProfile(BaseModel):
    id: str
    name: str
    age: int
    sex: str
    weight_kg: float = Field(alias="weightKg")
    egfr: Optional[float] = Field(None, alias="eGfr")
    creatinine_mg_dl: Optional[float] = Field(None, alias="creatinineMgDl")
    pregnancy_status: str = Field("Not Applicable", alias="pregnancyStatus")
    diagnoses: List[str] = Field(default_factory=list)
    known_allergies: List[str] = Field(default_factory=list, alias="knownAllergies")
    current_medications: List[dict] = Field(default_factory=list, alias="currentMedications")
    highest_alert_severity: str = Field("None", alias="highestAlertSeverity")
    review_status: str = Field("Pending Review", alias="reviewStatus")
    last_reviewed_at: Optional[str] = Field(None, alias="lastReviewedAt")

    class Config:
        populate_by_name = True
