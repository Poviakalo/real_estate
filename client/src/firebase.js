// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-97ac7.firebaseapp.com",
  projectId: "real-estate-97ac7",
  storageBucket: "real-estate-97ac7.firebasestorage.app",
  messagingSenderId: "241392935775",
  appId: "1:241392935775:web:c5f8cbb2c4baf3e0e34cea"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);