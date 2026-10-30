from fastapi import APIRouter, HTTPException
from ..schemas.safety import SafetyReviewRequest, SafetyReviewResponse
from ..services.safety_engine import run_safety_review_engine

router = APIRouter(tags=["Medication Safety"])

@router.post("/safety-review", response_model=SafetyReviewResponse)
def execute_safety_review(payload: SafetyReviewRequest):
    """
    Executes clinical decision-support medication safety evaluation.
    Screens for DDIs, therapeutic duplications, renal dose limits, and clinical contraindications.
    """
    try:
        response = run_safety_review_engine(
            clinical_context=payload.clinical_context,
            medications=payload.medications,
            options=payload.options
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during safety review execution: {str(e)}"
        )
