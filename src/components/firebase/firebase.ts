// src/components/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCDNEo0p5cRCo9MI-0v4fVyI8CWrewfNDM",
  authDomain: "genmonitoring-7a26e.firebaseapp.com",
  databaseURL:
    "https://genmonitoring-7a26e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "genmonitoring-7a26e",
  storageBucket: "genmonitoring-7a26e.appspot.com",
  messagingSenderId: "708707703373",
  appId: "1:708707703373:web:d1fdf146e1d4a4f5881a04",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export database
export const database = getDatabase(app);
