
from AI.app.services.soil_assessment import assess_soil


def test_complete_soil_information():
    result = assess_soil(
        soil_texture="Loamy",
        soil_type="Volcanic soil",
        soil_ph=6.2,
        drainage="Good",
        soil_depth_cm=100,
        fertility="High"
    )

    assert result["is_complete"] is True
    assert result["missing_information"] == []


def test_missing_soil_information():
    result = assess_soil(
        soil_texture="Clay",
        soil_type=None,
        soil_ph=None,
        drainage="Poor",
        soil_depth_cm=None,
        fertility="Medium"
    )

    assert result["is_complete"] is False
    assert "soil_type" in result["missing_information"]
    assert "soil_ph" in result["missing_information"]
