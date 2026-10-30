from fastapi import APIRouter, UploadFile, File, HTTPException
from ..schemas.evaluation import IngestionReport
from ..services.ingestion_service import inspect_and_ingest_records
from ..services.reference_store import reference_store

router = APIRouter(prefix="/ingest", tags=["Dataset Ingestion"])

@router.post("/file", response_model=IngestionReport)
async def upload_dataset_file(file: UploadFile = File(...)):
    """
    Ingests an organizer-provided dataset file (CSV, TSV, or JSON).
    Dynamically inspects columns, validates types, and maps records into reference stores.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file must have a valid filename")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    report = inspect_and_ingest_records(content, file.filename)
    return report

@router.get("/status")
def get_ingestion_status():
    """Returns current dataset ingestion status."""
    return {
        "officialDataLoaded": reference_store.official_data_loaded,
        "catalogueSize": len(reference_store.drug_catalogue),
        "interactionRulesSize": len(reference_store.interaction_rules),
        "syntheticPatientsSize": len(reference_store.synthetic_patients),
        "demoCasesSize": len(reference_store.demo_cases)
    }
