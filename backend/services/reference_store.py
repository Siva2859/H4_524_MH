import csv
import json
import re
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from ..config import settings

def clean_key(s: str) -> str:
    s = s.lower()
    s = re.sub(r"ks|cs", "x", s)
    s = re.sub(r"ph", "f", s)
    s = re.sub(r"ee|ea", "i", s)
    s = re.sub(r"oo", "u", s)
    return re.sub(r"[^a-z0-9]", "", s)

SPECIAL_RESOLUTIONS: Dict[str, List[str]] = {
    "pcm": ["paracetamol"],
    "amoxyclav": ["amoxicillin", "clavulanic acid"],
    "amoxclav": ["amoxicillin", "clavulanic acid"],
    "amoxiclav": ["amoxicillin", "clavulanic acid"],
    "aceclopcm": ["aceclofenac", "paracetamol"],
    "monteleukastlc": ["levocetirizine", "montelukast"],
    "montelukastlc": ["levocetirizine", "montelukast"],
    "tmpsmx": ["sulfamethoxazole", "trimethoprim"],
    "cotrimoxazole": ["sulfamethoxazole", "trimethoprim"],
    "insulin3070": ["insulin isophane", "insulin regular"],
    "insulin5050": ["insulin isophane", "insulin regular"],
    "ldopacarbidopa": ["carbidopa", "levodopa"],
    "hctz": ["hydrochlorothiazide"],
    "sodabicarb": ["sodium bicarbonate"],
    "sodbicarb": ["sodium bicarbonate"],
    "sodami": ["sodium bicarbonate"],
    "ismn": ["isosorbide mononitrate"],
    "isdn": ["isosorbide dinitrate"],
    "mtx": ["methotrexate"],
    "udca": ["ursodeoxycholic acid"],
    "vitd3": ["cholecalciferol"],
    "vitamind3": ["cholecalciferol"],
    "d3": ["cholecalciferol"],
    "lthyroxine": ["levothyroxine"],
    "thyroxinesodium": ["levothyroxine"],
    "thyroxine": ["levothyroxine"],
    "frusemide": ["furosemide"],
    "mecobalamin": ["methylcobalamin"],
    "calciumvitd3": ["calcium carbonate", "cholecalciferol"],
    "calciumcarbonated3": ["calcium carbonate", "cholecalciferol"],
    "calciumd3": ["calcium carbonate", "cholecalciferol"],
    "calciumvitd": ["calcium carbonate", "cholecalciferol"],
    "tramadolpcm": ["paracetamol", "tramadol"],
    "pntp": ["pantoprazole"],
    "rozav": ["rosuvastatin"],
    "paxi": ["paroxetine"],
    "coumadin": ["warfarin"],
    "lipitor": ["atorvastatin"],
    "plavix": ["clopidogrel"],
    "dispirin": ["aspirin"],
    "glucophage": ["metformin"],
    "acetaminophen": ["paracetamol"],
}

class ReferenceStore:
    """
    In-memory clinical reference store loaded from official H4 Medication Safety Dataset CSVs.
    Thread-safe reads, fast cached lookups, and JSON fallback support.
    """
    def __init__(self, data_dir: Optional[Path] = None, h4_data_dir: Optional[Path] = None):
        self.data_dir = data_dir or settings.data_dir
        self.h4_data_dir = h4_data_dir or settings.h4_data_dir
        
        # Primary catalogs
        self.drug_catalogue: List[Dict[str, Any]] = []
        self.drug_ref_by_generic: Dict[str, Dict[str, Any]] = {}
        
        self.combination_brands: List[Dict[str, Any]] = []
        self.combos_by_key: Dict[str, List[str]] = {}
        
        self.interaction_rules: List[Dict[str, Any]] = []
        self.interactions_by_pair: Dict[Tuple[str, str], Tuple[str, str, str]] = {}
        
        self.renal_rules: List[Dict[str, Any]] = []
        self.renal_by_generic: Dict[str, List[Tuple[int, str, str]]] = {}
        
        self.duplicate_rules: List[Dict[str, Any]] = []
        self.duplicate_groups_by_id: Dict[str, Dict[str, Any]] = {}
        
        self.contraindication_rules: List[Dict[str, Any]] = []
        self.contraindications_by_condition: Dict[str, List[Tuple[str, str, str, str]]] = {}
        
        self.conditions_catalog: Dict[str, Dict[str, Any]] = {}
        
        # Fast lookup tables for normalization
        self.exact_lookup: Dict[str, List[str]] = {}
        self.lookup_keys: List[str] = []
        
        # Legacy/UI compatibility structures
        self.brand_to_generic: Dict[str, Dict[str, Any]] = {}
        self.common_misspellings: Dict[str, Dict[str, Any]] = {}
        self.synthetic_patients: List[Dict[str, Any]] = []
        self.official_patients: List[Dict[str, Any]] = []
        self.demo_cases: List[Dict[str, Any]] = []
        
        # State tracking
        self.official_data_loaded = False
        self.official_dataset_info: Dict[str, Any] = {}

        self.load_all()

    def _read_csv(self, file_path: Path) -> List[Dict[str, str]]:
        if not file_path.exists():
            return []
        with open(file_path, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            return [row for row in reader]

    def _load_json(self, filename: str) -> Any:
        file_path = self.data_dir / filename
        if not file_path.exists():
            return [] if not filename.endswith("alias_map.json") else {}
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def load_all(self):
        """Loads official H4 dataset CSVs if available, falling back to JSON fixtures."""
        if self._load_official_csvs():
            return

        # Fallback to local JSON files if official CSVs are absent
        self._load_fallback_json()

    def _load_official_csvs(self) -> bool:
        """Loads official dataset from H4_Medication_Safety_Checker/data."""
        if not self.h4_data_dir.exists():
            return False

        drug_ref_path = self.h4_data_dir / "drug_reference.csv"
        combos_path = self.h4_data_dir / "combination_brands.csv"
        interactions_path = self.h4_data_dir / "interactions.csv"
        renal_path = self.h4_data_dir / "renal_rules.csv"
        dup_path = self.h4_data_dir / "duplicate_therapy_groups.csv"
        ci_path = self.h4_data_dir / "drug_disease_contraindications.csv"
        conditions_path = self.h4_data_dir / "conditions.csv"

        if not (drug_ref_path.exists() and interactions_path.exists()):
            return False

        # 1. Load drug_reference.csv
        drug_rows = self._read_csv(drug_ref_path)
        self.drug_catalogue = []
        self.drug_ref_by_generic = {}
        for r in drug_rows:
            gen = r.get("generic_name", "").strip().lower()
            brands = [b.strip() for b in r.get("common_brands", "").split(";") if b.strip()]
            dose_forms = [d.strip() for d in r.get("dose_forms", "").split(";") if d.strip()]
            
            entry = {
                "id": r.get("drug_id", ""),
                "genericName": r.get("generic_name", ""),
                "drugClass": r.get("drug_class", "Standard"),
                "therapeuticGroup": r.get("therapeutic_group", ""),
                "duplicateGroup": r.get("duplicate_group", ""),
                "commonBrands": brands,
                "brandAliases": brands,
                "doseForms": dose_forms,
                "usualDose": r.get("usual_adult_daily_dose_range", ""),
                "maxDailyDose": float(r["max_daily_dose_mg"]) if r.get("max_daily_dose_mg") else None,
                "renalAdjustment": r.get("renal_adjustment_flag") == "Y",
                "renalRule": r.get("renal_rule", ""),
                "pregnancyCategory": r.get("pregnancy_category", "N"),
                "notes": r.get("notes", "")
            }
            self.drug_catalogue.append(entry)
            self.drug_ref_by_generic[gen] = entry

        # 2. Load combination_brands.csv
        combo_rows = self._read_csv(combos_path)
        self.combination_brands = []
        self.combos_by_key = {}
        for r in combo_rows:
            b_name = r.get("brand_name", "").strip()
            str_lbl = r.get("strength_label", "").strip()
            comps = [c.strip() for c in r.get("generic_components", "").split(";") if c.strip()]
            entry = {
                "brandName": b_name,
                "strengthLabel": str_lbl,
                "doseForm": r.get("dose_form", ""),
                "components": r.get("components", ""),
                "genericComponents": comps
            }
            self.combination_brands.append(entry)
            self.combos_by_key[clean_key(b_name)] = comps
            if str_lbl:
                self.combos_by_key[clean_key(f"{b_name} {str_lbl}")] = comps
                self.combos_by_key[clean_key(f"{b_name}-{str_lbl}")] = comps

        # 3. Load interactions.csv
        ix_rows = self._read_csv(interactions_path)
        self.interaction_rules = []
        self.interactions_by_pair = {}
        for r in ix_rows:
            da = r.get("drug_a", "").strip().lower()
            db = r.get("drug_b", "").strip().lower()
            pair = tuple(sorted([da, db]))
            sev = r.get("severity", "").strip().lower()
            action = r.get("recommended_action", "").strip()
            mech = r.get("mechanism_effect", "").strip()
            self.interactions_by_pair[pair] = (sev, action, mech)
            self.interaction_rules.append({
                "drugA": da,
                "drugB": db,
                "severity": sev,
                "recommendedAction": action,
                "mechanism": mech
            })

        # 4. Load renal_rules.csv
        renal_rows = self._read_csv(renal_path)
        self.renal_rules = []
        self.renal_by_generic = {}
        for r in renal_rows:
            gen = r.get("generic_name", "").strip().lower()
            egfr_b = int(r.get("egfr_below", 0))
            sev = r.get("severity", "").strip().lower()
            act = r.get("recommended_action", "").strip()
            if gen not in self.renal_by_generic:
                self.renal_by_generic[gen] = []
            self.renal_by_generic[gen].append((egfr_b, sev, act))
            self.renal_rules.append({
                "genericName": gen,
                "egfrBelow": egfr_b,
                "severity": sev,
                "recommendedAction": act
            })
        for gen in self.renal_by_generic:
            self.renal_by_generic[gen].sort(key=lambda x: x[0])

        # 5. Load duplicate_therapy_groups.csv
        dup_rows = self._read_csv(dup_path)
        self.duplicate_rules = []
        self.duplicate_groups_by_id = {}
        for r in dup_rows:
            grp = r.get("duplicate_group", "").strip().lower()
            members = set(m.strip().lower() for m in r.get("member_generics", "").split(";") if m.strip())
            entry = {
                "groupId": grp,
                "groupName": r.get("group_name", ""),
                "severity": r.get("severity", "").strip().lower(),
                "recommendedAction": r.get("recommended_action", "").strip(),
                "members": members
            }
            self.duplicate_groups_by_id[grp] = entry
            self.duplicate_rules.append(entry)

        # 6. Load drug_disease_contraindications.csv
        ci_rows = self._read_csv(ci_path)
        self.contraindication_rules = []
        self.contraindications_by_condition = {}
        for r in ci_rows:
            cid = r.get("condition_id", "").strip().lower()
            gen = r.get("generic_name", "").strip().lower()
            sev = r.get("severity", "").strip().lower()
            act = r.get("recommended_action", "").strip()
            reason = r.get("reason", "").strip()
            if cid not in self.contraindications_by_condition:
                self.contraindications_by_condition[cid] = []
            self.contraindications_by_condition[cid].append((gen, sev, act, reason))
            self.contraindication_rules.append({
                "conditionId": cid,
                "conditionName": r.get("condition_name", ""),
                "genericName": gen,
                "severity": sev,
                "recommendedAction": act,
                "reason": reason
            })

        # 7. Load conditions.csv
        cond_rows = self._read_csv(conditions_path)
        self.conditions_catalog = {}
        for r in cond_rows:
            cid = r.get("condition_id", "").strip().lower()
            self.conditions_catalog[cid] = {
                "conditionId": cid,
                "conditionName": r.get("condition_name", ""),
                "kind": r.get("kind", ""),
                "description": r.get("description", ""),
                "exampleTerms": r.get("example_terms", "")
            }

        # 8. Build exact lookup dictionary for normalization
        self.exact_lookup = {}
        for k, v in SPECIAL_RESOLUTIONS.items():
            self.exact_lookup[clean_key(k)] = v
        for drug in self.drug_catalogue:
            gen = drug["genericName"]
            self.exact_lookup[clean_key(gen)] = [gen]
            for b in drug["brandAliases"]:
                self.exact_lookup[clean_key(b)] = [gen]
        for combo in self.combination_brands:
            comps = combo["genericComponents"]
            self.exact_lookup[clean_key(combo["brandName"])] = comps
            if combo["strengthLabel"]:
                self.exact_lookup[clean_key(f"{combo['brandName']} {combo['strengthLabel']}")] = comps
                self.exact_lookup[clean_key(f"{combo['brandName']}-{combo['strengthLabel']}")] = comps
                
        self.lookup_keys = sorted(self.exact_lookup.keys(), key=lambda x: -len(x))

        # 9. Load patients_train.csv into official_patients
        train_pat_path = self.h4_data_dir / "patients_train.csv"
        self.official_patients = []
        if train_pat_path.exists():
            pat_rows = self._read_csv(train_pat_path)
            for r in pat_rows[:100]:
                pid = r.get("patient_id", "")
                age = int(r.get("age", 50))
                sex = r.get("sex", "M")
                preg = r.get("pregnant", "NA")
                diag_list = [d.strip() for d in r.get("diagnoses", "").split(";") if d.strip()]
                allergies_str = r.get("allergies", "")
                meds_raw = [m.strip() for m in re.split(r"[;\n]", r.get("medication_list", "")) if m.strip()]
                
                patient_obj = {
                    "id": pid,
                    "name": f"H4 Patient {pid}",
                    "age": age,
                    "sex": "Female" if sex == "F" else "Male",
                    "gender": "Female" if sex == "F" else "Male",
                    "eGfr": float(r["egfr_ml_min_1_73m2"]) if r.get("egfr_ml_min_1_73m2") and r["egfr_ml_min_1_73m2"] != "nan" else None,
                    "eGFR": float(r["egfr_ml_min_1_73m2"]) if r.get("egfr_ml_min_1_73m2") and r["egfr_ml_min_1_73m2"] != "nan" else None,
                    "weightKg": float(r["weight_kg"]) if r.get("weight_kg") and r["weight_kg"] != "nan" else None,
                    "pregnancyStatus": "Positive" if preg == "Y" else ("Negative" if preg == "N" else "Not Applicable"),
                    "diagnoses": diag_list,
                    "knownAllergies": [allergies_str] if allergies_str and allergies_str != "nan" else [],
                    "allergies": [allergies_str] if allergies_str and allergies_str != "nan" else [],
                    "currentMedications": [{"genericName": m, "strength": "", "dose": "", "route": "Oral", "frequency": "Standard"} for m in meds_raw],
                    "medicationList": r.get("medication_list", ""),
                    "prescriberCount": int(r.get("prescriber_count", 1)) if r.get("prescriber_count") else 1,
                    "isDemonstrationData": False,
                    "dataSource": "Official H4 Dataset (Train Cohort)",
                    "highestAlertSeverity": "Review Needed",
                    "reviewStatus": "Pending Review"
                }
                self.official_patients.append(patient_obj)

        # 10. Load synthetic demo patients from fallback JSON if available
        synth_data = self._load_json("synthetic_patients.json")
        if synth_data:
            self.synthetic_patients = synth_data
            for pt in self.synthetic_patients:
                pt["dataSource"] = "Synthetic Demo Patient"
                pt["isDemonstrationData"] = True
        self.demo_cases = self._load_json("demo_cases.json")

        self.official_data_loaded = True
        self.official_dataset_info = {
            "drugsCount": len(self.drug_catalogue),
            "combinationsCount": len(self.combination_brands),
            "interactionsCount": len(self.interaction_rules),
            "renalRulesCount": len(self.renal_rules),
            "duplicateGroupsCount": len(self.duplicate_rules),
            "contraindicationsCount": len(self.contraindication_rules),
            "conditionsCount": len(self.conditions_catalog),
            "lookupKeysCount": len(self.lookup_keys)
        }
        return True

    def _load_fallback_json(self):
        """Loads fallback JSON fixtures if dataset CSVs are unavailable."""
        self.drug_catalogue = self._load_json("drug_catalogue.json")
        for drug in self.drug_catalogue:
            gen = drug.get("genericName", "").strip().lower()
            self.drug_ref_by_generic[gen] = drug
        self.interaction_rules = self._load_json("interaction_rules.json")
        self.duplicate_rules = self._load_json("duplicate_rules.json")
        self.renal_rules = self._load_json("renal_rules.json")
        self.contraindication_rules = self._load_json("contraindications.json")
        
        alias_data = self._load_json("alias_map.json")
        if isinstance(alias_data, dict):
            self.brand_to_generic = alias_data.get("brand_to_generic", {})
            self.common_misspellings = alias_data.get("common_misspellings", {})
        else:
            self.brand_to_generic = {}
            self.common_misspellings = {}

        self.synthetic_patients = self._load_json("synthetic_patients.json")
        self.demo_cases = self._load_json("demo_cases.json")
        self.official_data_loaded = False

    def get_drug_by_generic(self, generic_name: str) -> Optional[Dict[str, Any]]:
        cleaned = generic_name.strip().lower()
        if cleaned in self.drug_ref_by_generic:
            return self.drug_ref_by_generic[cleaned]
        for drug in self.drug_catalogue:
            if drug.get("genericName", "").strip().lower() == cleaned:
                return drug
        return None

    def get_patient_by_id(self, patient_id: str) -> Optional[Dict[str, Any]]:
        cleaned_id = patient_id.strip().upper()
        for pt in self.synthetic_patients:
            if pt.get("id", "").strip().upper() == cleaned_id:
                return pt
        for pt in self.official_patients:
            if pt.get("id", "").strip().upper() == cleaned_id:
                return pt
        return None

    def add_official_data(self, data_type: str, records: List[Dict[str, Any]]):
        if data_type == "medicines":
            self.drug_catalogue = records
            self.official_data_loaded = True
        elif data_type == "interactions":
            self.interaction_rules = records
            self.official_data_loaded = True
        elif data_type == "patients":
            self.synthetic_patients = records
            self.official_data_loaded = True
        elif data_type == "near_miss":
            self.demo_cases = records
            self.official_data_loaded = True

reference_store = ReferenceStore()
