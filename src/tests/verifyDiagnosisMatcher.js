/**
 * MediGuard AI - Intelligent Diagnosis Name Normalization Test Suite
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import {
  resolveSingleDiagnosis,
  resolveMultipleDiagnoses,
  applyDiagnosisConfirmation
} from "../services/diagnosisMatcher.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`❌ FAILED: ${message}`);
  }
}

console.log("=== MediGuard AI: Diagnosis Normalization Verification ===");

// 1. Exact Canonical Match
const exact1 = resolveSingleDiagnosis("Hypertension");
assert(exact1.canonicalName === "Hypertension", "Exact match canonicalName");
assert(exact1.confidence === 100, "Exact match confidence is 100");
assert(exact1.matchType === "exact", "Exact match matchType");
assert(exact1.requiresConfirmation === false, "Exact match does not require confirmation");
assert(exact1.isCanonical === true, "Exact match is canonical");

const exact2 = resolveSingleDiagnosis("Asthma");
assert(exact2.canonicalName === "Asthma" && exact2.confidence === 100, "Exact match for Asthma");

const exact3 = resolveSingleDiagnosis("heart_failure");
assert(exact3.canonicalName === "Heart failure" && exact3.conditionId === "heart_failure", "Condition resolution for heart_failure");

// 2. Case-Insensitive Match
const case1 = resolveSingleDiagnosis("hypertension");
assert(case1.canonicalName === "Hypertension", "Case-insensitive hypertension");
assert(case1.confidence === 99, "Case-insensitive confidence is 99");
assert(case1.matchType === "case_insensitive", "Case-insensitive matchType");

const case2 = resolveSingleDiagnosis("gout");
assert(case2.canonicalName === "Gout", "Case-insensitive gout");

// 3. Normalized Punctuation and Whitespace
const punct1 = resolveSingleDiagnosis("Stroke / TIA");
assert(punct1.canonicalName === "Stroke / TIA", "Punctuation preservation for Stroke / TIA");

const punct2 = resolveSingleDiagnosis("Type-2  Diabetes  Mellitus.");
assert(punct2.canonicalName === "Type 2 diabetes mellitus", "Punctuation normalized for Type-2 Diabetes Mellitus.");
assert(punct2.confidence === 98, "Punctuation normalized confidence is 98");
assert(punct2.matchType === "normalized_punctuation", "Punctuation normalized matchType");

// 4. Medical Synonyms and Clinical Abbreviations
const synCases = [
  { input: "HTN", expected: "Hypertension", id: "hypertension" },
  { input: "T2DM", expected: "Type 2 diabetes mellitus", id: "type2_diabetes" },
  { input: "DM2", expected: "Type 2 diabetes mellitus", id: "type2_diabetes" },
  { input: "CKD 3b", expected: "Chronic kidney disease", id: "ckd" },
  { input: "CHF", expected: "Heart failure", id: "heart_failure" },
  { input: "HFrEF", expected: "Heart failure", id: "heart_failure" },
  { input: "AF", expected: "Atrial fibrillation", id: "atrial_fibrillation" },
  { input: "Afib", expected: "Atrial fibrillation", id: "atrial_fibrillation" },
  { input: "BA", expected: "Asthma", id: "asthma" },
  { input: "PUD", expected: "Peptic ulcer disease / GI bleed", id: "peptic_ulcer" },
  { input: "GERD", expected: "Acid peptic disease / GERD", id: "gerd" },
  { input: "CLD", expected: "Chronic liver disease / cirrhosis", id: "chronic_liver_disease" },
  { input: "OA", expected: "Osteoarthritis", id: "osteoarthritis" },
  { input: "RA", expected: "Rheumatoid arthritis", id: "rheumatoid_arthritis" },
  { input: "LBP", expected: "Low back pain / spondylosis", id: "low_back_pain" },
  { input: "MDD", expected: "Depression", id: "depression" },
  { input: "GAD", expected: "Anxiety disorder", id: "anxiety" },
  { input: "BPH", expected: "Benign prostatic hyperplasia", id: "bph" },
  { input: "UTI", expected: "Urinary tract infection", id: "uti" },
  { input: "TB", expected: "Tuberculosis (on treatment)", id: "tuberculosis" }
];

synCases.forEach(sc => {
  const res = resolveSingleDiagnosis(sc.input);
  assert(
    res.canonicalName === sc.expected,
    `Synonym '${sc.input}' resolved to '${sc.expected}' (got: '${res.canonicalName}')`
  );
  assert(res.conditionId === sc.id, `Synonym '${sc.input}' mapped to conditionId '${sc.id}'`);
  assert(res.confidence === 95, `Synonym confidence is 95`);
  assert(res.requiresConfirmation === true, `Synonym requires user confirmation`);
});

// 5. Controlled Fuzzy Spelling Matching
const typoCases = [
  { input: "Diabtes Mellitus", expected: "Type 2 diabetes mellitus" },
  { input: "Hypertenson", expected: "Hypertension" },
  { input: "Ashtma", expected: "Asthma" },
  { input: "Peptc Ulcer", expected: "Peptic ulcer disease / GI bleed" },
  { input: "Chrnoic Kidney Disease", expected: "Chronic kidney disease" }
];

typoCases.forEach(tc => {
  const res = resolveSingleDiagnosis(tc.input);
  assert(
    res.canonicalName === tc.expected,
    `Typo '${tc.input}' corrected to '${tc.expected}' (got: '${res.canonicalName}')`
  );
  assert(res.confidence >= 75, `Typo '${tc.input}' confidence >= 75% (was ${res.confidence})`);
  assert(res.requiresConfirmation === true, `Typo correction requires confirmation`);
});

// 6. Multiple Diagnoses Support
const multiInput = "Type 2 Diabtes, Hypertenson, Chronic Kidney Diseas Stage 4, Unknown Condition XYZ";
const multiResults = resolveMultipleDiagnoses(multiInput);

assert(multiResults.length === 4, "Parsed 4 comma-separated diagnoses");
assert(multiResults[0].canonicalName === "Type 2 diabetes mellitus", "Multi 0 resolved");
assert(multiResults[1].canonicalName === "Hypertension", "Multi 1 resolved");
assert(multiResults[2].canonicalName === "Chronic kidney disease", "Multi 2 resolved");
assert(multiResults[3].isKnown === false, "Multi 3 unknown preserved");
assert(multiResults[3].rawInput === "Unknown Condition XYZ", "Multi 3 rawInput preserved");

// 7. Applying Confirmation
const updatedText = applyDiagnosisConfirmation(
  "Type 2 Diabtes, Hypertenson, CKD",
  1,
  "Hypertension"
);
assert(
  updatedText === "Type 2 Diabtes, Hypertension, CKD",
  `Confirmation replaced item 1 with canonical name (got: '${updatedText}')`
);

// 8. Unresolved / Unknown Diagnosis Handling
const unknownRes = resolveSingleDiagnosis("Syndrome of Undiagnosed Rare Origin 99");
assert(unknownRes.canonicalName === null, "Unknown canonicalName is null");
assert(unknownRes.isKnown === false, "Unknown isKnown is false");
assert(unknownRes.matchType === "unresolved", "Unknown matchType is unresolved");
assert(unknownRes.requiresConfirmation === false, "Unknown does not auto-prompt replacement");

// 9. Empty Input Handling
const emptyRes = resolveSingleDiagnosis("");
assert(emptyRes.matchType === "empty", "Empty input handled safely");
const emptyMulti = resolveMultipleDiagnoses("");
assert(emptyMulti.length === 0, "Empty multi-input returns empty array");

// Summary
console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("✅ All diagnosis normalization tests PASSED successfully!");
}
