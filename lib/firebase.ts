// /home/project/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: Replace this with your actual Firebase project configuration
// You should ideally store this in environment variables (e.g., .env.local)
// Example: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, etc.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // PASTE YOUR API KEY HERE
  authDomain: "YOUR_AUTH_DOMAIN", // PASTE YOUR AUTH DOMAIN HERE
  projectId: "YOUR_PROJECT_ID", // PASTE YOUR PROJECT ID HERE
  storageBucket: "YOUR_STORAGE_BUCKET", // PASTE YOUR STORAGE BUCKET HERE
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // PASTE YOUR MESSAGING SENDER ID HERE
  appId: "YOUR_APP_ID", // PASTE YOUR APP ID HERE
  // measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

// Example Firestore usage (add functions as needed)
/*
import { collection, addDoc, getDocs } from "firebase/firestore";

export const saveContentPiece = async (content: ContentPiece) => {
  try {
    const docRef = await addDoc(collection(db, "generatedContent"), content);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; // Re-throw the error for handling upstream
  }
};

export const getAllContentPieces = async () => {
    const querySnapshot = await getDocs(collection(db, "generatedContent"));
    const contentPieces = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return contentPieces;
}
*/
