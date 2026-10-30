/**
 * MediGuard AI - Brand / Generic Alias Matching Service
 * Levenshtein Distance & Fuzzy Matcher with Explainable Confidence Scoring
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import { DRUG_CATALOGUE } from "../data/drugReferenceCatalogue.js";
import { BRAND_TO_GENERIC, COMMON_MISSPELLINGS } from "../data/aliasMap.js";

/**
 * Calculates Levenshtein edit distance between two strings
 */
function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }
  return dp[m][n];
}

/**
 * Strips dosage suffixes (e.g. '500mg', '10 mg', 'oral') to reveal active name
 */
function stripDosageSuffix(term) {
  return term.replace(/[\s,\-]+(\d+(\.\d+)?\s*(mg|mcg|g|ml|iu|units?)|oral|tablet|capsule|tabs?|caps?)\b.*$/i, '').trim();
}

/**
 * Resolves an entered medication name against canonical drug reference
 * @param {string} inputName 
 * @returns {Object} Resolution candidate with confidence score and match reasoning
 */
export function resolveMedicineName(inputName) {
  if (!inputName || !inputName.trim()) {
    return null;
  }

  const rawCleaned = inputName.trim().toLowerCase();
  const baseCleaned = stripDosageSuffix(rawCleaned);
  const termsToTry = [rawCleaned];
  if (baseCleaned && baseCleaned !== rawCleaned) {
    termsToTry.push(baseCleaned);
  }

  // 1. Check exact match with canonical generic name
  for (const term of termsToTry) {
    const exactGeneric = DRUG_CATALOGUE.find(
      d => d.genericName.toLowerCase() === term
    );
    if (exactGeneric) {
      return {
        enteredTerm: inputName,
        canonicalDrug: exactGeneric,
        genericName: exactGeneric.genericName,
        rxNormId: exactGeneric.rxNormId,
        drugClass: exactGeneric.drugClass,
        matchType: term === rawCleaned ? "Exact Generic Standard" : "Generic Match (Dose Parsed)",
        confidence: 100,
        requiresConfirmation: false,
        reasoning: `Exact character-for-character match to canonical generic formulary '${exactGeneric.genericName}' (RxNorm: ${exactGeneric.rxNormId}).`
      };
    }
  }

  // 2. Check exact brand alias table
  for (const term of termsToTry) {
    if (BRAND_TO_GENERIC[term]) {
      const aliasInfo = BRAND_TO_GENERIC[term];
      const targetDrug = DRUG_CATALOGUE.find(d => d.genericName === aliasInfo.generic);
      return {
        enteredTerm: inputName,
        canonicalDrug: targetDrug,
        genericName: aliasInfo.generic,
        rxNormId: aliasInfo.rxNormId,
        drugClass: targetDrug?.drugClass || "Recognized Drug Class",
        matchType: aliasInfo.type,
        confidence: aliasInfo.matchConfidence,
        requiresConfirmation: false,
        reasoning: `Verified brand-to-generic mapping for '${inputName}' -> ${aliasInfo.generic} (${aliasInfo.type}).`
      };
    }
  }

  // 3. Check curated common phonetic/typographic misspellings
  for (const term of termsToTry) {
    if (COMMON_MISSPELLINGS[term]) {
      const misspelling = COMMON_MISSPELLINGS[term];
      const targetDrug = DRUG_CATALOGUE.find(d => d.genericName === misspelling.generic);
      const requiresConf = true; // Typographic errors require human verification before silent mapping
      return {
        enteredTerm: inputName,
        canonicalDrug: targetDrug,
        genericName: misspelling.generic,
        rxNormId: targetDrug?.rxNormId || "UNKNOWN",
        drugClass: targetDrug?.drugClass || "Class identified",
        matchType: "Typographic / Phonetic Misspelling",
        confidence: misspelling.confidence,
        requiresConfirmation: requiresConf,
        reasoning: `Detected probable typographic or phonetic prescription error for '${inputName}'. Suggested canonical target: '${misspelling.generic}'. Human confirmation required.`
      };
    }
  }

  // 4. Fuzzy Levenshtein Search across generic names and brand aliases
  let bestCandidate = null;
  let minDistance = 999;
  let bestSimilarity = 0;
  let matchCategory = "";

  const lookupTerm = baseCleaned || rawCleaned;

  DRUG_CATALOGUE.forEach(drug => {
    // Check against canonical generic name
    const distGeneric = levenshteinDistance(lookupTerm, drug.genericName.toLowerCase());
    const maxLenGeneric = Math.max(lookupTerm.length, drug.genericName.length);
    const simGeneric = Math.round((1 - distGeneric / maxLenGeneric) * 100);

    if (simGeneric > bestSimilarity) {
      bestSimilarity = simGeneric;
      minDistance = distGeneric;
      bestCandidate = drug;
      matchCategory = `Generic (${drug.genericName})`;
    }

    // Check against known brand aliases
    drug.brandAliases.forEach(alias => {
      const distAlias = levenshteinDistance(lookupTerm, alias.toLowerCase());
      const maxLenAlias = Math.max(lookupTerm.length, alias.length);
      const simAlias = Math.round((1 - distAlias / maxLenAlias) * 100);

      if (simAlias > bestSimilarity) {
        bestSimilarity = simAlias;
        minDistance = distAlias;
        bestCandidate = drug;
        matchCategory = `Brand Alias (${alias})`;
      }
    });
  });

  // Evaluate fuzzy thresholds
  if (bestSimilarity >= 88 && bestCandidate) {
    return {
      enteredTerm: inputName,
      canonicalDrug: bestCandidate,
      genericName: bestCandidate.genericName,
      rxNormId: bestCandidate.rxNormId,
      drugClass: bestCandidate.drugClass,
      matchType: `Fuzzy Distance (${matchCategory})`,
      confidence: bestSimilarity,
      requiresConfirmation: true, // Safety rule: human verification required for typos
      reasoning: `Fuzzy similarity search matched '${inputName}' to ${matchCategory} with ${bestSimilarity}% certainty. Human confirmation required.`
    };
  } else if (bestSimilarity >= 70 && bestCandidate) {
    return {
      enteredTerm: inputName,
      canonicalDrug: bestCandidate,
      genericName: bestCandidate.genericName,
      rxNormId: bestCandidate.rxNormId,
      drugClass: bestCandidate.drugClass,
      matchType: `Ambiguous Query (${matchCategory})`,
      confidence: bestSimilarity,
      requiresConfirmation: true,
      reasoning: `Ambiguous query '${inputName}' has low certainty (${bestSimilarity}% against ${matchCategory}). Prescriber must explicitly clarify intent.`
    };
  }

  // Unresolved
  return {
    enteredTerm: inputName,
    canonicalDrug: null,
    genericName: inputName,
    rxNormId: "UNKNOWN",
    drugClass: "Unresolved / Out of Catalogue",
    matchType: "Unresolved",
    confidence: bestSimilarity,
    requiresConfirmation: true,
    reasoning: `No matching medicine found for '${inputName}' within available catalogue thresholds (Best match: ${bestSimilarity}%).`
  };
}
