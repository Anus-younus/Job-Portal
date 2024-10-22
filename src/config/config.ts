import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2Pax_A-UK4TjsT7Lf0o6xbfUWgpebXOU",
  authDomain: "nextjs-saylani-batch-11.firebaseapp.com",
  databaseURL: "https://nextjs-saylani-batch-11-default-rtdb.firebaseio.com",
  projectId: "nextjs-saylani-batch-11",
  storageBucket: "nextjs-saylani-batch-11.appspot.com",
  messagingSenderId: "967652255821",
  appId: "1:967652255821:web:bd9aebf82904c782f65404"
};

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)