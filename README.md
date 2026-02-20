# 🏥 Swasth Saathi (स्वास्थ्य साथी)
### *India's AI-Powered Healthcare Super-App*

**Swasth Saathi** is a comprehensive, privacy-first healthcare platform designed specifically for the Indian ecosystem. It leverages Artificial Intelligence to provide preventive care, symptom analysis, and digital health management in multiple regional languages.

---

## 🌟 Key Features

### 🤖 AI-Driven Diagnostics
- **Symptom Checker:** Chat-based interface that predicts health risks (Mild, Moderate, Emergency) and suggests home remedies.
- **Health Prediction Dashboards:** Gamified risk assessments for Diabetes and Heart Disease based on lifestyle data.
- **Smart Report Analysis:** AI-powered insights from uploaded medical documents.

### 🍱 Targeted Nutrition & Wellness
- **Regional Diet Plans:** Specialized diet recommendations for Diabetes, Hypertension, and Obesity featuring Indian foods (Poha, Idli, etc.).
- **Mental Health Suite:** Mood tracking, anonymous support mode, and guided breathing exercises (Pranayama).
- **Hydration Tracker:** Visual progress for daily water intake.

### 🏛️ Government Integration
- **Scheme Explorer:** Easy access to Ayushman Bharat (PM-JAY), Jan Aushadhi, and National Health Mission info.
- **ABHA Identification:** Digital integration for unified health records.

### 🚨 Emergency & Inclusivity
- **One-Tap SOS:** Immediate vibration-triggered emergency alerts with GPS sharing.
- **Multilingual Support:** Fully functional in English, Hindi, Marathi, Tamil, and Bengali.
- **Offline-First Design:** Core features work without an active internet connection.

---

## 🛠️ Tech Stack

### Frontend (Mobile)
- **Framework:** React Native with Expo
- **State Management:** Zustand
- **Navigation:** Expo Router
- **UI Components:** React Native Paper, Lucide Icons
- **Storage:** SecureStore & AsyncStorage

### Backend
- **Framework:** Node.js (Express)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT & OTP-based mock logic

### AI/ML Service
- **Framework:** Python (FastAPI)
- **Processing:** Custom symptom prediction logic and food nutritional mapping

---

## 📂 Project Structure

```text
├── mobile/             # React Native Expo Application
│   ├── app/            # Screens & Navigation logic
│   ├── components/     # Reusable UI elements
│   └── hooks/          # Custom state hooks (Zustand)
├── backend/            # Express.js Server
│   ├── prisma/         # Database schema
│   └── server.js       # API endpoints
└── ml-service/         # FastAPI Machine Learning Service
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- Expo Go app on your mobile device

### 1. Mobile App
```bash
cd mobile
npm install
npx expo start
```
Scan the QR code with Expo Go to run the app.

### 2. Backend
```bash
cd backend
npm install
npx prisma generate
npm start
```

### 3. ML Service
```bash
cd ml-service
pip install -r requirements.txt
python main.py
```

---

## � Documentation
- [Architecture & Implementation Plan](ARCHITECTURE.md)
- [Production Deployment Guide](DEPLOYMENT.md)

---

## �📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for a Healthier India 🇮🇳</p>
