"""
backend/core/prompts.py
-----------------------
Purpose:
  Dynamic PromptTemplate & ChatPromptTemplate loader for LangChain.
  Loads externalized JSON prompt files from `backend/prompts/` and constructs
  role-based, few-shot, and conversational chat prompt templates with `MessagesPlaceholder`.
"""

import os
import json
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder

PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "..", "prompts")

def load_prompt_json(filename: str) -> dict:
    """Reads externalized JSON prompt template file."""
    path = os.path.join(PROMPTS_DIR, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    raise FileNotFoundError(f"Prompt JSON file not found at {path}")

def get_root_cause_prompt_template() -> ChatPromptTemplate:
    """
    Constructs Few-Shot Role-Based ChatPromptTemplate for structured output extraction.
    Demonstrates LangChain PromptTemplate concepts: System role, Few-shot exemplars, User content.
    """
    prompt_data = load_prompt_json("root_cause_prompt.json")
    
    system_role = prompt_data.get("system_role", "You are an AI PM Quality Intelligence Engine.")
    few_shot_examples = prompt_data.get("few_shot_examples", [])
    
    messages = [("system", system_role)]
    
    # Add Few-Shot Exemplars for model steerability
    for example in few_shot_examples:
        messages.append(("human", example["input"]))
        messages.append(("ai", json.dumps(example["output"])))
        
    messages.append(("human", prompt_data.get("template", "{review_text}")))
    
    return ChatPromptTemplate.from_messages(messages)

def get_rag_qa_prompt_template() -> ChatPromptTemplate:
    """
    Constructs RAG QA ChatPromptTemplate with MessagesPlaceholder for dynamic runtime chat history injection.
    """
    prompt_data = load_prompt_json("rag_qa_prompt.json")
    system_role = prompt_data.get("system_role", "You are an AI Product Assistant.")
    
    return ChatPromptTemplate.from_messages([
        ("system", system_role),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "Retrieved Customer Review Context Chunks:\n{context}\n\nUser Question: {question}")
    ])
