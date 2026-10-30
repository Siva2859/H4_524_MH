/**
 * MediGuard AI - Initial Session Audit Logs
 * SYNTHETIC / DEMO AUDIT RECORDS - Tracks browser-session safety checks
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

export const INITIAL_AUDIT_LOGS = [
  {
    id: "AUD-2026-001",
    timestamp: "2026-10-18 10:45:12",
    patientId: "SYN-PT-1042",
    patientName: "Arthur Vance (Synthetic)",
    medicinesReviewed: ["Warfarin 4mg", "Aspirin 81mg", "Metformin 500mg"],
    alertsRaisedCount: 1,
    highestSeverity: "Critical",
    reviewerAction: "Flagged for Attending Review",
    reviewerNotes: "Confirmed bleeding risk between Warfarin and Aspirin. Alerted attending cardiologist to reassess dual therapy indication.",
    status: "Reviewed (Demo)",
    triggeredRules: ["RULE-DDI-001 (DDI-WAR-ASA)"],
    clinicalSnapshot: {
      age: 72,
      eGfr: 52,
      pregnancyStatus: "Not Applicable",
      diagnoses: ["Atrial Fibrillation", "Type 2 Diabetes", "CAD"]
    },
    sessionHash: "SHA256-DEMO-9f82ab41"
  },
  {
    id: "AUD-2026-002",
    timestamp: "2026-10-18 09:20:34",
    patientId: "SYN-PT-1088",
    patientName: "Elena Rostova (Synthetic)",
    medicinesReviewed: ["Lisinopril 20mg", "Losartan 50mg", "Ibuprofen 400mg"],
    alertsRaisedCount: 2,
    highestSeverity: "Critical",
    reviewerAction: "Regimen Modified (Demo)",
    reviewerNotes: "Discontinued redundant Losartan. Stopped oral Ibuprofen due to renal compromise (eGFR 44). Transitioned to topical analgesia.",
    status: "Resolved (Demo)",
    triggeredRules: ["RULE-DUP-002 (DUP-RAAS)", "RULE-REN-006 (REN-NSAID-30)"],
    clinicalSnapshot: {
      age: 64,
      eGfr: 44,
      pregnancyStatus: "Negative",
      diagnoses: ["Severe Hypertension", "Diabetic Nephropathy", "Osteoarthritis"]
    },
    sessionHash: "SHA256-DEMO-64c8d19e"
  },
  {
    id: "AUD-2026-003",
    timestamp: "2026-10-17 16:15:00",
    patientId: "SYN-PT-3091",
    patientName: "Robert M. Davies (Synthetic)",
    medicinesReviewed: ["Clopidogrel 75mg", "Omeprazole 40mg", "Simvastatin 40mg"],
    alertsRaisedCount: 2,
    highestSeverity: "High",
    reviewerAction: "Substituted Alternative (Demo)",
    reviewerNotes: "Switched Omeprazole to Pantoprazole 40mg to prevent CYP2C19 clopidogrel attenuation. Advised simvastatin dose reduction to 20mg.",
    status: "Reviewed (Demo)",
    triggeredRules: ["RULE-DDI-004 (DDI-CLOP-OMEP)", "RULE-DDI-005 (DDI-SIMV-AMLO)"],
    clinicalSnapshot: {
      age: 58,
      eGfr: 38,
      pregnancyStatus: "Not Applicable",
      diagnoses: ["Coronary Artery Disease", "GERD", "Hyperlipidemia"]
    },
    sessionHash: "SHA256-DEMO-73ba081f"
  },
  {
    id: "AUD-2026-004",
    timestamp: "2026-10-17 11:30:22",
    patientId: "SYN-PT-6311",
    patientName: "David K. O'Connor (Synthetic)",
    medicinesReviewed: ["Amoxicillin 500mg", "Acetaminophen 500mg"],
    alertsRaisedCount: 0,
    highestSeverity: "None",
    reviewerAction: "Verified Clear in Demo Rules",
    reviewerNotes: "No interaction or renal alerts detected in available demo rule set. Standard counseling provided.",
    status: "Completed (Demo)",
    triggeredRules: ["NO-RULE-TRIGGERED"],
    clinicalSnapshot: {
      age: 41,
      eGfr: 98,
      pregnancyStatus: "Not Applicable",
      diagnoses: ["Acute Sinusitis", "Tension Headache"]
    },
    sessionHash: "SHA256-DEMO-4a12ec88"
  }
];
