import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDs-E9kqfd10yra5A65pghbNcMmNvRQumQ",
  authDomain: "job-portal-21d55.firebaseapp.com",
  projectId: "job-portal-21d55",
  storageBucket: "job-portal-21d55.appspot.com",
  messagingSenderId: "81220574939",
  appId: "1:81220574939:web:bfcabed8e2499da74df6fe",
  measurementId: "G-PBPVDM8GZ1"
};

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)