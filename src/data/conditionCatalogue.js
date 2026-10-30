/**
 * MediGuard AI - Canonical Condition Reference Catalogue & Synonyms
 * Official H4 Medication Safety Conditions Reference Dataset
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

export const CANONICAL_CONDITIONS = [
  {
    conditionId: "hypertension",
    conditionName: "Hypertension",
    kind: "diagnosis",
    description: "High blood pressure",
    exampleTerms: "HTN; high BP"
  },
  {
    conditionId: "type2_diabetes",
    conditionName: "Type 2 diabetes mellitus",
    kind: "diagnosis",
    description: "Type 2 diabetes",
    exampleTerms: "DM2; T2DM"
  },
  {
    conditionId: "dyslipidaemia",
    conditionName: "Dyslipidaemia",
    kind: "diagnosis",
    description: "High cholesterol / lipids",
    exampleTerms: "dyslipidemia"
  },
  {
    conditionId: "ckd",
    conditionName: "Chronic kidney disease",
    kind: "diagnosis",
    description: "CKD (renal rules use the recorded eGFR, not this text)",
    exampleTerms: "CKD 3b"
  },
  {
    conditionId: "cad",
    conditionName: "Coronary artery disease",
    kind: "diagnosis",
    description: "Ischaemic heart disease, old MI, post-PCI",
    exampleTerms: "CAD; post MI"
  },
  {
    conditionId: "heart_failure",
    conditionName: "Heart failure",
    kind: "diagnosis",
    description: "Heart failure (any type)",
    exampleTerms: "CHF; HFrEF"
  },
  {
    conditionId: "atrial_fibrillation",
    conditionName: "Atrial fibrillation",
    kind: "diagnosis",
    description: "AF",
    exampleTerms: "AF"
  },
  {
    conditionId: "stroke",
    conditionName: "Stroke / TIA",
    kind: "diagnosis",
    description: "Prior stroke or TIA",
    exampleTerms: "old CVA"
  },
  {
    conditionId: "dvt_pe",
    conditionName: "Venous thromboembolism",
    kind: "diagnosis",
    description: "DVT / PE",
    exampleTerms: "DVT"
  },
  {
    conditionId: "mechanical_valve",
    conditionName: "Mechanical heart valve",
    kind: "diagnosis",
    description: "Prosthetic mechanical valve on anticoagulation",
    exampleTerms: "s/p MVR"
  },
  {
    conditionId: "asthma",
    conditionName: "Asthma",
    kind: "diagnosis",
    description: "Bronchial asthma",
    exampleTerms: "BA"
  },
  {
    conditionId: "copd",
    conditionName: "COPD",
    kind: "diagnosis",
    description: "Chronic obstructive pulmonary disease",
    exampleTerms: "COPD"
  },
  {
    conditionId: "peptic_ulcer",
    conditionName: "Peptic ulcer disease / GI bleed",
    kind: "diagnosis",
    description: "Peptic ulcer or previous upper GI bleed",
    exampleTerms: "PUD; h/o UGI bleed"
  },
  {
    conditionId: "gerd",
    conditionName: "Acid peptic disease / GERD",
    kind: "diagnosis",
    description: "Gastritis, dyspepsia, reflux",
    exampleTerms: "APD; GERD"
  },
  {
    conditionId: "chronic_liver_disease",
    conditionName: "Chronic liver disease / cirrhosis",
    kind: "diagnosis",
    description: "Chronic liver disease or cirrhosis",
    exampleTerms: "CLD"
  },
  {
    conditionId: "hypothyroidism",
    conditionName: "Hypothyroidism",
    kind: "diagnosis",
    description: "Hypothyroidism",
    exampleTerms: "hypothyroid"
  },
  {
    conditionId: "hyperthyroidism",
    conditionName: "Hyperthyroidism",
    kind: "diagnosis",
    description: "Hyperthyroidism / Graves",
    exampleTerms: "Graves"
  },
  {
    conditionId: "osteoarthritis",
    conditionName: "Osteoarthritis",
    kind: "diagnosis",
    description: "Degenerative joint disease",
    exampleTerms: "OA knee"
  },
  {
    conditionId: "low_back_pain",
    conditionName: "Low back pain / spondylosis",
    kind: "diagnosis",
    description: "Mechanical back or neck pain",
    exampleTerms: "LBP"
  },
  {
    conditionId: "rheumatoid_arthritis",
    conditionName: "Rheumatoid arthritis",
    kind: "diagnosis",
    description: "Rheumatoid arthritis",
    exampleTerms: "RA"
  },
  {
    conditionId: "gout",
    conditionName: "Gout",
    kind: "diagnosis",
    description: "Gout / hyperuricaemia",
    exampleTerms: "gout"
  },
  {
    conditionId: "osteoporosis",
    conditionName: "Osteoporosis",
    kind: "diagnosis",
    description: "Osteoporosis",
    exampleTerms: "osteoporosis"
  },
  {
    conditionId: "epilepsy",
    conditionName: "Epilepsy / seizure disorder",
    kind: "diagnosis",
    description: "Seizure disorder",
    exampleTerms: "seizure disorder"
  },
  {
    conditionId: "depression",
    conditionName: "Depression",
    kind: "diagnosis",
    description: "Depressive disorder",
    exampleTerms: "MDD"
  },
  {
    conditionId: "anxiety",
    conditionName: "Anxiety disorder",
    kind: "diagnosis",
    description: "Anxiety / panic",
    exampleTerms: "GAD"
  },
  {
    conditionId: "bipolar",
    conditionName: "Bipolar disorder",
    kind: "diagnosis",
    description: "Bipolar affective disorder",
    exampleTerms: "BPAD"
  },
  {
    conditionId: "schizophrenia",
    conditionName: "Schizophrenia / psychosis",
    kind: "diagnosis",
    description: "Psychotic disorder",
    exampleTerms: "schizophrenia"
  },
  {
    conditionId: "insomnia",
    conditionName: "Insomnia",
    kind: "diagnosis",
    description: "Sleep disturbance",
    exampleTerms: "insomnia"
  },
  {
    conditionId: "parkinsons",
    conditionName: "Parkinson's disease",
    kind: "diagnosis",
    description: "Parkinson's disease / parkinsonism",
    exampleTerms: "PD"
  },
  {
    conditionId: "dementia",
    conditionName: "Dementia",
    kind: "diagnosis",
    description: "Dementia of any cause",
    exampleTerms: "dementia"
  },
  {
    conditionId: "neuropathy",
    conditionName: "Peripheral neuropathy",
    kind: "diagnosis",
    description: "Diabetic or other neuropathy",
    exampleTerms: "DPN"
  },
  {
    conditionId: "migraine",
    conditionName: "Migraine",
    kind: "diagnosis",
    description: "Migraine",
    exampleTerms: "migraine"
  },
  {
    conditionId: "vertigo",
    conditionName: "Vertigo",
    kind: "diagnosis",
    description: "Peripheral vertigo",
    exampleTerms: "BPPV"
  },
  {
    conditionId: "bph",
    conditionName: "Benign prostatic hyperplasia",
    kind: "diagnosis",
    description: "BPH / LUTS",
    exampleTerms: "BPH"
  },
  {
    conditionId: "overactive_bladder",
    conditionName: "Overactive bladder",
    kind: "diagnosis",
    description: "Urge incontinence",
    exampleTerms: "OAB"
  },
  {
    conditionId: "erectile_dysfunction",
    conditionName: "Erectile dysfunction",
    kind: "diagnosis",
    description: "ED",
    exampleTerms: "ED"
  },
  {
    conditionId: "uti",
    conditionName: "Urinary tract infection",
    kind: "diagnosis",
    description: "Current UTI",
    exampleTerms: "UTI"
  },
  {
    conditionId: "respiratory_infection",
    conditionName: "Respiratory tract infection",
    kind: "diagnosis",
    description: "Current URTI/LRTI/pneumonia",
    exampleTerms: "LRTI"
  },
  {
    conditionId: "tuberculosis",
    conditionName: "Tuberculosis (on treatment)",
    kind: "diagnosis",
    description: "TB on anti-TB therapy",
    exampleTerms: "PTB on ATT"
  },
  {
    conditionId: "anaemia",
    conditionName: "Anaemia",
    kind: "diagnosis",
    description: "Iron/B12/folate deficiency anaemia",
    exampleTerms: "IDA"
  },
  {
    conditionId: "allergic_rhinitis",
    conditionName: "Allergic rhinitis / urticaria",
    kind: "diagnosis",
    description: "Allergic rhinitis or urticaria",
    exampleTerms: "AR"
  },
  {
    conditionId: "angle_closure_glaucoma",
    conditionName: "Angle-closure glaucoma",
    kind: "diagnosis",
    description: "Narrow / angle-closure glaucoma",
    exampleTerms: "narrow angle glaucoma"
  },
  {
    conditionId: "g6pd_deficiency",
    conditionName: "G6PD deficiency",
    kind: "diagnosis",
    description: "Glucose-6-phosphate dehydrogenase deficiency",
    exampleTerms: "G6PD def"
  },
  {
    conditionId: "myasthenia_gravis",
    conditionName: "Myasthenia gravis",
    kind: "diagnosis",
    description: "Myasthenia gravis",
    exampleTerms: "MG"
  },
  {
    conditionId: "acne",
    conditionName: "Acne",
    kind: "diagnosis",
    description: "Acne vulgaris",
    exampleTerms: "acne"
  },
  {
    conditionId: "pregnancy_related",
    conditionName: "Pregnancy-related condition",
    kind: "diagnosis",
    description: "Antenatal / pregnancy-related diagnosis",
    exampleTerms: "G2P1 at 20 wks; GDM"
  },
  {
    conditionId: "infertility_or_gyn",
    conditionName: "Gynaecological condition",
    kind: "diagnosis",
    description: "Menstrual or fertility problem",
    exampleTerms: "AUB"
  },
  {
    conditionId: "hepatitis_b",
    conditionName: "Chronic hepatitis B",
    kind: "diagnosis",
    description: "Chronic HBV infection",
    exampleTerms: "CHB"
  },
  {
    conditionId: "skin_fungal",
    conditionName: "Fungal skin/nail infection",
    kind: "diagnosis",
    description: "Dermatophytosis / onychomycosis",
    exampleTerms: "tinea"
  },
  {
    conditionId: "ibs_gi_spasm",
    conditionName: "Abdominal colic / IBS",
    kind: "diagnosis",
    description: "Functional bowel / colic",
    exampleTerms: "IBS"
  },
  {
    conditionId: "nausea_vomiting",
    conditionName: "Nausea / vomiting",
    kind: "diagnosis",
    description: "Nausea or vomiting",
    exampleTerms: "vomiting"
  },
  {
    conditionId: "cough_cold",
    conditionName: "Cough / common cold",
    kind: "diagnosis",
    description: "Acute cough or cold",
    exampleTerms: "cough"
  },
  {
    conditionId: "fever",
    conditionName: "Fever",
    kind: "diagnosis",
    description: "Acute febrile illness",
    exampleTerms: "fever"
  },
  {
    conditionId: "headache",
    conditionName: "Headache",
    kind: "diagnosis",
    description: "Headache / body ache",
    exampleTerms: "headache"
  },
  {
    conditionId: "pregnancy",
    conditionName: "Pregnancy",
    kind: "pregnancy_field",
    description: "Taken from the pregnant field (Y), not from diagnoses",
    exampleTerms: "pregnant=Y"
  },
  {
    conditionId: "penicillin_allergy",
    conditionName: "Penicillin allergy",
    kind: "allergy",
    description: "Taken from the allergies field",
    exampleTerms: "penicillin; PCN"
  },
  {
    conditionId: "sulfonamide_allergy",
    conditionName: "Sulfonamide (sulfa) antibiotic allergy",
    kind: "allergy",
    description: "Taken from the allergies field",
    exampleTerms: "sulfa"
  },
  {
    conditionId: "nsaid_hypersensitivity",
    conditionName: "Aspirin/NSAID hypersensitivity",
    kind: "allergy",
    description: "Taken from the allergies field",
    exampleTerms: "aspirin allergy; NSAID allergy"
  }
];

export const CANONICAL_CONDITIONS_MAP = Object.fromEntries(
  CANONICAL_CONDITIONS.map(c => [c.conditionId, c])
);

/**
 * Standard medical acronyms, clinical abbreviations, and common clinical terms
 * mapped to official condition IDs.
 */
export const CONDITION_ALIASES = {
  // Cardiovascular
  "htn": "hypertension",
  "high bp": "hypertension",
  "high blood pressure": "hypertension",
  "elevated bp": "hypertension",
  "arterial hypertension": "hypertension",
  "essential hypertension": "hypertension",
  "systemic hypertension": "hypertension",

  "cad": "cad",
  "ihd": "cad",
  "ischaemic heart disease": "cad",
  "ischemic heart disease": "cad",
  "coronary heart disease": "cad",
  "chd": "cad",
  "post mi": "cad",
  "old mi": "cad",
  "myocardial infarction": "cad",
  "post-pci": "cad",
  "post pci": "cad",
  "angina": "cad",
  "angina pectoris": "cad",
  "cabg": "cad",
  "stent": "cad",

  "chf": "heart_failure",
  "congestive heart failure": "heart_failure",
  "hf": "heart_failure",
  "hfref": "heart_failure",
  "hfpef": "heart_failure",
  "cardiac failure": "heart_failure",
  "ccf": "heart_failure",
  "congestive cardiac failure": "heart_failure",
  "dcmp": "heart_failure",
  "lv dysfunction": "heart_failure",
  "cardiomyopathy": "heart_failure",

  "af": "atrial_fibrillation",
  "afib": "atrial_fibrillation",
  "a-fib": "atrial_fibrillation",
  "atrial fib": "atrial_fibrillation",
  "auricular fibrillation": "atrial_fibrillation",

  "stroke": "stroke",
  "tia": "stroke",
  "cva": "stroke",
  "old cva": "stroke",
  "cerebrovascular accident": "stroke",
  "transient ischemic attack": "stroke",
  "ischemic stroke": "stroke",

  "dvt": "dvt_pe",
  "pe": "dvt_pe",
  "vte": "dvt_pe",
  "deep vein thrombosis": "dvt_pe",
  "deep venous thrombosis": "dvt_pe",
  "pulmonary embolism": "dvt_pe",
  "venous thromboembolism": "dvt_pe",

  "mvr": "mechanical_valve",
  "avr": "mechanical_valve",
  "s/p mvr": "mechanical_valve",
  "s/p avr": "mechanical_valve",
  "prosthetic valve": "mechanical_valve",
  "prosthetic heart valve": "mechanical_valve",
  "mechanical valve": "mechanical_valve",
  "mechanical heart valve": "mechanical_valve",

  // Endocrine & Metabolic
  "t2dm": "type2_diabetes",
  "dm2": "type2_diabetes",
  "t2d": "type2_diabetes",
  "dm-2": "type2_diabetes",
  "dm 2": "type2_diabetes",
  "type 2 diabetes": "type2_diabetes",
  "type ii diabetes": "type2_diabetes",
  "type 2 diabetes mellitus": "type2_diabetes",
  "niddm": "type2_diabetes",
  "diabetes mellitus": "type2_diabetes",
  "diabetes": "type2_diabetes",
  "diabetic": "type2_diabetes",

  "dyslipidemia": "dyslipidaemia",
  "hyperlipidemia": "dyslipidaemia",
  "high cholesterol": "dyslipidaemia",
  "hypercholesterolemia": "dyslipidaemia",
  "elevated lipids": "dyslipidaemia",
  "hypertriglyceridemia": "dyslipidaemia",

  "hypothyroid": "hypothyroidism",
  "hypothyroidism": "hypothyroidism",
  "hashimoto": "hypothyroidism",
  "hashimotos": "hypothyroidism",
  "underactive thyroid": "hypothyroidism",

  "hyperthyroid": "hyperthyroidism",
  "hyperthyroidism": "hyperthyroidism",
  "graves": "hyperthyroidism",
  "graves disease": "hyperthyroidism",
  "thyrotoxicosis": "hyperthyroidism",
  "overactive thyroid": "hyperthyroidism",

  // Renal & Genitourinary
  "ckd": "ckd",
  "ckd 1": "ckd",
  "ckd 2": "ckd",
  "ckd 3": "ckd",
  "ckd 3a": "ckd",
  "ckd 3b": "ckd",
  "ckd 4": "ckd",
  "ckd 5": "ckd",
  "chronic kidney disease": "ckd",
  "chronic kidney disease stage 1": "ckd",
  "chronic kidney disease stage 2": "ckd",
  "chronic kidney disease stage 3": "ckd",
  "chronic kidney disease stage 4": "ckd",
  "chronic kidney disease stage 5": "ckd",
  "chronic renal failure": "ckd",
  "crf": "ckd",
  "chronic renal disease": "ckd",
  "renal impairment": "ckd",
  "renal insufficiency": "ckd",
  "end stage renal disease": "ckd",
  "esrd": "ckd",

  "bph": "bph",
  "luts": "bph",
  "enlarged prostate": "bph",
  "benign prostatic hyperplasia": "bph",
  "benign prostatic hypertrophy": "bph",
  "prostatomegaly": "bph",

  "oab": "overactive_bladder",
  "overactive bladder": "overactive_bladder",
  "urge incontinence": "overactive_bladder",
  "urinary urgency": "overactive_bladder",

  "ed": "erectile_dysfunction",
  "erectile dysfunction": "erectile_dysfunction",
  "impotence": "erectile_dysfunction",

  "uti": "uti",
  "urinary tract infection": "uti",
  "cystitis": "uti",
  "pyelonephritis": "uti",

  // Respiratory
  "ba": "asthma",
  "asthma": "asthma",
  "bronchial asthma": "asthma",
  "allergic asthma": "asthma",
  "reactive airway disease": "asthma",
  "rad": "asthma",

  "copd": "copd",
  "chronic obstructive pulmonary disease": "copd",
  "emphysema": "copd",
  "chronic bronchitis": "copd",

  "urti": "respiratory_infection",
  "lrti": "respiratory_infection",
  "respiratory infection": "respiratory_infection",
  "respiratory tract infection": "respiratory_infection",
  "pneumonia": "respiratory_infection",
  "bronchitis": "respiratory_infection",
  "chest infection": "respiratory_infection",

  "tb": "tuberculosis",
  "ptb": "tuberculosis",
  "pulmonary tb": "tuberculosis",
  "pulmonary tuberculosis": "tuberculosis",
  "ptb on att": "tuberculosis",
  "tuberculosis": "tuberculosis",

  "cough": "cough_cold",
  "cold": "cough_cold",
  "common cold": "cough_cold",
  "coryza": "cough_cold",
  "rhinorrhea": "cough_cold",

  // Gastrointestinal & Hepatic
  "pud": "peptic_ulcer",
  "peptic ulcer": "peptic_ulcer",
  "peptic ulcer disease": "peptic_ulcer",
  "gastric ulcer": "peptic_ulcer",
  "duodenal ulcer": "peptic_ulcer",
  "gi bleed": "peptic_ulcer",
  "ugi bleed": "peptic_ulcer",
  "upper gi bleed": "peptic_ulcer",
  "h/o ugi bleed": "peptic_ulcer",
  "bleeding ulcer": "peptic_ulcer",

  "gerd": "gerd",
  "gord": "gerd",
  "apd": "gerd",
  "acid peptic disease": "gerd",
  "gastritis": "gerd",
  "dyspepsia": "gerd",
  "acid reflux": "gerd",
  "reflux": "gerd",
  "heartburn": "gerd",

  "cld": "chronic_liver_disease",
  "cirrhosis": "chronic_liver_disease",
  "liver cirrhosis": "chronic_liver_disease",
  "hepatic cirrhosis": "chronic_liver_disease",
  "chronic liver disease": "chronic_liver_disease",
  "liver disease": "chronic_liver_disease",
  "liver failure": "chronic_liver_disease",
  "portal hypertension": "chronic_liver_disease",
  "portal htn": "chronic_liver_disease",
  "ascites": "chronic_liver_disease",

  "chb": "hepatitis_b",
  "chronic hepatitis b": "hepatitis_b",
  "hbv": "hepatitis_b",
  "hepatitis b": "hepatitis_b",

  "ibs": "ibs_gi_spasm",
  "irritable bowel syndrome": "ibs_gi_spasm",
  "abdominal colic": "ibs_gi_spasm",
  "colic": "ibs_gi_spasm",
  "spastic colon": "ibs_gi_spasm",

  "nausea": "nausea_vomiting",
  "vomiting": "nausea_vomiting",
  "emesis": "nausea_vomiting",

  // Musculoskeletal
  "oa": "osteoarthritis",
  "oa knee": "osteoarthritis",
  "oa knees": "osteoarthritis",
  "osteoarthritis": "osteoarthritis",
  "degenerative joint disease": "osteoarthritis",
  "djd": "osteoarthritis",
  "osteoarthrosis": "osteoarthritis",
  "knee oa": "osteoarthritis",

  "lbp": "low_back_pain",
  "low back pain": "low_back_pain",
  "back pain": "low_back_pain",
  "lumbar spondylosis": "low_back_pain",
  "cervical spondylosis": "low_back_pain",
  "spondylosis": "low_back_pain",
  "lumbago": "low_back_pain",
  "sciatica": "low_back_pain",

  "ra": "rheumatoid_arthritis",
  "rheumatoid arthritis": "rheumatoid_arthritis",
  "rheumatoid": "rheumatoid_arthritis",

  "gout": "gout",
  "gouty arthritis": "gout",
  "hyperuricemia": "gout",
  "hyperuricaemia": "gout",
  "tophaceous gout": "gout",

  "osteoporosis": "osteoporosis",
  "osteopenia": "osteoporosis",
  "low bone density": "osteoporosis",

  // Neurological & Psychiatric
  "epilepsy": "epilepsy",
  "seizure": "epilepsy",
  "seizure disorder": "epilepsy",
  "convulsions": "epilepsy",
  "fits": "epilepsy",
  "gtcs": "epilepsy",

  "mdd": "depression",
  "depression": "depression",
  "major depression": "depression",
  "major depressive disorder": "depression",
  "depressive disorder": "depression",

  "gad": "anxiety",
  "anxiety": "anxiety",
  "anxiety disorder": "anxiety",
  "panic disorder": "anxiety",
  "panic attacks": "anxiety",

  "bpad": "bipolar",
  "bipolar": "bipolar",
  "bipolar disorder": "bipolar",
  "bipolar affective disorder": "bipolar",
  "manic depression": "bipolar",

  "schizophrenia": "schizophrenia",
  "psychosis": "schizophrenia",
  "psychotic disorder": "schizophrenia",

  "insomnia": "insomnia",
  "sleeplessness": "insomnia",
  "sleep disturbance": "insomnia",

  "pd": "parkinsons",
  "parkinson": "parkinsons",
  "parkinsons": "parkinsons",
  "parkinson's disease": "parkinsons",
  "parkinson disease": "parkinsons",
  "parkinsonism": "parkinsons",

  "dementia": "dementia",
  "alzheimer": "dementia",
  "alzheimers": "dementia",
  "alzheimer's": "dementia",
  "alzheimer's disease": "dementia",
  "senile dementia": "dementia",
  "vascular dementia": "dementia",

  "dpn": "neuropathy",
  "neuropathy": "neuropathy",
  "diabetic neuropathy": "neuropathy",
  "diabetic peripheral neuropathy": "neuropathy",
  "peripheral neuropathy": "neuropathy",
  "polyneuropathy": "neuropathy",

  "migraine": "migraine",
  "hemicrania": "migraine",
  "migraine with aura": "migraine",
  "migraine without aura": "migraine",

  "vertigo": "vertigo",
  "bppv": "vertigo",
  "peripheral vertigo": "vertigo",
  "dizziness": "vertigo",
  "labyrinthitis": "vertigo",

  // Hematologic & Immunologic
  "anaemia": "anaemia",
  "anemia": "anaemia",
  "ida": "anaemia",
  "iron deficiency anaemia": "anaemia",
  "iron deficiency anemia": "anaemia",
  "b12 deficiency": "anaemia",

  "ar": "allergic_rhinitis",
  "allergic rhinitis": "allergic_rhinitis",
  "allergic rhinitis / urticaria": "allergic_rhinitis",
  "urticaria": "allergic_rhinitis",
  "hay fever": "allergic_rhinitis",
  "hives": "allergic_rhinitis",

  "angle closure glaucoma": "angle_closure_glaucoma",
  "angle-closure glaucoma": "angle_closure_glaucoma",
  "narrow angle glaucoma": "angle_closure_glaucoma",
  "closed angle glaucoma": "angle_closure_glaucoma",
  "glaucoma": "angle_closure_glaucoma",

  "g6pd": "g6pd_deficiency",
  "g6pd def": "g6pd_deficiency",
  "g6pd deficiency": "g6pd_deficiency",
  "glucose-6-phosphate dehydrogenase deficiency": "g6pd_deficiency",

  "mg": "myasthenia_gravis",
  "myasthenia": "myasthenia_gravis",
  "myasthenia gravis": "myasthenia_gravis",

  // Dermatologic & Infectious & Other
  "acne": "acne",
  "acne vulgaris": "acne",
  "pimples": "acne",

  "tinea": "skin_fungal",
  "onychomycosis": "skin_fungal",
  "fungal infection": "skin_fungal",
  "fungal skin infection": "skin_fungal",
  "ringworm": "skin_fungal",

  "fever": "fever",
  "pyrexia": "fever",
  "febrile illness": "fever",
  "acute fever": "fever",

  "headache": "headache",
  "tension headache": "headache",
  "body ache": "headache",
  "cephalalgia": "headache",

  "gdm": "pregnancy_related",
  "gestational diabetes": "pregnancy_related",
  "preeclampsia": "pregnancy_related",
  "pre-eclampsia": "pregnancy_related",
  "antenatal": "pregnancy_related",
  "g2p1": "pregnancy_related",

  "aub": "infertility_or_gyn",
  "abnormal uterine bleeding": "infertility_or_gyn",
  "pcos": "infertility_or_gyn",
  "infertility": "infertility_or_gyn",
  "dysmenorrhea": "infertility_or_gyn",

  // Allergies & Pregnancy
  "pregnant": "pregnancy",
  "pregnancy": "pregnancy",
  "penicillin allergy": "penicillin_allergy",
  "pcn allergy": "penicillin_allergy",
  "sulfa allergy": "sulfonamide_allergy",
  "aspirin allergy": "nsaid_hypersensitivity",
  "nsaid allergy": "nsaid_hypersensitivity"
};

/**
 * Common misspellings and typographical errors in diagnoses
 */
export const COMMON_DIAGNOSIS_TYPOS = {
  "diabtes": "type2_diabetes",
  "diabtes mellitus": "type2_diabetes",
  "diabetis": "type2_diabetes",
  "diabeties": "type2_diabetes",
  "hypertenson": "hypertension",
  "hypertention": "hypertension",
  "hypertenshion": "hypertension",
  "ashtma": "asthma",
  "astma": "asthma",
  "peptc ulcer": "peptic_ulcer",
  "peptic ulcr": "peptic_ulcer",
  "peptic ulser": "peptic_ulcer",
  "chrnoic kidney disease": "ckd",
  "cronickidney disease": "ckd",
  "depresion": "depression",
  "deppression": "depression",
  "anxietey": "anxiety",
  "anxity": "anxiety",
  "epilepsi": "epilepsy",
  "epilepsey": "epilepsy",
  "headrache": "headache",
  "headahe": "headache",
  "osteoarthrits": "osteoarthritis",
  "osteoprosis": "osteoporosis",
  "cirhosis": "chronic_liver_disease",
  "cirrhocis": "chronic_liver_disease",
  "parkinsons disease": "parkinsons",
  "parkinson disese": "parkinsons",
  "dmentia": "dementia",
  "demetia": "dementia"
};

