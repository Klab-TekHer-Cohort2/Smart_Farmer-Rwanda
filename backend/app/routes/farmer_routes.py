
from typing import Literal
from app.services.sms_service import send_sms, SMSDeliveryError
from fastapi import (
    APIRouter,
    Depends,
    Header,
    HTTPException,
    status
)

from app.models.farmer import (
    FarmerCreate,
    FarmerUpdate,
    FarmerResponse,
    PhoneOTPRequest,
    FarmerLoginRequest,
    FarmerPINSetupRequest,
    FarmerPINResetRequest,
)

from app.services.farmer_service import (
    register_farmer,
    get_all_farmers,
    get_farmer_by_id,
    get_farmer_by_phone,
    update_farmer,
    deactivate_farmer,
    authenticate_farmer,
    set_farmer_pin,
    reactivate_farmer,
)

from app.services.otp_service import (
    generate_otp,
    verify_otp,
    invalidate_otp,
    OTPRateLimitError
)

from app.services.auth_service import create_access_token
from app.dependencies import get_current_farmer, require_admin


router = APIRouter(prefix="/farmers", tags=["Farmers"])



def handle_farmer_error(result):
    if not isinstance(result, dict) or "error" not in result:
        return result

    error = result["error"]

    if error == "phone_exists":
        raise HTTPException(
            status_code=409,
            detail="This phone number is already registered."
        )

    if error == "farmer_not_found":
        raise HTTPException(
            status_code=404,
            detail="Farmer not found."
        )

    if error == "no_updates":
        raise HTTPException(
            status_code=422,
            detail="Provide at least one field to update."
        )

    raise HTTPException(
        status_code=500,
        detail="Farmer operation failed."
    )


# --------------------------------------------------
# FARMER: Self-registration
# --------------------------------------------------

@router.post(
    "/self-register",
    response_model=FarmerResponse,
    status_code=status.HTTP_201_CREATED
)
def self_register_farmer(farmer_data: FarmerCreate):
    """
    Allow a new farmer to create their own account.

    The farmer must verify their phone and set a PIN
    before logging in.
    """

    result = register_farmer(farmer_data)

    return handle_farmer_error(result)


# --------------------------------------------------
# ADMIN: Register a farmer
# --------------------------------------------------

@router.post(
    "/register",
    response_model=FarmerResponse,
    status_code=status.HTTP_201_CREATED
)
def create_farmer(
    farmer_data: FarmerCreate,
    current_admin: dict = Depends(require_admin)
):
    return handle_farmer_error(register_farmer(farmer_data))


# --------------------------------------------------
# ADMIN: View all farmers
# --------------------------------------------------

@router.get("/", response_model=list[FarmerResponse])
def list_farmers(
    status: Literal["all", "active", "inactive"] = "all",
    current_admin: dict = Depends(require_admin)
):
    return get_all_farmers(status)


# --------------------------------------------------
# FARMER: View own profile
# --------------------------------------------------

@router.get("/me", response_model=FarmerResponse)
def get_my_profile(
    current_farmer: dict = Depends(get_current_farmer)
):
    return current_farmer


# --------------------------------------------------
# ADMIN: View one farmer
# --------------------------------------------------

@router.get(
    "/admin/{farmer_id}",
    response_model=FarmerResponse
)
def get_farmer_by_admin(
    farmer_id: str,
    current_admin: dict = Depends(require_admin)
):
    farmer = get_farmer_by_id(farmer_id)

    if farmer is None:
        raise HTTPException(
            status_code=404,
            detail="Farmer not found."
        )

    return farmer


# --------------------------------------------------
# ADMIN: Update farmer
# --------------------------------------------------

@router.put(
    "/admin/{farmer_id}",
    response_model=FarmerResponse
)
def edit_farmer(
    farmer_id: str,
    farmer_data: FarmerUpdate,
    current_admin: dict = Depends(require_admin)
):
    result = update_farmer(farmer_id, farmer_data)

    return handle_farmer_error(result)


# --------------------------------------------------
# ADMIN: Deactivate farmer
# --------------------------------------------------

@router.patch(
    "/admin/{farmer_id}/deactivate",
    response_model=FarmerResponse
)
def deactivate_farmer_admin(
    farmer_id: str,
    current_admin: dict = Depends(require_admin)
):
    farmer = deactivate_farmer(farmer_id)

    if farmer is None:
        raise HTTPException(
            status_code=404,
            detail="Farmer not found."
        )

    return farmer


# --------------------------------------------------
# ADMIN: Reactivate farmer
# --------------------------------------------------

@router.patch(
    "/admin/{farmer_id}/reactivate",
    response_model=FarmerResponse
)
def restore_farmer(
    farmer_id: str,
    current_admin: dict = Depends(require_admin)
):
    farmer = reactivate_farmer(farmer_id)

    if farmer is None:
        raise HTTPException(
            status_code=404,
            detail="Farmer not found."
        )

    return farmer


# --------------------------------------------------
# FARMER: Set up PIN after OTP verification
# --------------------------------------------------

@router.post("/set-pin")
def setup_farmer_pin(request: FarmerPINSetupRequest):

    farmer = get_farmer_by_phone(request.phone_number)

    if farmer is None or farmer.get("is_active", True) is not True:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP."
        )

    # A farmer who already has a PIN must use PIN recovery.
    if farmer.get("pin_hash"):
        raise HTTPException(
            status_code=400,
            detail="A PIN is already configured. Use forgot PIN instead."
        )

    if not verify_otp(
        request.phone_number,
        request.otp,
        purpose="setup_pin"
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP."
        )

    farmer = set_farmer_pin(
        request.phone_number,
        request.pin
    )

    if farmer is None:
        raise HTTPException(
            status_code=400,
            detail="Unable to set PIN."
        )

    return {
        "message": "PIN set successfully. You can now log in."
    }

# --------------------------------------------------
# FARMER: Set up PIN after OTP verification
# --------------------------------------------------

@router.post("/reset-pin")
def reset_farmer_pin(request: FarmerPINResetRequest):
    farmer = get_farmer_by_phone(request.phone_number)

    if farmer is None or farmer.get("is_active", True) is not True:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP."
        )

    if not verify_otp(
        request.phone_number,
        request.otp,
        purpose="reset_pin"
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP."
        )

    farmer = set_farmer_pin(
        request.phone_number,
        request.new_pin,
        invalidate_sessions=True
    )

    if farmer is None:
        raise HTTPException(
            status_code=400,
            detail="Unable to reset PIN."
        )

    return {
        "message": (
            "PIN reset successfully. "
            "You can now log in using your new PIN."
        )
    }
# --------------------------------------------------
# FARMER: Login
# --------------------------------------------------

@router.post("/login")
def farmer_login(request: FarmerLoginRequest):
    farmer = authenticate_farmer(
        request.phone_number,
        request.pin
    )

    if farmer is None:
        raise HTTPException(
            status_code=401,
            detail=(
                "Invalid phone number or PIN, "
                "or account temporarily unavailable."
            )
        )

    access_token = create_access_token(
    user_id=farmer["farmer_id"],
    role="farmer",
    auth_version=farmer.get("auth_version", 0)
)

    return {
        "message": "Login successful.",
        "access_token": access_token,
        "token_type": "bearer",
        "data": FarmerResponse.model_validate(farmer)
    }


# --------------------------------------------------
# FARMER: Request OTP
# --------------------------------------------------


@router.post("/send-otp")
async def send_otp(
    request: PhoneOTPRequest,
    authorization: str | None = Header(default=None)
):
    # OTP requests are for unauthenticated users only.
    if authorization is not None:
        raise HTTPException(
            status_code=403,
            detail="Sign out before requesting a login OTP."
        )

    farmer = get_farmer_by_phone(request.phone_number)

    # Do not reveal whether a phone number is registered.
    if farmer is None or farmer.get("is_active", True) is not True:
        return {
            "message": (
                "If the number is registered, "
                "an OTP can be requested."
            )
        }

    try:
        otp = generate_otp(
            request.phone_number,
            purpose="setup_pin"
        )

    except OTPRateLimitError as error:
        raise HTTPException(
            status_code=429,
            detail="Please wait before requesting another OTP.",
            headers={"Retry-After": str(error.retry_after)}
        )

    # Prepare the SMS in the farmer's preferred language.
    if farmer.get("preferred_language") == "rw":
        message = (
            f"Smart Farmer Rwanda: Kode yawe yo kwemeza ni {otp}. "
            "Irangira mu minota 5. Ntuyihe undi muntu."
        )
    else:
        message = (
            f"Smart Farmer Rwanda: Your verification code is {otp}. "
            "It expires in 5 minutes. Do not share it with anyone."
        )

    try:
        await send_sms(request.phone_number, message)

    except SMSDeliveryError:
        invalidate_otp(request.phone_number, "setup_pin")

        raise HTTPException(
            status_code=503,
            detail="Unable to send verification SMS. Please try again later."
        )

    return {
        "message": (
            "If the number is registered, "
            "an OTP can be requested."
        )
    }



# --------------------------------------------------
# FARMER: Request PIN recovery OTP
# --------------------------------------------------


@router.post("/forgot-pin")
async def forgot_farmer_pin(
    request: PhoneOTPRequest,
    authorization: str | None = Header(default=None)
):
    # Recovery OTP requests are for unauthenticated users.
    if authorization is not None:
        raise HTTPException(
            status_code=403,
            detail="Sign out before requesting PIN recovery."
        )

    farmer = get_farmer_by_phone(request.phone_number)

    # Do not reveal whether a phone number is registered.
    if farmer is None or farmer.get("is_active", True) is not True:
        return {
            "message": (
                "If the number is registered, "
                "a PIN recovery OTP can be requested."
            )
        }

    try:
        otp = generate_otp(
            request.phone_number,
            purpose="reset_pin"
        )

    except OTPRateLimitError as error:
        raise HTTPException(
            status_code=429,
            detail="Please wait before requesting another OTP.",
            headers={"Retry-After": str(error.retry_after)}
        )

    # Prepare the recovery SMS in the farmer's preferred language.
    if farmer.get("preferred_language") == "rw":
        message = (
            f"Smart Farmer Rwanda: Kode yo guhindura PIN ni {otp}. "
            "Irangira mu minota 5. Ntuyihe undi muntu."
        )
    else:
        message = (
            f"Smart Farmer Rwanda: Your PIN recovery code is {otp}. "
            "It expires in 5 minutes. Do not share it with anyone."
        )

    try:
        await send_sms(request.phone_number, message)

    except SMSDeliveryError:
        invalidate_otp(request.phone_number, "reset_pin")

        raise HTTPException(
            status_code=503,
            detail="Unable to send recovery SMS. Please try again later."
        )

    return {
        "message": (
            "If the number is registered, "
            "a PIN recovery OTP can be requested."
        )
    }



# --------------------------------------------------
# FARMER: View profile by ID (own account only)
# --------------------------------------------------

@router.get(
    "/{farmer_id}",
    response_model=FarmerResponse
)
def get_farmer_profile(
    farmer_id: str,
    current_farmer: dict = Depends(get_current_farmer)
):
    if farmer_id != current_farmer.get("farmer_id"):
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access this farmer's profile."
        )

    return current_farmer
