import { initializeApp } from "firebase/app";
2
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAjDjTyE16tejbdVQ1SRyqwgXtu0gpuhg",
  authDomain: "personal-gemini-journal-507718.firebaseapp.com",
  projectId: "personal-gemini-journal-507718",
  storageBucket: "personal-gemini-journal-507718.firebasestorage.app",
  messagingSenderId: "234422397989",
  appId: "1:234422397989:web:68db566097a94bdb6763cc"
};

const app = initializeApp(firebaseConfig);
9

10
export const auth = getAuth(app);