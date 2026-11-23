
from AI.app.services.crop_suitability import assess_crop_suitability
from AI.app.services.crop_evidence import CROP_EVIDENCE
from AI.app.services.rag.semantic_retriever import semantic_search


# Explain what each existing evidence status represents.
EVIDENCE_CATEGORIES = {
    "rwanda_trials_reported_not_validated": {
        "category": "reported_crop_trials",
        "description": (
            "Crop trials have been reported in Rwanda, "
            "but the available information does not establish "
            "validated parcel-specific crop suitability."
        ),
        "suitability_support": "not_established",
        "limitation": (
            "Reported trials are not sufficient to confirm "
            "that this crop is suitable for the farmer's parcel."
        )
    },

    "rwanda_fertilizer_work_reported": {
        "category": "fertilizer_research",
        "description": (
            "Research or recommendations concerning fertilizer "
            "and nutrient management have been reported."
        ),
        "suitability_support": "not_established",
        "limitation": (
            "Fertilizer research does not prove that a crop "
            "is suitable for a particular parcel."
        )
    },

    "rwanda_production_constraints_reported": {
        "category": "production_constraints",
        "description": (
            "Research discusses crop production challenges "
            "and management constraints."
        ),
        "suitability_support": "not_established",
        "limitation": (
            "Production constraints do not establish "
            "soil texture or pH suitability for a parcel."
        )
    }
}


def generate_advisory(soil_information: dict):
    """
    Combine preliminary soil screening with crop-specific
    agricultural evidence retrieval.

    Evidence categories describe the known source material.
    Retrieved passages are not automatically verified as
    direct evidence of parcel-specific crop suitability.
    """

    # Step 1: Assess parcel soil information.
    assessment = assess_crop_suitability(soil_information)

    # Step 2: Stop if preliminary screening cannot proceed.
    if assessment["status"] != "preliminary_screening":
        return {
            "assessment": assessment,
            "agricultural_evidence": [],
            "message": (
                "More soil information is required before "
                "preliminary crop screening can be performed."
            )
        }

    agricultural_evidence = []

    # Step 3: Retrieve evidence separately for each crop.
    for recommendation in assessment["recommendations"]:

        crop = recommendation["crop"]
        crop_information = CROP_EVIDENCE[crop]

        evidence_status = crop_information["evidence_status"]

        evidence_classification = EVIDENCE_CATEGORIES.get(
            evidence_status,
            {
                "category": "unclassified_agricultural_information",
                "description": (
                    "The available evidence has not been assigned "
                    "a recognized evidence category."
                ),
                "suitability_support": "not_established",
                "limitation": (
                    "The evidence requires further agricultural review."
                )
            }
        )

        # Build a crop-specific search query.
        search_query = (
            f"Rwanda agricultural evidence for {crop}. "
            f"Soil texture: {soil_information.get('soil_texture')}. "
            f"Soil type: {soil_information.get('soil_type')}. "
            f"Soil pH: {soil_information.get('soil_ph')}. "
            f"Drainage: {soil_information.get('drainage')}. "
            f"Soil depth: {soil_information.get('soil_depth_cm')} cm. "
            f"Fertility: {soil_information.get('fertility')}. "
            f"Consider: {crop_information['soil_texture_guidance']} "
            f"{crop_information['ph_guidance']} "
            f"Other factors: "
            f"{', '.join(crop_information['other_factors'])}."
        )

        # Retrieve the three most relevant passages.
        retrieved_results = semantic_search(
            search_query,
            top_k=3
        )

        retrieved_passages = []

        for item in retrieved_results:

            retrieved_passages.append({
                "source": item["source_file"],
                "page": item["page"],
                "text": item["text"],
                "similarity_score": item["similarity_score"],
                "relevance_status": "retrieved_not_manually_verified",
                "direct_suitability_support": "not_established"
            })

        # Step 4: Organize the evidence and its limitations.
        agricultural_evidence.append({

            "crop": crop,

            "screening_status": recommendation["screening_status"],

            "screening_factors": {
                "soil_texture_match": recommendation["soil_texture_match"],
                "soil_ph_match": recommendation["soil_ph_match"],
                "drainage_match": recommendation["drainage_match"],
                "matching_factors": recommendation["matching_factors"],
                "mismatching_factors": recommendation["mismatching_factors"]
            },

            "requirement_status": recommendation["requirement_status"],

            "evidence_status": evidence_status,

            "evidence_category": evidence_classification["category"],

            "evidence_description": evidence_classification["description"],

            "suitability_support": (
                evidence_classification["suitability_support"]
            ),

            "known_sources": crop_information["sources"],

            "evidence_limitations": [
                crop_information["limitations"],
                evidence_classification["limitation"]
            ],

            "retrieval_note": (
                "Similarity scores indicate text similarity, "
                "not scientific validity or proof of crop suitability."
            ),

            "retrieved_passages": retrieved_passages
        })

    # Step 5: Return the preliminary assessment and organized evidence.
    return {
        "assessment": assessment,

        "agricultural_evidence": agricultural_evidence,

        "evidence_evaluation": {
            "evidence_categories_used": [
                "reported_crop_trials",
                "fertilizer_research",
                "production_constraints"
            ],

            "parcel_suitability_confirmed": False,

            "retrieved_passages_verified": False,

            "message": (
                "The retrieved agricultural passages require "
                "further review. Their similarity scores do not "
                "establish scientific validity or parcel suitability."
            )
        },

        "message": (
            "Preliminary soil screening and crop-specific "
            "agricultural evidence retrieval completed. The "
            "available evidence does not establish confirmed "
            "parcel-specific crop suitability."
        )
    }
