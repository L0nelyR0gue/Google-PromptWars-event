import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAFFeWHk2utN48at8YgMks6Ffv4C-WjTlM",
  authDomain: "travi-cd6fa.firebaseapp.com",
  projectId: "travi-cd6fa",
  storageBucket: "travi-cd6fa.firebasestorage.app",
  messagingSenderId: "250617724054",
  appId: "1:250617724054:web:53cc49a06ea9e3bc49d6b7",
  measurementId: "G-SPK0S508E2"
};

// Initialize Firebase (check if already initialized for HMR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
