import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// =================== TYPES ===================
export interface Medicine {
    id: string;
    name: string;
    dosage: string;
    time: string;
    taken: boolean;
    date: string;
}

export interface MealEntry {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface MoodEntry {
    id: string;
    mood: number; // 0-4
    stressLevel: number; // 1-10
    journal: string;
    date: string;
}

export interface HealthRecord {
    id: string;
    name: string;
    type: string;
    date: string;
    uri?: string;
}

export interface SymptomLog {
    id: string;
    symptoms: string[];
    duration: string;
    severity: number;
    prediction: string;
    riskCategory: string;
    date: string;
}

export interface ForumPost {
    id: string;
    user: string;
    title: string;
    body: string;
    replies: number;
    likes: number;
    date: string;
    anonymous: boolean;
}

export interface DoctorBooking {
    id: string;
    doctorName: string;
    specialty: string;
    hospital: string;
    date: string;
    status: 'upcoming' | 'completed' | 'cancelled';
}

export interface StepEntry {
    date: string;
    steps: number;
}

export interface SleepEntry {
    date: string;
    hours: number;
}

export interface WaterEntry {
    date: string;
    glasses: number;
}

export interface FeedbackEntry {
    id: string;
    rating: number;
    category: string;
    text: string;
    date: string;
}

// =================== STORE ===================
interface AppState {
    medicines: Medicine[];
    addMedicine: (m: Omit<Medicine, 'id'>) => void;
    removeMedicine: (id: string) => void;
    toggleMedicineTaken: (id: string) => void;

    meals: MealEntry[];
    waterGlasses: number;
    addMeal: (m: Omit<MealEntry, 'id'>) => void;
    removeMeal: (id: string) => void;
    setWater: (n: number) => void;

    moodEntries: MoodEntry[];
    addMoodEntry: (m: Omit<MoodEntry, 'id'>) => void;

    healthRecords: HealthRecord[];
    addHealthRecord: (r: Omit<HealthRecord, 'id'>) => void;
    removeHealthRecord: (id: string) => void;

    symptomLogs: SymptomLog[];
    addSymptomLog: (s: Omit<SymptomLog, 'id'>) => void;

    forumPosts: ForumPost[];
    addForumPost: (p: Omit<ForumPost, 'id'>) => void;
    likePost: (id: string) => void;

    bookings: DoctorBooking[];
    addBooking: (b: Omit<DoctorBooking, 'id'>) => void;

    stepEntries: StepEntry[];
    sleepEntries: SleepEntry[];
    addStepEntry: (s: StepEntry) => void;
    addSleepEntry: (s: SleepEntry) => void;

    feedbackEntries: FeedbackEntry[];
    addFeedback: (f: Omit<FeedbackEntry, 'id'>) => void;

    // Settings
    darkMode: boolean;
    language: string;
    fontSize: number;
    notifications: { push: boolean; email: boolean; sms: boolean; reminder: boolean; emergency: boolean };
    setDarkMode: (v: boolean) => void;
    setLanguage: (l: string) => void;
    setFontSize: (s: number) => void;
    setNotification: (key: string, value: boolean) => void;

    // Profile extended
    profile: {
        name: string; email: string; phone: string; dob: string;
        bloodGroup: string; emergencyContact: string; height: string; weight: string;
    };
    updateProfile: (p: Partial<AppState['profile']>) => void;

    init: () => Promise<void>;
    resetStore: () => Promise<void>;
}

const STORAGE_KEY = '@swasth_saathi_data';

const initialState = {
    medicines: [],
    meals: [],
    waterGlasses: 0,
    moodEntries: [],
    healthRecords: [],
    symptomLogs: [],
    forumPosts: [],
    bookings: [],
    stepEntries: [],
    sleepEntries: [],
    feedbackEntries: [],
    darkMode: false,
    language: 'en',
    fontSize: 16,
    notifications: { push: true, email: false, sms: true, reminder: true, emergency: true },
    profile: { name: '', email: '', phone: '', dob: '', bloodGroup: '', emergencyContact: '', height: '', weight: '' },
};

export const useAppStore = create<AppState>((set, get) => ({
    ...initialState, // Spread initial values

    addMedicine: (m) => {
        const newMed = { ...m, id: Date.now().toString() };
        set(s => { const ns = { ...s, medicines: [...s.medicines, newMed] }; saveState(ns); return ns; });
    },
    removeMedicine: (id) => {
        set(s => { const ns = { ...s, medicines: s.medicines.filter(m => m.id !== id) }; saveState(ns); return ns; });
    },
    toggleMedicineTaken: (id) => {
        set(s => { const ns = { ...s, medicines: s.medicines.map(m => m.id === id ? { ...m, taken: !m.taken } : m) }; saveState(ns); return ns; });
    },

    addMeal: (m) => {
        const newMeal = { ...m, id: Date.now().toString() };
        set(s => { const ns = { ...s, meals: [...s.meals, newMeal] }; saveState(ns); return ns; });
    },
    removeMeal: (id) => {
        set(s => { const ns = { ...s, meals: s.meals.filter(m => m.id !== id) }; saveState(ns); return ns; });
    },
    setWater: (n) => {
        set(s => { const ns = { ...s, waterGlasses: n }; saveState(ns); return ns; });
    },

    addMoodEntry: (m) => {
        const newEntry = { ...m, id: Date.now().toString() };
        set(s => { const ns = { ...s, moodEntries: [...s.moodEntries, newEntry] }; saveState(ns); return ns; });
    },

    addHealthRecord: (r) => {
        const newRec = { ...r, id: Date.now().toString() };
        set(s => { const ns = { ...s, healthRecords: [...s.healthRecords, newRec] }; saveState(ns); return ns; });
    },
    removeHealthRecord: (id) => {
        set(s => { const ns = { ...s, healthRecords: s.healthRecords.filter(r => r.id !== id) }; saveState(ns); return ns; });
    },

    addSymptomLog: (s) => {
        const newLog = { ...s, id: Date.now().toString() };
        set(st => { const ns = { ...st, symptomLogs: [...st.symptomLogs, newLog] }; saveState(ns); return ns; });
    },

    addForumPost: (p) => {
        const newPost = { ...p, id: Date.now().toString() };
        set(s => { const ns = { ...s, forumPosts: [newPost, ...s.forumPosts] }; saveState(ns); return ns; });
    },
    likePost: (id) => {
        set(s => { const ns = { ...s, forumPosts: s.forumPosts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p) }; saveState(ns); return ns; });
    },

    addBooking: (b) => {
        const newBooking = { ...b, id: Date.now().toString() };
        set(s => { const ns = { ...s, bookings: [...s.bookings, newBooking] }; saveState(ns); return ns; });
    },

    addStepEntry: (e) => {
        set(s => { const ns = { ...s, stepEntries: [...s.stepEntries.filter(x => x.date !== e.date), e] }; saveState(ns); return ns; });
    },
    addSleepEntry: (e) => {
        set(s => { const ns = { ...s, sleepEntries: [...s.sleepEntries.filter(x => x.date !== e.date), e] }; saveState(ns); return ns; });
    },

    addFeedback: (f) => {
        const newFb = { ...f, id: Date.now().toString() };
        set(s => { const ns = { ...s, feedbackEntries: [...s.feedbackEntries, newFb] }; saveState(ns); return ns; });
    },

    setDarkMode: (v) => set(s => { const ns = { ...s, darkMode: v }; saveState(ns); return ns; }),
    setLanguage: (l) => set(s => { const ns = { ...s, language: l }; saveState(ns); return ns; }),
    setFontSize: (v) => set(s => { const ns = { ...s, fontSize: v }; saveState(ns); return ns; }),

    setNotification: (key, value) => {
        set(s => { const ns = { ...s, notifications: { ...s.notifications, [key as keyof typeof s.notifications]: value } }; saveState(ns); return ns; });
    },

    updateProfile: (p) => {
        set(s => { const ns = { ...s, profile: { ...s.profile, ...p } }; saveState(ns); return ns; });
    },

    init: async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (raw) {
                set(JSON.parse(raw));
            }
        } catch (e) { console.error(e); }
    },

    resetStore: async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            set(initialState);
        } catch (e) {
            console.error(e);
        }
    }
}));

const saveState = async (state: AppState) => {
    try {
        const { medicines, meals, waterGlasses, moodEntries, healthRecords, symptomLogs, forumPosts, bookings, stepEntries, sleepEntries, feedbackEntries, darkMode, language, fontSize, notifications, profile } = state;
        const data = { medicines, meals, waterGlasses, moodEntries, healthRecords, symptomLogs, forumPosts, bookings, stepEntries, sleepEntries, feedbackEntries, darkMode, language, fontSize, notifications, profile };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save state', e);
    }
};
