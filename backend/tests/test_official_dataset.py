import pytest
from pathlib import Path
import pandas as pd
from backend.services.normalization import normalize_medication_name
from backend.services.safety_engine import run_safety_review_engine
from backend.schemas.patient import ClinicalContext
from backend.schemas.medication import MedicationInput
from backend.services.reference_store import reference_store
from backend.config import settings

def test_official_dataset_loaded():
    assert reference_store.official_data_loaded is True
    assert len(reference_store.drug_catalogue) >= 490
    assert len(reference_store.combination_brands) >= 90
    assert len(reference_store.interaction_rules) >= 2000
    assert len(reference_store.renal_rules) >= 160
    assert len(reference_store.duplicate_rules) >= 70
    assert len(reference_store.contraindication_rules) >= 150

def test_exact_generic_resolution():
    res = normalize_medication_name("metformin")
    assert res.resolution_status == "Resolved"
    assert res.resolved_name == "metformin"
    assert res.confidence == 100.0

def test_exact_brand_resolution():
    res = normalize_medication_name("Glyciphage")
    assert res.resolution_status == "Resolved"
    assert res.resolved_name == "metformin"
    assert res.confidence == 100.0

def test_combination_brand_expansion():
    res = normalize_medication_name("Glycomet-GP 1")
    assert res.resolution_status == "Resolved"
    assert res.is_combination is True
    assert set(res.combination_ingredients) == {"glimepiride", "metformin"}
    assert res.resolved_name == "glimepiride;metformin"

def test_supported_misspelling_resolution():
    res = normalize_medication_name("aspyrin")
    assert res.resolution_status == "Resolved"
    assert res.resolved_name == "aspirin"
    assert res.confidence >= 80.0

def test_non_drug_entry():
    res = normalize_medication_name("Physiotherapy")
    assert res.resolution_status == "Unresolved"
    assert res.resolved_name == ""
    assert res.matching_method == "Non-Drug Clinical Entry"

def test_drug_interaction_pair():
    ctx = ClinicalContext(age=60, egfr=80)
    meds = [
        MedicationInput(name="acenocoumarol"),
        MedicationInput(name="aceclofenac")
    ]
    res = run_safety_review_engine(ctx, meds)
    assert any(a.category == "Drug-Drug Interaction" for a in res.alerts)
    alert = next(a for a in res.alerts if a.category == "Drug-Drug Interaction")
    assert alert.official_severity == "major"
    assert "aceclofenac;acenocoumarol" in alert.drugs_involved or "acenocoumarol;aceclofenac" in alert.drugs_involved

def test_duplicate_therapy_single_drug():
    ctx = ClinicalContext(age=55, egfr=70)
    meds = [
        MedicationInput(name="Dolo 650"),
        MedicationInput(name="Combiflam")  # Contains ibuprofen + paracetamol
    ]
    res = run_safety_review_engine(ctx, meds)
    assert any(a.category == "Duplicate Therapy" and "paracetamol" in a.drugs_involved.lower() for a in res.alerts)
    dup = next(a for a in res.alerts if a.category == "Duplicate Therapy" and "paracetamol" in a.drugs_involved.lower())
    assert dup.official_severity == "major"  # Paracetamol duplication must be major

def test_duplicate_therapy_same_class():
    ctx = ClinicalContext(age=62, egfr=75)
    meds = [
        MedicationInput(name="Enalapril"),
        MedicationInput(name="Ramipril")
    ]
    res = run_safety_review_engine(ctx, meds)
    assert any(a.category == "Duplicate Therapy" for a in res.alerts)

def test_renal_threshold_rule():
    ctx = ClinicalContext(age=70, egfr=25)  # Strictly < 30
    meds = [MedicationInput(name="Metformin")]
    res = run_safety_review_engine(ctx, meds)
    assert any(a.category == "Kidney-Related Dose Concern" for a in res.alerts)
    renal = next(a for a in res.alerts if a.category == "Kidney-Related Dose Concern")
    assert renal.official_severity == "major"

def test_missing_renal_info_does_not_flag_violation():
    ctx = ClinicalContext(age=70, egfr=None)  # eGFR is missing
    meds = [MedicationInput(name="Metformin")]
    res = run_safety_review_engine(ctx, meds)
    assert not any(a.category == "Kidney-Related Dose Concern" for a in res.alerts)

def test_disease_contraindication():
    ctx = ClinicalContext(age=65, diagnoses=["Heart failure with reduced ejection fraction (HFrEF)"])
    meds = [MedicationInput(name="Ibuprofen")]
    res = run_safety_review_engine(ctx, meds)
    assert any(a.category == "Contraindication Flag" for a in res.alerts)
    ci = next(a for a in res.alerts if a.category == "Contraindication Flag")
    assert ci.official_severity == "major"
    assert "heart failure" in ci.why_flagged.lower()

def test_pregnancy_contraindications():
    ctx = ClinicalContext(age=26, sex="Female", pregnancyStatus="Confirmed")
    meds = [
        MedicationInput(name="Warfarin")  # Category X
    ]
    res = run_safety_review_engine(ctx, meds)
    assert any(a.category == "Contraindication Flag" for a in res.alerts)
    ci = next(a for a in res.alerts if a.category == "Contraindication Flag")
    assert ci.severity == "Critical"
    assert ci.official_severity == "contraindicated"

def test_alert_deduplication():
    ctx = ClinicalContext(age=60, egfr=60)
    meds = [
        MedicationInput(name="Aspirin"),
        MedicationInput(name="Warfarin"),
        MedicationInput(name="Dispirin")  # Another aspirin
    ]
    res = run_safety_review_engine(ctx, meds)
    # The aspirin-warfarin interaction must only be reported once
    ix_alerts = [a for a in res.alerts if a.category == "Drug-Drug Interaction"]
    assert len(ix_alerts) == 1

def test_submission_files_exist_and_valid():
    pred_path = settings.submission_dir / "H4_predictions.csv"
    res_path = settings.submission_dir / "H4_resolution.csv"
    assert pred_path.exists(), "submission/H4_predictions.csv does not exist"
    assert res_path.exists(), "submission/H4_resolution.csv does not exist"

    pred_df = pd.read_csv(pred_path, keep_default_na=False)
    res_df = pd.read_csv(res_path, keep_default_na=False)

    assert len(pred_df) > 0
    assert len(res_df) == 20867
    assert len(set(res_df["patient_id"])) == 3500
