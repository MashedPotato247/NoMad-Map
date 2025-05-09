import {
    FIRESTORE_API_KEY,
    FIRESTORE_APP_ID,
    FIRESTORE_MEASUREMENT_ID,
    FIRESTORE_PROJECT_ID
} from '@env';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIRESTORE_API_KEY,
  projectId: FIRESTORE_PROJECT_ID,
  appId: FIRESTORE_APP_ID,
  measurementId: FIRESTORE_MEASUREMENT_ID
};

// Initialize Firebase - ensure we don't initialize multiple instances
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
