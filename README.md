# ⚡ ProductReviewAnalyzer — PM Decision Intelligence Suite

An AI-powered B2B Product Review Intelligence platform built to analyze unstructured customer reviews, extract structured root-cause defects via Pydantic & LangChain LCEL, and provide a grounded RAG QA Conversational Assistant powered by Gemini 2.0 Flash and NVIDIA Nemotron 3 Embeddings.

---

## 🏗️ Architecture & Technology Stack

* **Frontend**: Next.js 14+ (App Router, JavaScript / JSX, Tailwind CSS, Recharts, Axios, Lucide Icons)
* **Backend**: Python FastAPI (`http://localhost:8000`), PyMongo, ChromaDB Vector Database, LangChain LCEL RAG Chain
* **Database**: MongoDB Atlas (`ProductReviewAnalyzer` database)
* **AI Models**: Google Gemini 2.0 Flash (`gemini-2.0-flash`), NVIDIA Nemotron 3 Embed 1B (`nvidia/nemotron-3-embed-1b`), HuggingFace (`all-MiniLM-L6-v2`)

---

## ⚡ How to Run the Project (Step-by-Step)

The project consists of **two applications** that run simultaneously:
1. **Next.js Frontend** (Runs on `http://localhost:3000`)
2. **FastAPI Backend** (Runs on `http://localhost:8000`)

---

### 1. Environment Configuration (`.env`)

Ensure a `.env` file exists in the root folder with your MongoDB Atlas and AI engine keys:

```env
PROJECT_NAME=ProductReviewAnalyzer
MONGO_DB_NAME=ProductReviewAnalyzer

# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/ProductReviewAnalyzer?retryWrites=true&w=majority

# AI Engine Models & Provider ("nvidia", "google", or "huggingface")
EMBEDDING_PROVIDER=nvidia
NVIDIA_API_KEY=nvapi-your_nvidia_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL_NAME=gemini-2.0-flash

# Auth Settings
JWT_SECRET_KEY=<generate via: python -c "import secrets; print(secrets.token_hex(32))">
JWT_EXPIRE_MINUTES=1440
FRONTEND_ORIGIN=http://localhost:3000
```

Also create `frontend/.env.local`:
```env
BACKEND_API_URL=http://localhost:8000
```

---

### 2. Starting the Services

#### Option A: Running in Two Separate Terminals (Recommended)

**Terminal 1 — Next.js Frontend**:
```bash
cd frontend
npm run dev
```
👉 *Frontend will be live at*: **`http://localhost:3000`**

**Terminal 2 — FastAPI Backend**:
```bash
cd backend
.\venv\Scripts\activate
uvicorn main:app --port 8000 --reload
```
👉 *Backend REST API will be live at*: **`http://localhost:8000`**

---

#### Option B: Running from Root Workspace Folder

If you don't want to `cd frontend`, you can launch the Next.js frontend directly from the root workspace using npm prefix:

```bash
npm --prefix frontend run dev
```

---

## 📂 Project Folder Structure

```
Product-Review-Analyzer/
├── backend/                  # Python FastAPI Backend
│   ├── main.py               # REST API Endpoints (/api/products, /api/upload, /api/status, /api/chat)
│   ├── config.py             # System Settings & Environment Loaders
│   ├── database/
│   │   └── mongo.py          # PyMongo MongoDB Atlas CRUD Helpers
│   └── core/
│       ├── chains.py         # LangChain LCEL RAG Chain
│       ├── schemas.py        # Pydantic Extraction Schemas (RootCauseReport)
│       └── vectorstore.py    # Pluggable Vector Embedding Factory (NVIDIA, Google, HF)
├── frontend/                 # Next.js 14+ App Router Frontend (JavaScript)
│   ├── package.json
│   ├── public/
│   │   └── pmLogo.png        # Brand Logo Image & Favicon
│   └── src/
│       ├── app/
│       │   ├── layout.js     # Top Header + Collapsible Sidebar Shell Layout
│       │   ├── page.js       # Dashboard Overview & Recharts Status Bar Chart
│       │   ├── upload/       # Drag & Drop CSV Ingestion Form (/upload)
│       │   ├── reviews/      # Product Catalog, Recharts & Root-Cause Table (/reviews)
│       │   ├── assistant/    # Grounded RAG Chat Thread & Citations (/assistant)
│       │   └── settings/     # Engine Health Status Overview (/settings)
│       ├── components/
│       │   └── layout/
│       │       ├── Header.js # Full-width Fixed Top Header Banner
│       │       └── Sidebar.js# Collapsible Icon-Rail Navigation Sidebar
│       └── lib/
│           └── api.js        # Axios REST Client connecting to http://localhost:8000
└── .env                      # Environment Variables
```

---

## 🚀 Key Features

* 📊 **Portfolio Dashboard (`/`)**: 5 Hero Metric Cards and Recharts status bar visualization.
* 📁 **Dataset Ingestion (`/upload`)**: Drag-and-drop CSV uploader with batch structured Pydantic extraction.
* 📋 **Review Ledger & Root Cause Analysis (`/reviews`)**: Interactive product selector, PM status editor, Recharts sentiment & issue category charts, and Pydantic root-cause defect breakdown.
* 💬 **Product QA Assistant (`/assistant`)**: Grounded RAG chat thread with domain-agnostic quick prompt chips and expandable vector document citations.
* ⚙️ **Engine Settings (`/settings`)**: Health overview for FastAPI, MongoDB Atlas, ChromaDB, and Gemini/NVIDIA API keys.
