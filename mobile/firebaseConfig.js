// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCBe7ByKvM4HGvRk8f6OoWhtJSadLO6Zro',
  authDomain: 'faersmartstickapp-35ad8.firebaseapp.com',
  projectId: 'faersmartstickapp-35ad8',
  storageBucket: 'faersmartstickapp-35ad8.firebasestorage.app',
  messagingSenderId: '132163559183',
  appId: '1:132163559183:web:2cc4c64294359c5b36a87a',
  measurementId: 'G-YXWHY0PZKS',
};

// initialize the app
const app = initializeApp(firebaseConfig);

// only enable Analytics if supported (prevents RN crash)
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

// set up Auth with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Firestore instance
const db = getFirestore(app);

export { auth, db };
