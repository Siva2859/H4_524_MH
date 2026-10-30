/**
 * MediGuard AI - Synthetic Patient Cohort
 * STRICTLY SYNTHETIC DEMO DATA - Never use real patient data.
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

export const SYNTHETIC_PATIENTS = [
  {
    id: "SYN-PT-1042",
    name: "Arthur Vance (Synthetic)",
    age: 72,
    sex: "Male",
    weightKg: 78,
    eGfr: 28, // Severe CKD (Stage 4)
    creatinineMgDl: 2.6,
    pregnancyStatus: "Not Applicable",
    diagnoses: ["Type 2 Diabetes Mellitus", "Hypertension", "Chronic Kidney Disease Stage 4", "Atrial Fibrillation"],
    knownAllergies: ["Penicillin (Rash)"],
    currentMedications: [
      { genericName: "Warfarin", strength: "4 mg", dose: "4 mg", route: "Oral", frequency: "Once daily" },
      { genericName: "Aspirin", strength: "81 mg", dose: "81 mg", route: "Oral", frequency: "Once daily" },
      { genericName: "Metformin", strength: "500 mg", dose: "500 mg", route: "Oral", frequency: "Twice daily" },
      { genericName: "Atorvastatin", strength: "20 mg", dose: "20 mg", route: "Oral", frequency: "Once daily at night" }
    ],
    highestAlertSeverity: "Critical",
    reviewStatus: "Pending Review",
    lastReviewedAt: "2026-10-17 14:22",
    assignedClinician: "Dr. Sarah Jenkins"
  },
  {
    id: "SYN-PT-1088",
    name: "Elena Rostova (Synthetic)",
    age: 64,
    sex: "Female",
    weightKg: 68,
    eGfr: 44, // Moderate CKD (Stage 3b)
    creatinineMgDl: 1.5,
    pregnancyStatus: "Negative",
    diagnoses: ["Severe Hypertension", "Diabetic Nephropathy", "Osteoarthritis"],
    knownAllergies: ["Sulfa drugs"],
    currentMedications: [
      { genericName: "Lisinopril", strength: "20 mg", dose: "20 mg", route: "Oral", frequency: "Once daily" },
      { genericName: "Losartan", strength: "50 mg", dose: "50 mg", route: "Oral", frequency: "Once daily" },
      { genericName: "Ibuprofen", strength: "400 mg", dose: "400 mg", route: "Oral", frequency: "Three times daily PRN" },
      { genericName: "Amlodipine", strength: "5 mg", dose: "5 mg", route: "Oral", frequency: "Once daily" }
    ],
    highestAlertSeverity: "Critical",
    reviewStatus: "Pending Review",
    lastReviewedAt: "2026-10-18 09:15",
    assignedClinician: "Dr. Sarah Jenkins"
  },
  {
    id: "SYN-PT-2015",
    name: "Maya Chen (Synthetic)",
    age: 32,
    sex: "Female",
    weightKg: 62,
    eGfr: 105, // Normal
    creatinineMgDl: 0.7,
    pregnancyStatus: "Positive", // Pregnant!
    diagnoses: ["Essential Hypertension", "Pregnancy (22 weeks gestation)", "Migraine"],
    knownAllergies: ["None recorded"],
    currentMedications: [
      { genericName: "Lisinopril", strength: "10 mg", dose: "10 mg", route: "Oral", frequency: "Once daily" },
      { genericName: "Atorvastatin", strength: "10 mg", dose: "10 mg", route: "Oral", frequency: "Once daily" }
    ],
    highestAlertSeverity: "Critical",
    reviewStatus: "Pending Review",
    lastReviewedAt: "2026-10-18 11:30",
    assignedClinician: "Dr. Sarah Jenkins"
  },
  {
    id: "SYN-PT-3091",
    name: "Robert M. Davies (Synthetic)",
    age: 58,
    sex: "Male",
    weightKg: 85,
    eGfr: 38, // CKD Stage 3b
    creatinineMgDl: 1.8,
    pregnancyStatus: "Not Applicable",
    diagnoses: ["Coronary Artery Disease", "GERD", "Hyperlipidemia"],
    knownAllergies: ["Codeine (Nausea)"],
    currentMedications: [
      { genericName: "Clopidogrel", strength: "75 mg", dose: "75 mg", route: "Oral", frequency: "Once daily" },
      { genericName: "Omeprazole", strength: "40 mg", dose: "40 mg", route: "Oral", frequency: "Once daily before breakfast" },
      { genericName: "Amlodipine", strength: "10 mg", dose: "10 mg", route: "Oral", frequency: "Once daily" },
      { genericName: "Simvastatin", strength: "40 mg", dose: "40 mg", route: "Oral", frequency: "Once daily in evening" }
    ],
    highestAlertSeverity: "High",
    reviewStatus: "Reviewed (Demo)",
    lastReviewedAt: "2026-10-16 16:45",
    assignedClinician: "Dr. Sarah Jenkins"
  },
  {
    id: "SYN-PT-4102",
    name: "Farhan Qureshi (Synthetic)",
    age: 48,
    sex: "Male",
    weightKg: 74,
    eGfr: 82, // Mild reduction
    creatinineMgDl: 1.1,
    pregnancyStatus: "Not Applicable",
    diagnoses: ["Bronchial Asthma (Moderate persistent)", "Essential Hypertension", "Insomnia"],
    knownAllergies: ["Aspirin (Asthma exacerbation)"],
    currentMedications: [
      { genericName: "Propranolol", strength: "40 mg", dose: "40 mg", route: "Oral", frequency: "Twice daily" },
      { genericName: "Diazepam", strength: "5 mg", dose: "5 mg", route: "Oral", frequency: "At bedtime" },
      { genericName: "Lorazepam", strength: "1 mg", dose: "1 mg", route: "Oral", frequency: "PRN daytime anxiety" }
    ],
    highestAlertSeverity: "Critical",
    reviewStatus: "Pending Review",
    lastReviewedAt: "2026-10-18 10:05",
    assignedClinician: "Dr. Sarah Jenkins"
  },
  {
    id: "SYN-PT-5290",
    name: "Sunita Patel (Synthetic)",
    age: 69,
    sex: "Female",
    weightKg: 58,
    eGfr: 26, // Severe CKD
    creatinineMgDl: 2.3,
    pregnancyStatus: "Negative",
    diagnoses: ["Diabetic Peripheral Neuropathy", "Type 2 Diabetes", "Chronic Kidney Disease Stage 4"],
    knownAllergies: ["None recorded"],
    currentMedications: [
      { genericName: "Gabapentin", strength: "600 mg", dose: "600 mg", route: "Oral", frequency: "Three times daily" },
      { genericName: "Metformin", strength: "1000 mg", dose: "1000 mg", route: "Oral", frequency: "Twice daily" }
    ],
    highestAlertSeverity: "Critical",
    reviewStatus: "Pending Review",
    lastReviewedAt: "2026-10-18 12:40",
    assignedClinician: "Dr. Sarah Jenkins"
  },
  {
    id: "SYN-PT-6311",
    name: "David K. O'Connor (Synthetic)",
    age: 41,
    sex: "Male",
    weightKg: 82,
    eGfr: 98, // Normal
    creatinineMgDl: 0.9,
    pregnancyStatus: "Not Applicable",
    diagnoses: ["Acute Sinusitis", "Mild Tension Headache"],
    knownAllergies: ["None recorded"],
    currentMedications: [
      { genericName: "Amoxicillin", strength: "500 mg", dose: "500 mg", route: "Oral", frequency: "Three times daily" },
      { genericName: "Acetaminophen", strength: "500 mg", dose: "500 mg", route: "Oral", frequency: "Every 6 hours PRN" }
    ],
    highestAlertSeverity: "None",
    reviewStatus: "Reviewed (Demo)",
    lastReviewedAt: "2026-10-18 08:30",
    assignedClinician: "Dr. Sarah Jenkins"
  },
  {
    id: "SYN-PT-7140",
    name: "Grace M. Taylor (Synthetic)",
    age: 53,
    sex: "Female",
    weightKg: 65,
    eGfr: 76,
    creatinineMgDl: 1.0,
    pregnancyStatus: "Negative",
    diagnoses: ["Rheumatoid Arthritis", "Osteopenia"],
    knownAllergies: ["None recorded"],
    currentMedications: [
      { genericName: "Methotrexate", strength: "15 mg", dose: "15 mg", route: "Oral", frequency: "ONCE WEEKLY" },
      { genericName: "Ibuprofen", strength: "600 mg", dose: "600 mg", route: "Oral", frequency: "Three times daily" }
    ],
    highestAlertSeverity: "Critical",
    reviewStatus: "Pending Review",
    lastReviewedAt: "2026-10-17 17:10",
    assignedClinician: "Dr. Sarah Jenkins"
  }
];
