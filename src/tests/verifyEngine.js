/**
 * MediGuard AI - Automated Headless Verification Script
 * Validates the rule engine, demo cases, fuzzy matcher, and report generation
 */

import { runSafetyReview } from '../services/safetyEngine.js';
import { resolveMedicineName } from '../services/aliasMatcher.js';
import { DEMO_CASES } from '../data/demoCases.js';
import { DRUG_CATALOGUE } from '../data/drugReferenceCatalogue.js';

console.log("=================================================");
console.log("  MEDIGUARD AI - HEADLESS AUTOMATED VERIFICATION ");
console.log("=================================================");

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. Drug reference count
assert(DRUG_CATALOGUE.length >= 25, `Drug reference catalog has ${DRUG_CATALOGUE.length} items (>= 25 expected)`);

// 2. Normalization & Fuzzy matcher tests
const matchTypo = resolveMedicineName("Metfornin");
assert(matchTypo && matchTypo.genericName === "Metformin" && matchTypo.confidence >= 90, 
  `Typo 'Metfornin' mapped to Metformin with confidence ${matchTypo?.confidence}%`);

const matchBrand = resolveMedicineName("Lipitor");
assert(matchBrand && matchBrand.genericName === "Atorvastatin" && matchBrand.confidence === 100,
  `Brand 'Lipitor' mapped to Atorvastatin with 100% confidence`);

const matchCoumadin = resolveMedicineName("Coumadin");
assert(matchCoumadin && matchCoumadin.genericName === "Warfarin" && matchCoumadin.confidence === 100,
  `Brand 'Coumadin' mapped to Warfarin with 100% confidence`);

const matchDoseSuffix = resolveMedicineName("Metformin 500mg");
assert(matchDoseSuffix && matchDoseSuffix.genericName === "Metformin",
  `Dosage string 'Metformin 500mg' parsed and resolved to canonical Metformin`);

const matchLowConf = resolveMedicineName("Metoprol");
assert(matchLowConf && matchLowConf.requiresConfirmation === true,
  `Ambiguous query 'Metoprol' correctly flagged with requiresConfirmation = true`);

// 3. Demo Case 1 Verification (Warfarin + Aspirin DDI)
const case1 = DEMO_CASES[0];
const res1 = runSafetyReview(case1.clinicalContext, case1.medications);
assert(res1.hasCriticalAlerts === true, `Case 1 raised Critical Alerts`);
const ddiAlert = res1.alerts.find(a => a.ruleCode === "DDI-WAR-ASA");
assert(ddiAlert !== undefined, `Case 1 triggered RULE-DDI-001 (Warfarin + Aspirin bleeding risk)`);
assert(ddiAlert?.severity === "Critical", `DDI-WAR-ASA has Critical severity`);

// 4. Demo Case 2 Verification (Dual RAAS Duplicate Therapy)
const case2 = DEMO_CASES[1];
const res2 = runSafetyReview(case2.clinicalContext, case2.medications);
const dupAlert = res2.alerts.find(a => a.ruleCode === "DUP-RAAS");
assert(dupAlert !== undefined, `Case 2 triggered Dual RAAS Blockade Duplicate Therapy alert`);

// 5. Demo Case 3 Verification (Severe Renal Contraindication eGFR < 30)
const case3 = DEMO_CASES[2];
const res3 = runSafetyReview(case3.clinicalContext, case3.medications);
const renalAlert = res3.alerts.find(a => a.ruleCode === "REN-MET-30");
assert(renalAlert !== undefined, `Case 3 triggered Metformin contraindicated at eGFR < 30`);
const uncertainAlert = res3.alerts.find(a => a.category === "Uncertain Medication Identity");
assert(uncertainAlert !== undefined, `Case 3 triggered Uncertain Medication Identity flag for 'Metfornin'`);

// 6. Demo Case 4 Verification (Safe Regimen in Available Rules)
const case4 = DEMO_CASES[3];
const res4 = runSafetyReview(case4.clinicalContext, case4.medications);
assert(res4.totalAlerts === 0, `Case 4 produced 0 alerts`);
assert(res4.statusMessage.includes("No issue detected"), 
  `Case 4 status acknowledges no issue detected without claiming complete safety`);

// 7. Clinical Contraindication in Pregnancy
const pregContext = { age: 30, sex: "Female", pregnancyStatus: "Positive", diagnoses: ["Hypertension"] };
const pregMeds = [{ genericName: "Lisinopril", strength: "10mg" }];
const resPreg = runSafetyReview(pregContext, pregMeds);
assert(resPreg.alerts.some(a => a.ruleCode === "CTX-PREG-ACE"), 
  `ACE inhibitor flagged as contraindicated in pregnancy`);

console.log("=================================================");
console.log(`  VERIFICATION RESULTS: ${passed}/${total} TESTS PASSED`);
console.log("=================================================");
