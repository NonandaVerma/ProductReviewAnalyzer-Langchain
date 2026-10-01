"""
backend/core/chains.py
----------------------
Purpose:
  LangChain LCEL (LangChain Expression Language) Chains & Pipelines.
  Demonstrates BOTH `with_structured_output()` (Native Tool Calling) 
  AND LangChain Output Parsers (`PydanticOutputParser`, `StrOutputParser`).
"""

from typing import Dict, Any, List
from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser
from langchain_core.prompts import PromptTemplate

from core.models import get_llm_with_fallback
from core.schemas import RootCauseReport
from core.prompts import get_root_cause_prompt_template, get_rag_qa_prompt_template
from core.vectorstore import similarity_search_for_product
from core.memory import get_langchain_chat_history

def run_batch_extraction_chain(product_name: str, review_texts: List[str]) -> RootCauseReport:
    """
    Demonstrates Modern LangChain Structured Output Concept:
    Chain = PromptTemplate | LLM.with_structured_output(RootCauseReport)
    Uses native Function/Tool Calling API of Gemini 2.0 Flash to guarantee 100% valid JSON.
    """
    llm_with_fallback = get_llm_with_fallback()
    prompt = get_root_cause_prompt_template()
    
    # Modern approach: Native Tool/Function Calling Structured Output
    structured_llm = llm_with_fallback.with_structured_output(RootCauseReport)
    chain = prompt | structured_llm
    
    combined_reviews = "\n---\n".join(review_texts[:20])
    return chain.invoke({
        "product_name": product_name,
        "review_text": combined_reviews
    })

def run_fallback_pydantic_parser_chain(product_name: str, review_texts: List[str]) -> RootCauseReport:
    """
    Demonstrates Classical LangChain Output Parser Concept (PydanticOutputParser):
    Chain = PromptWithFormatInstructions | LLM | PydanticOutputParser()
    Used for open-source models (HuggingFace / local LLMs) that do not support native function calling.
    """
    llm = get_llm_with_fallback()
    parser = PydanticOutputParser(pydantic_object=RootCauseReport)
    
    # Inject Pydantic format instructions into prompt template
    format_instructions = parser.get_format_instructions()
    prompt_string = (
        "You are an AI Quality Engine. Extract structured root cause metrics for {product_name}.\n"
        "Customer Reviews:\n{review_text}\n\n"
        "{format_instructions}"
    )
    prompt = PromptTemplate(
        template=prompt_string,
        input_variables=["product_name", "review_text"],
        partial_variables={"format_instructions": format_instructions}
    )
    
    chain = prompt | llm | parser
    combined_reviews = "\n---\n".join(review_texts[:20])
    return chain.invoke({
        "product_name": product_name,
        "review_text": combined_reviews
    })

def run_rag_qa_chain(product_id: str, product_name: str, question: str) -> Dict[str, Any]:
    """
    Demonstrates LangChain RAG & StrOutputParser Concept:
    Chain = ChatPromptTemplate | LLM | StrOutputParser()
    1. Fetches MMR vector context chunks from ChromaDB.
    2. Injects runtime chat history via MessagesPlaceholder.
    3. Parses output text string cleanly via StrOutputParser().
    """
    context_docs = similarity_search_for_product(product_id, question, k=4)
    context_text = "\n\n".join([doc.page_content for doc in context_docs]) if context_docs else "No specific review context found."
    sources = [f"Review Chunk #{doc.metadata.get('review_index', 'N/A')}" for doc in context_docs]
    
    chat_history = get_langchain_chat_history(product_id)
    prompt = get_rag_qa_prompt_template()
    llm = get_llm_with_fallback()
    output_parser = StrOutputParser()
    
    chain = prompt | llm | output_parser
    
    answer = chain.invoke({
        "product_name": product_name,
        "context": context_text,
        "chat_history": chat_history,
        "question": question
    })
    
    return {
        "answer": answer,
        "sources": sources
    }
