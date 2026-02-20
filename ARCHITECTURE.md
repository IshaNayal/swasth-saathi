# Swasth Saathi - Technical Architecture & Implementation Plan

## 1. System Overview
Swasth Saathi is designed as a distributed microservice architecture to ensure scalability and separation of concerns between user management and heavy ML computations.

### Components:
- **Mobile (React Native/Expo)**: Cross-platform frontend for patients.
- **Backend (Node.js/Express)**: API Gateway handling Auth (OTP), User Data, and Health Logs.
- **ML-Service (FastAPI/Python)**: High-performance service for symptom analysis, risk prediction, and OCR.
- **Data Layer**:
    - **PostgreSQL**: Primary relational data (Users, Sessions, Health Records Metadata).
    - **Redis**: For rate limiting and OTP caching.
    - **S3 (LocalStack/AWS)**: Storage for PDF reports and images.

---

## 2. Updated Project Structure
```text
/swasth-saathi
├── mobile/             # Expo React Native App
├── backend/            # Express.js (Auth + Gateway)
├── ml-service/         # FastAPI (ML/NLP Models)
├── infrastructure/     # Docker Compose & K8s manifests
└── shared/             # Shared Types & Constants
```

---

## 3. Database Schema (PostgreSQL)

### Users Table
- `id`: UUID (Primary Key)
- `phone`: String (Unique)
- `is_verified`: Boolean
- `created_at`: Timestamp

### Health_Profiles
- `user_id`: UUID (FK)
- `name`: String
- `dob`: Date
- `gender`: String
- `history`: JSONB (Diabetes, Hypertension, etc.)

### Symptoms_Logs
- `id`: UUID
- `user_id`: UUID (FK)
- `symptoms`: JSONB
- `risk_score`: Float
- `condition_prediction`: String

---

## 4. API Contracts

### ML Service (FastAPI)
- `POST /analyze-symptoms`: Accepts structured symptoms, returns risk category & possible conditions.
- `POST /predict-risk`: Accepts vitals/history, returns long-term risk percentages.
- `POST /analyze-report`: Accepts image/PDF, returns extracted lab values via OCR.

### Backend (Node.js)
- `POST /auth/send-otp`: Triggers SMS OTP.
- `POST /auth/verify-otp`: Returns JWT.
- `GET /health/summary`: Aggregates ML predictions and historical data for the dashboard.

---

## 5. Development Roadmap
- **Step 1**: Initialize clean folder structure and move existing mobile code to `/mobile`.
- **Step 2**: Implement Node.js Auth (JWT + OTP Mock).
- **Step 3**: Scaffold FastAPI with a Sentence-Transformer model for symptom matching.
- **Step 4**: Build the Mobile Home Screen and Symptom Chatbot UI.
