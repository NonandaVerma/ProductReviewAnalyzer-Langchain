"""
backend/database/mongo.py
--------------------------
Purpose:
  MongoDB Atlas connection and CRUD helper functions.
  Manages saving product catalog records, updating PM decision statuses 
  (Under Review, Approved, Flagged for R&D, Decision Finished), fetching products,
  and persisting RAG conversational threads in database 'ProductReviewAnalyzer' in MongoDB Atlas.
"""

from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import datetime
from config import settings

def get_mongo_client():
    """Returns PyMongo client instance connected to MongoDB Atlas."""
    return MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)

def get_db():
    """Returns database reference for 'ProductReviewAnalyzer'."""
    client = get_mongo_client()
    return client[settings.MONGO_DB_NAME]

def save_product_ledger(product_id: str, product_name: str, category: str, total_reviews: int, metrics: dict):
    """
    Saves or updates product ledger metadata and extracted batch metrics in MongoDB Atlas.
    Demonstrates Use Case 3 (Automated Risk Tagging):
    If extracted root_causes contain `warranty_friction == True` AND `urgency >= 4`, 
    automatically tags product status as 'Flagged for R&D'.
    """
    db = get_db()
    products_col = db["products"]
    
    # 3. Use Case 3: Automated Risk Classification
    initial_status = "Under Review"
    root_causes = metrics.get("root_causes", [])
    for item in root_causes:
        if isinstance(item, dict):
            if item.get("warranty_friction") and item.get("urgency", 0) >= 4:
                initial_status = "Flagged for R&D"
                break

    product_doc = {
        "product_id": product_id,
        "name": product_name,
        "category": category,
        "status": initial_status,
        "upload_date": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "total_reviews": total_reviews,
        "metrics": metrics
    }
    
    products_col.update_one(
        {"product_id": product_id},
        {"$set": product_doc},
        upsert=True
    )
    return product_doc

def update_product_status(product_id: str, new_status: str):
    """Updates PM decision status ('Under Review', 'Approved', 'Flagged for R&D', 'Decision Finished')."""
    db = get_db()
    products_col = db["products"]
    products_col.update_one(
        {"product_id": product_id},
        {"$set": {"status": new_status}}
    )

def fetch_all_products():
    """Fetches all product records for the catalog."""
    db = get_db()
    products_col = db["products"]
    return list(products_col.find({}, {"_id": 0}))

def fetch_product_by_id(product_id: str):
    """Fetches a specific product record by ID for Use Case 2 (Dynamic REST API)."""
    db = get_db()
    products_col = db["products"]
    return products_col.find_one({"product_id": product_id}, {"_id": 0})

def save_chat_message(product_id: str, role: str, content: str, sources: list = None):
    """Saves a conversational turn (user query or AI assistant response) in MongoDB Atlas."""
    db = get_db()
    chat_col = db["chat_history"]
    doc = {
        "product_id": product_id,
        "role": role,
        "content": content,
        "sources": sources or [],
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    chat_col.insert_one(doc)

def fetch_chat_history(product_id: str):
    """Fetches full conversational QA thread history for a given product."""
    db = get_db()
    chat_col = db["chat_history"]
    return list(chat_col.find({"product_id": product_id}, {"_id": 0}).sort("timestamp", 1))

def ensure_user_indexes():
    """Idempotent unique index on users.email. Safe to call on every app startup."""
    db = get_db()
    db["users"].create_index("email", unique=True, name="uniq_email")

def create_user(name: str, email: str, hashed_password: str) -> dict:
    """Inserts a new PM user account. Raises ValueError if the email is already registered."""
    db = get_db()
    users_col = db["users"]
    doc = {
        "name": name,
        "email": email.lower().strip(),
        "hashed_password": hashed_password,
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }
    try:
        result = users_col.insert_one(doc)
    except DuplicateKeyError:
        raise ValueError("Email already registered")
    doc["_id"] = str(result.inserted_id)
    return doc

def get_user_by_email(email: str):
    """Fetches a user account by email, or None if not found."""
    db = get_db()
    users_col = db["users"]
    return users_col.find_one({"email": email.lower().strip()})
