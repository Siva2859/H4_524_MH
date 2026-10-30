/**
 * MediGuard AI - Brand, Generic & Misspelling Alias Mapping
 * SYNTHETIC / DEMO DATA - Illustrative mapping database.
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

export const SAMPLE_SEARCH_PRESETS = [
  { query: "Metfornin", note: "Common typo for Metformin (Renal concern)" },
  { query: "Lipitor", note: "Brand name for Atorvastatin (Statin)" },
  { query: "Coumadin", note: "Brand name for Warfarin (Anticoagulant)" },
  { query: "Augmentin", note: "Brand name for Amoxicillin/Clavulanate" },
  { query: "Dispirin", note: "Brand name for Aspirin (Antiplatelet)" },
  { query: "Paracetmol", note: "Typo for Paracetamol / Acetaminophen" },
  { query: "Lasix", note: "Brand name for Furosemide (Loop Diuretic)" },
  { query: "Plavix", note: "Brand name for Clopidogrel (P2Y12 Inhibitor)" },
  { query: "Aleve", note: "Brand name for Naproxen (NSAID)" },
  { query: "Neurontin", note: "Brand name for Gabapentin (Renal caution)" },
  { query: "Metoprol", note: "Incomplete/ambiguous query (Requires human confirmation)" }
];

export const BRAND_TO_GENERIC = {
  // Cardiovascular / Anticoagulants
  "coumadin": { generic: "Warfarin", rxNormId: "11289", type: "Brand Alias", matchConfidence: 100 },
  "jantoven": { generic: "Warfarin", rxNormId: "11289", type: "Brand Alias", matchConfidence: 100 },
  "marevan": { generic: "Warfarin", rxNormId: "11289", type: "Brand Alias", matchConfidence: 100 },
  
  "dispirin": { generic: "Aspirin", rxNormId: "1191", type: "Brand Alias", matchConfidence: 100 },
  "ecotrin": { generic: "Aspirin", rxNormId: "1191", type: "Brand Alias", matchConfidence: 100 },
  "bayer aspirin": { generic: "Aspirin", rxNormId: "1191", type: "Brand Alias", matchConfidence: 100 },
  
  "plavix": { generic: "Clopidogrel", rxNormId: "32968", type: "Brand Alias", matchConfidence: 100 },
  "clopilet": { generic: "Clopidogrel", rxNormId: "32968", type: "Brand Alias", matchConfidence: 100 },
  "deplatt": { generic: "Clopidogrel", rxNormId: "32968", type: "Brand Alias", matchConfidence: 100 },

  "prinivil": { generic: "Lisinopril", rxNormId: "29046", type: "Brand Alias", matchConfidence: 100 },
  "zestril": { generic: "Lisinopril", rxNormId: "29046", type: "Brand Alias", matchConfidence: 100 },
  "lipril": { generic: "Lisinopril", rxNormId: "29046", type: "Brand Alias", matchConfidence: 100 },

  "cozaar": { generic: "Losartan", rxNormId: "52175", type: "Brand Alias", matchConfidence: 100 },
  "losacar": { generic: "Losartan", rxNormId: "52175", type: "Brand Alias", matchConfidence: 100 },
  "repace": { generic: "Losartan", rxNormId: "52175", type: "Brand Alias", matchConfidence: 100 },

  "lipitor": { generic: "Atorvastatin", rxNormId: "83367", type: "Brand Alias", matchConfidence: 100 },
  "atorva": { generic: "Atorvastatin", rxNormId: "83367", type: "Brand Alias", matchConfidence: 100 },
  "storvas": { generic: "Atorvastatin", rxNormId: "83367", type: "Brand Alias", matchConfidence: 100 },

  "zocor": { generic: "Simvastatin", rxNormId: "36567", type: "Brand Alias", matchConfidence: 100 },
  "simvotin": { generic: "Simvastatin", rxNormId: "36567", type: "Brand Alias", matchConfidence: 100 },

  "norvasc": { generic: "Amlodipine", rxNormId: "17767", type: "Brand Alias", matchConfidence: 100 },
  "amlong": { generic: "Amlodipine", rxNormId: "17767", type: "Brand Alias", matchConfidence: 100 },

  "lasix": { generic: "Furosemide", rxNormId: "4603", type: "Brand Alias", matchConfidence: 100 },
  "aldactone": { generic: "Spironolactone", rxNormId: "9997", type: "Brand Alias", matchConfidence: 100 },

  // Diabetes / Endocrine
  "glucophage": { generic: "Metformin", rxNormId: "6809", type: "Brand Alias", matchConfidence: 100 },
  "glycomet": { generic: "Metformin", rxNormId: "6809", type: "Brand Alias", matchConfidence: 100 },
  "fortamet": { generic: "Metformin", rxNormId: "6809", type: "Brand Alias", matchConfidence: 100 },

  // Analgesics / NSAIDs
  "advil": { generic: "Ibuprofen", rxNormId: "5640", type: "Brand Alias", matchConfidence: 100 },
  "motrin": { generic: "Ibuprofen", rxNormId: "5640", type: "Brand Alias", matchConfidence: 100 },
  "brufen": { generic: "Ibuprofen", rxNormId: "5640", type: "Brand Alias", matchConfidence: 100 },
  "nurofen": { generic: "Ibuprofen", rxNormId: "5640", type: "Brand Alias", matchConfidence: 100 },

  "aleve": { generic: "Naproxen", rxNormId: "7258", type: "Brand Alias", matchConfidence: 100 },
  "naprosyn": { generic: "Naproxen", rxNormId: "7258", type: "Brand Alias", matchConfidence: 100 },

  "tylenol": { generic: "Acetaminophen", rxNormId: "161", type: "Brand Alias", matchConfidence: 100 },
  "panadol": { generic: "Acetaminophen", rxNormId: "161", type: "Brand Alias", matchConfidence: 100 },
  "calpol": { generic: "Acetaminophen", rxNormId: "161", type: "Brand Alias", matchConfidence: 100 },
  "crocin": { generic: "Acetaminophen", rxNormId: "161", type: "Brand Alias", matchConfidence: 100 },
  "paracetamol": { generic: "Acetaminophen", rxNormId: "161", type: "International Nonproprietary Name (INN)", matchConfidence: 100 },

  // GI
  "prilosec": { generic: "Omeprazole", rxNormId: "7646", type: "Brand Alias", matchConfidence: 100 },
  "omez": { generic: "Omeprazole", rxNormId: "7646", type: "Brand Alias", matchConfidence: 100 },
  "protonix": { generic: "Pantoprazole", rxNormId: "40790", type: "Brand Alias", matchConfidence: 100 },
  "pantocid": { generic: "Pantoprazole", rxNormId: "40790", type: "Brand Alias", matchConfidence: 100 },
  "pan 40": { generic: "Pantoprazole", rxNormId: "40790", type: "Brand Alias", matchConfidence: 100 },

  // Neuro / Psych / Other
  "neurontin": { generic: "Gabapentin", rxNormId: "25480", type: "Brand Alias", matchConfidence: 100 },
  "gabapin": { generic: "Gabapentin", rxNormId: "25480", type: "Brand Alias", matchConfidence: 100 },
  "lovenox": { generic: "Enoxaparin", rxNormId: "67108", type: "Brand Alias", matchConfidence: 100 },
  "clexane": { generic: "Enoxaparin", rxNormId: "67108", type: "Brand Alias", matchConfidence: 100 },
  "augmentin": { generic: "Amoxicillin / Clavulanate", rxNormId: "6185", type: "Brand Alias", matchConfidence: 100 },
  "clavam": { generic: "Amoxicillin / Clavulanate", rxNormId: "6185", type: "Brand Alias", matchConfidence: 100 },
  "amoxil": { generic: "Amoxicillin", rxNormId: "723", type: "Brand Alias", matchConfidence: 100 },
  "valium": { generic: "Diazepam", rxNormId: "3322", type: "Brand Alias", matchConfidence: 100 },
  "ativan": { generic: "Lorazepam", rxNormId: "6470", type: "Brand Alias", matchConfidence: 100 },
  "inderal": { generic: "Propranolol", rxNormId: "8787", type: "Brand Alias", matchConfidence: 100 },
  "trexall": { generic: "Methotrexate", rxNormId: "6851", type: "Brand Alias", matchConfidence: 100 },
  "k-dur": { generic: "Potassium Chloride", rxNormId: "8591", type: "Brand Alias", matchConfidence: 100 },
  "potclor": { generic: "Potassium Chloride", rxNormId: "8591", type: "Brand Alias", matchConfidence: 100 }
};

// Known common phonetic and typing misspellings
export const COMMON_MISSPELLINGS = {
  "metfornin": { generic: "Metformin", confidence: 91, reason: "Common typographic transposition ('m' -> 'n')" },
  "metformn": { generic: "Metformin", confidence: 93, reason: "Omitted vowel 'i'" },
  "metaformin": { generic: "Metformin", confidence: 90, reason: "Phonetic vowel intrusion" },
  "gluco-phage": { generic: "Metformin", confidence: 95, reason: "Hyphenated brand variant" },
  "paracetmol": { generic: "Acetaminophen", confidence: 92, reason: "Omitted 'a' in paracetamol" },
  "paracetemol": { generic: "Acetaminophen", confidence: 90, reason: "Vowel substitution 'e' for 'a'" },
  "tylenol extra": { generic: "Acetaminophen", confidence: 95, reason: "Brand modifier string" },
  "aspirine": { generic: "Aspirin", confidence: 96, reason: "French / European spelling variant" },
  "warfrin": { generic: "Warfarin", confidence: 92, reason: "Omitted vowel 'a'" },
  "plavixx": { generic: "Clopidogrel", confidence: 94, reason: "Typographic letter doubling" },
  "lasyks": { generic: "Furosemide", confidence: 76, reason: "Phonetic spelling of Lasix (Uncertain - requires confirmation)" },
  "ibuprofin": { generic: "Ibuprofen", confidence: 93, reason: "Phonetic substitution 'i' for 'e'" },
  "naproxyn": { generic: "Naproxen", confidence: 91, reason: "Phonetic substitution 'y' for 'e'" },
  "omeprazole 20": { generic: "Omeprazole", confidence: 95, reason: "Appended dose in name string" },
  "lisinopril hctz": { generic: "Lisinopril", confidence: 82, reason: "Combination formulation containing Lisinopril" },
  "metoprol": { generic: "Propranolol", confidence: 54, reason: "Partial prefix match - HIGHLY UNCERTAIN (Could be Metoprolol, not Propranolol)" }
};
