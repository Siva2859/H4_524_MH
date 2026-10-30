"""
MediGuard AI - Intelligent Diagnosis Name Normalization Service (Backend)
Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
The Medication Safety Second Pair of Eyes
Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna

Sequence:
1. Exact official condition name match
2. Case-insensitive official condition name match
3. Normalized punctuation and whitespace matching
4. Supported medical synonym and alias matching
5. Official condition ID match
6. Controlled fuzzy spelling matching (Levenshtein distance)
7. Ambiguous or unresolved diagnosis handling
"""

import re
from typing import Optional, List, Dict, Any, Tuple
from .reference_store import reference_store
from ..schemas.diagnosis import DiagnosisNormalizationResponse

def levenshtein_dist(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return levenshtein_dist(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = list(range(len(s2) + 1))
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

def normalize_diagnosis_text(s: str) -> str:
    if not s:
        return ""
    # Strip punctuation, hyphens, slashes, brackets
    cleaned = re.sub(r"[.,;:_\-/\\()\[\]{}]", " ", s)
    return " ".join(cleaned.split()).strip()

# Standard medical acronyms and clinical aliases
CONDITION_ALIASES: Dict[str, str] = {
    "htn": "hypertension",
    "high bp": "hypertension",
    "high blood pressure": "hypertension",
    "elevated bp": "hypertension",
    "arterial hypertension": "hypertension",
    "essential hypertension": "hypertension",

    "cad": "cad",
    "ihd": "cad",
    "ischaemic heart disease": "cad",
    "ischemic heart disease": "cad",
    "coronary heart disease": "cad",
    "post mi": "cad",
    "old mi": "cad",
    "myocardial infarction": "cad",
    "post-pci": "cad",
    "post pci": "cad",
    "angina": "cad",

    "chf": "heart_failure",
    "congestive heart failure": "heart_failure",
    "hf": "heart_failure",
    "hfref": "heart_failure",
    "hfpef": "heart_failure",
    "cardiac failure": "heart_failure",
    "ccf": "heart_failure",
    "dcmp": "heart_failure",
    "lv dysfunction": "heart_failure",

    "af": "atrial_fibrillation",
    "afib": "atrial_fibrillation",
    "a-fib": "atrial_fibrillation",
    "atrial fib": "atrial_fibrillation",

    "stroke": "stroke",
    "tia": "stroke",
    "cva": "stroke",
    "old cva": "stroke",
    "cerebrovascular accident": "stroke",
    "transient ischemic attack": "stroke",

    "dvt": "dvt_pe",
    "pe": "dvt_pe",
    "vte": "dvt_pe",
    "deep vein thrombosis": "dvt_pe",
    "pulmonary embolism": "dvt_pe",
    "venous thromboembolism": "dvt_pe",

    "mvr": "mechanical_valve",
    "avr": "mechanical_valve",
    "s/p mvr": "mechanical_valve",
    "s/p avr": "mechanical_valve",
    "mechanical valve": "mechanical_valve",
    "prosthetic valve": "mechanical_valve",

    "t2dm": "type2_diabetes",
    "dm2": "type2_diabetes",
    "t2d": "type2_diabetes",
    "dm 2": "type2_diabetes",
    "type 2 diabetes": "type2_diabetes",
    "type ii diabetes": "type2_diabetes",
    "type 2 diabetes mellitus": "type2_diabetes",
    "diabetes mellitus": "type2_diabetes",
    "diabetes": "type2_diabetes",
    "diabetic": "type2_diabetes",

    "dyslipidemia": "dyslipidaemia",
    "hyperlipidemia": "dyslipidaemia",
    "high cholesterol": "dyslipidaemia",
    "hypercholesterolemia": "dyslipidaemia",

    "ckd": "ckd",
    "ckd 1": "ckd",
    "ckd 2": "ckd",
    "ckd 3": "ckd",
    "ckd 3a": "ckd",
    "ckd 3b": "ckd",
    "ckd 4": "ckd",
    "ckd 5": "ckd",
    "chronic kidney disease": "ckd",
    "chronic kidney disease stage 1": "ckd",
    "chronic kidney disease stage 2": "ckd",
    "chronic kidney disease stage 3": "ckd",
    "chronic kidney disease stage 4": "ckd",
    "chronic kidney disease stage 5": "ckd",
    "chronic renal failure": "ckd",
    "crf": "ckd",

    "ba": "asthma",
    "asthma": "asthma",
    "bronchial asthma": "asthma",
    "reactive airway disease": "asthma",

    "copd": "copd",
    "chronic obstructive pulmonary disease": "copd",

    "pud": "peptic_ulcer",
    "peptic ulcer": "peptic_ulcer",
    "peptic ulcer disease": "peptic_ulcer",
    "gastric ulcer": "peptic_ulcer",
    "duodenal ulcer": "peptic_ulcer",
    "gi bleed": "peptic_ulcer",
    "ugi bleed": "peptic_ulcer",

    "gerd": "gerd",
    "gord": "gerd",
    "apd": "gerd",
    "acid peptic disease": "gerd",
    "gastritis": "gerd",
    "dyspepsia": "gerd",
    "acid reflux": "gerd",

    "cld": "chronic_liver_disease",
    "cirrhosis": "chronic_liver_disease",
    "liver cirrhosis": "chronic_liver_disease",
    "chronic liver disease": "chronic_liver_disease",

    "hypothyroid": "hypothyroidism",
    "hypothyroidism": "hypothyroidism",
    "hyperthyroid": "hyperthyroidism",
    "hyperthyroidism": "hyperthyroidism",

    "oa": "osteoarthritis",
    "oa knee": "osteoarthritis",
    "osteoarthritis": "osteoarthritis",
    "lbp": "low_back_pain",
    "low back pain": "low_back_pain",
    "back pain": "low_back_pain",
    "ra": "rheumatoid_arthritis",
    "rheumatoid arthritis": "rheumatoid_arthritis",
    "gout": "gout",
    "osteoporosis": "osteoporosis",

    "epilepsy": "epilepsy",
    "seizure": "epilepsy",
    "seizure disorder": "epilepsy",

    "mdd": "depression",
    "depression": "depression",
    "major depressive disorder": "depression",
    "gad": "anxiety",
    "anxiety": "anxiety",
    "anxiety disorder": "anxiety",
    "bpad": "bipolar",
    "bipolar": "bipolar",
    "schizophrenia": "schizophrenia",
    "insomnia": "insomnia",

    "pd": "parkinsons",
    "parkinsons": "parkinsons",
    "parkinson's disease": "parkinsons",
    "dementia": "dementia",
    "alzheimer": "dementia",
    "alzheimers": "dementia",
    "dpn": "neuropathy",
    "peripheral neuropathy": "neuropathy",
    "migraine": "migraine",
    "vertigo": "vertigo",

    "bph": "bph",
    "benign prostatic hyperplasia": "bph",
    "oab": "overactive_bladder",
    "overactive bladder": "overactive_bladder",
    "ed": "erectile_dysfunction",
    "erectile dysfunction": "erectile_dysfunction",
    "uti": "uti",
    "urinary tract infection": "uti",
    "urti": "respiratory_infection",
    "lrti": "respiratory_infection",
    "respiratory infection": "respiratory_infection",
    "pneumonia": "respiratory_infection",
    "tb": "tuberculosis",
    "ptb": "tuberculosis",
    "tuberculosis": "tuberculosis",
    "anaemia": "anaemia",
    "anemia": "anaemia",
    "ida": "anaemia",
    "ar": "allergic_rhinitis",
    "allergic rhinitis": "allergic_rhinitis",
    "angle closure glaucoma": "angle_closure_glaucoma",
    "narrow angle glaucoma": "angle_closure_glaucoma",
    "glaucoma": "angle_closure_glaucoma",
    "g6pd": "g6pd_deficiency",
    "g6pd def": "g6pd_deficiency",
    "mg": "myasthenia_gravis",
    "myasthenia gravis": "myasthenia_gravis",
    "acne": "acne",
    "pregnant": "pregnancy",
    "pregnancy": "pregnancy"
}

COMMON_DIAGNOSIS_TYPOS: Dict[str, str] = {
    "diabtes": "type2_diabetes",
    "diabtes mellitus": "type2_diabetes",
    "diabetis": "type2_diabetes",
    "hypertenson": "hypertension",
    "hypertention": "hypertension",
    "ashtma": "asthma",
    "astma": "asthma",
    "peptc ulcer": "peptic_ulcer",
    "peptic ulcr": "peptic_ulcer",
    "chrnoic kidney disease": "ckd",
    "depresion": "depression",
    "anxietey": "anxiety",
    "epilepsi": "epilepsy",
    "headrache": "headache",
    "cirhosis": "chronic_liver_disease"
}

def resolve_single_diagnosis(raw_term: str) -> DiagnosisNormalizationResponse:
    if not raw_term or not raw_term.strip():
        return DiagnosisNormalizationResponse(
            rawInput="",
            canonicalName=None,
            conditionId=None,
            confidence=0,
            matchType="empty",
            reason="Empty diagnosis term",
            requiresConfirmation=False,
            isCanonical=False,
            isKnown=False
        )

    trimmed = raw_term.strip()
    lower = trimmed.lower()
    normalized_punct = normalize_diagnosis_text(lower)

    # 1. Exact official condition name match
    for cid, info in reference_store.conditions_catalog.items():
        cname = info.get("conditionName", "")
        if cname == trimmed:
            return DiagnosisNormalizationResponse(
                rawInput=trimmed,
                canonicalName=cname,
                conditionId=cid,
                confidence=100,
                matchType="exact",
                reason="Exact official condition match",
                requiresConfirmation=False,
                isCanonical=True,
                isKnown=True
            )

    # 2. Case-insensitive official condition name match
    for cid, info in reference_store.conditions_catalog.items():
        cname = info.get("conditionName", "")
        if cname.lower() == lower:
            return DiagnosisNormalizationResponse(
                rawInput=trimmed,
                canonicalName=cname,
                conditionId=cid,
                confidence=99,
                matchType="case_insensitive",
                reason="Case-insensitive official match",
                requiresConfirmation=cname != trimmed,
                isCanonical=cname == trimmed,
                isKnown=True
            )

    # 3. Normalized punctuation and whitespace matching
    for cid, info in reference_store.conditions_catalog.items():
        cname = info.get("conditionName", "")
        if normalize_diagnosis_text(cname.lower()) == normalized_punct:
            return DiagnosisNormalizationResponse(
                rawInput=trimmed,
                canonicalName=cname,
                conditionId=cid,
                confidence=98,
                matchType="normalized_punctuation",
                reason="Punctuation and whitespace normalized",
                requiresConfirmation=True,
                isCanonical=False,
                isKnown=True
            )

    # 4. Supported medical synonym, abbreviation, and clinical alias
    matched_alias_cid = CONDITION_ALIASES.get(lower) or CONDITION_ALIASES.get(normalized_punct)
    if matched_alias_cid and matched_alias_cid in reference_store.conditions_catalog:
        canonical_info = reference_store.conditions_catalog[matched_alias_cid]
        return DiagnosisNormalizationResponse(
            rawInput=trimmed,
            canonicalName=canonical_info.get("conditionName", matched_alias_cid.title()),
            conditionId=matched_alias_cid,
            confidence=95,
            matchType="synonym_alias",
            reason="Recognized medical acronym / clinical alias",
            requiresConfirmation=True,
            isCanonical=False,
            isKnown=True
        )

    # 5. Official condition ID match
    if lower in reference_store.conditions_catalog:
        info = reference_store.conditions_catalog[lower]
        return DiagnosisNormalizationResponse(
            rawInput=trimmed,
            canonicalName=info.get("conditionName", lower.title()),
            conditionId=lower,
            confidence=95,
            matchType="official_id",
            reason="Official condition ID match",
            requiresConfirmation=True,
            isCanonical=False,
            isKnown=True
        )

    # 6. Common misspellings lookup
    matched_typo_cid = COMMON_DIAGNOSIS_TYPOS.get(lower) or COMMON_DIAGNOSIS_TYPOS.get(normalized_punct)
    if matched_typo_cid and matched_typo_cid in reference_store.conditions_catalog:
        info = reference_store.conditions_catalog[matched_typo_cid]
        return DiagnosisNormalizationResponse(
            rawInput=trimmed,
            canonicalName=info.get("conditionName", matched_typo_cid.title()),
            conditionId=matched_typo_cid,
            confidence=90,
            matchType="known_spelling_typo",
            reason="Common spelling mistake corrected",
            requiresConfirmation=True,
            isCanonical=False,
            isKnown=True
        )

    # 6b. Controlled fuzzy Levenshtein matching
    best_candidate_id = None
    best_dist = float("inf")
    best_score = 0

    for cid, info in reference_store.conditions_catalog.items():
        cname_lower = info.get("conditionName", "").lower()
        dist = levenshtein_dist(lower, cname_lower)
        max_len = max(len(lower), len(cname_lower))
        score = int(round((1 - dist / max_len) * 100))
        max_allowed_dist = 1 if max_len <= 5 else (2 if max_len <= 10 else 3)
        if dist <= max_allowed_dist and score >= 75 and dist < best_dist:
            best_dist = dist
            best_score = score
            best_candidate_id = cid

    if not best_candidate_id:
        for alias, cid in CONDITION_ALIASES.items():
            if len(alias) >= 4 and cid in reference_store.conditions_catalog:
                dist = levenshtein_dist(lower, alias)
                max_len = max(len(lower), len(alias))
                score = int(round((1 - dist / max_len) * 100))
                max_allowed_dist = 1 if max_len <= 5 else 2
                if dist <= max_allowed_dist and score >= 75 and dist < best_dist:
                    best_dist = dist
                    best_score = score
                    best_candidate_id = cid

    if best_candidate_id and best_score >= 75:
        info = reference_store.conditions_catalog[best_candidate_id]
        return DiagnosisNormalizationResponse(
            rawInput=trimmed,
            canonicalName=info.get("conditionName", best_candidate_id.title()),
            conditionId=best_candidate_id,
            confidence=best_score,
            matchType="fuzzy_spelling",
            reason=f"Fuzzy spelling match (edit distance {best_dist})",
            requiresConfirmation=True,
            isCanonical=False,
            isKnown=True
        )

    # 7. Unresolved / Unknown
    return DiagnosisNormalizationResponse(
        rawInput=trimmed,
        canonicalName=None,
        conditionId=None,
        confidence=0,
        matchType="unresolved",
        reason="Unrecognized / custom clinical condition (preserved without auto-replacement)",
        requiresConfirmation=False,
        isCanonical=False,
        isKnown=False
    )

def resolve_multiple_diagnoses(terms: List[str]) -> List[DiagnosisNormalizationResponse]:
    return [resolve_single_diagnosis(t) for t in terms if t and t.strip()]

