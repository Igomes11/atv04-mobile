import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBm5J2UKBVi6AAB1SHdjD_wUuW6rT7adB0",
  authDomain: "aula06-firebase-teste.firebaseapp.com",
  projectId: "aula06-firebase-teste",
  storageBucket: "aula06-firebase-teste.firebasestorage.app",
  messagingSenderId: "335111553216",
  appId: "1:335111553216:web:9f74a07c95585a3e2a2d25"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);