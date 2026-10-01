"""
backend/core/memory.py
----------------------
Purpose:
  Conversational Memory Manager for LangChain.
  Converts stored MongoDB Atlas chat history documents into LangChain
  `HumanMessage` and `AIMessage` instances for dynamic insertion into `MessagesPlaceholder`.
"""

from typing import List
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from database.mongo import fetch_chat_history

def get_langchain_chat_history(product_id: str) -> List[BaseMessage]:
    """
    Demonstrates LangChain Chat Memory Concept:
    Loads stored MongoDB chat turns and formats them as BaseMessage objects
    for dynamic MessagesPlaceholder injection at runtime.
    """
    db_history = fetch_chat_history(product_id)
    messages: List[BaseMessage] = []
    
    for turn in db_history:
        role = turn.get("role", "human")
        content = turn.get("content", "")
        if role == "user" or role == "human":
            messages.append(HumanMessage(content=content))
        elif role == "assistant" or role == "ai":
            messages.append(AIMessage(content=content))
            
    return messages
