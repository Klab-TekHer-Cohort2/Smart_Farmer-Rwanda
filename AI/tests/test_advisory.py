
from AI.app.services.advisory import generate_advisory


def test_advisory_returns_assessment_and_evidence():
    soil_information = {
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = generate_advisory(soil_information)

    assert "assessment" in result
    assert "agricultural_evidence" in result
    assert result["assessment"]["status"] == "preliminary_screening"


def test_advisory_stops_when_soil_data_is_missing():
    soil_information = {
        "soil_texture": "loamy",
        "soil_type": None,
        "soil_ph": None,
        "drainage": None,
        "soil_depth_cm": None,
        "fertility": None
    }

    result = generate_advisory(soil_information)

    assert result["assessment"]["status"] == "insufficient_data"
    assert result["agricultural_evidence"] == []
