import re
import json
from pathlib import Path
from itertools import combinations
import pandas as pd

HERE = Path(__file__).resolve().parent
DATA = HERE / "data"

FORM_WORDS = {
    "tab", "tab.", "t.", "t", "cap", "cap.", "c.", "c", "inj", "inj.", "syp", "syp.", "syr",
    "inh", "inh.", "mdi", "rotacap", "sachet", "sach.", "sach", "patch", "susp", "drops",
    "powder", "neb", "respule", "gel", "ointment", "cream", "lotion", "solution", "syrup"
}

STOP_WORDS = {
    "od", "bd", "tds", "hs", "sos", "prn", "bid", "tid", "qid", "once", "twice", "x", "at",
    "if", "after", "before", "weekly", "every", "daily", "puffs", "puff", "empty", "ml",
    "-", "--", "(cont.)", "continue", "cont.", "cont", "bf", "bbf", "food", "stomach", "pain",
    "bedtime", "night", "morning", "days", "day", "month", "months", "wks", "weeks", "week",
    "tsp", "dr", "doctor", "pvt", "clinic", "phc", "opd", "ortho", "old", "rx", "hrs",
    "hours", "times", "time", "take", "with", "water", "milk", "dose", "cr", "sr", "er",
    "pr", "xl", "la", "ds"
}

NON_DRUGS = {
    "bp charting", "cervical collar", "check k+ in 1 wk", "diabetic diet",
    "diet advice - low salt", "dressing daily", "ecg done", "glucometer strips",
    "hot water fomentation", "insulin pen needles", "knee cap", "ls belt",
    "nebulisation sos at phc", "physiotherapy", "plenty of oral fluids",
    "rbs monitoring", "rft/lft next visit", "review after 1 month",
    "review with reports", "salt restriction", "steam inhalation",
    "sugar charting at home", "walker"
}

SPECIALS = {
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
}

def key(s: str) -> str:
    s = s.lower()
    s = re.sub(r"ks|cs", "x", s)
    s = re.sub(r"ph", "f", s)
    s = re.sub(r"ee|ea", "i", s)
    s = re.sub(r"oo", "u", s)
    return re.sub(r"[^a-z0-9]", "", s)

def is_stopped(entry: str) -> bool:
    return bool(re.search(r"\[discont\.?\]|\bdiscontinued\b|\bdiscont\.?\b|\(stop\b.*?\)|- stopped.*|\bstopped\b|^stop\s+", entry, re.IGNORECASE))

def clean_entry(entry: str) -> str:
    e = re.sub(r"\s*-\s*", "-", entry)
    e = re.sub(r"\[discont\.?\]|\bdiscontinued\b|\bdiscont\.?\b|\(stop\b.*?\)|- stopped.*|\bstopped\b|^stop\s+", "", e, flags=re.IGNORECASE)
    e = re.sub(r"^\s*x\.?\s+", "", e, flags=re.IGNORECASE)
    return e.strip()

def levenshtein_dist(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return levenshtein_dist(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = list(range(len(s2) + 1))
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

def find_best_match(target: str, candidates: list, max_dist: int = 2):
    if len(target) < 4:
        return None
    best_candidate = None
    min_d = max_dist + 1
    for c in candidates:
        if abs(len(c) - len(target)) > max_dist:
            continue
        d = levenshtein_dist(target, c)
        if d < min_d:
            min_d = d
            best_candidate = c
            if d == 1:
                break
    if min_d <= max_dist:
        return best_candidate
    return None

def build_engine_lookups():
    ref = pd.read_csv(DATA / "drug_reference.csv", keep_default_na=False)
    combos = pd.read_csv(DATA / "combination_brands.csv", keep_default_na=False)
    ix = pd.read_csv(DATA / "interactions.csv", keep_default_na=False)
    renal = pd.read_csv(DATA / "renal_rules.csv", keep_default_na=False)
    dup_groups = pd.read_csv(DATA / "duplicate_therapy_groups.csv", keep_default_na=False)
    ci = pd.read_csv(DATA / "drug_disease_contraindications.csv", keep_default_na=False)
    
    exact_lk = {}
    for k, v in SPECIALS.items():
        exact_lk[key(k)] = v
        
    for g, brands in zip(ref.generic_name, ref.common_brands):
        exact_lk[key(g)] = [g]
        for b in [x for x in brands.split(";") if x]:
            exact_lk[key(b)] = [g]
            
    for b, comps in zip(combos.brand_name, combos.generic_components):
        exact_lk[key(b)] = [x.strip() for x in comps.split(";") if x.strip()]
        
    for b, str_lbl, comps in zip(combos.brand_name, combos.strength_label, combos.generic_components):
        if str_lbl:
            exact_lk[key(f"{b} {str_lbl}")] = [x.strip() for x in comps.split(";") if x.strip()]
            exact_lk[key(f"{b}-{str_lbl}")] = [x.strip() for x in comps.split(";") if x.strip()]
            
    drug_ref = {}
    for _, r in ref.iterrows():
        drug_ref[r["generic_name"]] = {
            "duplicate_group": r["duplicate_group"],
            "pregnancy_category": r["pregnancy_category"],
            "renal_flag": r["renal_adjustment_flag"]
        }
        
    interactions_map = {}
    for _, r in ix.iterrows():
        a, b = sorted([r["drug_a"], r["drug_b"]])
        interactions_map[(a, b)] = (r["severity"], r["recommended_action"])
        
    renal_map = {}
    for _, r in renal.iterrows():
        g = r["generic_name"]
        if g not in renal_map:
            renal_map[g] = []
        renal_map[g].append((int(r["egfr_below"]), r["severity"], r["recommended_action"]))
        
    for g in renal_map:
        renal_map[g].sort(key=lambda x: x[0])
        
    dup_map = {}
    for _, r in dup_groups.iterrows():
        grp = r["duplicate_group"]
        dup_map[grp] = {
            "severity": r["severity"],
            "recommended_action": r["recommended_action"],
            "members": set(r["member_generics"].split(";")) if r["member_generics"] else set()
        }
        
    ci_map = {}
    for _, r in ci.iterrows():
        cid = r["condition_id"]
        if cid not in ci_map:
            ci_map[cid] = []
        ci_map[cid].append((r["generic_name"], r["severity"], r["recommended_action"]))
        
    return {
        "lk": exact_lk,
        "lk_keys": sorted(exact_lk.keys(), key=lambda x: -len(x)),
        "drug_ref": drug_ref,
        "interactions": interactions_map,
        "renal": renal_map,
        "dup_groups": dup_map,
        "ci": ci_map
    }

def resolve_single_part(part: str, lk: dict, lk_keys: list):
    if re.search(r"\b30[/-]70\b|insulin 30/70", part, re.IGNORECASE):
        return ["insulin isophane", "insulin regular"]
    if re.search(r"\binsulin\b.*\b50[/-]50\b", part, re.IGNORECASE):
        return ["insulin isophane", "insulin regular"]

    words = part.split()
    while words and words[0].lower().rstrip(".") in FORM_WORDS:
        words = words[1:]
    while words and words[0].lower() in {"x", "tab", "tab.", "t.", "cap", "cap."}:
        words = words[1:]
        
    name = []
    for w in words:
        lw = w.lower().rstrip(".,")
        if lw in STOP_WORDS or re.match(r"^[0-9]", lw) or re.fullmatch(r"[0-9]-[0-9]-[0-9].*", lw):
            break
        name.append(w)
        
    for n in range(len(name), 0, -1):
        k = key(" ".join(name[:n]))
        if k in lk:
            return lk[k]
            
    full_k = key(" ".join(name))
    if full_k in lk:
        return lk[full_k]
        
    stripped_k = re.sub(r"\d+$", "", full_k)
    if stripped_k in lk:
        return lk[stripped_k]
        
    cand = find_best_match(stripped_k if stripped_k else full_k, lk_keys, max_dist=2)
    if cand and cand in lk:
        return lk[cand]
        
    if name:
        first_k = key(name[0])
        first_stripped = re.sub(r"\d+$", "", first_k)
        if len(first_stripped) >= 5:
            cand = find_best_match(first_stripped, lk_keys, max_dist=2)
            if cand and cand in lk:
                return lk[cand]
        elif len(first_stripped) == 4:
            cand = find_best_match(first_stripped, lk_keys, max_dist=1)
            if cand and cand in lk:
                return lk[cand]

    if len(full_k) >= 4:
        for k in lk_keys:
            if k.startswith(full_k) and len(k) <= len(full_k) + 4:
                return lk[k]

    return []

def resolve_entry(entry: str, lk: dict, lk_keys: list):
    if entry.strip().lower() in NON_DRUGS:
        return []
    cleaned = clean_entry(entry)
    if not cleaned:
        return []
    if "+" in cleaned:
        parts = cleaned.split("+")
        res = []
        for p in parts:
            sub = resolve_single_part(p, lk, lk_keys)
            res.extend(sub)
        if res:
            return sorted(set(res))
    if "/" in cleaned:
        parts = cleaned.split("/")
        if len(parts) == 2 and not re.match(r"^\d", parts[0].strip()) and not re.match(r"^\d", parts[1].strip()):
            res = []
            for p in parts:
                sub = resolve_single_part(p, lk, lk_keys)
                res.extend(sub)
            if res:
                return sorted(set(res))
    res = resolve_single_part(cleaned, lk, lk_keys)
    if res:
        return sorted(set(res))
    return sorted(set(resolve_single_part(entry, lk, lk_keys)))

def extract_conditions(diagnoses_str: str, allergies_str: str) -> set:
    conds = set()
    diag = str(diagnoses_str).lower()
    allergy = str(allergies_str).lower()
    
    # 1. Heart Failure
    if re.search(r"\bhf\b|heart failure|cardiac failure|chf|hfref|hfpef|dcmp|ccf|lv dysfunction|lvef|ef\s*\d+%|ef\s*<|cardiomyopathy", diag):
        if not re.search(r"no\s+(hf|heart failure|ccf)", diag):
            conds.add("heart_failure")
        
    # 2. Chronic Liver Disease
    if re.search(r"cirrhosis|cirrhotic|cirrrhosis|cld|chronic liver|liver disease|liver failure|chronic hepatitis|portal htn|ascites", diag):
        conds.add("chronic_liver_disease")
        
    # 3. Peptic ulcer
    if re.search(r"peptic ulcer|pud|gi bleed|ugi bleed|gastric ulcer|duodenal ulcer|ulcer stomach|bleeding du|bleeding gu", diag):
        conds.add("peptic_ulcer")
        
    # 4. Asthma
    if re.search(r"asthma|\bba\b|bronchial asthma|reactive airway|wheeze", diag):
        if not re.search(r"no\s+(ba|asthma|reactive airway)", diag):
            conds.add("asthma")
            
    # 5. Angle closure glaucoma
    if re.search(r"angle\s*closure|narrow angle|glaucoma", diag):
        conds.add("angle_closure_glaucoma")
        
    # 6. Dementia
    if re.search(r"dementia|alzheimer", diag):
        conds.add("dementia")
        
    # 7. Parkinsons
    if re.search(r"parkinson|paralysis agitans|\bpd\b", diag):
        conds.add("parkinsons")
        
    # 8. Gout
    if re.search(r"\bgout\b|gouty|hyperuric|tophaceous", diag):
        if not re.search(r"no\s+gout", diag):
            conds.add("gout")
        
    # 9. Myasthenia Gravis
    if re.search(r"myasthenia|\bmg\b", diag):
        conds.add("myasthenia_gravis")
        
    # 10. G6PD deficiency
    if re.search(r"g6pd", diag):
        conds.add("g6pd_deficiency")
        
    # 11. Epilepsy
    if re.search(r"epilepsy|seizure|convulsion", diag):
        conds.add("epilepsy")
        
    # Allergies
    if allergy and allergy != "nan" and "nkda" not in allergy and "no known" not in allergy:
        if re.search(r"penicillin|\bpcn\b|amoxicillin|ampicillin", allergy):
            conds.add("penicillin_allergy")
        if re.search(r"sulfa|sulphonamide|sulfonamide|septra|bactrim", allergy):
            conds.add("sulfonamide_allergy")
        if re.search(r"aspirin|nsaid|brufen|ibuprofen|combiflam|painkiller", allergy):
            conds.add("nsaid_hypersensitivity")
            
    return conds

SEV_RANK = {"contraindicated": 4, "major": 3, "moderate": 2, "minor": 1}

def run_pipeline(pats_df: pd.DataFrame, engine: dict):
    res_rows = []
    alerts = []
    
    lk = engine["lk"]
    lk_keys = engine["lk_keys"]
    drug_ref = engine["drug_ref"]
    interactions_map = engine["interactions"]
    renal_map = engine["renal"]
    dup_map = engine["dup_groups"]
    ci_map = engine["ci"]
    
    for _, pat in pats_df.iterrows():
        pid = pat["patient_id"]
        med_list = str(pat["medication_list"])
        tokens = [t.strip() for t in re.split(r"[;\n]", med_list) if t.strip()]
        
        active_entries_generics = []
        patient_seen_alerts = set()
        
        for tok in tokens:
            gens = resolve_entry(tok, lk, lk_keys)
            res_rows.append({
                "patient_id": pid,
                "written_token": tok,
                "resolved_generic": ";".join(sorted(gens))
            })
            if not is_stopped(tok) and gens:
                active_entries_generics.append(set(gens))
                
        all_active_generics = set().union(*active_entries_generics) if active_entries_generics else set()
        
        # 1. Interactions
        for g1, g2 in combinations(sorted(all_active_generics), 2):
            hit = interactions_map.get((g1, g2))
            if hit:
                key_alert = (pid, "interaction", frozenset([g1, g2]))
                if key_alert not in patient_seen_alerts:
                    patient_seen_alerts.add(key_alert)
                    alerts.append({
                        "patient_id": pid,
                        "issue_type": "interaction",
                        "severity": hit[0],
                        "drugs_involved": f"{g1};{g2}",
                        "suggested_action": hit[1],
                        "confidence": 0.90
                    })
                    
        # 2. Duplicate Therapy
        # Case (a): Same generic across >= 2 entries
        for g in sorted(all_active_generics):
            entries_with_g = sum(1 for e in active_entries_generics if g in e)
            if entries_with_g >= 2:
                ref_info = drug_ref.get(g, {})
                grp = ref_info.get("duplicate_group", "")
                grp_info = dup_map.get(grp, {})
                
                if g == "paracetamol":
                    sev = "major"
                    action = "Paracetamol from two products - risk of exceeding 4 g/day (liver toxicity); keep one source"
                elif grp_info:
                    sev = grp_info["severity"]
                    action = grp_info["recommended_action"]
                else:
                    sev = "moderate"
                    action = f"Duplicate therapy: {g} prescribed multiple times - review total daily dose"
                    
                key_alert = (pid, "duplicate_therapy", frozenset([g]))
                if key_alert not in patient_seen_alerts:
                    patient_seen_alerts.add(key_alert)
                    alerts.append({
                        "patient_id": pid,
                        "issue_type": "duplicate_therapy",
                        "severity": sev,
                        "drugs_involved": g,
                        "suggested_action": action,
                        "confidence": 0.90
                    })
                    
        # Case (b): Two different generics from same group in different entries
        for g1, g2 in combinations(sorted(all_active_generics), 2):
            grp1 = drug_ref.get(g1, {}).get("duplicate_group", "")
            grp2 = drug_ref.get(g2, {}).get("duplicate_group", "")
            if grp1 and grp1 == grp2:
                g1_entries = [i for i, e in enumerate(active_entries_generics) if g1 in e]
                g2_entries = [i for i, e in enumerate(active_entries_generics) if g2 in e]
                has_distinct_entry = any(i != j for i in g1_entries for j in g2_entries)
                if has_distinct_entry:
                    grp_info = dup_map.get(grp1, {})
                    sev = grp_info.get("severity", "moderate")
                    action = grp_info.get("recommended_action", f"Two drugs from same class ({grp1}) - keep one")
                    key_alert = (pid, "duplicate_therapy", frozenset([g1, g2]))
                    if key_alert not in patient_seen_alerts:
                        patient_seen_alerts.add(key_alert)
                        alerts.append({
                            "patient_id": pid,
                            "issue_type": "duplicate_therapy",
                            "severity": sev,
                            "drugs_involved": f"{g1};{g2}",
                            "suggested_action": action,
                            "confidence": 0.90
                        })
                        
        # 3. Renal Dose
        egfr_val = pat.get("egfr_ml_min_1_73m2")
        if egfr_val is not None and str(egfr_val).strip() and str(egfr_val).strip() != "nan":
            try:
                egfr_num = float(egfr_val)
                for g in sorted(all_active_generics):
                    if g in renal_map:
                        for tier_below, tier_sev, tier_act in renal_map[g]:
                            if egfr_num < tier_below:
                                key_alert = (pid, "renal_dose", frozenset([g]))
                                if key_alert not in patient_seen_alerts:
                                    patient_seen_alerts.add(key_alert)
                                    alerts.append({
                                        "patient_id": pid,
                                        "issue_type": "renal_dose",
                                        "severity": tier_sev,
                                        "drugs_involved": g,
                                        "suggested_action": tier_act,
                                        "confidence": 0.90
                                    })
                                break
            except ValueError:
                pass
                
        # 4. Contraindications
        is_pregnant = str(pat.get("pregnant", "")).strip().upper() == "Y"
        conds = extract_conditions(pat.get("diagnoses", ""), pat.get("allergies", ""))
        if is_pregnant:
            conds.add("pregnancy")
            
        for g in sorted(all_active_generics):
            g_alerts = []
            
            for c in conds:
                if c in ci_map:
                    for rule_gen, rule_sev, rule_act in ci_map[c]:
                        if rule_gen == g:
                            g_alerts.append((SEV_RANK.get(rule_sev, 1), rule_sev, rule_act))
                            
            if is_pregnant:
                preg_cat = drug_ref.get(g, {}).get("pregnancy_category", "")
                if preg_cat == "X":
                    g_alerts.append((4, "contraindicated", "Contraindicated in pregnancy (FDA category X) - stop and switch to a pregnancy-safe alternative"))
                elif preg_cat == "D":
                    g_alerts.append((3, "major", "Evidence of fetal risk (FDA category D) - review urgently; switch to a safer alternative unless benefit clearly justifies"))
                    
            if g_alerts:
                g_alerts.sort(key=lambda x: -x[0])
                top_rank, top_sev, top_act = g_alerts[0]
                key_alert = (pid, "contraindication", frozenset([g]))
                if key_alert not in patient_seen_alerts:
                    patient_seen_alerts.add(key_alert)
                    alerts.append({
                        "patient_id": pid,
                        "issue_type": "contraindication",
                        "severity": top_sev,
                        "drugs_involved": g,
                        "suggested_action": top_act,
                        "confidence": 0.90
                    })
                    
    return pd.DataFrame(alerts), pd.DataFrame(res_rows)

def main():
    print("Building engine lookups...")
    engine = build_engine_lookups()
    
    print("Loading train patients...")
    pats = pd.read_csv(DATA / "patients_train.csv", keep_default_na=False)
    
    print("Running pipeline on train patients...")
    pred_df, res_df = run_pipeline(pats, engine)
    
    out_dir = HERE / "submission_test_run"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    pred_path = out_dir / "H4_predictions.csv"
    res_path = out_dir / "H4_resolution.csv"
    
    pred_df.to_csv(pred_path, index=False)
    res_df.to_csv(res_path, index=False)
    print(f"Saved {len(pred_df)} predictions to {pred_path}")
    print(f"Saved {len(res_df)} resolutions to {res_path}")

if __name__ == "__main__":
    main()
