
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.weather_routes import router as weather_router
from app.routes.parcel_routes import router as parcel_router
from app.routes.soil_routes import router as soil_router
from app.routes.farm_profile_routes import router as farm_profile_router
from app.routes.farmer_routes import router as farmer_router
from app.routes.admin_routes import router as admin_router
from app.routes.auth_routes import router as auth_router


# Create the FastAPI application
app = FastAPI(
    title="Smart Farmer Rwanda API",
    description=(
        "An AI-powered agricultural advisory system "
        "for Rwandan farmers."
    ),
    version="1.0.0"
)


# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routers
app.include_router(farmer_router)
app.include_router(parcel_router)
app.include_router(soil_router)
app.include_router(farm_profile_router)
app.include_router(admin_router)
app.include_router(weather_router)
app.include_router(auth_router)


# Welcome endpoint
@app.get("/", tags=["General"])
def home():
    return {
        "message": "Welcome to Smart Farmer Rwanda!",
        "status": "Backend is running"
    }


# Health check endpoint
@app.get("/health", tags=["General"])
def health_check():
    return {
        "status": "healthy",
        "project": "Smart Farmer Rwanda",
        "version": "1.0.0"
    }
