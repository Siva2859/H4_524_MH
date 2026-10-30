import re
from typing import Optional, List, Dict, Any, Tuple
from .reference_store import reference_store, clean_key, SPECIAL_RESOLUTIONS
from ..schemas.medication import NormalizationResponse

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

def find_best_match(target: str, candidates: list, max_dist: int = 2) -> Optional[Tuple[str, int]]:
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
    if min_d <= max_dist and best_candidate:
        return best_candidate, min_d
    return None

def is_stopped_entry(entry: str) -> bool:
    return bool(re.search(r"\[discont\.?\]|\bdiscontinued\b|\bdiscont\.?\b|\(stop\b.*?\)|- stopped.*|\bstopped\b|^stop\s+", entry, re.IGNORECASE))

def clean_entry_text(entry: str) -> str:
    e = re.sub(r"\s*-\s*", "-", entry)
    e = re.sub(r"\[discont\.?\]|\bdiscontinued\b|\bdiscont\.?\b|\(stop\b.*?\)|- stopped.*|\bstopped\b|^stop\s+", "", e, flags=re.IGNORECASE)
    e = re.sub(r"^\s*x\.?\s+", "", e, flags=re.IGNORECASE)
    return e.strip()

def resolve_single_part(part: str) -> Tuple[List[str], str, float]:
    lk = reference_store.exact_lookup
    lk_keys = reference_store.lookup_keys

    # Check insulin combinations
    if re.search(r"\b30[/-]70\b|insulin 30/70", part, re.IGNORECASE):
        return ["insulin isophane", "insulin regular"], "Biphasic Insulin Expansion", 100.0
    if re.search(r"\binsulin\b.*\b50[/-]50\b", part, re.IGNORECASE):
        return ["insulin isophane", "insulin regular"], "Biphasic Insulin Expansion", 100.0

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

    # 1. Exact match longest prefix
    for n in range(len(name), 0, -1):
        k = clean_key(" ".join(name[:n]))
        if k in lk:
            return lk[k], "Exact Formulary Match", 100.0

    full_k = clean_key(" ".join(name))
    if full_k in lk:
        return lk[full_k], "Exact Formulary Match", 100.0

    stripped_k = re.sub(r"\d+$", "", full_k)
    if stripped_k in lk:
        return lk[stripped_k], "Formulary Match (Dose Stripped)", 100.0

    # 2. Controlled Levenshtein Fuzzy Match
    match_res = find_best_match(stripped_k if stripped_k else full_k, lk_keys, max_dist=2)
    if match_res:
        cand, dist = match_res
        conf = 92.0 if dist == 1 else 85.0
        return lk[cand], f"Controlled Levenshtein Match (dist={dist})", conf

    # First word fuzzy match
    if name:
        first_k = clean_key(name[0])
        first_stripped = re.sub(r"\d+$", "", first_k)
        if len(first_stripped) >= 5:
            match_res = find_best_match(first_stripped, lk_keys, max_dist=2)
            if match_res:
                cand, dist = match_res
                conf = 90.0 if dist == 1 else 82.0
                return lk[cand], f"Controlled Levenshtein Match (dist={dist})", conf
        elif len(first_stripped) == 4:
            match_res = find_best_match(first_stripped, lk_keys, max_dist=1)
            if match_res:
                cand, dist = match_res
                return lk[cand], "Controlled Levenshtein Match (dist=1)", 88.0

    # Prefix match for truncated: e.g. "rozav" -> rozavel, "dyna" -> dynapar
    if len(full_k) >= 4:
        for k in lk_keys:
            if k.startswith(full_k) and len(k) <= len(full_k) + 4:
                return lk[k], "Truncated Prefix Match", 85.0

    return [], "Unresolved", 0.0

def normalize_medication_name(input_term: str) -> NormalizationResponse:
    """
    Normalizes a medication brand, generic, abbreviation, combination product,
    or misspelling into canonical generic name(s) using the official dataset.
    """
    if not input_term or not input_term.strip():
        return NormalizationResponse(
            originalInput=input_term or "",
            resolvedName=None,
            matchingMethod="None",
            confidence=0.0,
            resolutionStatus="Unresolved",
            requiresConfirmation=False,
            reasoning="Empty or whitespace-only medication name entered.",
            suggestedAlternatives=[],
            isCombination=False,
            combinationIngredients=[]
        )

    clean_raw = input_term.strip()
    lower_raw = clean_raw.lower()

    # Check non-drug entry
    if lower_raw in NON_DRUGS:
        return NormalizationResponse(
            originalInput=clean_raw,
            resolvedName="",
            matchingMethod="Non-Drug Clinical Entry",
            confidence=100.0,
            resolutionStatus="Unresolved",
            requiresConfirmation=False,
            reasoning="Identified as a clinical measurement, order, test, or lifestyle instruction, not a pharmaceutical medication.",
            suggestedAlternatives=[],
            isCombination=False,
            combinationIngredients=[]
        )

    cleaned = clean_entry_text(clean_raw)
    if not cleaned:
        return NormalizationResponse(
            originalInput=clean_raw,
            resolvedName="",
            matchingMethod="Discontinued / Blank Entry",
            confidence=100.0,
            resolutionStatus="Unresolved",
            requiresConfirmation=False,
            reasoning="Medication marked as discontinued or stopped.",
            suggestedAlternatives=[],
            isCombination=False,
            combinationIngredients=[]
        )

    # Check combinations with '+'
    if "+" in cleaned:
        parts = cleaned.split("+")
        generics = []
        confs = []
        methods = []
        for p in parts:
            p_gens, p_meth, p_conf = resolve_single_part(p)
            generics.extend(p_gens)
            confs.append(p_conf)
            methods.append(p_meth)
        if generics:
            unique_gens = sorted(set(generics))
            min_conf = min(confs) if confs else 90.0
            canonical_info = reference_store.get_drug_by_generic(unique_gens[0])
            return NormalizationResponse(
                originalInput=clean_raw,
                resolvedName=";".join(unique_gens),
                matchingMethod="Generic Combination Split",
                confidence=min_conf,
                resolutionStatus="Resolved",
                requiresConfirmation=min_conf < 85.0,
                drugClass=canonical_info.get("drugClass") if canonical_info else "Combination Product",
                reasoning=f"Resolved multi-ingredient combination to active generic components: {', '.join(unique_gens)}.",
                canonicalDrug=canonical_info,
                isCombination=len(unique_gens) > 1,
                combinationIngredients=unique_gens
            )

    # Check combinations with '/'
    if "/" in cleaned:
        parts = cleaned.split("/")
        if len(parts) == 2 and not re.match(r"^\d", parts[0].strip()) and not re.match(r"^\d", parts[1].strip()):
            generics = []
            confs = []
            for p in parts:
                p_gens, p_meth, p_conf = resolve_single_part(p)
                generics.extend(p_gens)
                confs.append(p_conf)
            if generics:
                unique_gens = sorted(set(generics))
                min_conf = min(confs) if confs else 90.0
                canonical_info = reference_store.get_drug_by_generic(unique_gens[0])
                return NormalizationResponse(
                    originalInput=clean_raw,
                    resolvedName=";".join(unique_gens),
                    matchingMethod="Generic Combination Split",
                    confidence=min_conf,
                    resolutionStatus="Resolved",
                    requiresConfirmation=min_conf < 85.0,
                    drugClass=canonical_info.get("drugClass") if canonical_info else "Combination Product",
                    reasoning=f"Resolved multi-ingredient combination to active generic components: {', '.join(unique_gens)}.",
                    canonicalDrug=canonical_info,
                    isCombination=len(unique_gens) > 1,
                    combinationIngredients=unique_gens
                )

    # Resolve single product
    resolved_gens, method, conf = resolve_single_part(cleaned)
    if not resolved_gens:
        resolved_gens, method, conf = resolve_single_part(clean_raw)

    if resolved_gens:
        unique_gens = sorted(set(resolved_gens))
        is_combo = len(unique_gens) > 1
        canonical_info = reference_store.get_drug_by_generic(unique_gens[0])
        drug_class = canonical_info.get("drugClass", "Standard") if canonical_info else ("Combination Product" if is_combo else "Unknown Class")
        
        reasoning = (
            f"Expanded combination brand '{clean_raw}' to active generic ingredients: {', '.join(unique_gens)}."
            if is_combo else
            f"Resolved '{clean_raw}' to canonical formulary generic '{unique_gens[0]}' via {method} ({conf}% confidence)."
        )
        
        return NormalizationResponse(
            originalInput=clean_raw,
            resolvedName=";".join(unique_gens),
            matchingMethod=method,
            confidence=conf,
            resolutionStatus="Resolved",
            requiresConfirmation=conf < 85.0,
            drugClass=drug_class,
            rxNormId=canonical_info.get("id") if canonical_info else None,
            reasoning=reasoning,
            canonicalDrug=canonical_info,
            isCombination=is_combo,
            combinationIngredients=unique_gens
        )

    # Unresolved medication
    return NormalizationResponse(
        originalInput=clean_raw,
        resolvedName=None,
        matchingMethod="Unresolved",
        confidence=0.0,
        resolutionStatus="Unresolved",
        requiresConfirmation=True,
        reasoning=f"No verified matching generic or brand found in official formulary for '{clean_raw}'.",
        suggestedAlternatives=[],
        isCombination=False,
        combinationIngredients=[]
    )
