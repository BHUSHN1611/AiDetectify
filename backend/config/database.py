from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()  # ← Make sure this line exists!

MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)

db = client["authdb"]

users_col = db["users"]
refresh_tokens_col = db["refresh_tokens"]
detections_col = db["detections"]