"""
backend/core/models.py
----------------------
Purpose:
  Multi-Model Resiliency Engine for LangChain.
  Provides `get_llm_with_fallback()` using `.with_fallbacks()` so the application
  automatically redirects to backup providers (NVIDIA / HuggingFace) if Gemini hits rate limits,
  preventing live app crashes.
"""

import os
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from config import settings

def get_primary_llm():
    """Initializes primary Gemini 2.0 Flash ChatModel."""
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        api_key = os.getenv("GEMINI_API_KEY", "")
    return ChatGoogleGenerativeAI(
        model=settings.GEMINI_MODEL_NAME or "gemini-2.0-flash",
        google_api_key=api_key,
        temperature=0.2
    )

def get_llm_with_fallback():
    """
    Demonstrates LangChain Multi-Model Resiliency & Fallbacks concept.
    Wraps primary Gemini 2.0 Flash LLM with fallbacks to avoid single-point-of-failure runtime crashes.
    """
    primary_llm = get_primary_llm()
    fallback_llms = []
    
    if settings.NVIDIA_API_KEY:
        try:
            from langchain_nvidia_ai_endpoints import ChatNVIDIA
            nvidia_llm = ChatNVIDIA(
                model="meta/llama-3.1-70b-instruct",
                nvidia_api_key=settings.NVIDIA_API_KEY,
                temperature=0.2
            )
            fallback_llms.append(nvidia_llm)
        except Exception:
            pass

    if fallback_llms:
        return primary_llm.with_fallbacks(fallback_llms)
    return primary_llm

def get_embedding_function():
    """
    Pluggable Embedding Model Factory supporting NVIDIA Nemotron 3, Google text-embedding-004,
    and HuggingFace local CPU embeddings.
    """
    provider = (settings.EMBEDDING_PROVIDER or "google").lower()
    
    if provider == "nvidia" and settings.NVIDIA_API_KEY:
        try:
            from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
            return NVIDIAEmbeddings(
                model="nvidia/nemotron-3-embed-1b",
                nvidia_api_key=settings.NVIDIA_API_KEY
            )
        except Exception as e:
            print(f"[WARN] NVIDIA Embeddings unavailable ({e}), trying Google text-embedding-004.")
            
    if (provider == "google" or provider == "nvidia") and settings.GEMINI_API_KEY:
        try:
            return GoogleGenerativeAIEmbeddings(
                model="models/text-embedding-004",
                google_api_key=settings.GEMINI_API_KEY
            )
        except Exception as e:
            print(f"[WARN] Google Embeddings failed ({e}), falling back to local HuggingFace.")

    # Default robust local CPU fallback (Sentence-Transformers)
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
