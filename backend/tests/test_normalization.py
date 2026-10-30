import pytest
from backend.services.normalization import normalize_medication_name

def test_exact_generic_matching():
    res = normalize_medication_name("Warfarin")
    assert res.resolution_status == "Resolved"
    assert res.resolved_name.lower() == "warfarin"
    assert res.confidence == 100.0
    assert res.requires_confirmation is False
    assert "Exact" in res.matching_method

def test_case_and_whitespace_normalization():
    res = normalize_medication_name("   aSpIrIn   ")
    assert res.resolution_status == "Resolved"
    assert res.resolved_name.lower() == "aspirin"
    assert res.confidence == 100.0
    assert res.requires_confirmation is False

def test_brand_name_matching():
    res = normalize_medication_name("Coumadin")
    assert res.resolution_status == "Resolved"
    assert res.resolved_name.lower() == "warfarin"
    assert res.confidence == 100.0
    assert res.requires_confirmation is False

    res2 = normalize_medication_name("Lipitor")
    assert res2.resolution_status == "Resolved"
    assert res2.resolved_name.lower() == "atorvastatin"
    assert res2.confidence == 100.0

def test_combination_brand_expansion():
    res = normalize_medication_name("Glycomet-GP 1")
    assert res.resolution_status == "Resolved"
    assert "glimepiride" in res.resolved_name.lower()
    assert "metformin" in res.resolved_name.lower()
    assert res.is_combination is True
    assert len(res.combination_ingredients) >= 2

def test_curated_misspelling():
    res = normalize_medication_name("Metfornin")
    assert res.resolution_status == "Resolved"
    assert res.resolved_name.lower() == "metformin"
    assert res.confidence >= 85.0

def test_fuzzy_levenshtein_matching():
    res = normalize_medication_name("Clopidogrelx")
    assert res.resolution_status == "Resolved"
    assert res.resolved_name.lower() == "clopidogrel"
    assert res.confidence >= 80.0

def test_non_drug_clinical_instruction():
    res = normalize_medication_name("BP charting")
    assert res.resolution_status == "Unresolved"
    assert res.resolved_name == ""
    assert res.matching_method == "Non-Drug Clinical Entry"

def test_unknown_medication():
    res = normalize_medication_name("XyzUnknownDrug12345")
    assert res.resolution_status == "Unresolved"
    assert res.resolved_name is None
    assert res.confidence < 70.0

def test_empty_input():
    res = normalize_medication_name("")
    assert res.resolution_status == "Unresolved"
    assert res.resolved_name is None
    assert res.confidence == 0.0
