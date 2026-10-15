# 🎓 AI-Powered Centralized College Resource Sharing Hub — Getting Started & How It Works

Welcome to the **AI-Powered Centralized College Resource Sharing Hub**! This application is a complete, modular, secure, and scalable academic platform where students, faculty, and administrators can upload, discover, classify, bookmark, download, and manage academic resources using AI-powered document processing and semantic search.

---

## 🔑 Login Credentials

The system comes pre-seeded with test accounts for all 3 user roles:

| Role | Email | Password | What You Can Do |
| :--- | :--- | :--- | :--- |
| **Administrator (ADMIN)** | `admin@example.com` | `Password123!` | Manage departments, programs, subjects, categories, approve/reject uploaded resources, resolve duplicates, view system analytics & audit logs |
| **Faculty Member (FACULTY)** | `faculty@example.com` | `Password123!` | Upload course materials, manage own uploaded resources, view download/view statistics for course materials, browse & download resources |
| **Student (STUDENT)** | `student@example.com` | `Password123!` | Perform natural-language semantic searches, preview & download documents, rate resources, bookmark materials, view recommendations |

---

## 🚀 How to Run the Application

### Option A: Local Development Mode (Recommended for testing)

#### Step 1: Start the Express Backend API
Open Terminal 1:
```bash
cd backend
npm run dev
```
> **Backend API URL**: `http://localhost:5000/api`  
> **Health Check**: `http://localhost:5000/health`

#### Step 2: Start the Python FastAPI AI Microservice
Open Terminal 2:
```bash
cd ai-service
# Activate python virtual environment if created:
# Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
> **AI Service URL**: `http://localhost:8000`  
> **Health Check**: `http://localhost:8000/health`

#### Step 3: Start the Next.js Frontend
Open Terminal 3:
```bash
cd frontend
npm run dev
```
> **Frontend App URL**: `http://localhost:3000`

---

### Option B: Docker Containerized Mode

If Docker Desktop is running on your machine:
```bash
docker compose up -d
```
All services (Frontend, Backend, AI Microservice, PostgreSQL with pgvector, and Redis) will start automatically in isolated containers.

---

## 🧠 How the Application Works

### 1. Academic Organizational Hierarchy
Resources are organized according to an institutional hierarchy:
```text
College
 └── Department (e.g., Computer Science & Engineering)
      └── Program (e.g., B.Tech Computer Science)
           └── Semester (e.g., Semester 5)
                └── Subject (e.g., Database Management Systems)
                     └── Academic Resources (Lecture Notes, Question Papers, etc.)
```

### 2. Document Processing & AI Pipeline
When a user uploads an academic document (PDF, DOCX, PPTX, TXT):
1. **Validation & Storage**: The backend verifies MIME type, size limit, and calculates a SHA-256 file checksum.
2. **Text Extraction**: PyMuPDF / text extractors extract document text and metadata.
3. **AI Classification**: The FastAPI AI service analyzes text content and automatically determines the category (e.g., `LECTURE_NOTE`, `QUESTION_PAPER`, `LAB_MANUAL`) with a confidence score and key keywords.
4. **Vector Embedding**: Sentence-Transformer embeddings convert text chunks into 384-dimensional mathematical vectors stored in PostgreSQL.
5. **Duplicate Detection**: SHA-256 checksums flag exact duplicates; vector cosine similarity (> 88%) flags semantic duplicates for administrative review.
6. **Approval Workflow**: Uploaded resources enter `PENDING_APPROVAL` status until an Administrator or Faculty member approves them for public discovery.

### 3. Hybrid Semantic & Vector Search
Unlike simple keyword search, users can query in natural conversational language (e.g., *"DBMS notes explaining 3NF normalization"* or *"Operating system previous year exam questions"*).
The search engine ranks results using a multi-factor hybrid scoring algorithm:
- **60%** Semantic Vector Similarity
- **15%** Full-Text Keyword Match
- **10%** Subject / Department Metadata Match
- **10%** Resource Quality & Rating
- **5%** Download & View Popularity

---

## 🛠️ Verification & Testing

To verify backend tests:
```bash
cd backend
npm test
```
All automated tests for database connection, user roles, password security, and health checks will run and display pass reports.

---

## 🤝 Support & API Documentation

- **Interactive API Documentation (Swagger)**: Available at `http://localhost:5000/api/docs` (when server is running).
- **Database Inspection**: Run `npx prisma studio` inside `backend/` to launch an interactive web UI for inspecting database tables.
