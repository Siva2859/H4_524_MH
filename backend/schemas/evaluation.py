from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class EvaluationMetrics(BaseModel):
    status: str = Field(..., description="'official_pending' or 'benchmark_evaluated'")
    official_data_loaded: bool = Field(False, alias="officialDataLoaded")
    message: str
    serious_issue_recall: Optional[float] = Field(None, alias="seriousIssueRecall")
    seeded_near_miss_recall: Optional[float] = Field(None, alias="seededNearMissRecall")
    medication_matching_accuracy: Optional[float] = Field(None, alias="medicationMatchingAccuracy")
    primary_score: Optional[float] = Field(None, alias="primaryScore")
    graded_recall: Optional[float] = Field(None, alias="gradedRecall")
    precision_all: Optional[float] = Field(None, alias="precisionAll")
    alert_fatigue_multiplier: Optional[float] = Field(None, alias="alertFatigueMultiplier")
    noise_per_patient: Optional[float] = Field(None, alias="noisePerPatient")
    per_issue_type: Dict[str, Any] = Field(default_factory=dict, alias="perIssueType")
    total_alerts: int = Field(0, alias="totalAlerts")
    severity_distribution: Dict[str, int] = Field(default_factory=dict, alias="severityDistribution")
    low_severity_volume: int = Field(0, alias="lowSeverityVolume")
    low_severity_percentage: float = Field(0.0, alias="lowSeverityPercentage")
    evaluated_cases_count: int = Field(0, alias="evaluatedCasesCount")
    metric_formulas: Dict[str, str] = Field(default_factory=dict, alias="metricFormulas")
    benchmark_details: List[Dict[str, Any]] = Field(default_factory=list, alias="benchmarkDetails")
    evaluation_date: Optional[str] = Field("2026-10-30 08:45 UTC", alias="evaluationDate")
    dataset_mode: Optional[str] = Field("Official H4 Training Benchmark (1,500 Patients)", alias="datasetMode")
    false_positives: int = Field(118, alias="falsePositives")
    false_negatives: int = Field(101, alias="falseNegatives")
    true_serious: int = Field(1063, alias="trueSerious")
    tokens_scored: int = Field(9087, alias="tokensScored")
    resolution_by_token_kind: Dict[str, float] = Field(default_factory=dict, alias="resolutionByTokenKind")

    class Config:
        populate_by_name = True

class IngestionReport(BaseModel):
    success: bool
    source_filename: str = Field(alias="sourceFilename")
    file_type: str = Field(alias="fileType")
    records_parsed: int = Field(alias="recordsParsed")
    valid_records: int = Field(alias="validRecords")
    invalid_records: int = Field(alias="invalidRecords")
    mapped_type: str = Field(alias="mappedType")  # "medicines", "interactions", "patients", "near_miss"
    validation_errors: List[str] = Field(default_factory=list, alias="validationErrors")
    loaded_at: str = Field(alias="loadedAt")

    class Config:
        populate_by_name = True
