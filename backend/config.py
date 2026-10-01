"""
backend/config.py
-----------------
Purpose:
  Central configuration loader for the FastAPI backend.
  Reads environment variables from `.env` (API keys, MongoDB Atlas connection URI, 
  ChromaDB persistence path, and database name 'ProductReviewAnalyzer').
"""

import os
from dotenv import load_dotenv

# Load environment variables from root .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

class Settings:
    PROJECT_NAME: str = "ProductReviewAnalyzer"
    VERSION: str = "1.0.0"
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # MongoDB Atlas Settings
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "ProductReviewAnalyzer")
    
    # Vector Database Settings
    CHROMA_PERSIST_DIR: str = os.path.join(os.path.dirname(__file__), "..", "chroma_db")

    # Auth Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "dev-insecure-change-me")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))

    # CORS
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

settings = Settings()
