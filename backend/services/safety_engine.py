import re
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Set, Tuple
from itertools import combinations

from ..schemas.patient import ClinicalContext
from ..schemas.medication import MedicationInput, ResolvedMedication
from ..schemas.safety import AlertItem, SafetyReviewResponse, CLINICAL_DISCLAIMER_TEXT
from .normalization import normalize_medication_name, is_stopped_entry
from .reference_store import reference_store

SEVERITY_MAPPING = {
    "contraindicated": "Critical",
    "major": "High",
    "moderate": "Moderate",
    "minor": "Low"
}

SEV_RANK = {
    "contraindicated": 4,
    "major": 3,
    "moderate": 2,
    "minor": 1
}

CATEGORY_MAP = {
    "interaction": "Drug-Drug Interaction",
    "duplicate_therapy": "Duplicate Therapy",
    "renal_dose": "Kidney-Related Dose Concern",
    "contraindication": "Contraindication Flag"
}

def extract_patient_conditions(diagnoses: List[str], allergies: List[str]) -> Set[str]:
    conds = set()
    diag = " ".join(diagnoses).lower()
    allergy = " ".join(allergies).lower()

    # 1. Heart Failure
    if re.search(r"\bhf\b|heart failure|cardiac failure|chf|hfref|hfpef|dcmp|ccf|lv dysfunction|lvef|ef\s*\d+%|ef\s*<|cardiomyopathy", diag):
        if not re.search(r"no\s+(hf|heart failure|ccf)", diag):
            conds.add("heart_failure")

    # 2. Chronic Liver Disease
    if re.search(r"cirrhosis|cirrhotic|cirrrhosis|cld|chronic liver|liver disease|liver failure|chronic hepatitis|portal htn|ascites", diag):
        conds.add("chronic_liver_disease")

    # 3. Peptic ulcer
    if re.search(r"peptic ulcer|pud|gi bleed|ugi bleed|gastric ulcer|duodenal ulcer|ulcer stomach|bleeding du|bleeding gu", diag):
        conds.add("peptic_ulcer")

    # 4. Asthma
    if re.search(r"asthma|\bba\b|bronchial asthma|reactive airway|wheeze", diag):
        if not re.search(r"no\s+(ba|asthma|reactive airway)", diag):
            conds.add("asthma")

    # 5. Angle closure glaucoma
    if re.search(r"angle\s*closure|narrow angle|glaucoma", diag):
        conds.add("angle_closure_glaucoma")

    # 6. Dementia
    if re.search(r"dementia|alzheimer", diag):
        conds.add("dementia")

    # 7. Parkinsons
    if re.search(r"parkinson|paralysis agitans|\bpd\b", diag):
        conds.add("parkinsons")

    # 8. Gout
    if re.search(r"\bgout\b|gouty|hyperuric|tophaceous", diag):
        if not re.search(r"no\s+gout", diag):
            conds.add("gout")

    # 9. Myasthenia Gravis
    if re.search(r"myasthenia|\bmg\b", diag):
        conds.add("myasthenia_gravis")

    # 10. G6PD deficiency
    if re.search(r"g6pd", diag):
        conds.add("g6pd_deficiency")

    # 11. Epilepsy
    if re.search(r"epilepsy|seizure|convulsion", diag):
        conds.add("epilepsy")

    # Allergies
    if allergy and allergy != "nan" and "nkda" not in allergy and "no known" not in allergy:
        if re.search(r"penicillin|\bpcn\b|amoxicillin|ampicillin", allergy):
            conds.add("penicillin_allergy")
        if re.search(r"sulfa|sulphonamide|sulfonamide|septra|bactrim", allergy):
            conds.add("sulfonamide_allergy")
        if re.search(r"aspirin|nsaid|brufen|ibuprofen|combiflam|painkiller", allergy):
            conds.add("nsaid_hypersensitivity")

    return conds

def run_safety_review_engine(
    clinical_context: ClinicalContext,
    medications: List[MedicationInput],
    options: Optional[Dict[str, Any]] = None
) -> SafetyReviewResponse:
    """
    Executes a dataset-driven, explainable medication safety review.
    Evaluates drug interactions, duplicate therapies, renal safety, and disease contraindications.
    Prioritizes serious alerts to reduce alert fatigue.
    """
    alerts: List[AlertItem] = []
    resolved_medications: List[ResolvedMedication] = []
    uncertain_matches: List[ResolvedMedication] = []

    active_entries_generics: List[Set[str]] = []
    patient_seen_alerts: Set[Tuple[str, frozenset]] = set()

    # 1. Normalize each medication
    for idx, med in enumerate(medications):
        raw_name = med.raw_name
        norm_result = normalize_medication_name(raw_name)
        
        resolved_name = norm_result.resolved_name or ""
        is_stopped = is_stopped_entry(raw_name)

        ingredients = norm_result.combination_ingredients
        if not ingredients and resolved_name:
            ingredients = [g.strip() for g in resolved_name.split(";") if g.strip()]

        canonical_drug = norm_result.canonical_drug or (
            reference_store.get_drug_by_generic(ingredients[0]) if ingredients else None
        )
        drug_class = norm_result.drug_class or (canonical_drug.get("drugClass") if canonical_drug else "Standard")

        resolved_item = ResolvedMedication(
            originalIndex=idx,
            rawInput=raw_name,
            strength=med.strength or "",
            dose=med.dose or "",
            route=med.route or "Oral",
            frequency=med.frequency or "Daily",
            resolvedGeneric=resolved_name if resolved_name else raw_name,
            canonicalDrug=canonical_drug,
            drugClass=drug_class,
            rxNormId=canonical_drug.get("id", "UNKNOWN") if canonical_drug else "UNKNOWN",
            confidence=norm_result.confidence,
            matchType=norm_result.matching_method,
            requiresConfirmation=norm_result.requires_confirmation or norm_result.resolution_status != "Resolved",
            reasoning=norm_result.reasoning,
            isCombination=norm_result.is_combination,
            combinationIngredients=ingredients
        )
        resolved_medications.append(resolved_item)

        if resolved_item.requires_confirmation or norm_result.resolution_status != "Resolved":
            uncertain_matches.append(resolved_item)

        # Only active, non-stopped medications participate in safety risk checks
        if not is_stopped and ingredients:
            active_entries_generics.append(set(ingredients))

    # Alert on uncertain or unresolved medication identity
    for item in uncertain_matches:
        alerts.append(AlertItem(
            id=f"ALERT-UNCERTAIN-{item.original_index}",
            ruleCode="ALERT-IDENTITY-VERIFICATION",
            severity="High",
            category="Uncertain Medication Identity",
            title=f"Uncertain Drug Identity: '{item.raw_input}'",
            involvedMedicines=[item.raw_input],
            matchedRule="RULE-MEDICATION-NAME-RESOLUTION",
            whyFlagged=(
                f"The entered term '{item.raw_input}' could not be matched with 100% certainty to the official reference catalog "
                f"(Resolution: {item.match_type}, Confidence: {item.confidence}%)."
            ),
            evidence="Official Clinical Dataset Guideline: Unresolved medication names must be explicitly flagged rather than silently ignored.",
            confidence=f"{item.confidence}% Match Confidence",
            limitations="Clinical review required to verify medication spelling, strength, or intended brand.",
            suggestedAction=f"Prescriber or pharmacist should clarify '{item.raw_input}' prior to administering.",
            sourceReference="H4_Medication_Safety_Reference",
            requiresHumanConfirmation=True,
            resolvedGeneric=item.resolved_generic,
            officialIssueType="unresolved_token",
            officialSeverity="major",
            drugsInvolved=item.raw_input
        ))

    all_active_generics: Set[str] = set().union(*active_entries_generics) if active_entries_generics else set()

    # 2. Drug-Drug Interactions
    for g1, g2 in combinations(sorted(all_active_generics), 2):
        pair = (g1, g2)
        hit = reference_store.interactions_by_pair.get(pair)
        if hit:
            sev_official, rec_action, mech = hit
            key_alert = ("interaction", frozenset([g1, g2]))
            if key_alert not in patient_seen_alerts:
                patient_seen_alerts.add(key_alert)
                ui_sev = SEVERITY_MAPPING.get(sev_official, "Moderate")
                alerts.append(AlertItem(
                    id=f"ALERT-IX-{g1}-{g2}",
                    ruleCode=f"RULE-IX-{g1.upper()}-{g2.upper()}",
                    severity=ui_sev,
                    category="Drug-Drug Interaction",
                    title=f"Interaction: {g1.title()} + {g2.title()}",
                    involvedMedicines=[g1.title(), g2.title()],
                    matchedRule="H4_INTERACTIONS_DATASET",
                    whyFlagged=mech if mech else f"Documented pharmacokinetic/pharmacodynamic interaction between {g1} and {g2}.",
                    evidence=f"Official H4 Drug Interactions Reference (Severity: {sev_official.upper()})",
                    confidence="100% Deterministic Rule Match",
                    limitations="Interaction rules reflect curated hospital reference set; clinical judgment required.",
                    suggestedAction=rec_action,
                    sourceReference="interactions.csv",
                    mechanism=mech,
                    officialIssueType="interaction",
                    officialSeverity=sev_official,
                    drugsInvolved=f"{g1};{g2}"
                ))

    # 3. Duplicate Therapy
    # Case (a): Same generic across multiple entries
    for g in sorted(all_active_generics):
        entries_with_g = sum(1 for e in active_entries_generics if g in e)
        if entries_with_g >= 2:
            drug_info = reference_store.drug_ref_by_generic.get(g, {})
            grp_id = drug_info.get("duplicateGroup", "")
            grp_info = reference_store.duplicate_groups_by_id.get(grp_id, {})

            if g == "paracetamol":
                sev_official = "major"
                action = "Paracetamol from two products - risk of exceeding 4 g/day (liver toxicity); keep one source"
            elif grp_info:
                sev_official = grp_info["severity"]
                action = grp_info["recommendedAction"]
            else:
                sev_official = "moderate"
                action = f"Duplicate therapy: {g} prescribed multiple times - review total daily dose"

            key_alert = ("duplicate_therapy", frozenset([g]))
            if key_alert not in patient_seen_alerts:
                patient_seen_alerts.add(key_alert)
                ui_sev = SEVERITY_MAPPING.get(sev_official, "Moderate")
                alerts.append(AlertItem(
                    id=f"ALERT-DUP-{g}",
                    ruleCode=f"RULE-DUP-{g.upper()}",
                    severity=ui_sev,
                    category="Duplicate Therapy",
                    title=f"Duplicate Ingredient: {g.title()} Prescribed Multiple Times",
                    involvedMedicines=[g.title()],
                    matchedRule="H4_DUPLICATE_THERAPY_DATASET",
                    whyFlagged=f"Active generic ingredient '{g}' is supplied in {entries_with_g} separate prescribed medication entries.",
                    evidence=f"Official Duplicate Therapy Reference (Severity: {sev_official.upper()})",
                    confidence="100% Deterministic Match",
                    limitations="Check if multiple entries reflect deliberate dosage titration or unintentional duplication.",
                    suggestedAction=action,
                    sourceReference="duplicate_therapy_groups.csv",
                    officialIssueType="duplicate_therapy",
                    officialSeverity=sev_official,
                    drugsInvolved=g
                ))

    # Case (b): Two different generics from same duplicate group across different entries
    for g1, g2 in combinations(sorted(all_active_generics), 2):
        grp1 = reference_store.drug_ref_by_generic.get(g1, {}).get("duplicateGroup", "")
        grp2 = reference_store.drug_ref_by_generic.get(g2, {}).get("duplicateGroup", "")
        if grp1 and grp1 == grp2:
            g1_entries = [i for i, e in enumerate(active_entries_generics) if g1 in e]
            g2_entries = [i for i, e in enumerate(active_entries_generics) if g2 in e]
            has_distinct_entry = any(i != j for i in g1_entries for j in g2_entries)
            if has_distinct_entry:
                grp_info = reference_store.duplicate_groups_by_id.get(grp1, {})
                sev_official = grp_info.get("severity", "moderate")
                action = grp_info.get("recommendedAction", f"Two drugs from same class ({grp1}) - keep one")
                key_alert = ("duplicate_therapy", frozenset([g1, g2]))
                if key_alert not in patient_seen_alerts:
                    patient_seen_alerts.add(key_alert)
                    ui_sev = SEVERITY_MAPPING.get(sev_official, "Moderate")
                    alerts.append(AlertItem(
                        id=f"ALERT-DUP-GROUP-{g1}-{g2}",
                        ruleCode=f"RULE-DUP-CLASS-{grp1.upper()}",
                        severity=ui_sev,
                        category="Duplicate Therapy",
                        title=f"Same Class Duplication: {g1.title()} + {g2.title()} ({grp_info.get('groupName', grp1)})",
                        involvedMedicines=[g1.title(), g2.title()],
                        matchedRule="H4_DUPLICATE_GROUP_DATASET",
                        whyFlagged=f"Patient is receiving multiple agents from the same therapeutic duplicate group '{grp_info.get('groupName', grp1)}'.",
                        evidence=f"Official Duplicate Therapy Reference (Group: {grp1}, Severity: {sev_official.upper()})",
                        confidence="100% Deterministic Match",
                        limitations="Guidelines may allow combination in specialized circumstances; confirm indication.",
                        suggestedAction=action,
                        sourceReference="duplicate_therapy_groups.csv",
                        officialIssueType="duplicate_therapy",
                        officialSeverity=sev_official,
                        drugsInvolved=f"{g1};{g2}"
                    ))

    # 4. Renal Safety Checking
    patient_egfr = clinical_context.egfr
    if patient_egfr is not None:
        for g in sorted(all_active_generics):
            if g in reference_store.renal_by_generic:
                # Tiers are sorted by egfr_below ascending; first matching tier is most restrictive
                for tier_below, sev_official, rec_action in reference_store.renal_by_generic[g]:
                    if patient_egfr < tier_below:
                        key_alert = ("renal_dose", frozenset([g]))
                        if key_alert not in patient_seen_alerts:
                            patient_seen_alerts.add(key_alert)
                            ui_sev = SEVERITY_MAPPING.get(sev_official, "Moderate")
                            alerts.append(AlertItem(
                                id=f"ALERT-RENAL-{g}",
                                ruleCode=f"RULE-RENAL-{g.upper()}-LT{tier_below}",
                                severity=ui_sev,
                                category="Kidney-Related Dose Concern",
                                title=f"Renal Impairment Dose Alert: {g.title()} (eGFR {patient_egfr} < {tier_below})",
                                involvedMedicines=[g.title()],
                                matchedRule="H4_RENAL_RULES_DATASET",
                                whyFlagged=f"Patient eGFR is {patient_egfr} mL/min/1.73m², which is below the threshold of {tier_below} mL/min/1.73m² for {g}.",
                                evidence=f"Official Renal Dose Rules (Tier Threshold: < {tier_below}, Severity: {sev_official.upper()})",
                                confidence="100% Deterministic Rule Match",
                                limitations="Renal dosing evaluated using recorded eGFR estimate; acute kidney injury may alter clearance rapidly.",
                                suggestedAction=rec_action,
                                sourceReference="renal_rules.csv",
                                patientEgfr=float(patient_egfr),
                                threshold=float(tier_below),
                                officialIssueType="renal_dose",
                                officialSeverity=sev_official,
                                drugsInvolved=g
                            ))
                        break

    # 5. Disease Contraindications & Pregnancy
    is_pregnant = clinical_context.is_pregnant
    diagnoses_list = clinical_context.diagnoses or []
    allergies_list = (clinical_context.known_allergies or []) + (clinical_context.allergies or [])
    conds = extract_patient_conditions(diagnoses_list, allergies_list)
    if is_pregnant:
        conds.add("pregnancy")

    for g in sorted(all_active_generics):
        g_ci_alerts = []

        # Check condition-specific contraindications
        for c in conds:
            if c in reference_store.contraindications_by_condition:
                for rule_gen, rule_sev, rule_act, rule_reason in reference_store.contraindications_by_condition[c]:
                    if rule_gen == g:
                        cond_name = reference_store.conditions_catalog.get(c, {}).get("conditionName", c.title())
                        g_ci_alerts.append((
                            SEV_RANK.get(rule_sev, 1),
                            rule_sev,
                            rule_act,
                            f"Contraindicated in {cond_name}: {rule_reason}",
                            cond_name
                        ))

        # Check pregnancy category if pregnant
        if is_pregnant:
            preg_cat = reference_store.drug_ref_by_generic.get(g, {}).get("pregnancyCategory", "")
            if preg_cat == "X":
                g_ci_alerts.append((
                    4,
                    "contraindicated",
                    "Contraindicated in pregnancy (FDA category X) - stop and switch to a pregnancy-safe alternative",
                    f"{g.title()} is FDA Category X (teratogenic / embryotoxic) and strictly contraindicated in pregnancy.",
                    "Pregnancy"
                ))
            elif preg_cat == "D":
                g_ci_alerts.append((
                    3,
                    "major",
                    "Evidence of fetal risk (FDA category D) - review urgently; switch to a safer alternative unless benefit clearly justifies",
                    f"{g.title()} is FDA Category D with demonstrated positive evidence of human fetal risk.",
                    "Pregnancy"
                ))

        if g_ci_alerts:
            # Pick the single highest severity contraindication for this drug
            g_ci_alerts.sort(key=lambda x: -x[0])
            top_rank, sev_official, rec_action, reason_text, condition_name = g_ci_alerts[0]
            key_alert = ("contraindication", frozenset([g]))
            if key_alert not in patient_seen_alerts:
                patient_seen_alerts.add(key_alert)
                ui_sev = SEVERITY_MAPPING.get(sev_official, "Moderate")
                alerts.append(AlertItem(
                    id=f"ALERT-CONTRA-{g}",
                    ruleCode=f"RULE-CONTRA-{g.upper()}",
                    severity=ui_sev,
                    category="Contraindication Flag",
                    title=f"Contraindication: {g.title()} with {condition_name}",
                    involvedMedicines=[g.title()],
                    matchedRule="H4_CONTRAINDICATIONS_DATASET",
                    whyFlagged=reason_text,
                    evidence=f"Official Disease Contraindication Reference (Severity: {sev_official.upper()})",
                    confidence="100% Deterministic Rule Match",
                    limitations="Evaluated against recorded patient diagnoses, allergy history, and pregnancy status.",
                    suggestedAction=rec_action,
                    sourceReference="drug_disease_contraindications.csv",
                    officialIssueType="contraindication",
                    officialSeverity=sev_official,
                    drugsInvolved=g
                ))

    # Sort alerts by clinical severity (Critical first, then High, Moderate, Low)
    severity_order = {"Critical": 4, "High": 3, "Moderate": 2, "Low": 1}
    alerts.sort(key=lambda a: -severity_order.get(a.severity, 0))

    # Counts
    severity_counts = {"Critical": 0, "High": 0, "Moderate": 0, "Low": 0}
    category_counts = {
        "Drug-Drug Interaction": 0,
        "Duplicate Therapy": 0,
        "Kidney-Related Dose Concern": 0,
        "Contraindication Flag": 0,
        "Uncertain Medication Identity": 0
    }

    for alert in alerts:
        severity_counts[alert.severity] = severity_counts.get(alert.severity, 0) + 1
        category_counts[alert.category] = category_counts.get(alert.category, 0) + 1

    has_critical = severity_counts["Critical"] > 0
    has_high = severity_counts["High"] > 0
    has_no_alerts = len(alerts) == 0

    if has_no_alerts:
        status_message = "No medication safety risks detected across verified rules for current regimen. List verified against official formulary."
    elif has_critical:
        status_message = f"CRITICAL: {severity_counts['Critical']} contraindicated medication safety violation(s) require urgent clinician review."
    elif has_high:
        status_message = f"HIGH PRIORITY: {severity_counts['High']} major clinical safety concern(s) flagged for prescriber assessment."
    else:
        status_message = f"CAUTION: {len(alerts)} moderate or monitoring safety notice(s) identified."

    return SafetyReviewResponse(
        evaluatedAt=datetime.now(timezone.utc).isoformat(),
        clinicalContext=clinical_context,
        medicationsCount=len(medications),
        resolvedMedications=resolved_medications,
        alerts=alerts,
        severityCounts=severity_counts,
        categoryCounts=category_counts,
        hasCriticalAlerts=has_critical,
        hasHighAlerts=has_high,
        totalAlerts=len(alerts),
        hasNoAlerts=has_no_alerts,
        statusMessage=status_message,
        clinicalDisclaimer=CLINICAL_DISCLAIMER_TEXT
    )
