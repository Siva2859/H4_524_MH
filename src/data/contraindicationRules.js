/**
 * MediGuard AI - Illustrative Clinical Contraindication Rules
 * SYNTHETIC / DEMO RULES - Not clinically validated.
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

export const CONTRAINDICATION_RULES = [
  {
    id: "RULE-CTX-001",
    ruleCode: "CTX-PREG-ACE",
    drugClass: "Antihypertensive (ACE Inhibitor)",
    drugNames: ["Lisinopril"],
    conditionTrigger: "Pregnancy",
    severity: "Critical",
    title: "Black Box Contraindication: ACE Inhibitor in Pregnancy",
    category: "Contraindication Flag",
    clinicalRationale: "Drugs acting directly on the renin-angiotensin system during the second and third trimesters reduce fetal renal function and increase fetal and neonatal morbidity and death (oligohydramnios, skull hypoplasia, fetal renal failure).",
    evidence: "Demo Reference REF-CTX-301 (Illustrative FDA Boxed Warning and teratology registries).",
    confidence: "99% (Clinical condition and drug class match)",
    limitations: "Illustrative demo rule: Applies if pregnancy status is positive or suspected.",
    suggestedAction: "Discontinue immediately. Substitute with pregnancy-compatible antihypertensive agents such as Labetalol, Nifedipine (extended-release), or Methyldopa."
  },
  {
    id: "RULE-CTX-002",
    ruleCode: "CTX-PREG-ARB",
    drugClass: "Antihypertensive (Angiotensin II Receptor Blocker - ARB)",
    drugNames: ["Losartan"],
    conditionTrigger: "Pregnancy",
    severity: "Critical",
    title: "Black Box Contraindication: ARB in Pregnancy",
    category: "Contraindication Flag",
    clinicalRationale: "ARBs cause fetal hypotension, oligohydramnios sequence, pulmonary hypoplasia, and fetal death when administered during pregnancy.",
    evidence: "Demo Reference REF-CTX-302 (Illustrative boxed warning summary).",
    confidence: "99% (Clinical condition match)",
    limitations: "Illustrative demo rule: Triggers upon recorded pregnancy flag.",
    suggestedAction: "Discontinue immediately. Review blood pressure with maternal-fetal medicine specialist."
  },
  {
    id: "RULE-CTX-003",
    ruleCode: "CTX-PREG-MTX",
    drugClass: "Antirheumatic / Antineoplastic (Antifolate)",
    drugNames: ["Methotrexate"],
    conditionTrigger: "Pregnancy",
    severity: "Critical",
    title: "Strict Teratogenic Contraindication: Methotrexate in Pregnancy",
    category: "Contraindication Flag",
    clinicalRationale: "Methotrexate is a potent folic acid antagonist causing embryopathy, craniofacial abnormalities, skeletal malformations, and spontaneous abortion.",
    evidence: "Demo Reference REF-CTX-303 (Illustrative teratogenicity consensus).",
    confidence: "99% (Clinical condition match)",
    limitations: "Illustrative demo rule: Absolute contraindication in pregnancy.",
    suggestedAction: "Discontinue immediately and refer for urgent obstetric and teratology counseling."
  },
  {
    id: "RULE-CTX-004",
    ruleCode: "CTX-PREG-WAR",
    drugClass: "Anticoagulant (Vitamin K Antagonist)",
    drugNames: ["Warfarin"],
    conditionTrigger: "Pregnancy",
    severity: "Critical",
    title: "Teratogenic Hazard: Warfarin in Pregnancy",
    category: "Contraindication Flag",
    clinicalRationale: "Crosses placental barrier readily, causing Warfarin Embryopathy (nasal hypoplasia, stippled epiphyses, microcephaly) and high risk of maternal and fetal hemorrhage.",
    evidence: "Demo Reference REF-CTX-304 (Illustrative obstetric hematology reference).",
    confidence: "99% (Clinical condition match)",
    limitations: "Illustrative demo rule: Low Molecular Weight Heparins (e.g. Enoxaparin) do not cross placenta and are preferred alternatives.",
    suggestedAction: "Switch to therapeutic Low Molecular Weight Heparin (e.g. Enoxaparin) in consultation with hematology."
  },
  {
    id: "RULE-CTX-005",
    ruleCode: "CTX-PREG-STAT",
    drugClass: "Lipid-lowering (HMG-CoA Reductase Inhibitor / Statin)",
    drugNames: ["Atorvastatin", "Simvastatin"],
    conditionTrigger: "Pregnancy",
    severity: "High",
    title: "Contraindication in Pregnancy: Statin Therapy",
    category: "Contraindication Flag",
    clinicalRationale: "Cholesterol and cholesterol derivatives are essential for fetal organ and skeletal development. Statins interrupt fetal sterol synthesis.",
    evidence: "Demo Reference REF-CTX-305 (Illustrative safety guidelines).",
    confidence: "98% (Clinical condition match)",
    limitations: "Illustrative demo rule: Treatment of hyperlipidemia can almost always be safely deferred during pregnancy and lactation.",
    suggestedAction: "Discontinue statin therapy for the duration of pregnancy and breastfeeding."
  },
  {
    id: "RULE-CTX-006",
    ruleCode: "CTX-ASTHMA-BB",
    drugClass: "Antihypertensive (Non-selective Beta Blocker)",
    drugNames: ["Propranolol"],
    conditionTrigger: "Asthma",
    severity: "Critical",
    title: "Life-Threatening Bronchospasm Hazard: Non-selective Beta-blocker in Asthma",
    category: "Contraindication Flag",
    clinicalRationale: "Non-selective beta blockade antagonizes beta-2 adrenoceptors in bronchial smooth muscle, triggering severe, potentially fatal bronchospasm and refractoriness to beta-agonist rescue inhalers.",
    evidence: "Demo Reference REF-CTX-306 (Illustrative respiratory pharmacology safety guidance).",
    confidence: "98% (Condition and pharmacological match)",
    limitations: "Illustrative demo rule: Applies to all non-selective beta blockers; cardioselective agents (e.g. Metoprolol, Bisoprolol) carry lower but cautious risk.",
    suggestedAction: "Avoid non-selective beta blockers in patients with asthma or severe bronchospastic airway disease. Switch to cardioselective beta-1 blocker or non-beta-blocker antihypertensive."
  },
  {
    id: "RULE-CTX-007",
    ruleCode: "CTX-PUD-NSAID",
    drugClass: "NSAID (Non-selective)",
    drugNames: ["Ibuprofen", "Naproxen", "Aspirin"],
    conditionTrigger: "Peptic Ulcer Disease",
    severity: "High",
    title: "Gastrointestinal Perforation / Hemorrhage Risk: NSAID in Peptic Ulcer Disease",
    category: "Contraindication Flag",
    clinicalRationale: "Systemic NSAIDs inhibit COX-1-mediated mucosal prostaglandin production, compromising gastric cytoprotection, reducing mucosal blood flow, and directly promoting ulcer recurrence, acute GI bleeding, and perforation.",
    evidence: "Demo Reference REF-CTX-307 (Illustrative gastroenterology consensus).",
    confidence: "97% (Condition and class match)",
    limitations: "Illustrative demo rule: Patient history of active vs healed ulcer with PPI co-therapy is modeled conservatively.",
    suggestedAction: "Avoid systemic oral NSAIDs. If pain relief is urgently required, evaluate monitored Acetaminophen or non-pharmacologic modalities."
  }
];
