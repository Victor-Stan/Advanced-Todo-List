import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCGOpB2mM8GGltSO4sTECRn6i1QtfZBfYs",
  authDomain: "react-firebase-todo-af14d.firebaseapp.com",
  projectId: "react-firebase-todo-af14d",
  storageBucket: "react-firebase-todo-af14d.appspot.com",
  messagingSenderId: "185984014977",
  appId: "1:185984014977:web:2de8f97ffa93e1a8d68b80"
};


const app = initializeApp(firebaseConfig);

export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);