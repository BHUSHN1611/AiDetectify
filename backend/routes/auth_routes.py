from fastapi import APIRouter, HTTPException, Depends
from dbmodels.user_model import RegisterRequest, LoginRequest, TokenResponse
from utils.auth import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    decode_token, get_current_user,
)
from config.database import users_col, refresh_tokens_col
from datetime import datetime, timedelta
import os

router = APIRouter(prefix="/auth", tags=["Auth"])


# ── Register ─────────────────────────────────────────
@router.post("/register", status_code=201)
async def register(data: RegisterRequest):
    if await users_col.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    user = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "created_at": datetime.utcnow(),
    }
    result = await users_col.insert_one(user)
    user_id = str(result.inserted_id)

    access_token  = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)

    await refresh_tokens_col.insert_one({
        "user_id": user_id,
        "token": refresh_token,
        "expires_at": datetime.utcnow() + timedelta(
            days=int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
        ),
    })

    return {
        "message": "Registered successfully",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {"id": user_id, "name": data.name, "email": data.email},
    }


# ── Login ─────────────────────────────────────────────
@router.post("/login")
async def login(data: LoginRequest):
    user = await users_col.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id = str(user["_id"])
    access_token  = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)

    await refresh_tokens_col.insert_one({
        "user_id": user_id,
        "token": refresh_token,
        "expires_at": datetime.utcnow() + timedelta(
            days=int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
        ),
    })

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {"id": user_id, "name": user["name"], "email": user["email"]},
    }


# ── Refresh ───────────────────────────────────────────
@router.post("/refresh")
async def refresh(refresh_token: str):
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    stored = await refresh_tokens_col.find_one({"token": refresh_token})
    if not stored:
        raise HTTPException(status_code=401, detail="Refresh token revoked")

    new_access = create_access_token(payload["sub"])
    return {"access_token": new_access, "token_type": "bearer"}


# ── Logout ────────────────────────────────────────────
@router.post("/logout")
async def logout(refresh_token: str, current_user=Depends(get_current_user)):
    await refresh_tokens_col.delete_one({"token": refresh_token})
    return {"message": "Logged out"}


# ── Me ────────────────────────────────────────────────
@router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
    }
