# AI-Powered Centralized College Resource Sharing Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20%2B%20pgvector-blue)](https://www.postgresql.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14%20App%20Router-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.112-teal)](https://fastapi.tiangolo.com/)

An enterprise-grade, modular, secure, and scalable academic resource management web application. Built for colleges and universities to enable students and faculty to upload, discover, classify, bookmark, rate, download, and moderate academic documents using AI-driven document processing, vector embeddings (`pgvector`), and hybrid semantic search.

---

## 📸 Core Features

- **Centralized Academic Hierarchy**: Configurable multi-level structure: `College` -> `Department` -> `Program` -> `Semester` -> `Subject` -> `Resource`.
- **AI Document Classification & Metadata Extraction**: Automatic document category detection (Lecture Notes, Question Papers, Lab Manuals, Assignments, etc.) with confidence scores and top keyword generation via Python FastAPI service.
- **Hybrid Semantic Vector Search**: Natural language search powered by `pgvector` 384-dim embeddings (`sentence-transformers/all-MiniLM-L6-v2`) combined with PostgreSQL full-text search and academic metadata filters.
- **Automated Duplicate Detection**: Multi-level checksum verification (SHA-256 exact match) + semantic vector similarity detection (> 0.88 cosine threshold) with admin moderation workflow.
- **Role-Based Access Control (RBAC)**: Fine-grained authorization tiers (`STUDENT`, `FACULTY`, `ADMIN`) with secure JWT authentication (Access & Refresh tokens).
- **Asynchronous Background Processing Pipeline**: BullMQ + Redis job worker queue handling non-blocking document text extraction, AI classification, chunking, and embedding generation.
- **Role-Tailored Portals & Dashboards**:
  - **Student Portal**: Natural language global search, personalized recommendations, bookmark folders, download tracking, resource preview, rating & reporting.
  - **Faculty Portal**: Course material manager, upload pipeline, view/download analytics graphs, approval status tracker.
  - **Admin Control Panel**: Master data management, user activation/roles, resource moderation queue, duplicate candidate resolution, audit log inspector, system configuration.

---

## 🏗️ Architecture Diagram

```text
                   ┌────────────────────────────────────────┐
                   │           Next.js Frontend             │
                   │  (App Router, TypeScript, Tailwind,    │
                   │   Shadcn UI, TanStack Query, Recharts) │
                   └───────────────────┬────────────────────┘
                                       │
                                       │ REST API (JSON / FormData)
                                       ▼
                   ┌────────────────────────────────────────┐
                   │            Express Backend             │
                   │  (TypeScript, JWT Auth, RBAC, Zod,     │
                   │   Prisma ORM, Multer, Helmet, CORS)    │
                   └───────┬──────────────┬──────────────┬──┘
                           │              │              │
        ┌──────────────────┘              │              └─────────────────┐
        ▼                                 ▼                                ▼
┌───────────────┐               ┌──────────────────┐               ┌───────────────┐
│  PostgreSQL   │               │   Redis Queue    │               │ Local / Cloud │
│  + pgvector   │               │     (BullMQ)     │               │ File Storage  │
│  (Metadata &  │               └────────┬─────────┘               └───────────────┘
│ Vector Chunks)│                        │
└───────────────┘                        ▼
                                ┌──────────────────┐
                                │    AI Service    │
                                │ (Python/FastAPI, │
                                │ PyMuPDF, Sentence│
                                │  Transformers)   │
                                └──────────────────┘
```

---

## 📁 Repository Structure

```text
college-resource-hub/
├── frontend/                 # Next.js 14 App Router client application
├── backend/                  # Node.js + Express REST API service
│   ├── src/                  # Controllers, Services, Middleware, Validators, Jobs
│   └── prisma/               # Schema, Migrations, Seed data
├── ai-service/               # FastAPI microservice for embeddings & classification
├── storage/                  # Local storage path for uploaded academic documents
├── docker-compose.yml        # Docker orchestration file
├── .env.example              # Environment variables template
└── README.md                 # System documentation
```

---

## 🚀 Quick Start & Installation

### Prerequisites

- **Node.js**: v20.x or higher
- **PostgreSQL**: 16+ with `pgvector` extension enabled
- **Redis**: 7.x
- **Python**: 3.10+ (for running AI microservice locally)
- **Docker & Docker Compose**: (Optional, for containerized run)

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone & enter repository
git clone https://github.com/your-org/college-resource-hub.git
cd college-resource-hub

# 2. Copy environment file
cp .env.example .env

# 3. Launch all containers (Frontend, Backend, AI Service, PostgreSQL+pgvector, Redis)
docker compose up -d

# Services will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# AI Microservice: http://localhost:8000/health
```

### Option 2: Local Development Setup

#### 1. Setup Backend & Database

```bash
cd backend

# Install dependencies
npm install

# Configure environment (.env) in root directory
# Ensure PostgreSQL database is created

# Generate Prisma Client & Run Migrations
npx prisma generate
npx prisma migrate dev --name init

# Seed Database with Master Data & Test Credentials
npm run prisma:seed

# Start Backend Dev Server
npm run dev
```

#### 2. Setup AI Service

```bash
cd ai-service

# Create virtual environment & install packages
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js Development Server
npm run dev
```

---

## 🔐 Default Test Credentials

The database seed script generates pre-configured test users (Password: `Password123!`):

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@example.com` | `Password123!` | System configuration, Master data, Approvals, Users, Audit Logs |
| **FACULTY** | `faculty@example.com` | `Password123!` | Upload resources, Manage course materials, View analytics |
| **STUDENT** | `student@example.com` | `Password123!` | Semantic search, Download, Bookmark, Rate, Report |

---

## 🛠️ API Endpoint Overview

- `POST /api/auth/register` - Register new user account
- `POST /api/auth/login` - Authenticate user & return JWT tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Fetch authenticated user profile
- `GET /api/resources` - Browse approved resources with filtering & pagination
- `POST /api/resources/upload` - Secure file upload & initiate AI background processing pipeline
- `POST /api/search` - Hybrid vector + FTS natural language search
- `GET /health` - System health check

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
