import pytest
from backend.services.safety_engine import run_safety_review_engine
from backend.schemas.patient import ClinicalContext
from backend.schemas.medication import MedicationInput

def test_warfarin_aspirin_interaction():
    ctx = ClinicalContext(age=72, egfr=52, diagnoses=["Atrial Fibrillation"])
    meds = [
        MedicationInput(genericName="Warfarin"),
        MedicationInput(genericName="Aspirin")
    ]
    res = run_safety_review_engine(ctx, meds)
    assert res.has_high_alerts is True or res.has_critical_alerts is True
    assert any(a.category == "Drug-Drug Interaction" for a in res.alerts)
    ddi_alert = next(a for a in res.alerts if a.category == "Drug-Drug Interaction")
    assert ddi_alert.official_issue_type == "interaction"
    assert "bleeding" in ddi_alert.why_flagged.lower() or "bleeding" in ddi_alert.suggested_action.lower()

def test_safe_non_interacting_regimen():
    ctx = ClinicalContext(age=41, egfr=98, diagnoses=["Headache"])
    meds = [
        MedicationInput(genericName="Amoxicillin"),
        MedicationInput(genericName="Paracetamol")
    ]
    res = run_safety_review_engine(ctx, meds)
    assert res.has_no_alerts is True
    assert res.total_alerts == 0
    assert "no medication safety risks detected" in res.status_message.lower()

def test_duplicate_sulfonylurea_therapy():
    ctx = ClinicalContext(age=64, egfr=60, diagnoses=["Type 2 Diabetes"])
    meds = [
        MedicationInput(genericName="Gliclazide"),
        MedicationInput(genericName="Glimepiride")
    ]
    res = run_safety_review_engine(ctx, meds)
    assert any(a.category == "Duplicate Therapy" for a in res.alerts)
    dup = next(a for a in res.alerts if a.category == "Duplicate Therapy")
    assert dup.official_issue_type == "duplicate_therapy"
    assert dup.severity in {"Critical", "High"}

def test_exact_ingredient_duplicate():
    ctx = ClinicalContext(age=50, egfr=80)
    meds = [
        MedicationInput(name="Metformin 500mg"),
        MedicationInput(name="Glucophage 500mg")
    ]
    res = run_safety_review_engine(ctx, meds)
    assert any(a.category == "Duplicate Therapy" for a in res.alerts)
    dup = next(a for a in res.alerts if a.category == "Duplicate Therapy")
    assert "metformin" in dup.drugs_involved.lower()

def test_renal_dose_metformin():
    ctx = ClinicalContext(age=69, egfr=28)  # eGFR < 30 mL/min
    meds = [MedicationInput(genericName="Metformin")]
    res = run_safety_review_engine(ctx, meds)
    assert any(a.category == "Kidney-Related Dose Concern" for a in res.alerts)
    renal_alert = next(a for a in res.alerts if a.category == "Kidney-Related Dose Concern")
    assert renal_alert.official_issue_type == "renal_dose"
    assert renal_alert.threshold == 30.0

def test_missing_egfr_handling():
    ctx = ClinicalContext(age=65, egfr=None)  # Missing eGFR
    meds = [MedicationInput(genericName="Metformin")]
    res = run_safety_review_engine(ctx, meds)
    # Missing eGFR must not automatically be treated as a confirmed renal violation
    assert not any(a.category == "Kidney-Related Dose Concern" for a in res.alerts)

def test_pregnancy_contraindication():
    ctx = ClinicalContext(age=28, sex="Female", pregnancyStatus="Confirmed")
    meds = [MedicationInput(genericName="Atorvastatin")]
    res = run_safety_review_engine(ctx, meds)
    assert any(a.category == "Contraindication Flag" for a in res.alerts)
    preg_alert = next(a for a in res.alerts if a.category == "Contraindication Flag")
    assert preg_alert.severity == "Critical"
    assert preg_alert.official_severity == "contraindicated"

def test_alert_severity_ordering():
    ctx = ClinicalContext(age=70, egfr=25, diagnoses=["Asthma"])
    meds = [
        MedicationInput(genericName="Warfarin"),
        MedicationInput(genericName="Aspirin"),
        MedicationInput(genericName="Metformin")
    ]
    res = run_safety_review_engine(ctx, meds)
    assert len(res.alerts) > 1
    # Verify strict descending order: Critical -> High -> Moderate -> Low
    sev_values = [{"Critical": 4, "High": 3, "Moderate": 2, "Low": 1}[a.severity] for a in res.alerts]
    assert sev_values == sorted(sev_values, reverse=True)
