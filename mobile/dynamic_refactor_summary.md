# Dynamic Data Refactor Summary

This document summarizes the complete transition of the **Swasth Saathi** application from static mock data to a fully dynamic, user-driven data model using Zustand and AsyncStorage.

## Core Architecture
- **State Management**: `useAppStore` created with Zustand to handle all application data.
- **Persistence**: `AsyncStorage` used to save and load all data across app restarts.
- **Initialization**: App data is loaded on startup in `_layout.tsx`.
- **Logout Cleanup**: User data is cleared securely upon logout via `useAuthStore` calling `resetStore`.

## Screen Updates

### 1. Home Dashboard (`HomeScreen.tsx`)
- **Dynamic Profile**: Displays logged-in user's name (or "User") from Store.
- **Health Score**: Calculated in real-time based on:
  - Medicine adherence (today's schedule).
  - Water intake (goals vs actual).
  - Mood score (latest entry).
  - Steps (mock from store vs goal).
- **Settings Sync**: Dark mode and language preferences are read from Store.

### 2. Medicines (`MedicinesScreen.tsx`)
- **Full CRUD**: Users can Add, Remove, and Mark medicines as taken.
- **Progress Tracking**: Daily adherance progress bar updates dynamically.
- **Persistence**: Medicine list and taken status are saved.

### 3. Nutrition (`NutritionScreen.tsx`)
- **Meal Logging**: Users can log Calories, Protein, Carbs, Fat for meals.
- **Hydration Tracker**: Tracks daily water glasses.
- **History**: Maintains a log of past entries.

### 4. Mental Health (`MentalHealthScreen.tsx`)
- **Mood Journal**: Logs mood (0-4), stress level (1-10), and journal notes.
- **Weekly Trends**: Graph (or list) generated from `moodEntries` history.

### 5. Health Records (`MyRecordsScreen.tsx`)
- **Document Locker**: Uploads files using `expo-document-picker`.
- **Persistence**: Metadata (name, type, URI) saved to Store.
- **Mock AI Analysis**: Simulates analysis step on upload.

### 6. Symptom Checker (`CheckSymptomsScreen.tsx`)
- **Chat Interface**: Interactive symptom questionnaire.
- **AI Simulation**: Generates a health assessment based on inputs.
- **Log Saving**: Results are saved to `symptomLogs` in Store.

### 7. Community (`CommunityScreen.tsx`)
- **Interactive Forum**: Browse posts from store.
- **User Actions**: Create new posts (anonymous option), Like posts.
- **Persistence**: All posts and interactions are saved.

### 8. Find Doctors (`NearbyDoctorsScreen.tsx`)
- **Search & Filter**: Filter static doctor list by name/specialty/availability.
- **Booking Flow**: "Book Now" adds an appointment to `bookings` in Store.
- **Status**: Visual indicator for doctor availability.

### 9. Emergency (`EmergencyScreen.tsx`)
- **Dynamic Contact**: Displays and calls the user's saved Emergency Contact (from Profile).
- **SOS Logic**: Triggers alerts (simulated) using user location and contact.
- **Fall Detection**: Toggles sync with Settings preferences.

### 10. Profile & Settings
- **ProfileScreen**: Displays medical stats AND **upcoming appointments list** (fetched from store). Link to edit profile.
- **SettingsScreen**: Full edit capabilities for Profile, Preferences, Notifications.
- **Theme/Lang**: Changes persist across app restarts.

## Next Steps or Recommendations
- **Backend Integration**: Replace `AsyncStorage` calls in `useAppStore` with API calls to a real backend (Node/Express/Firebase) for multi-device sync.
- **Real AI**: Connect `CheckSymptomsScreen` to a real LLM API (OpenAI/Gemini).
- **Push Notifications**: Integrate Expo Notifications for medicine reminders.
