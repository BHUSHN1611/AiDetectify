from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth_routes import router as auth_router
from routes.detect_routes import router as detect_router

from utils.predictor import _load_model
import logging


logging.basicConfig(level=logging.INFO)

app = FastAPI(title="AI Image Detectify API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://aidetectify.onrender.com","http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(detect_router)


@app.on_event("startup")
async def startup_event():
    """Pre-load the ML model so the first request isn't slow."""
    _load_model()


@app.get("/")
async def root():
    return {"message": "AI Image Detectify API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
