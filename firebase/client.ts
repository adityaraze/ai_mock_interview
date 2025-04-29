import { getApp,initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBvz-Of53gSXnjWKPXfYFJ881NyjZBxmvQ",
  authDomain: "prepwise-d6e06.firebaseapp.com",
  projectId: "prepwise-d6e06",
  storageBucket: "prepwise-d6e06.firebasestorage.app",
  messagingSenderId: "67508233458",
  appId: "1:67508233458:web:3ecb3b80b5d691742c5c6b",
  measurementId: "G-9FGH1KQSS0"
};

// Initialize Firebase
const app = !getApp.length ? initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);