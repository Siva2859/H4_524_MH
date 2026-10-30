/**
 * MediGuard AI - Intelligent Diagnosis Name Normalization Service
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 * 
 * Sequence:
 * 1. Exact official condition name match
 * 2. Case-insensitive official condition name match
 * 3. Normalized punctuation and whitespace matching
 * 4. Supported medical synonym and alias matching
 * 5. Official condition ID match
 * 6. Controlled fuzzy spelling matching (Levenshtein distance)
 * 7. Ambiguous or unresolved diagnosis handling
 */

import {
  CANONICAL_CONDITIONS,
  CANONICAL_CONDITIONS_MAP,
  CONDITION_ALIASES,
  COMMON_DIAGNOSIS_TYPOS
} from "../data/conditionCatalogue.js";

/**
 * Calculates Levenshtein edit distance between two strings
 */
export function calculateLevenshteinDistance(a, b) {
  if (!a) return b ? b.length : 0;
  if (!b) return a.length;

  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
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
 * Normalizes punctuation, hyphens, slashes, and collapses whitespace
 */
export function normalizeDiagnosisText(str) {
  if (!str) return "";
  return str
    .replace(/[.,;:_\-/\\()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Resolves an individual diagnosis term against the official H4 condition catalogue
 * @param {string} rawTerm - The raw diagnosis term entered by user
 * @returns {Object} Resolution candidate with metadata and confirmation requirement
 */
export function resolveSingleDiagnosis(rawTerm) {
  if (!rawTerm || !rawTerm.trim()) {
    return {
      rawInput: "",
      canonicalName: null,
      conditionId: null,
      confidence: 0,
      matchType: "empty",
      reason: "Empty diagnosis term",
      requiresConfirmation: false,
      isCanonical: false,
      isKnown: false
    };
  }

  const trimmed = rawTerm.trim();
  const lower = trimmed.toLowerCase();
  const normalizedPunct = normalizeDiagnosisText(lower);

  // 1. Exact official condition name match
  const exactNameMatch = CANONICAL_CONDITIONS.find(c => c.conditionName === trimmed);
  if (exactNameMatch) {
    return {
      rawInput: trimmed,
      canonicalName: exactNameMatch.conditionName,
      conditionId: exactNameMatch.conditionId,
      confidence: 100,
      matchType: "exact",
      reason: "Exact official condition match",
      requiresConfirmation: false,
      isCanonical: true,
      isKnown: true
    };
  }

  // 2. Case-insensitive official condition name match
  const caseNameMatch = CANONICAL_CONDITIONS.find(
    c => c.conditionName.toLowerCase() === lower
  );
  if (caseNameMatch) {
    return {
      rawInput: trimmed,
      canonicalName: caseNameMatch.conditionName,
      conditionId: caseNameMatch.conditionId,
      confidence: 99,
      matchType: "case_insensitive",
      reason: "Case-insensitive official match",
      requiresConfirmation: caseNameMatch.conditionName !== trimmed,
      isCanonical: caseNameMatch.conditionName === trimmed,
      isKnown: true
    };
  }

  // 3. Normalized punctuation and whitespace matching against condition name
  const punctMatch = CANONICAL_CONDITIONS.find(c => {
    const cNorm = normalizeDiagnosisText(c.conditionName.toLowerCase());
    return cNorm === normalizedPunct;
  });
  if (punctMatch) {
    return {
      rawInput: trimmed,
      canonicalName: punctMatch.conditionName,
      conditionId: punctMatch.conditionId,
      confidence: 98,
      matchType: "normalized_punctuation",
      reason: "Punctuation and whitespace normalized",
      requiresConfirmation: true,
      isCanonical: false,
      isKnown: true
    };
  }

  // 4. Supported medical synonym, abbreviation, and clinical alias
  if (CONDITION_ALIASES[lower] || CONDITION_ALIASES[normalizedPunct]) {
    const condId = CONDITION_ALIASES[lower] || CONDITION_ALIASES[normalizedPunct];
    const canonical = CANONICAL_CONDITIONS_MAP[condId];
    if (canonical) {
      return {
        rawInput: trimmed,
        canonicalName: canonical.conditionName,
        conditionId: canonical.conditionId,
        confidence: 95,
        matchType: "synonym_alias",
        reason: "Recognized medical acronym / clinical alias",
        requiresConfirmation: true,
        isCanonical: false,
        isKnown: true
      };
    }
  }

  // 5. Official condition ID match
  const exactIdMatch = CANONICAL_CONDITIONS.find(c => c.conditionId === lower);
  if (exactIdMatch) {
    return {
      rawInput: trimmed,
      canonicalName: exactIdMatch.conditionName,
      conditionId: exactIdMatch.conditionId,
      confidence: 95,
      matchType: "official_id",
      reason: "Official condition ID match",
      requiresConfirmation: true,
      isCanonical: false,
      isKnown: true
    };
  }

  // 6. Common diagnosis misspellings lookup
  if (COMMON_DIAGNOSIS_TYPOS[lower] || COMMON_DIAGNOSIS_TYPOS[normalizedPunct]) {
    const condId = COMMON_DIAGNOSIS_TYPOS[lower] || COMMON_DIAGNOSIS_TYPOS[normalizedPunct];
    const canonical = CANONICAL_CONDITIONS_MAP[condId];
    if (canonical) {
      return {
        rawInput: trimmed,
        canonicalName: canonical.conditionName,
        conditionId: canonical.conditionId,
        confidence: 90,
        matchType: "known_spelling_typo",
        reason: "Common spelling mistake corrected",
        requiresConfirmation: true,
        isCanonical: false,
        isKnown: true
      };
    }
  }

  // 6b. Controlled fuzzy spelling matching (Levenshtein distance)
  let bestCandidate = null;
  let bestDist = Infinity;
  let bestScore = 0;

  // Test against canonical condition names
  for (const c of CANONICAL_CONDITIONS) {
    const cNameLower = c.conditionName.toLowerCase();
    const dist = calculateLevenshteinDistance(lower, cNameLower);
    const maxLen = Math.max(lower.length, cNameLower.length);
    const score = Math.round((1 - dist / maxLen) * 100);

    // Controlled threshold: >= 75% similarity with max distance threshold
    const maxAllowedDist = maxLen <= 5 ? 1 : maxLen <= 10 ? 2 : 3;
    if (dist <= maxAllowedDist && score >= 75 && dist < bestDist) {
      bestDist = dist;
      bestScore = score;
      bestCandidate = c;
    }
  }

  // Also test against aliases for fuzzy typos of abbreviations / synonyms
  if (!bestCandidate) {
    for (const [alias, cid] of Object.entries(CONDITION_ALIASES)) {
      if (alias.length >= 4) { // Only fuzzy match aliases of reasonable length
        const dist = calculateLevenshteinDistance(lower, alias);
        const maxLen = Math.max(lower.length, alias.length);
        const score = Math.round((1 - dist / maxLen) * 100);
        const maxAllowedDist = maxLen <= 5 ? 1 : 2;

        if (dist <= maxAllowedDist && score >= 75 && dist < bestDist) {
          bestDist = dist;
          bestScore = score;
          bestCandidate = CANONICAL_CONDITIONS_MAP[cid];
        }
      }
    }
  }

  if (bestCandidate && bestScore >= 75) {
    return {
      rawInput: trimmed,
      canonicalName: bestCandidate.conditionName,
      conditionId: bestCandidate.conditionId,
      confidence: bestScore,
      matchType: "fuzzy_spelling",
      reason: `Fuzzy spelling match (edit distance ${bestDist})`,
      requiresConfirmation: true,
      isCanonical: false,
      isKnown: true
    };
  }

  // 7. Ambiguous or unresolved diagnosis handling
  return {
    rawInput: trimmed,
    canonicalName: null,
    conditionId: null,
    confidence: 0,
    matchType: "unresolved",
    reason: "Unrecognized / custom clinical condition (preserved without auto-replacement)",
    requiresConfirmation: false,
    isCanonical: false,
    isKnown: false
  };
}

/**
 * Parses and resolves multiple comma-separated diagnoses
 * @param {string|Array<string>} input - Comma-separated string or array of diagnosis terms
 * @returns {Array<Object>} Array of resolved diagnosis objects
 */
export function resolveMultipleDiagnoses(input) {
  if (!input) return [];

  let terms = [];
  if (Array.isArray(input)) {
    terms = input;
  } else if (typeof input === "string") {
    terms = input.split(",");
  } else {
    return [];
  }

  return terms
    .map(t => t.trim())
    .filter(Boolean)
    .map((term, index) => {
      const res = resolveSingleDiagnosis(term);
      return {
        ...res,
        index
      };
    });
}

/**
 * Replaces a specific diagnosis in a comma-separated string with its confirmed canonical name
 * @param {string} originalString - The current comma-separated diagnosis text
 * @param {number} targetIndex - Index of the item to update
 * @param {string} canonicalName - The canonical condition name to insert
 * @returns {string} Updated comma-separated string
 */
export function applyDiagnosisConfirmation(originalString, targetIndex, canonicalName) {
  if (!originalString) return canonicalName;
  const items = originalString.split(",").map(s => s.trim()).filter(Boolean);
  if (targetIndex >= 0 && targetIndex < items.length) {
    items[targetIndex] = canonicalName;
  }
  return items.join(", ");
}
