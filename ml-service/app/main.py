from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class AnalyzeSymptomsRequest(BaseModel):
    symptoms: List[str]
    severity: int
    duration_days: int
    age: int
    chronic_conditions: Optional[List[str]] = []

class AnalyzeSymptomsResponse(BaseModel):
    risk_score: float
    risk_level: str
    possible_conditions: List[str]
    recommendations: List[str]
    disclaimer: str

@app.post("/analyze-symptoms", response_model=AnalyzeSymptomsResponse)
def analyze_symptoms(req: AnalyzeSymptomsRequest):
    # Placeholder ML logic
    return AnalyzeSymptomsResponse(
        risk_score=0.82,
        risk_level="Moderate",
        possible_conditions=["Viral Infection"],
        recommendations=["Rest", "Hydration"],
        disclaimer="This is not a medical diagnosis."
    )

@app.get("/health")
def health():
    return {"status": "ok"}
