import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function hasFirebaseConfig() {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

export function firebaseApp() {
  if (!hasFirebaseConfig()) return null;
  return getApps().length ? getApps()[0] : initializeApp(config);
}

export function firestoreDb() {
  const app = firebaseApp();
  return app ? getFirestore(app) : null;
}
