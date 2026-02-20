from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Swasth Saathi ML Service")

class SymptomRequest(BaseModel):
    symptoms: List[str]
    duration: str
    severity: int
    medical_history: Optional[List[str]] = []

@app.get("/")
def read_root():
    return {"status": "ML Service is Online", "version": "1.0.0"}

@app.post("/analyze-symptoms")
async def analyze_symptoms(request: SymptomRequest):
    # Placeholder for NLP model matching
    # In Phase 1, we will use a simple rule-based or embedding-based match
    return {
        "conditions": ["Common Cold", "Influenza"],
        "risk_category": "Mild",
        "severity_score": request.severity,
        "next_steps": "Rest and hydration. If symptoms persist for more than 3 days, see a doctor.",
        "disclaimer": "Not a doctor. For guidance only."
    }

@app.post("/predict-risk")
async def predict_risk(data: dict):
    # Placeholder for Logistic Regression model
    return {
        "diabetes_risk_5yr": "12%",
        "heart_disease_risk": "5%",
        "status": "Green"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
