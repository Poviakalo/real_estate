// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-e61a3.firebaseapp.com",
  projectId: "real-estate-e61a3",
  storageBucket: "real-estate-e61a3.firebasestorage.app",
  messagingSenderId: "735130504653",
  appId: "1:735130504653:web:2b51ef597851e03f434884"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);