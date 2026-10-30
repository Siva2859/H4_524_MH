/**
 * MediGuard AI - Multilingual Support & Parity Verification Test
 * 
 * Tests:
 * 1. Languages definition parity & metadata
 * 2. Translation key parity across en, te, and hi dictionaries
 * 3. Clinical explanation coverage for all 30 safety rules in Telugu & Hindi
 * 4. Preservation of medicine names, doses, and clinical abbreviations
 * 5. Dynamic alert translation behavior with fallback safety
 */

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../i18n/languages.js';
import { en } from '../i18n/translations/en.js';
import { te } from '../i18n/translations/te.js';
import { hi } from '../i18n/translations/hi.js';
import { RULE_EXPLANATION_TRANSLATIONS, translateAlert } from '../i18n/clinicalExplanations.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log("\n========================================================");
console.log("  MediGuard AI - Multilingual & Parity Verification Suite");
console.log("========================================================\n");

// 1. Language Definitions
console.log("[1] Language Definitions & Metadata:");
assert(SUPPORTED_LANGUAGES.en !== undefined, "English ('en') is defined");
assert(SUPPORTED_LANGUAGES.te !== undefined, "Telugu ('te') is defined");
assert(SUPPORTED_LANGUAGES.hi !== undefined, "Hindi ('hi') is defined");
assert(SUPPORTED_LANGUAGES.te.nativeName === "తెలుగు", "Telugu native name is 'తెలుగు'");
assert(SUPPORTED_LANGUAGES.hi.nativeName === "हिन्दी", "Hindi native name is 'हिन्दी'");
assert(DEFAULT_LANGUAGE === "en", "Default fallback language is English");

// 2. Dictionary Key Parity
console.log("\n[2] Translation Dictionary Structure Parity (en vs te vs hi):");
function checkKeyParity(baseObj, targetObj, langName, path = '') {
  for (const key of Object.keys(baseObj)) {
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof baseObj[key] === 'object' && baseObj[key] !== null) {
      assert(targetObj && typeof targetObj[key] === 'object', `Section '${currentPath}' exists in ${langName}`);
      checkKeyParity(baseObj[key], targetObj ? targetObj[key] : {}, langName, currentPath);
    } else {
      assert(targetObj && typeof targetObj[key] === 'string' && targetObj[key].length > 0, `Key '${currentPath}' is translated in ${langName}`);
    }
  }
}

console.log("Checking Telugu parity:");
checkKeyParity(en, te, "Telugu (te)");

console.log("Checking Hindi parity:");
checkKeyParity(en, hi, "Hindi (hi)");

// 3. Clinical Rules Translation Coverage
console.log("\n[3] Clinical Safety Rules Localization Coverage (30 Rules):");
const requiredRules = [
  "RULE-DDI-001", "RULE-DDI-002", "RULE-DDI-003", "RULE-DDI-004", "RULE-DDI-005",
  "RULE-DDI-006", "RULE-DDI-007", "RULE-DDI-008", "RULE-DDI-009", "RULE-DDI-010",
  "RULE-DUP-001", "RULE-DUP-002", "RULE-DUP-003", "RULE-DUP-004", "RULE-DUP-005",
  "RULE-REN-001", "RULE-REN-002", "RULE-REN-003", "RULE-REN-004", "RULE-REN-005",
  "RULE-REN-006", "RULE-REN-007", "RULE-CTX-001", "RULE-CTX-002", "RULE-CTX-003",
  "RULE-CTX-004", "RULE-CTX-005", "RULE-CTX-006", "RULE-CTX-007", "ALERT-HUMAN-CONFIRM-REQ"
];

for (const ruleId of requiredRules) {
  const trans = RULE_EXPLANATION_TRANSLATIONS[ruleId];
  assert(trans !== undefined, `Rule ${ruleId} exists in clinical dictionary`);
  if (trans) {
    assert(trans.te && trans.te.whyFlagged && trans.te.suggestedAction, `Rule ${ruleId} has Telugu rationale & action`);
    assert(trans.hi && trans.hi.whyFlagged && trans.hi.suggestedAction, `Rule ${ruleId} has Hindi rationale & action`);
  }
}

// 4. Alert Translation & Drug Protection Testing
console.log("\n[4] Clinical Alert Translation & Drug Name Protection:");
const mockAlert = {
  id: "test-alert-1",
  matchedRule: "RULE-DDI-001",
  severity: "Critical",
  category: "Drug-Drug Interaction",
  title: "Major Bleeding Risk: Warfarin + Aspirin",
  involvedMedicines: ["Warfarin", "Aspirin"],
  whyFlagged: "Coadministration significantly amplifies the risk of major hemorrhage.",
  suggestedAction: "Review clinical indication for combination.",
  confidence: "High (Deterministic Formulary Rule)"
};

// Translate to Telugu
const teAlert = translateAlert(mockAlert, 'te');
assert(teAlert.matchedRule === "RULE-DDI-001", "Telugu alert preserves Rule ID: RULE-DDI-001");
assert(teAlert.involvedMedicines[0] === "Warfarin" && teAlert.involvedMedicines[1] === "Aspirin", "Telugu alert strictly preserves drug names 'Warfarin' and 'Aspirin'");
assert(teAlert.severity === "Critical", "Telugu alert preserves severity 'Critical'");
assert(teAlert.whyFlagged.includes("రక్తస్రావం"), "Telugu alert contains authentic Telugu clinical rationale");
assert(teAlert.suggestedAction.includes("సమీక్షించండి"), "Telugu alert contains authentic Telugu clinician action");

// Translate to Hindi
const hiAlert = translateAlert(mockAlert, 'hi');
assert(hiAlert.matchedRule === "RULE-DDI-001", "Hindi alert preserves Rule ID: RULE-DDI-001");
assert(hiAlert.involvedMedicines[0] === "Warfarin" && hiAlert.involvedMedicines[1] === "Aspirin", "Hindi alert strictly preserves drug names 'Warfarin' and 'Aspirin'");
assert(hiAlert.severity === "Critical", "Hindi alert preserves severity 'Critical'");
assert(hiAlert.whyFlagged.includes("रक्तस्राव"), "Hindi alert contains authentic Hindi clinical rationale");
assert(hiAlert.suggestedAction.includes("समीक्षा करें"), "Hindi alert contains authentic Hindi clinician action");

// Fallback behavior on unmapped rule
const fallbackAlert = translateAlert({
  id: "test-fallback",
  matchedRule: "RULE-UNKNOWN-999",
  title: "Unknown Alert Title",
  whyFlagged: "Original English Rationale",
  suggestedAction: "Original English Action",
  involvedMedicines: ["DrugA", "DrugB"]
}, 'te');

assert(fallbackAlert.title === "Unknown Alert Title", "Unmapped rule falls back gracefully to English title");
assert(fallbackAlert.whyFlagged === "Original English Rationale", "Unmapped rule falls back gracefully to English rationale");
assert(fallbackAlert.suggestedAction === "Original English Action", "Unmapped rule falls back gracefully to English action");

// Summary
console.log("\n========================================================");
console.log(`  Tests Passed: ${passed} | Tests Failed: ${failed}`);
console.log("========================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("  ALL MULTILINGUAL & PARITY VERIFICATION TESTS PASSED!\n");
}
