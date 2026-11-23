
from AI.app.services.crop_requirements import CROP_REQUIREMENTS
from AI.app.services.crop_evidence import CROP_EVIDENCE


def assess_crop_suitability(soil_information: dict):
    """
    Perform preliminary soil screening using texture, pH and drainage.

    This is not a scientifically validated or confirmed
    parcel-specific crop recommendation.
    """

    # Step 1: Check the three required screening factors.
    required_screening_fields = [
        "soil_texture",
        "soil_ph",
        "drainage"
    ]

    missing_screening_fields = [
        field for field in required_screening_fields
        if soil_information.get(field) is None
    ]

    if missing_screening_fields:
        return {
            "status": "insufficient_data",
            "message": (
                "More soil information is required for preliminary screening."
            ),
            "missing_information": missing_screening_fields,
            "recommendations": []
        }

    # Step 2: Validate soil pH.
    soil_ph = soil_information["soil_ph"]
    soil_depth = soil_information.get("soil_depth_cm")

    if (
        not isinstance(soil_ph, (int, float))
        or isinstance(soil_ph, bool)
        or not 0 <= soil_ph <= 14
    ):
        return {
            "status": "invalid_data",
            "message": "Soil pH must be a number between 0 and 14.",
            "recommendations": []
        }

    # Step 3: Validate optional soil depth.
    if soil_depth is not None and (
        not isinstance(soil_depth, (int, float))
        or isinstance(soil_depth, bool)
        or soil_depth <= 0
    ):
        return {
            "status": "invalid_data",
            "message": "Soil depth must be a positive number.",
            "recommendations": []
        }

    # Step 4: Validate soil texture and drainage.
    texture_value = soil_information["soil_texture"]
    drainage_value = soil_information["drainage"]

    if (
        not isinstance(texture_value, str)
        or not isinstance(drainage_value, str)
    ):
        return {
            "status": "invalid_data",
            "message": "Soil texture and drainage must be text.",
            "recommendations": []
        }

    texture = texture_value.strip().lower()
    drainage = drainage_value.strip().lower()

    if not texture or not drainage:
        return {
            "status": "invalid_data",
            "message": "Soil texture and drainage cannot be empty.",
            "recommendations": []
        }

    # Step 5: Identify additional parcel information.
    contextual_fields = [
        "soil_type",
        "soil_depth_cm",
        "fertility"
    ]

    additional_information_received = [
        field for field in contextual_fields
        if soil_information.get(field) is not None
    ]

    additional_information_missing = [
        field for field in contextual_fields
        if soil_information.get(field) is None
    ]

    # Step 6: Screen each crop using only the three implemented factors.
    preliminary_matches = []

    for crop, requirements in CROP_REQUIREMENTS.items():

        texture_match = (
            texture in requirements["suitable_soil_textures"]
        )

        preferred_ph = requirements["preferred_ph"]

        ph_match = (
            preferred_ph[0] <= soil_ph <= preferred_ph[1]
        )

        drainage_match = (
            drainage in requirements["drainage"]
        )

        matching_factors = [
            name for name, matched in [
                ("soil_texture", texture_match),
                ("soil_ph", ph_match),
                ("drainage", drainage_match)
            ]
            if matched
        ]

        mismatching_factors = [
            name for name, matched in [
                ("soil_texture", texture_match),
                ("soil_ph", ph_match),
                ("drainage", drainage_match)
            ]
            if not matched
        ]

        screening_status = (
            "potential_match"
            if not mismatching_factors
            else "potential_mismatch"
        )

        preliminary_matches.append({
            "crop": crop,
            "screening_status": screening_status,
            "soil_texture_match": texture_match,
            "soil_ph_match": ph_match,
            "drainage_match": drainage_match,
            "matching_factors": matching_factors,
            "mismatching_factors": mismatching_factors,
            "requirement_status": requirements["requirement_status"],
            "evidence_status": CROP_EVIDENCE[crop]["evidence_status"],
            "assessment_type": "preliminary_screening",
            "confirmation_required": True
        })

    # Step 7: Return the complete preliminary assessment.
    return {
        "status": "preliminary_screening",
        "assessment_method": "three_factor_soil_screening",

        "factors_assessed": [
            "soil_texture",
            "soil_ph",
            "drainage"
        ],

        "soil_type_received": soil_information.get("soil_type"),
        "soil_depth_received_cm": soil_depth,
        "fertility_received": soil_information.get("fertility"),

        "additional_information_received": additional_information_received,
        "additional_information_missing": additional_information_missing,

        "message": (
            "This preliminary screening compares soil texture, pH "
            "and drainage against provisional general crop guidance. "
            "It is not a confirmed crop recommendation. Additional "
            "factors such as soil type, soil depth, fertility, climate "
            "and water availability require further assessment."
        ),

        "recommendations": preliminary_matches
    }
