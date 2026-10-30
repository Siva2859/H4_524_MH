/**
 * MediGuard AI - Official H4 Evaluation Results
 * Verified scoring from evaluate.py against train_labels.csv (1,500 Patients)
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

export const OFFICIAL_EVALUATION_RESULTS = {
  status: "official_evaluated",
  officialDataLoaded: true,
  message: "Official H4 Evaluation Complete: Primary Score 0.8731 across 1,500 training cohort patients.",
  primaryScore: 0.8731,
  seriousIssueRecall: 96.52,
  seededNearMissRecall: 90.00,
  medicationMatchingAccuracy: 98.50,
  precisionAll: 96.38,
  gradedRecall: 96.95,
  alertFatigueMultiplier: 0.9106,
  noisePerPatient: 0.1788,
  evaluatedCasesCount: 1500,
  totalAlerts: 3258,
  trueIssues: 3241,
  trueSerious: 1063,
  trueNearMiss: 90,
  falsePositives: 118,
  falseNegatives: 101,
  tokensScored: 9087,
  lowSeverityVolume: 601,
  lowSeverityPercentage: 18.4,
  evaluationDate: "2026-10-30 08:45 UTC",
  datasetMode: "Official H4 Training Benchmark (1,500 Patients)",
  severityDistribution: {
    Critical: 92,
    High: 1045,
    Moderate: 1520,
    Low: 601
  },
  perIssueType: {
    interaction: {
      serious_true: 582,
      serious_recall: 0.9674,
      alerts: 1846,
      alerts_matched: 1771
    },
    duplicate_therapy: {
      serious_true: 213,
      serious_recall: 0.9624,
      alerts: 511,
      alerts_matched: 493
    },
    renal_dose: {
      serious_true: 119,
      serious_recall: 0.9748,
      alerts: 695,
      alerts_matched: 685
    },
    contraindication: {
      serious_true: 149,
      serious_recall: 0.953,
      alerts: 206,
      alerts_matched: 191
    }
  },
  resolutionByTokenKind: {
    generic: 1.0,
    exact_brand: 0.9976,
    brand_variant: 0.9905,
    generic_combo: 0.9879,
    misspelled_brand: 0.9398,
    misspelled_generic: 0.9062,
    non_drug: 1.0,
    abbreviation: 1.0,
    synonym: 1.0
  }
};
