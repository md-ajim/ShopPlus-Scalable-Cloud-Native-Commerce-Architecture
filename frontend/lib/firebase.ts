// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAVXiiuR-pg_ofkuIwftNfTQ_fdrYNIXv8",
  authDomain: "auth-75e4b.firebaseapp.com",
  projectId: "auth-75e4b",
  storageBucket: "auth-75e4b.firebasestorage.app",
  messagingSenderId: "560618527966",
  appId: "1:560618527966:web:95286bc182d4164a24764f",
  measurementId: "G-5DGMNP0X2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);