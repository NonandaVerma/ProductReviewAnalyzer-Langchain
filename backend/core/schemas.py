"""
backend/core/schemas.py
-----------------------
Purpose:
  Pydantic v2 validation schemas for structured extraction using LangChain `with_structured_output()`.
  Defines strict output structures for batch review analysis, extracting sentiment counts,
  primary complaint topics, specific defects, warranty friction flags, and urgency scores.
"""

from pydantic import BaseModel, Field
from typing import List, Optional

class DefectItem(BaseModel):
    """Schema for individual extracted defect item."""
    topic: str = Field(
        ..., 
        description="Aspect category e.g. Hardware, Warranty, Battery, Build Quality, Software"
    )
    defect: str = Field(
        ..., 
        description="Specific reported defect description e.g. Excessive heating after 3 months"
    )
    warranty_friction: bool = Field(
        default=False, 
        description="True if customer reported rejection or excuses regarding warranty claims"
    )
    urgency: int = Field(
        default=3, 
        ge=1, 
        le=5, 
        description="Urgency severity rating from 1 (minor) to 5 (critical failure)"
    )

class RootCauseReport(BaseModel):
    """Schema for batch structured output extraction across customer reviews."""
    total_reviews_analyzed: int = Field(..., ge=0, description="Total review count in batch")
    positive_count: int = Field(default=0, ge=0, description="Positive sentiment count")
    negative_count: int = Field(default=0, ge=0, description="Negative sentiment count")
    neutral_count: int = Field(default=0, ge=0, description="Neutral sentiment count")
    top_complaint: str = Field(..., description="Primary reported defect category")
    root_causes: List[DefectItem] = Field(..., description="List of extracted defect items")

class StatusUpdateRequest(BaseModel):
    """Request schema for PM decision status updates."""
    product_id: str = Field(..., description="Product ID e.g. anker_powerbank_20k")
    status: str = Field(..., description="PM status: Under Review, Approved, Flagged for R&D, Decision Finished")

class ChatRequest(BaseModel):
    """Request schema for RAG chat assistant queries."""
    product_id: str = Field(..., description="Product ID context")
    question: str = Field(..., description="User query text")
