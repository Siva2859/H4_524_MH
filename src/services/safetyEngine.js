/**
 * MediGuard AI - Clinical Safety Decision Support Rule Engine
 * Deterministic, Explainable Evaluation of Synthetic Clinical Regimens
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import { INTERACTION_RULES } from "../data/interactionRules.js";
import { DUPLICATE_THERAPY_RULES } from "../data/duplicateTherapyRules.js";
import { RENAL_RULES } from "../data/renalRules.js";
import { CONTRAINDICATION_RULES } from "../data/contraindicationRules.js";
import { resolveMedicineName } from "./aliasMatcher.js";

/**
 * Severity ranking for clinical prioritization
 */
export const SEVERITY_ORDER = {
  "Critical": 4,
  "High": 3,
  "Moderate": 2,
  "Low": 1
};

/**
 * Executes the full Medication Safety Review for a given clinical context and medication list
 * 
 * @param {Object} clinicalContext
 * @param {number|string} clinicalContext.age
 * @param {number|string} clinicalContext.weight
 * @param {number|string} clinicalContext.eGfr - estimated Glomerular Filtration Rate (mL/min/1.73m²)
 * @param {string} clinicalContext.pregnancyStatus - 'Positive', 'Negative', 'Not Applicable'
 * @param {Array<string>} clinicalContext.diagnoses - e.g. ['Type 2 Diabetes', 'Hypertension', 'Asthma']
 * @param {Array<Object>} medications - array of medication objects
 * @param {Object} [_options] - config options such as strictSensitivity, suppressTrivial
 * 
 * @returns {Object} Comprehensive review results with alerts, resolved meds, and metadata
 */
export function runSafetyReview(clinicalContext, medications, _options = {}) {
  const alerts = [];
  const resolvedMedications = [];
  const uncertainMatches = [];

  // Normalize clinical context values
  const eGfrNum = parseFloat(clinicalContext.eGfr);
  const isPregnant = (clinicalContext.pregnancyStatus || "").toLowerCase() === "positive";
  const diagnosesList = Array.isArray(clinicalContext.diagnoses)
    ? clinicalContext.diagnoses.map(d => d.trim().toLowerCase())
    : [];

  // 1. Resolve each medication to its canonical form
  medications.forEach((med, index) => {
    const rawName = med.genericName || med.name || "";
    const resolution = resolveMedicineName(rawName);

    const resolvedItem = {
      originalIndex: index,
      rawInput: rawName,
      strength: med.strength || "",
      dose: med.dose || "",
      route: med.route || "Oral",
      frequency: med.frequency || "Daily",
      resolvedGeneric: resolution ? resolution.genericName : rawName,
      canonicalDrug: resolution ? resolution.canonicalDrug : null,
      drugClass: resolution?.drugClass || "Unknown Class",
      rxNormId: resolution?.rxNormId || "UNKNOWN",
      confidence: resolution?.confidence || 0,
      matchType: resolution?.matchType || "Unresolved",
      requiresConfirmation: resolution?.requiresConfirmation || false,
      reasoning: resolution?.reasoning || ""
    };

    resolvedMedications.push(resolvedItem);

    if (resolvedItem.requiresConfirmation) {
      uncertainMatches.push(resolvedItem);
    }
  });

  // If there are uncertain or low-confidence matches, generate an advisory safety alert
  uncertainMatches.forEach(item => {
    alerts.push({
      id: `ALERT-UNCERTAIN-${item.originalIndex}`,
      ruleCode: "ALERT-HUMAN-CONFIRM-REQ",
      severity: "High",
      category: "Uncertain Medication Identity",
      title: `Uncertain Drug Identity: '${item.rawInput}' (${item.confidence}% Confidence)`,
      involvedMedicines: [item.rawInput],
      matchedRule: "RULE-SAFETY-IDENTITY-VERIFICATION",
      whyFlagged: `The entered medication name '${item.rawInput}' could not be mapped to the demo reference catalogue with high certainty (Confidence: ${item.confidence}%).`,
      evidence: "Safety Requirement: Clinical decision support must avoid silent mapping of ambiguous medication names to prevent undetected errors.",
      confidence: `${item.confidence}% Match Certainty`,
      limitations: "Illustrative demo alias engine detected phonetic or spelling discrepancy.",
      suggestedAction: `Manually verify and confirm whether '${item.rawInput}' corresponds to '${item.resolvedGeneric}' or a different intended medicine before relying on automated checks.`,
      sourceReference: "SYNTH-SAFETY-DIRECTIVE-H4",
      requiresHumanConfirmation: true,
      resolvedGeneric: item.resolvedGeneric
    });
  });

  // Extract list of resolved generic names for combinatorial checks
  const genericNames = resolvedMedications.map(m => m.resolvedGeneric);

  // 2. Evaluate Drug-Drug Interactions (DDI)
  for (let i = 0; i < genericNames.length; i++) {
    for (let j = i + 1; j < genericNames.length; j++) {
      const nameA = genericNames[i];
      const nameB = genericNames[j];

      const matchedDdi = INTERACTION_RULES.find(rule => 
        (rule.drugA.toLowerCase() === nameA.toLowerCase() && rule.drugB.toLowerCase() === nameB.toLowerCase()) ||
        (rule.drugA.toLowerCase() === nameB.toLowerCase() && rule.drugB.toLowerCase() === nameA.toLowerCase())
      );

      if (matchedDdi) {
        alerts.push({
          id: `ALERT-DDI-${matchedDdi.id}-${i}-${j}`,
          ruleCode: matchedDdi.ruleCode,
          severity: matchedDdi.severity,
          category: matchedDdi.category,
          title: matchedDdi.title,
          involvedMedicines: [nameA, nameB],
          matchedRule: matchedDdi.id,
          whyFlagged: matchedDdi.clinicalRationale,
          evidence: matchedDdi.evidence,
          confidence: matchedDdi.confidence,
          limitations: matchedDdi.limitations,
          suggestedAction: matchedDdi.suggestedAction,
          sourceReference: matchedDdi.sourceReference,
          mechanism: matchedDdi.mechanism
        });
      }
    }
  }

  // 3. Evaluate Duplicate Therapies
  DUPLICATE_THERAPY_RULES.forEach(dupRule => {
    let matchingMedications = [];

    if (dupRule.targetClass) {
      // Find all medications that share this exact class
      matchingMedications = resolvedMedications.filter(
        m => m.drugClass && m.drugClass.toLowerCase().includes(dupRule.targetClass.toLowerCase())
      );
    } else if (dupRule.targetClasses) {
      // Find medications across target interacting classes (e.g. ACEi + ARB)
      matchingMedications = resolvedMedications.filter(m => 
        dupRule.targetClasses.some(tc => m.drugClass && m.drugClass.toLowerCase().includes(tc.toLowerCase()))
      );
    }

    // If more than 1 distinct medication matches this duplicate pattern
    const uniqueDrugs = [...new Set(matchingMedications.map(m => m.resolvedGeneric))];
    if (uniqueDrugs.length > 1) {
      alerts.push({
        id: `ALERT-DUP-${dupRule.id}`,
        ruleCode: dupRule.ruleCode,
        severity: dupRule.severity,
        category: dupRule.category,
        title: dupRule.title,
        involvedMedicines: uniqueDrugs,
        matchedRule: dupRule.id,
        whyFlagged: dupRule.clinicalRationale,
        evidence: dupRule.evidence,
        confidence: dupRule.confidence,
        limitations: dupRule.limitations,
        suggestedAction: dupRule.suggestedAction,
        sourceReference: "SYNTH-DUP-REF-100"
      });
    }
  });

  // 4. Evaluate Kidney-Related / Renal Dose Concerns
  if (!isNaN(eGfrNum)) {
    RENAL_RULES.forEach(renalRule => {
      const drugPresent = resolvedMedications.find(
        m => m.resolvedGeneric.toLowerCase() === renalRule.drugName.toLowerCase()
      );

      if (drugPresent) {
        let conditionMet = false;
        if (renalRule.comparator === "lessThan" && eGfrNum < renalRule.eGfrThreshold) {
          conditionMet = true;
        }

        // Avoid triggering moderate eGFR < 45 rule if critical eGFR < 30 is already active
        if (conditionMet) {
          if (renalRule.ruleCode === "REN-MET-45" && eGfrNum < 30) {
            return; // Skip milder warning when critical MALA alert fires
          }

          alerts.push({
            id: `ALERT-RENAL-${renalRule.id}`,
            ruleCode: renalRule.ruleCode,
            severity: renalRule.severity,
            category: renalRule.category,
            title: `${renalRule.title} (Recorded eGFR: ${eGfrNum} mL/min)`,
            involvedMedicines: [drugPresent.resolvedGeneric],
            matchedRule: renalRule.id,
            whyFlagged: renalRule.clinicalRationale,
            evidence: renalRule.evidence,
            confidence: renalRule.confidence,
            limitations: renalRule.limitations,
            suggestedAction: renalRule.suggestedAction,
            sourceReference: "SYNTH-RENAL-REF-2026",
            patientEgfr: eGfrNum,
            threshold: renalRule.eGfrThreshold
          });
        }
      }
    });
  }

  // 5. Evaluate Clinical Condition & Pregnancy Contraindications
  CONTRAINDICATION_RULES.forEach(ctxRule => {
    // Condition check: Pregnancy
    if (ctxRule.conditionTrigger === "Pregnancy" && isPregnant) {
      const match = resolvedMedications.find(m => 
        ctxRule.drugNames.some(dn => dn.toLowerCase() === m.resolvedGeneric.toLowerCase()) ||
        (m.drugClass && m.drugClass.toLowerCase().includes(ctxRule.drugClass.toLowerCase()))
      );

      if (match) {
        alerts.push({
          id: `ALERT-CTX-${ctxRule.id}`,
          ruleCode: ctxRule.ruleCode,
          severity: ctxRule.severity,
          category: ctxRule.category,
          title: ctxRule.title,
          involvedMedicines: [match.resolvedGeneric],
          matchedRule: ctxRule.id,
          whyFlagged: ctxRule.clinicalRationale,
          evidence: ctxRule.evidence,
          confidence: ctxRule.confidence,
          limitations: ctxRule.limitations,
          suggestedAction: ctxRule.suggestedAction,
          sourceReference: "SYNTH-CTX-TERATOLOGY-REF"
        });
      }
    }

    // Condition check: Asthma
    if (ctxRule.conditionTrigger === "Asthma") {
      const hasAsthma = diagnosesList.some(d => d.includes("asthma") || d.includes("bronchospasm") || d.includes("copd"));
      if (hasAsthma) {
        const match = resolvedMedications.find(m => 
          ctxRule.drugNames.some(dn => dn.toLowerCase() === m.resolvedGeneric.toLowerCase())
        );
        if (match) {
          alerts.push({
            id: `ALERT-CTX-${ctxRule.id}`,
            ruleCode: ctxRule.ruleCode,
            severity: ctxRule.severity,
            category: ctxRule.category,
            title: ctxRule.title,
            involvedMedicines: [match.resolvedGeneric],
            matchedRule: ctxRule.id,
            whyFlagged: ctxRule.clinicalRationale,
            evidence: ctxRule.evidence,
            confidence: ctxRule.confidence,
            limitations: ctxRule.limitations,
            suggestedAction: ctxRule.suggestedAction,
            sourceReference: "SYNTH-CTX-RESP-REF"
          });
        }
      }
    }

    // Condition check: Peptic Ulcer Disease
    if (ctxRule.conditionTrigger === "Peptic Ulcer Disease") {
      const hasPud = diagnosesList.some(d => d.includes("ulcer") || d.includes("pud") || d.includes("gastritis") || d.includes("gi bleed"));
      if (hasPud) {
        const match = resolvedMedications.find(m => 
          ctxRule.drugNames.some(dn => dn.toLowerCase() === m.resolvedGeneric.toLowerCase())
        );
        if (match) {
          alerts.push({
            id: `ALERT-CTX-${ctxRule.id}`,
            ruleCode: ctxRule.ruleCode,
            severity: ctxRule.severity,
            category: ctxRule.category,
            title: ctxRule.title,
            involvedMedicines: [match.resolvedGeneric],
            matchedRule: ctxRule.id,
            whyFlagged: ctxRule.clinicalRationale,
            evidence: ctxRule.evidence,
            confidence: ctxRule.confidence,
            limitations: ctxRule.limitations,
            suggestedAction: ctxRule.suggestedAction,
            sourceReference: "SYNTH-CTX-GI-REF"
          });
        }
      }
    }
  });

  // Sort alerts by clinical severity (Critical first, then High, Moderate, Low)
  alerts.sort((a, b) => {
    const scoreA = SEVERITY_ORDER[a.severity] || 0;
    const scoreB = SEVERITY_ORDER[b.severity] || 0;
    return scoreB - scoreA;
  });

  // Severity count breakdown
  const severityCounts = {
    Critical: alerts.filter(a => a.severity === "Critical").length,
    High: alerts.filter(a => a.severity === "High").length,
    Moderate: alerts.filter(a => a.severity === "Moderate").length,
    Low: alerts.filter(a => a.severity === "Low").length
  };

  const categoryCounts = {
    "Drug-Drug Interaction": alerts.filter(a => a.category === "Drug-Drug Interaction").length,
    "Duplicate Therapy": alerts.filter(a => a.category === "Duplicate Therapy").length,
    "Kidney-Related Dose Concern": alerts.filter(a => a.category === "Kidney-Related Dose Concern").length,
    "Contraindication Flag": alerts.filter(a => a.category === "Contraindication Flag").length,
    "Uncertain Medication Identity": alerts.filter(a => a.category === "Uncertain Medication Identity").length
  };

  return {
    evaluatedAt: new Date().toISOString(),
    clinicalContext,
    medicationsCount: medications.length,
    resolvedMedications,
    alerts,
    severityCounts,
    categoryCounts,
    hasCriticalAlerts: severityCounts.Critical > 0,
    hasHighAlerts: severityCounts.High > 0,
    totalAlerts: alerts.length,
    hasNoAlerts: alerts.length === 0,
    statusMessage: alerts.length === 0
      ? "No issue detected in the available reference rules"
      : `${alerts.length} safety alert${alerts.length > 1 ? 's' : ''} flagged for clinician review`
  };
}
