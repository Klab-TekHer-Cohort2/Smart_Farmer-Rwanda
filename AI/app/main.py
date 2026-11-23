
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from AI.app.services.crop_suitability import assess_crop_suitability
from AI.app.services.advisory import generate_advisory
from AI.app.services.gemini_service import generate_farmer_explanation
from AI.app.services.weather_service import get_farm_weather


app = FastAPI(
    title="Smart Farmer Rwanda AI Service",
    description="AI-powered crop recommendation and weather forecasting service",
    version="1.1.0"
)


class SoilAssessmentRequest(BaseModel):
    upi: str
    soil_texture: Optional[str] = None
    soil_type: Optional[str] = None
    soil_ph: Optional[float] = Field(default=None, ge=0, le=14)
    drainage: Optional[str] = None
    soil_depth_cm: Optional[float] = Field(default=None, gt=0)
    fertility: Optional[str] = None


class AdvisoryExplanationRequest(SoilAssessmentRequest):
    farmer_question: str
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)




def recognize_question_intent(question: str) -> str:
    """
    Recognize whether a farmer is asking about:
    - Crop recommendations
    - Weather forecasts
    - Something outside the chatbot's scope
    """

    question_lower = question.lower().strip()

    weather_phrases = [
        # English
        "weather", "rain", "rainfall", "forecast", "temperature",
        "sunny", "cloudy", "wind", "humidity", "storm", "drought",
        "climate", "weather conditions", "will it rain",
        "is it going to rain",

        # Kinyarwanda
        "ikirere", "imvura", "ese imvura", "hazagwa imvura",
        "imvura izagwa", "imvura izaza", "iteganyagihe",
        "ubushyuhe", "izuba", "umuyaga", "amapfa",
        "ikirere kimeze gute", "ese hazaba izuba",
        "ese ejo hazagwa imvura",
    ]

    crop_phrases = [
        # English
        "which crop", "which crops", "what crop", "what crops",
        "what should i plant", "what should i grow",
        "what can i plant", "what can i grow",
        "what do you think i should plant",
        "what to plant", "what to grow",
        "suitable crop", "crop recommendation",
        "recommend crops", "crops for my soil",
        "crops for my land", "best crop",
        "crop suitability", "start farming",
        "start growing crops", "start planting",
        "farming on my land", "planting on my land",
        "growing crops on my land", "what to farm",

        # Kinyarwanda
        "nahinga iki",
        "ni iki nahinga",
        "nakwihingira iki",
        "ni ibihe bihingwa",
        "nahinga ibihe bihingwa",
        "ni iki nakwihingira",
        "ni iki nakorera ku butaka bwanjye",
        "ndashaka gutangira guhinga",
        "ndifuza gutangira guhinga",
        "ndashaka guhinga",
        "ubutaka bwanjye",
        "ni iki cyahingwa",
        "ibihingwa byakwera",
        "ni ibihe bihingwa byera",
        "mbese nahinga iki",
    ]

    # Check weather first to avoid confusing weather questions
    # with crop recommendation questions.
    if any(phrase in question_lower for phrase in weather_phrases):
        return "weather"

    if any(phrase in question_lower for phrase in crop_phrases):
        return "crop_recommendation"

    return "out_of_scope"




@app.get("/")
def home():
    return {
        "message": "Welcome to Smart Farmer Rwanda AI Service",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Smart Farmer Rwanda AI"
    }


@app.post("/assess-soil")
def assess_parcel_soil(request: SoilAssessmentRequest):

    soil_information = request.model_dump(exclude={"upi"})

    result = assess_crop_suitability(soil_information)

    return {
        "upi": request.upi,
        "data_source": "sample_or_unverified",
        "assessment": result
    }


@app.post("/explain-advisory")
def explain_agricultural_advisory(
    request: AdvisoryExplanationRequest
):

    # Step 1: Recognize the farmer's question.
    intent = recognize_question_intent(request.farmer_question)

    # Step 2: Redirect questions outside our project scope.
    # Do not run soil assessment, RAG or weather retrieval.
    if intent == "out_of_scope":
        return {
            "upi": request.upi,
            "intent": intent,
            "advisory": None,
            "weather": None,
            "gemini_explanation": (
                "Hello! I'm your Smart Farmer Rwanda assistant. "
                "I currently help farmers with crop recommendations "
                "and weather forecasts. You can ask me which crops "
                "may suit your soil or what weather to expect."
            )
        }

    # Step 3: Validate weather coordinates when supplied.
    if (request.latitude is None) != (request.longitude is None):
        raise HTTPException(
            status_code=422,
            detail="Both latitude and longitude are required."
        )

    weather_data = None
    advisory_result = None

    # Step 4: Retrieve only the information needed.

    if intent == "weather":

        if request.latitude is None or request.longitude is None:
            return {
                "upi": request.upi,
                "intent": intent,
                "advisory": None,
                "weather": None,
                "gemini_explanation": (
                    "I can help you check the weather forecast, "
                    "but I need your farm's location coordinates first."
                )
            }

        weather_data = get_farm_weather(
            request.latitude,
            request.longitude
        )

    elif intent == "crop_recommendation":

        soil_information = request.model_dump(
            exclude={
                "upi",
                "farmer_question",
                "latitude",
                "longitude"
            }
        )

        advisory_result = generate_advisory(soil_information)

    # Step 5: Ask Gemini to explain the relevant information.
    explanation = generate_farmer_explanation(
        advisory_data={
            "data_source": "sample_or_unverified",
            "intent": intent,
            "advisory": advisory_result,
            "weather": weather_data
        },
        farmer_question=request.farmer_question
    )

    # Step 6: Return the response.
    return {
        "upi": request.upi,
        "intent": intent,
        "data_source": "sample_or_unverified",
        "advisory": advisory_result,
        "weather": weather_data,
        "gemini_explanation": explanation
    }
