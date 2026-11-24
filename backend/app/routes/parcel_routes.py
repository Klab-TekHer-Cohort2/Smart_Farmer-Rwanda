
from fastapi import APIRouter, HTTPException, Depends, status

from app.models.parcel import (
    ParcelCreate,
    AdminParcelCreate,
    ParcelUpdate
)

from app.services.parcel_service import (
    create_parcel,
    get_all_parcels,
    get_parcel_by_id,
    get_parcels_by_farmer,
    update_parcel,
    delete_parcel
)

from app.services.farmer_service import get_farmer_by_id

from app.dependencies import get_current_farmer, require_admin


router = APIRouter(
    prefix="/parcels",
    tags=["Parcels"]
)


def handle_parcel_error(result):
    """Convert service errors into appropriate HTTP responses."""

    # Successful results can be lists or other non-dictionary values.
    if not isinstance(result, dict):
        return result

    error = result.get("error")

    if error == "farmer_not_found":
        raise HTTPException(
            status_code=404,
            detail="Farmer not found."
        )

    if error == "farmer_inactive":
        raise HTTPException(
            status_code=400,
            detail="Cannot register a parcel for an inactive farmer."
        )

    if error == "upi_already_exists":
        raise HTTPException(
            status_code=409,
            detail="A parcel with this UPI already exists."
        )

    if error == "parcel_not_found":
        raise HTTPException(
            status_code=404,
            detail="Parcel not found."
        )

    if error == "no_updates":
        raise HTTPException(
            status_code=400,
            detail="No parcel information was provided."
        )

    if error == "invalid_update":
        raise HTTPException(
            status_code=400,
            detail="Required location fields cannot be empty."
        )

    return result

# --------------------------------------------------
# FARMER: Register a parcel for their own account
# --------------------------------------------------

@router.post("/", status_code=status.HTTP_201_CREATED)
def farmer_create_parcel(
    parcel_data: ParcelCreate,
    current_farmer: dict = Depends(get_current_farmer)
):
    farmer_id = current_farmer.get("farmer_id")

    result = create_parcel(parcel_data, farmer_id)
    handle_parcel_error(result)

    return {
        "message": "Your parcel was registered successfully.",
        "data": result
    }


# --------------------------------------------------
# FARMER: View all their own parcels
# --------------------------------------------------

@router.get("/me")
def get_my_parcels(
    current_farmer: dict = Depends(get_current_farmer)
):
    farmer_id = current_farmer.get("farmer_id")

    result = get_parcels_by_farmer(farmer_id)
    handle_parcel_error(result)

    return {
        "message": "Your parcels were retrieved successfully.",
        "total_parcels": len(result),
        "data": result
    }


# --------------------------------------------------
# FARMER: View one of their own parcels
# --------------------------------------------------

@router.get("/me/{parcel_id}")
def get_my_parcel(
    parcel_id: str,
    current_farmer: dict = Depends(get_current_farmer)
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
            detail="You are not allowed to access this parcel."
        )

    return {
        "message": "Parcel retrieved successfully.",
        "data": parcel
    }


# --------------------------------------------------
# ADMIN: Register a parcel for a selected farmer
# --------------------------------------------------

@router.post("/admin", status_code=status.HTTP_201_CREATED)
def admin_create_parcel(
    parcel_data: AdminParcelCreate,
    current_admin: dict = Depends(require_admin)
):
    result = create_parcel(
        parcel_data,
        parcel_data.farmer_id
    )

    handle_parcel_error(result)

    return {
        "message": "Parcel registered successfully.",
        "data": result
    }


# --------------------------------------------------
# ADMIN: View all parcels
# --------------------------------------------------

@router.get("/admin")
def get_all_registered_parcels(
    current_admin: dict = Depends(require_admin)
):
    parcels = get_all_parcels()

    return {
        "message": "Parcels retrieved successfully.",
        "total_parcels": len(parcels),
        "data": parcels
    }


# --------------------------------------------------
# ADMIN: View all parcels belonging to one farmer
# --------------------------------------------------

@router.get("/admin/farmer/{farmer_id}")
def get_farmer_parcels(
    farmer_id: str,
    current_admin: dict = Depends(require_admin)
):
    farmer = get_farmer_by_id(farmer_id)

    if farmer is None:
        raise HTTPException(
            status_code=404,
            detail="Farmer not found."
        )

    parcels = get_parcels_by_farmer(farmer_id)
    handle_parcel_error(parcels)

    return {
        "message": "Farmer parcels retrieved successfully.",
        "farmer_id": farmer_id,
        "farmer_name": farmer.get("full_name"),
        "total_parcels": len(parcels),
        "data": parcels
    }


# --------------------------------------------------
# ADMIN: View one parcel
# --------------------------------------------------

@router.get("/admin/{parcel_id}")
def get_admin_parcel(
    parcel_id: str,
    current_admin: dict = Depends(require_admin)
):
    parcel = get_parcel_by_id(parcel_id)

    if parcel is None:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found."
        )

    return {
        "message": "Parcel retrieved successfully.",
        "data": parcel
    }


# --------------------------------------------------
# ADMIN: Update a parcel
# --------------------------------------------------

@router.put("/admin/{parcel_id}")
def update_existing_parcel(
    parcel_id: str,
    parcel_data: ParcelUpdate,
    current_admin: dict = Depends(require_admin)
):
    result = update_parcel(parcel_id, parcel_data)
    handle_parcel_error(result)

    return {
        "message": "Parcel updated successfully.",
        "data": result
    }


# --------------------------------------------------
# ADMIN: Delete a parcel
# --------------------------------------------------

@router.delete("/admin/{parcel_id}")
def delete_existing_parcel(
    parcel_id: str,
    current_admin: dict = Depends(require_admin)
):
    result = delete_parcel(parcel_id)
    handle_parcel_error(result)

    return result
