import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYgQckFnNE1AUTF19QFNRE4295FlSHmMI",
  authDomain: "term8-zhiyu-chen.firebaseapp.com",
  projectId: "term8-zhiyu-chen",
  storageBucket: "term8-zhiyu-chen.firebasestorage.app",
  messagingSenderId: "7301681102",
  appId: "1:7301681102:web:aeb0855e54f3026902a59f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);