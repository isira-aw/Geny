// src/components/firebase/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let app: FirebaseApp | null = null;
let database: Database | null = null;
let isInitialized = false;

export function initializeFirebase(config: FirebaseConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!config?.databaseURL) {
      const error = "Firebase databaseURL is missing";
      console.error(error);
      reject(new Error(error));
      return;
    }

    try {
      app = initializeApp(config);
      database = getDatabase(app);
      isInitialized = true;
      console.log("Firebase initialized successfully");
      resolve();
    } catch (error) {
      console.error("Firebase initialization error:", error);
      reject(error);
    }
  });
}

export function getDatabaseInstance(): Database {
  if (!isInitialized || !database) {
    throw new Error("Firebase not initialized yet");
  }
  return database;
}

export function isFirebaseInitialized(): boolean {
  return isInitialized;
}