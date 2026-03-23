from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# Auth Models
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


# Detection Models
class DetectionResult(BaseModel):
    prediction: str         
    confidence: float       
    ai_probability: float    
    real_probability: float  
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
