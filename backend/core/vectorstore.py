"""
backend/core/vectorstore.py
---------------------------
Purpose:
  ChromaDB Persistent Vector Store & Retrieval Pipeline.
  Handles query/result vector generation and Maximal Marginal Relevance (MMR) search.
"""

import os
from typing import List
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from config import settings
from core.models import get_embedding_function

def get_vectorstore() -> Chroma:
    """Returns persistent ChromaDB vector store instance."""
    embedding_fn = get_embedding_function()
    os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)
    return Chroma(
        collection_name="product_reviews",
        embedding_function=embedding_fn,
        persist_directory=settings.CHROMA_PERSIST_DIR
    )

def add_documents_to_vectorstore(documents: List[Document]):
    """Embeds and indexes document chunks into persistent ChromaDB store."""
    if not documents:
        return
    vectorstore = get_vectorstore()
    vectorstore.add_documents(documents)

def similarity_search_for_product(product_id: str, query: str, k: int = 4) -> List[Document]:
    """
    Demonstrates LangChain Retrieval Concept: Maximal Marginal Relevance (MMR) search.
    Fetches top k relevant and diverse context chunks filtered by `product_id`.
    """
    vectorstore = get_vectorstore()
    return vectorstore.max_marginal_relevance_search(
        query=query,
        k=k,
        filter={"product_id": product_id}
    )
