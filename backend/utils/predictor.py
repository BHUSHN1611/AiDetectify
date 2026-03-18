"""
predictor.py
Loads the pretrained CNN model once at startup and exposes predict_image().

The model file is expected at:
    backend/model_detect/detector_model.h5

IMG_SIZE is auto-detected from the model's input layer so this file never
needs editing when you swap in a different model (128, 224, etc.).
"""

import os
import io
import logging
import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────
# Fallback size used only when building the dummy model (no .h5 found).
FALLBACK_IMG_SIZE = 128
MODEL_PATH = os.path.join(
    os.path.dirname(__file__), "..", "model_detect", "detector_model.h5"
)

# ── State ─────────────────────────────────────────────
model    = None
img_size = FALLBACK_IMG_SIZE   # will be overwritten once model is loaded


def _detect_img_size(m) -> int:
    """
    Read the spatial input size directly from the loaded model so we
    never have to hard-code it here.

    Handles three common shapes:
      (None, H, W, C)  – standard image model
      (None, N)        – flat input (unusual but safe fallback)
      None             – model has no declared input shape
    """
    try:
        shape = m.input_shape          # e.g. (None, 128, 128, 3)
        if shape and len(shape) == 4:
            return int(shape[1])       # height dimension
    except Exception:
        pass
    logger.warning("Could not read model input shape – defaulting to %d", FALLBACK_IMG_SIZE)
    return FALLBACK_IMG_SIZE


# ── Load model once ───────────────────────────────────
def _load_model():
    global model, img_size
    if model is not None:
        return model

    abs_path = os.path.abspath(MODEL_PATH)
    if not os.path.exists(abs_path):
        logger.warning(
            "Model file not found at %s — using random-weight fallback. "
            "Place your trained detector_model.h5 there for real predictions.",
            abs_path,
        )
        # model    = _build_fallback_model()
        img_size = FALLBACK_IMG_SIZE
        return None

    try:
        import tensorflow as tf
        loaded   = tf.keras.models.load_model(abs_path)
        img_size = _detect_img_size(loaded)
        model    = loaded
        logger.info(
            "Loaded detector model from %s — input size auto-detected: %dx%d",
            abs_path, img_size, img_size,
        )
    except Exception as exc:
        logger.error("Failed to load model: %s — using fallback", exc)
        # model    = _build_fallback_model()
        img_size = FALLBACK_IMG_SIZE

    return None


# def _build_fallback_model():
#     """
#     Tiny Sequential CNN with random weights — keeps the API alive when
#     no .h5 is present. Predictions are meaningless.
#     """
#     try:
#         import tensorflow as tf
#         m = tf.keras.Sequential([
#             tf.keras.layers.Input(shape=(FALLBACK_IMG_SIZE, FALLBACK_IMG_SIZE, 3)),
#             tf.keras.layers.Conv2D(8, 3, activation="relu"),
#             tf.keras.layers.GlobalAveragePooling2D(),
#             tf.keras.layers.Dense(1, activation="sigmoid"),
#         ])
#         logger.info(
#             "Fallback model built with random weights (input %dx%d).",
#             FALLBACK_IMG_SIZE, FALLBACK_IMG_SIZE,
#         )
#         return m
#     except Exception as exc:
#         logger.error("Could not build fallback model: %s", exc)
#         return None


# ── Public API ────────────────────────────────────────
def predict_image(file_bytes: bytes) -> dict:
    """
    Run AI-vs-real inference on raw image bytes.

    Returns:
        {
            "prediction":       "Real Image" | "AI Generated",
            "confidence":       float  (0.0 – 1.0),
            "ai_probability":   float  (0 – 100),
            "real_probability": float  (0 – 100),
        }
    """
    m = _load_model()

    # ── Preprocess ────────────────────────────────────
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize((img_size, img_size), Image.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 255.0
    arr = np.expand_dims(arr, axis=0)      # (1, H, W, 3)

    logger.debug("Inference input shape: %s  img_size: %d", arr.shape, img_size)

    # ── Inference ─────────────────────────────────────
    if m is None:
        raw = 0.5   # last-resort: no model at all
    else:
        raw = float(m.predict(arr, verbose=0)[0][0])

    # Convention: sigmoid > 0.5 → Real Image, else → AI Generated
    if raw > 0.5:
        label      = "Real Image"
        confidence = raw
    else:
        label      = "AI Generated"
        confidence = 1.0 - raw

    return {
        "prediction":       label,
        "confidence":       round(confidence, 3),
        "ai_probability":   round((1.0 - raw) * 100, 1),
        "real_probability": round(raw * 100, 1),
    }