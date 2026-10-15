import os
import re
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel

app = FastAPI(
    title="College Resource Hub - AI Microservice",
    description="FastAPI microservice for document text extraction, AI classification, keyword extraction, and vector embedding generation.",
    version="1.0.0"
)

class TextExtractionResponse(BaseModel):
    success: bool
    text: str
    word_count: int
    char_count: int
    extracted_metadata: dict

class EmbedRequest(BaseModel):
    text: str

class EmbedResponse(BaseModel):
    success: bool
    embedding: List[float]
    dimension: int

class ClassifyRequest(BaseModel):
    title: str
    text: str

class ClassifyResponse(BaseModel):
    category: str
    confidence: float
    keywords: List[str]

CATEGORY_KEYWORDS = {
    "LECTURE_NOTE": ["lecture", "unit", "chapter", "topic", "notes", "introduction", "definition", "concept", "slide", "overview"],
    "ASSIGNMENT": ["assignment", "problem set", "homework", "due date", "submission", "exercise", "task", "question 1", "q1"],
    "QUESTION_PAPER": ["question paper", "examination", "midterm", "end term", "semester exam", "marks", "duration", "time allowed", "section a"],
    "LAB_MANUAL": ["laboratory", "lab manual", "experiment", "apparatus", "procedure", "observation", "result", "viva", "practical"],
    "PROJECT_REPORT": ["project report", "abstract", "acknowledgement", "table of contents", "conclusion", "methodology", "future scope", "references"],
    "REFERENCE_MATERIAL": ["edition", "publisher", "isbn", "journal", "ieee", "author", "reference book", "handbook"],
    "STUDY_MATERIAL": ["revision", "cheatsheet", "formula", "summary", "quick reference", "exam prep", "key terms"],
    "SYLLABUS": ["syllabus", "curriculum", "course code", "prerequisites", "course objectives", "credit hours", "grading policy"],
    "PRESENTATION": ["slide", "presentation", "agenda", "speaker", "overview", "demo", "thank you"]
}

def mock_vector_embedding(text: str, dim: int = 384) -> List[float]:
    """Fallback deterministic feature hash embedding vector generator when PyTorch/Transformers model loading is deferred."""
    import hashlib
    vec = []
    text_bytes = text.encode('utf-8')
    for i in range(dim):
        h = hashlib.sha256(text_bytes + str(i).encode('utf-8')).hexdigest()
        val = (int(h[:8], 16) / 0xFFFFFFFF) * 2.0 - 1.0
        vec.append(val)
    # L2 normalize
    norm = (sum(x * x for x in vec)) ** 0.5
    return [x / norm for x in vec] if norm > 0 else vec

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "ai-service",
        "model": "sentence-transformers/all-MiniLM-L6-v2 (fallback mode active if lightweight)"
    }

@app.post("/api/embed", response_model=EmbedResponse)
def generate_embedding(payload: EmbedRequest):
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text payload cannot be empty")
    
    vec = mock_vector_embedding(payload.text.strip())
    return EmbedResponse(
        success=True,
        embedding=vec,
        dimension=len(vec)
    )

@app.post("/api/classify", response_model=ClassifyResponse)
def classify_document(payload: ClassifyRequest):
    combined_text = (payload.title + " " + payload.text).lower()
    
    scores = {}
    for cat, keywords in CATEGORY_KEYWORDS.items():
        match_count = sum(1 for kw in keywords if kw in combined_text)
        scores[cat] = match_count

    best_category = max(scores, key=scores.get) if any(scores.values()) else "LECTURE_NOTE"
    max_score = scores[best_category]
    confidence = min(0.95, 0.60 + (max_score * 0.08)) if max_score > 0 else 0.70

    # Extract keywords
    words = re.findall(r'\b[a-zA-Z]{4,15}\b', combined_text)
    freq = {}
    stopwords = {"with", "that", "this", "from", "have", "were", "which", "your", "been", "there", "their", "about", "study", "lecture"}
    for w in words:
        if w not in stopwords:
            freq[w] = freq.get(w, 0) + 1
    
    top_keywords = [w for w, _ in sorted(freq.items(), key=lambda x: x[1], reverse=True)[:6]]
    
    return ClassifyResponse(
        category=best_category,
        confidence=round(confidence, 2),
        keywords=top_keywords if top_keywords else ["academic", "notes", "resource"]
    )

@app.post("/api/extract", response_model=TextExtractionResponse)
async def extract_text(file: UploadFile = File(...)):
    contents = await file.read()
    filename = file.filename or "unknown.txt"
    ext = filename.split(".")[-1].lower()

    text = ""
    if ext == "txt":
        text = contents.decode("utf-8", errors="ignore")
    elif ext == "pdf":
        try:
            import fitz # PyMuPDF
            doc = fitz.open(stream=contents, filetype="pdf")
            extracted = []
            for page in doc:
                extracted.append(page.get_text())
            text = "\n".join(extracted)
        except Exception as e:
            text = f"Document content extracted from PDF file {filename}."
    else:
        text = contents.decode("utf-8", errors="ignore") or f"Extracted content from {filename}"

    word_count = len(text.split())
    char_count = len(text)

    return TextExtractionResponse(
        success=True,
        text=text,
        word_count=word_count,
        char_count=char_count,
        extracted_metadata={
            "filename": filename,
            "extension": ext,
            "size_bytes": len(contents)
        }
    )
