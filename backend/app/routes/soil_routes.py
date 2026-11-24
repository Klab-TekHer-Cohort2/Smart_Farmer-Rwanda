
from fastapi import APIRouter, Depends, HTTPException, Path

from app.dependencies import get_current_farmer, require_admin
from app.services.soil_service import get_soil_by_upi
from app.services.parcel_service import (
    get_parcel_by_id,
    get_parcels_by_farmer,
    get_all_parcels,
)

router = APIRouter(prefix="/soil", tags=["Soil"])


# Farmer: view soil information for their own parcel
@router.get("/{parcel_id}")
def get_parcel_soil(
    parcel_id: str = Path(..., min_length=1, max_length=64),
    current_farmer: dict = Depends(get_current_farmer),
):
    parcel = get_parcel_by_id(parcel_id)

    if parcel is None:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found."
        )

    if parcel.get("farmer_id") != current_farmer.get("farmer_id"):
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access this soil information."
        )

    upi = parcel.get("upi")

    if not upi:
        raise HTTPException(
            status_code=404,
            detail="This parcel does not have a registered UPI."
        )

    soil = get_soil_by_upi(upi)

    if soil is None:
        raise HTTPException(
            status_code=404,
            detail="Soil information is not available for this parcel yet."
        )

    return {
        "message": "Soil information retrieved successfully",
        "parcel_id": parcel_id,
        "upi": upi,
        "data": soil
    }


# Admin: view soil information for all parcels
@router.get("/admin/all")
def get_all_soil(
    current_admin: dict = Depends(require_admin),
):
    parcels = get_all_parcels()
    soil_records = []

    for parcel in parcels:
        upi = parcel.get("upi")

        if not upi:
            continue

        soil = get_soil_by_upi(upi)

        soil_records.append({
            "parcel_id": parcel.get("parcel_id"),
            "farmer_id": parcel.get("farmer_id"),
            "upi": upi,
            "soil_data_available": soil is not None,
            "soil_information": soil
        })

    return {
        "message": "Soil information retrieved successfully",
        "total_parcels": len(soil_records),
        "data": soil_records
    }


# Admin: view soil information for a farmer's parcels
@router.get("/admin/farmer/{farmer_id}")
def get_farmer_soil(
    farmer_id: str,
    current_admin: dict = Depends(require_admin),
):
    parcels = get_parcels_by_farmer(farmer_id)

    if parcels is None:
        raise HTTPException(
            status_code=404,
            detail="Farmer not found."
        )

    soil_records = []

    for parcel in parcels:
        upi = parcel.get("upi")

        soil = get_soil_by_upi(upi) if upi else None

        soil_records.append({
            "parcel_id": parcel.get("parcel_id"),
            "upi": upi,
            "soil_data_available": soil is not None,
            "soil_information": soil
        })

    return {
        "message": "Farmer soil information retrieved successfully",
        "farmer_id": farmer_id,
        "total_parcels": len(parcels),
        "data": soil_records
    }

