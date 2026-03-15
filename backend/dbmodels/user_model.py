from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── Auth Models ───────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict


class UserOut(BaseModel):
    id: str
    name: str
    email: str


# ── Detection Models ──────────────────────────────────
class DetectionResult(BaseModel):
    prediction: str          # "Real Image" | "AI Generated"
    confidence: float        # 0.0 – 1.0
    ai_probability: float    # percentage 0–100
    real_probability: float  # percentage 0–100
    filename: str
    timestamp: datetime


class DetectionHistoryItem(BaseModel):
    id: str
    user_id: str
    filename: str
    prediction: str
    confidence: float
    ai_probability: float
    real_probability: float
    timestamp: datetime
