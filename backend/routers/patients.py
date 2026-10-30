from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from ..services.reference_store import reference_store

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("", response_model=List[Dict[str, Any]])
def list_patients(
    search: Optional[str] = Query(None, description="Search by name, ID, or diagnosis"),
    severity: Optional[str] = Query(None, description="Filter by highest alert severity"),
    mode: Optional[str] = Query("synthetic", description="Patient cohort mode: 'synthetic' or 'official'")
):
    """Retrieves patient cohort records with optional search, severity, and mode filters."""
    if mode == "official" and reference_store.official_patients:
        patients = reference_store.official_patients
    else:
        patients = reference_store.synthetic_patients
    filtered = patients

    if search:
        s = search.lower().strip()
        filtered = [
            p for p in filtered
            if s in p.get("name", "").lower()
            or s in p.get("id", "").lower()
            or any(s in d.lower() for d in p.get("diagnoses", []))
        ]

    if severity and severity != "ALL":
        filtered = [
            p for p in filtered
            if p.get("highestAlertSeverity", "").lower() == severity.lower()
        ]

    return filtered

@router.get("/{patient_id}", response_model=Dict[str, Any])
def get_patient(patient_id: str):
    """Retrieves a single patient profile by patient ID."""
    patient = reference_store.get_patient_by_id(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient with ID '{patient_id}' not found")
    return patient
