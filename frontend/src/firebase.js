// Import required Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8mqwXJEwbb9Bwncuh54fauz4iSK1D6X0",
  authDomain: "login-authentication-4106f.firebaseapp.com",
  projectId: "login-authentication-4106f",
  storageBucket: "login-authentication-4106f.firebasestorage.app",
  messagingSenderId: "248719151816",
  appId: "1:248719151816:web:86155051c320203d50cbfd",
  measurementId: "G-R72RFWYYLK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
