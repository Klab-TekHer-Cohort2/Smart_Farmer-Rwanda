from pydantic import BaseModel, ConfigDict, EmailStr, Field


class AdminLogin(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)


class AdminResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    admin_id: str
    full_name: str
    email: EmailStr
    is_active: bool = True