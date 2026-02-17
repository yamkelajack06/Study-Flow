/**
 * Firestore Database Service
 *
 * This file will handle:
 * - CRUD operations for user timetable entries
 * - User profile data management
 * - Real-time data synchronization
 * - Offline data caching and sync
 * - Data validation before Firestore writes
 * - Batch operations for bulk updates
 * - Query optimization and pagination
 * - Data migration between local and cloud storage
 */

/**
 * Firebase Configuration and Initialization
 *
 * This file will handle:
 * - Firebase app initialization with config
 * - Authentication service setup
 * - Firestore database setup
 * - Storage service setup (if needed for profile pics)
 * - Firebase environment configuration
 * - Error handling for Firebase connection issues
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;
const MEASUREMENT_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MESSAGING_SENDER_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
