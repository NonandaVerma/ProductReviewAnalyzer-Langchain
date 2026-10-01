"""
backend/core/loaders.py
-----------------------
Purpose:
  Data Loaders & Smart Chunking Engine using LangChain text splitters.
  Ingests CSV/Excel datasets and splits unstructured review text into
  searchable Document chunks with rich metadata.
"""

import pandas as pd
import io
from typing import List
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

def load_reviews_from_bytes(file_bytes: bytes, filename: str, product_id: str) -> List[Document]:
    """
    Parses CSV/Excel file bytes into LangChain Document objects enriched with product metadata.
    """
    if filename.endswith(".xlsx"):
        df = pd.read_excel(io.BytesIO(file_bytes))
    else:
        df = pd.read_csv(io.BytesIO(file_bytes))
        
    documents = []
    
    # Identify text column dynamically
    text_col = None
    for col in df.columns:
        if "review" in col.lower() or "text" in col.lower() or "comment" in col.lower():
            text_col = col
            break
    if not text_col:
        text_col = df.columns[0]
        
    for idx, row in df.iterrows():
        review_text = str(row[text_col]) if pd.notna(row[text_col]) else ""
        if review_text.strip():
            doc = Document(
                page_content=review_text,
                metadata={
                    "product_id": product_id,
                    "review_index": idx,
                    "filename": filename
                }
            )
            documents.append(doc)
            
    return documents

def split_documents(documents: List[Document], chunk_size: int = 500, chunk_overlap: int = 50) -> List[Document]:
    """
    Demonstrates LangChain Text Splitter concept: RecursiveCharacterTextSplitter.
    Splits long review texts into smaller semantic chunks to preserve context in ChromaDB.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", " ", ""]
    )
    return splitter.split_documents(documents)
