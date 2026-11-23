
from AI.app.services.gemini_service import generate_farmer_explanation


# Sample agricultural assessment for testing only.
sample_advisory = {
    "assessment": {
        "status": "preliminary_screening",
        "soil_information": {
            "soil_texture": "loamy",
            "soil_type": "volcanic",
            "soil_ph": 6.2,
            "drainage": "good",
            "soil_depth_cm": 100,
            "fertility": "high"
        },
        "recommendations": [
            {
                "crop": "maize",
                "screening_status": "potential_match",
                "confirmation_required": True
            },
            {
                "crop": "rice",
                "screening_status": "potential_mismatch",
                "confirmation_required": True
            }
        ]
    },
    "agricultural_evidence": [],
    "message": "This is preliminary soil screening."
}


try:
    answer = generate_farmer_explanation(
        sample_advisory,
        "Which crops look suitable for my soil, and why?"
    )

    print("\nGEMINI AGRICULTURAL EXPLANATION")
    print("--------------------------------")
    print(answer)

except Exception as error:
    print("Agricultural explanation test failed.")
    print("Error:", error)
