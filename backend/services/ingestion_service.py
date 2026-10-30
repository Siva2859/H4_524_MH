import csv
import json
import io
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple, Optional
from .reference_store import reference_store
from ..schemas.evaluation import IngestionReport

def detect_file_delimiter(sample_text: str) -> str:
    """Detects delimiter (comma, tab, semicolon) from header sample."""
    first_line = sample_text.splitlines()[0] if sample_text else ""
    if "\t" in first_line:
        return "\t"
    if ";" in first_line:
        return ";"
    return ","

def normalize_column_name(col: str) -> str:
    """Normalizes arbitrary column names (e.g. 'Drug Name', 'generic_name', 'RXNORM_ID') for flexible mapping."""
    return col.strip().lower().replace(" ", "_").replace("-", "_")

def inspect_and_ingest_records(
    file_bytes: bytes,
    filename: str
) -> IngestionReport:
    """
    Flexibly parses and validates incoming organizer dataset files without hardcoding column names.
    Supports CSV, TSV, and JSON for ~500 medicines, ~2,000 interaction pairs, and ~5,000 patient records.
    """
    text_content = file_bytes.decode("utf-8", errors="replace")
    errors: List[str] = []
    records: List[Dict[str, Any]] = []
    file_type = "unknown"

    # Attempt JSON parsing first
    if filename.lower().endswith(".json") or text_content.strip().startswith("[") or text_content.strip().startswith("{"):
        try:
            parsed_json = json.loads(text_content)
            file_type = "json"
            if isinstance(parsed_json, list):
                records = parsed_json
            elif isinstance(parsed_json, dict):
                # Try finding list under keys like "data", "records", "medicines", "interactions", "patients"
                for k in ["data", "records", "medicines", "drugs", "interactions", "patients"]:
                    if k in parsed_json and isinstance(parsed_json[k], list):
                        records = parsed_json[k]
                        break
                if not records:
                    records = [parsed_json]
        except Exception as e:
            errors.append(f"JSON parsing error: {str(e)}")

    # Otherwise parse as delimited text (CSV/TSV)
    if not records and not errors:
        file_type = "delimited_text"
        delimiter = detect_file_delimiter(text_content[:2048])
        reader = csv.DictReader(io.StringIO(text_content), delimiter=delimiter)
        for row_idx, row in enumerate(reader):
            if row:
                records.append(row)

    if not records:
        return IngestionReport(
            success=False,
            sourceFilename=filename,
            fileType=file_type,
            recordsParsed=0,
            validRecords=0,
            invalidRecords=0,
            mappedType="unknown",
            validationErrors=errors or ["Empty file or unparseable format"],
            loadedAt=datetime.now(timezone.utc).isoformat()
        )

    # Inspect columns from first valid record
    first_row = records[0]
    norm_keys = {normalize_column_name(k): k for k in first_row.keys()}

    # Determine mapped category dynamically:
    # 1. Interactions table (~2,000 pairs: drug_a, drug_b, severity, mechanism)
    # 2. Medicines catalogue (~500 drugs: generic, brand, class, rxnorm)
    # 3. Patients records (~5,000 patients: patient_id, age, egfr, medications)
    mapped_type = "unknown"
    valid_count = 0
    invalid_count = 0
    mapped_records: List[Dict[str, Any]] = []

    # Check for Interaction pairs
    is_interactions = any(
        k in norm_keys for k in ["druga", "drug_a", "drug1", "drug_1", "first_drug"]
    ) and any(
        k in norm_keys for k in ["drugb", "drug_b", "drug2", "drug_2", "second_drug"]
    )

    # Check for Patient records
    is_patients = any(
        k in norm_keys for k in ["patient_id", "patientid", "pt_id", "mrn"]
    ) and any(
        k in norm_keys for k in ["medications", "drugs", "current_medications", "regimen"]
    )

    # Check for Medicines catalogue
    is_medicines = any(
        k in norm_keys for k in ["generic_name", "genericname", "drug_name", "drugname", "active_ingredient"]
    )

    if is_interactions:
        mapped_type = "interactions"
        key_a = next(norm_keys[k] for k in ["druga", "drug_a", "drug1", "drug_1", "first_drug"] if k in norm_keys)
        key_b = next(norm_keys[k] for k in ["drugb", "drug_b", "drug2", "drug_2", "second_drug"] if k in norm_keys)
        key_sev = next((norm_keys[k] for k in ["severity", "severity_level", "risk_level"] if k in norm_keys), None)
        key_mech = next((norm_keys[k] for k in ["mechanism", "rationale", "description"] if k in norm_keys), None)
        key_evid = next((norm_keys[k] for k in ["evidence", "source", "reference"] if k in norm_keys), None)

        for idx, row in enumerate(records):
            drug_a = str(row.get(key_a, "")).strip()
            drug_b = str(row.get(key_b, "")).strip()
            if drug_a and drug_b:
                sev_raw = str(row.get(key_sev, "High")).strip().capitalize() if key_sev else "High"
                sev = sev_raw if sev_raw in ["Critical", "High", "Moderate", "Low"] else "High"
                mapped_records.append({
                    "id": f"OFFICIAL-DDI-{idx + 1:04d}",
                    "ruleCode": f"OFFICIAL-DDI-{idx + 1}",
                    "drugA": drug_a,
                    "drugB": drug_b,
                    "severity": sev,
                    "title": f"Interaction: {drug_a} + {drug_b}",
                    "category": "Drug-Drug Interaction",
                    "mechanism": str(row.get(key_mech, "Pharmacological interaction between agents.")) if key_mech else "Pharmacological interaction between agents.",
                    "clinicalRationale": f"Documented interaction between {drug_a} and {drug_b}.",
                    "evidence": str(row.get(key_evid, "Official Dataset Reference")) if key_evid else "Official Dataset Reference",
                    "confidence": "Official Reference Matched",
                    "limitations": "Standard interaction reference rule.",
                    "suggestedAction": f"Review concurrent use of {drug_a} and {drug_b} and monitor for adverse effects.",
                    "sourceReference": "OFFICIAL-ORGANIZER-DATASET"
                })
                valid_count += 1
            else:
                invalid_count += 1
                errors.append(f"Row {idx + 1}: Missing drugA or drugB")

        if mapped_records:
            reference_store.add_official_data("interactions", mapped_records)

    elif is_patients:
        mapped_type = "patients"
        # Map patient records
        key_pid = next(norm_keys[k] for k in ["patient_id", "patientid", "pt_id", "mrn"] if k in norm_keys)
        key_meds = next(norm_keys[k] for k in ["medications", "drugs", "current_medications", "regimen"] if k in norm_keys)
        key_age = next((norm_keys[k] for k in ["age", "patient_age"] if k in norm_keys), None)
        key_egfr = next((norm_keys[k] for k in ["egfr", "e_gfr", "gfr"] if k in norm_keys), None)

        for idx, row in enumerate(records):
            pid = str(row.get(key_pid, "")).strip()
            raw_meds = row.get(key_meds, [])
            if isinstance(raw_meds, str):
                # parse comma/semicolon separated list
                med_items = [{"genericName": m.strip()} for m in raw_meds.replace(";", ",").split(",") if m.strip()]
            elif isinstance(raw_meds, list):
                med_items = [
                    {"genericName": m if isinstance(m, str) else m.get("genericName", m.get("name", ""))}
                    for m in raw_meds
                ]
            else:
                med_items = []

            if pid:
                egfr_parsed = None
                if key_egfr and row.get(key_egfr):
                    try:
                        egfr_parsed = float(row.get(key_egfr))
                    except (ValueError, TypeError):
                        egfr_parsed = None

                age_parsed = 60
                if key_age and row.get(key_age):
                    try:
                        age_parsed = int(float(row.get(key_age)))
                    except (ValueError, TypeError):
                        age_parsed = 60

                mapped_records.append({
                    "id": pid,
                    "name": f"Patient {pid} (Official)",
                    "age": age_parsed,
                    "sex": str(row.get("sex", "Unknown")),
                    "weightKg": float(row.get("weight", 70.0)),
                    "eGfr": egfr_parsed,
                    "pregnancyStatus": str(row.get("pregnancy_status", "Not Applicable")),
                    "diagnoses": [d.strip() for d in str(row.get("diagnoses", "")).split(",") if d.strip()],
                    "currentMedications": med_items,
                    "highestAlertSeverity": "Pending",
                    "reviewStatus": "Pending Review"
                })
                valid_count += 1
            else:
                invalid_count += 1

        if mapped_records:
            reference_store.add_official_data("patients", mapped_records)

    elif is_medicines:
        mapped_type = "medicines"
        key_gen = next(norm_keys[k] for k in ["generic_name", "genericname", "drug_name", "drugname", "active_ingredient"] if k in norm_keys)
        key_class = next((norm_keys[k] for k in ["drug_class", "class", "therapeutic_class"] if k in norm_keys), None)
        key_rx = next((norm_keys[k] for k in ["rxnorm", "rxnorm_id", "rxcui"] if k in norm_keys), None)
        key_brand = next((norm_keys[k] for k in ["brands", "brand_names", "brand_aliases"] if k in norm_keys), None)

        for idx, row in enumerate(records):
            gen = str(row.get(key_gen, "")).strip()
            if gen:
                brands = []
                if key_brand and row.get(key_brand):
                    b_val = row.get(key_brand)
                    if isinstance(b_val, list):
                        brands = [str(b).strip() for b in b_val]
                    else:
                        brands = [str(b).strip() for b in str(b_val).split(",") if b.strip()]

                mapped_records.append({
                    "id": f"OFFICIAL-DRUG-{idx + 1:04d}",
                    "genericName": gen,
                    "brandAliases": brands,
                    "drugClass": str(row.get(key_class, "General Formulation")) if key_class else "General Formulation",
                    "rxNormId": str(row.get(key_rx, "UNKNOWN")) if key_rx else "UNKNOWN",
                    "routes": ["Oral"],
                    "renalAdjustment": "Review official prescribing monograph",
                    "status": "Official Catalogue Ingested"
                })
                valid_count += 1
            else:
                invalid_count += 1

        if mapped_records:
            reference_store.add_official_data("medicines", mapped_records)
    else:
        errors.append(f"Unrecognized schema. Columns found: {list(first_row.keys())}. Expected medicine catalogue, interaction table, or patient records.")

    return IngestionReport(
        success=valid_count > 0 and len(errors) == 0,
        sourceFilename=filename,
        fileType=file_type,
        recordsParsed=len(records),
        validRecords=valid_count,
        invalidRecords=invalid_count,
        mappedType=mapped_type,
        validationErrors=errors[:10],
        loadedAt=datetime.now(timezone.utc).isoformat()
    )
