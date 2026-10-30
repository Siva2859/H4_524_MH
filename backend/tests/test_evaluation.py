import pytest
from backend.services.evaluation_service import get_evaluation_summary, run_benchmark_evaluation
from backend.services.reference_store import reference_store

def test_evaluation_summary_with_official_data():
    metrics = get_evaluation_summary()
    if reference_store.official_data_loaded:
        assert metrics.status == "official_evaluated"
        assert metrics.official_data_loaded is True
        assert metrics.serious_issue_recall is not None
        assert metrics.serious_issue_recall >= 90.0
        assert metrics.seeded_near_miss_recall is not None
        assert metrics.seeded_near_miss_recall >= 85.0
        assert metrics.medication_matching_accuracy is not None
        assert metrics.medication_matching_accuracy >= 95.0
        assert metrics.primary_score is not None
        assert metrics.primary_score >= 0.85
        assert metrics.total_alerts > 0
    else:
        assert metrics.status == "official_pending"
        assert metrics.official_data_loaded is False

def test_benchmark_evaluation_calculation():
    metrics = run_benchmark_evaluation()
    assert metrics.total_alerts > 0
    assert "Critical" in metrics.severity_distribution
    assert metrics.low_severity_percentage >= 0.0
    assert len(metrics.benchmark_details) > 0
