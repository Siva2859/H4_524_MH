"""
Unit Tests for Intelligent Diagnosis Normalization
Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
The Medication Safety Second Pair of Eyes
Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.diagnosis_matcher import (
    resolve_single_diagnosis,
    resolve_multiple_diagnoses,
    normalize_diagnosis_text
)

client = TestClient(app)

def test_exact_condition_match():
    res = resolve_single_diagnosis("Hypertension")
    assert res.canonical_name == "Hypertension"
    assert res.condition_id == "hypertension"
    assert res.confidence == 100
    assert res.match_type == "exact"
    assert res.requires_confirmation is False
    assert res.is_canonical is True

    res2 = resolve_single_diagnosis("Asthma")
    assert res2.canonical_name == "Asthma"
    assert res2.confidence == 100

def test_case_insensitive_match():
    res = resolve_single_diagnosis("hypertension")
    assert res.canonical_name == "Hypertension"
    assert res.confidence == 99
    assert res.match_type == "case_insensitive"

    res_gout = resolve_single_diagnosis("gout")
    assert res_gout.canonical_name == "Gout"

def test_normalized_punctuation_match():
    res = resolve_single_diagnosis("Stroke / TIA")
    assert res.canonical_name == "Stroke / TIA"

    res2 = resolve_single_diagnosis("Type-2  Diabetes  Mellitus.")
    assert res2.canonical_name == "Type 2 diabetes mellitus"
    assert res2.confidence == 98
    assert res2.match_type == "normalized_punctuation"

def test_clinical_synonyms_and_acronyms():
    cases = [
        ("HTN", "Hypertension", "hypertension"),
        ("T2DM", "Type 2 diabetes mellitus", "type2_diabetes"),
        ("DM2", "Type 2 diabetes mellitus", "type2_diabetes"),
        ("CKD 3b", "Chronic kidney disease", "ckd"),
        ("CHF", "Heart failure", "heart_failure"),
        ("HFrEF", "Heart failure", "heart_failure"),
        ("AF", "Atrial fibrillation", "atrial_fibrillation"),
        ("BA", "Asthma", "asthma"),
        ("PUD", "Peptic ulcer disease / GI bleed", "peptic_ulcer"),
        ("GERD", "Acid peptic disease / GERD", "gerd"),
        ("CLD", "Chronic liver disease / cirrhosis", "chronic_liver_disease"),
        ("OA", "Osteoarthritis", "osteoarthritis"),
        ("RA", "Rheumatoid arthritis", "rheumatoid_arthritis"),
        ("LBP", "Low back pain / spondylosis", "low_back_pain"),
        ("MDD", "Depression", "depression"),
        ("GAD", "Anxiety disorder", "anxiety"),
        ("BPH", "Benign prostatic hyperplasia", "bph"),
        ("UTI", "Urinary tract infection", "uti"),
        ("TB", "Tuberculosis (on treatment)", "tuberculosis")
    ]
    for inp, expected_name, expected_id in cases:
        res = resolve_single_diagnosis(inp)
        assert res.canonical_name == expected_name, f"Failed for {inp}: got {res.canonical_name}"
        assert res.condition_id == expected_id, f"Failed ID for {inp}: got {res.condition_id}"
        assert res.confidence == 95
        assert res.requires_confirmation is True

def test_fuzzy_typo_correction():
    cases = [
        ("Diabtes Mellitus", "Type 2 diabetes mellitus"),
        ("Hypertenson", "Hypertension"),
        ("Ashtma", "Asthma"),
        ("Peptc Ulcer", "Peptic ulcer disease / GI bleed"),
        ("Chrnoic Kidney Disease", "Chronic kidney disease")
    ]
    for inp, expected_name in cases:
        res = resolve_single_diagnosis(inp)
        assert res.canonical_name == expected_name, f"Failed typo for {inp}: got {res.canonical_name}"
        assert res.confidence >= 75
        assert res.requires_confirmation is True

def test_unknown_and_empty_diagnoses():
    unknown = resolve_single_diagnosis("Rare Unknown Syndrome 999")
    assert unknown.canonical_name is None
    assert unknown.is_known is False
    assert unknown.match_type == "unresolved"
    assert unknown.raw_input == "Rare Unknown Syndrome 999"

    empty = resolve_single_diagnosis("")
    assert empty.match_type == "empty"
    assert empty.is_known is False

def test_api_normalize_single():
    resp = client.post("/api/v1/diagnoses/normalize", json={"term": "HTN"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["canonicalName"] == "Hypertension"
    assert data["conditionId"] == "hypertension"
    assert data["confidence"] == 95
    assert data["requiresConfirmation"] is True

def test_api_normalize_get_query():
    resp = client.get("/api/v1/diagnoses/normalize?term=Diabtes%20Mellitus")
    assert resp.status_code == 200
    data = resp.json()
    assert data["canonicalName"] == "Type 2 diabetes mellitus"
    assert data["confidence"] >= 75

def test_api_normalize_batch():
    resp = client.post("/api/v1/diagnoses/normalize-batch", json={
        "terms": ["HTN", "Astma", "Rare Disease XYZ"]
    })
    assert resp.status_code == 200
    items = resp.json()
    assert len(items) == 3
    assert items[0]["canonicalName"] == "Hypertension"
    assert items[1]["canonicalName"] == "Asthma"
    assert items[2]["isKnown"] is False

