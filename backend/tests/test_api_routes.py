import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert data["catalogue_size"] >= 25

def test_normalize_endpoint_post():
    response = client.post("/api/v1/medications/normalize", json={"term": "Metfornin"})
    assert response.status_code == 200
    data = response.json()
    assert data["resolvedName"].lower() == "metformin"

def test_normalize_endpoint_get():
    response = client.get("/api/v1/medications/normalize?term=Lipitor")
    assert response.status_code == 200
    data = response.json()
    assert data["resolvedName"].lower() == "atorvastatin"
    assert data["confidence"] == 100.0

def test_safety_review_endpoint():
    payload = {
        "clinicalContext": {
            "patientId": "TEST-PT-1",
            "age": 72,
            "sex": "Male",
            "weight": 75,
            "eGfr": 50,
            "pregnancyStatus": "Not Applicable",
            "diagnoses": ["AFib"]
        },
        "medications": [
            {"genericName": "Warfarin"},
            {"genericName": "Aspirin"}
        ]
    }
    response = client.post("/api/v1/safety-review", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert (data["hasCriticalAlerts"] is True) or (data["hasHighAlerts"] is True)
    assert data["totalAlerts"] >= 1
    assert "clinicalDisclaimer" in data

def test_patients_list_and_detail():
    resp = client.get("/api/v1/patients")
    assert resp.status_code == 200
    patients = resp.json()
    assert len(patients) >= 8

    # Detail
    first_id = patients[0]["id"]
    detail_resp = client.get(f"/api/v1/patients/{first_id}")
    assert detail_resp.status_code == 200
    assert detail_resp.json()["id"] == first_id

def test_reference_drugs_endpoint():
    resp = client.get("/api/v1/reference/drugs")
    assert resp.status_code == 200
    drugs = resp.json()
    assert len(drugs) >= 25

def test_evaluation_summary_endpoint():
    resp = client.get("/api/v1/evaluation/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert "status" in data
    assert "totalAlerts" in data

def test_evaluation_benchmark_run():
    resp = client.post("/api/v1/evaluation/run-benchmark")
    assert resp.status_code == 200
    data = resp.json()
    assert data["totalAlerts"] > 0
