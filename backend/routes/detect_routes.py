from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from config.database import detections_col
from utils.auth import get_current_user
from utils.predictor import predict_image
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api", tags=["Detection"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_SIZE_MB = 10


# ── POST /detect ──────────────────────────────────────
@router.post("/detect")
async def detect(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    # Validate content type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only JPEG, PNG, and WebP are supported.",
        )

    # Read and size-check
    file_bytes = await file.read()
    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max {MAX_SIZE_MB}MB allowed.",
        )

    # Run inference
    try:
        result = predict_image(file_bytes)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(exc)}")

    # Persist to MongoDB
    doc = {
        "user_id": str(current_user["_id"]),
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "ai_probability": result["ai_probability"],
        "real_probability": result["real_probability"],
        "timestamp": datetime.utcnow(),
    }
    inserted = await detections_col.insert_one(doc)

    return {
        "id": str(inserted.inserted_id),
        **result,
        "filename": file.filename,
        "timestamp": doc["timestamp"].isoformat(),
    }


# ── GET /history ──────────────────────────────────────
@router.get("/history")
async def history(
    limit: int = 20,
    skip: int = 0,
    current_user=Depends(get_current_user),
):
    user_id = str(current_user["_id"])
    cursor = (
        detections_col
        .find({"user_id": user_id})
        .sort("timestamp", -1)
        .skip(skip)
        .limit(limit)
    )
    items = []
    async for doc in cursor:
        items.append({
            "id": str(doc["_id"]),
            "user_id": doc["user_id"],
            "filename": doc["filename"],
            "prediction": doc["prediction"],
            "confidence": doc["confidence"],
            "ai_probability": doc.get("ai_probability", 0),
            "real_probability": doc.get("real_probability", 0),
            "timestamp": doc["timestamp"].isoformat(),
        })

    total = await detections_col.count_documents({"user_id": user_id})
    return {"items": items, "total": total, "skip": skip, "limit": limit}


# ── GET /stats ────────────────────────────────────────
@router.get("/stats")
async def stats(current_user=Depends(get_current_user)):
    user_id = str(current_user["_id"])
    total   = await detections_col.count_documents({"user_id": user_id})
    ai_gen  = await detections_col.count_documents(
        {"user_id": user_id, "prediction": "AI Generated"}
    )
    real    = await detections_col.count_documents(
        {"user_id": user_id, "prediction": "Real Image"}
    )
    return {
        "total_scans": total,
        "ai_generated": ai_gen,
        "real_images": real,
    }
