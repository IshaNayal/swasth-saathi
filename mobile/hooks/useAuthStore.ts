import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { useAppStore } from './useAppStore'; // Import App Store

interface User {
    phone: string;
    name?: string;
    role: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
    init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,

    setAuth: async (token, user) => {
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('userData', JSON.stringify(user));
        set({ token, user, isAuthenticated: true });
    },

    logout: async () => {
        try {
            // 1. Clear Auth
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userData');
            set({ token: null, user: null, isAuthenticated: false });

            // 2. Clear App Data
            await useAppStore.getState().resetStore();
        } catch (e) {
            console.error('Logout error:', e);
        }
    },

    init: async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const userData = await SecureStore.getItemAsync('userData');
            if (token && userData) {
                set({ token, user: JSON.parse(userData), isAuthenticated: true });
            }
        } catch (e) {
            console.error('Auth Init Error:', e);
        }
    }
}));
