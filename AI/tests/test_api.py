
from fastapi.testclient import TestClient

from AI.app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_soil_assessment_endpoint():
    payload = {
        "upi": "SAMPLE-UPI-001",
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    response = client.post("/assess-soil", json=payload)

    assert response.status_code == 200

    result = response.json()

    assert result["upi"] == "SAMPLE-UPI-001"
    assert result["data_source"] == "sample_or_unverified"
    assert result["assessment"]["status"] == "preliminary_screening"


def test_invalid_ph_is_rejected_by_api():
    payload = {
        "upi": "SAMPLE-UPI-001",
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 15,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    response = client.post("/assess-soil", json=payload)

    assert response.status_code == 422
