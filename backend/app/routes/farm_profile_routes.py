
from fastapi import APIRouter, HTTPException, Depends, Path

from app.services.farm_profile_service import get_farm_profile
from app.dependencies import get_current_farmer

router = APIRouter(
    prefix="/farmers",
    tags=["Farm Profiles"]
)


@router.get("/{upi}/profile")
def get_farmer_profile(
    upi: str = Path(..., min_length=1, max_length=64),
    current_farmer: dict = Depends(get_current_farmer)
):
    # Verify parcel ownership
    if upi not in current_farmer.get("upis", []):
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access this farm profile."
        )

    # Retrieve farm profile
    profile = get_farm_profile(upi)

    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Farm profile not found. Check the UPI and available records."
        )

    return {
        "message": "Farm profile retrieved successfully",
        "data": profile
    }



