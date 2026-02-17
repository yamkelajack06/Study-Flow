import { initializeApp } from "firebase/app";
import { initializeUI } from '@firebase-oss/ui-core'
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRE_BASE_AUTH_API_KEY,
  authDomain: import.meta.env.VITE_FIRE_BASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIRE_BASE_AUTH_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIRE_BASE_AUTH_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIRE_BASE_AUTH_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIRE_BASE_AUTH_APP_ID,
  measurementId: import.meta.env.VITE_FIRE_BASE_AUTH_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const ui = initializeUI({
  app,
});

export const auth = getAuth(app);
