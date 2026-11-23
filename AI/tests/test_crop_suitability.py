
from AI.app.services.crop_suitability import assess_crop_suitability


def test_complete_soil_information():
    soil = {
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "preliminary_screening"
    assert result["soil_type_received"] == "volcanic"
    assert result["soil_depth_received_cm"] == 100
    assert result["fertility_received"] == "high"

    assert result["assessment_method"] == "three_factor_soil_screening"

    assert result["factors_assessed"] == [
        "soil_texture",
        "soil_ph",
        "drainage"
    ]

    assert len(result["recommendations"]) == 6


def test_missing_soil_information():
    soil = {
        "soil_texture": "loamy",
        "soil_type": None,
        "soil_ph": None,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "insufficient_data"
    assert "soil_ph" in result["missing_information"]
    assert "soil_type" not in result["missing_information"]
    assert result["recommendations"] == []


def test_missing_additional_soil_information():
    soil = {
        "soil_texture": "loamy",
        "soil_type": None,
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": None,
        "fertility": None
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "preliminary_screening"

    assert "soil_type" in result["additional_information_missing"]
    assert "soil_depth_cm" in result["additional_information_missing"]
    assert "fertility" in result["additional_information_missing"]


def test_invalid_soil_ph():
    soil = {
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 15,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "invalid_data"


def test_negative_soil_depth():
    soil = {
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": -10,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "invalid_data"


def test_invalid_soil_texture():
    soil = {
        "soil_texture": 123,
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "invalid_data"


def test_invalid_drainage():
    soil = {
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": 123,
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "invalid_data"


def test_potential_match_for_maize():
    soil = {
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    maize = next(
        item for item in result["recommendations"]
        if item["crop"] == "maize"
    )

    assert maize["screening_status"] == "potential_match"
    assert maize["soil_texture_match"] is True
    assert maize["soil_ph_match"] is True
    assert maize["drainage_match"] is True
    assert maize["confirmation_required"] is True


def test_potential_mismatch_for_rice():
    soil = {
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    rice = next(
        item for item in result["recommendations"]
        if item["crop"] == "rice"
    )

    assert rice["screening_status"] == "potential_mismatch"
    assert rice["drainage_match"] is False
    assert "drainage" in rice["mismatching_factors"]


def test_soil_texture_is_case_insensitive():
    soil = {
        "soil_texture": "LOAMY",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": "GOOD",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "preliminary_screening"

    maize = next(
        item for item in result["recommendations"]
        if item["crop"] == "maize"
    )

    assert maize["soil_texture_match"] is True
    assert maize["drainage_match"] is True


def test_empty_soil_texture():
    soil = {
        "soil_texture": " ",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "invalid_data"


def test_empty_drainage():
    soil = {
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": " ",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "invalid_data"


def test_screening_is_not_confirmed_recommendation():
    soil = {
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "preliminary_screening"

    for crop in result["recommendations"]:
        assert crop["assessment_type"] == "preliminary_screening"
        assert crop["confirmation_required"] is True


def test_missing_soil_type_does_not_stop_screening():
    soil = {
        "soil_texture": "loamy",
        "soil_type": None,
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "preliminary_screening"
    assert result["soil_type_received"] is None
    assert "soil_type" in result["additional_information_missing"]


def test_boolean_ph_is_invalid():
    soil = {
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": True,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "invalid_data"


def test_boolean_depth_is_invalid():
    soil = {
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": True,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    assert result["status"] == "invalid_data"


def test_all_crops_have_evidence_status():
    soil = {
        "soil_texture": "loamy",
        "soil_type": "volcanic",
        "soil_ph": 6.2,
        "drainage": "good",
        "soil_depth_cm": 100,
        "fertility": "high"
    }

    result = assess_crop_suitability(soil)

    for crop in result["recommendations"]:
        assert crop["evidence_status"] is not None
        assert crop["requirement_status"] == "provisional_general_guidance"
