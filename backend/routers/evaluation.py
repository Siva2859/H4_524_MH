from fastapi import APIRouter
from ..schemas.evaluation import EvaluationMetrics
from ..services.evaluation_service import (
    get_evaluation_summary,
    run_benchmark_evaluation
)

router = APIRouter(prefix="/evaluation", tags=["Evaluation & Benchmarks"])

@router.get("/summary", response_model=EvaluationMetrics)
def fetch_evaluation_summary():
    """
    Retrieves current evaluation status.
    If organizer dataset is pending, returns explicit 'official_pending' status.
    """
    return get_evaluation_summary()

@router.post("/run-benchmark", response_model=EvaluationMetrics)
def trigger_benchmark_run():
    """
    Runs automated evaluation across verified test scenarios and computes exact
    recall, matching accuracy, and alert distribution metrics.
    """
    return run_benchmark_evaluation()
