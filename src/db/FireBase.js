import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configurația Firebase (pune-o aici o dată)
const firebaseConfig = {
  apiKey: "AIzaSyDsJSj5vDeXigoMWC9Zbr6xeGKKKf4ttUY",
  authDomain: "profx-academy.firebaseapp.com",
  projectId: "profx-academy",
  storageBucket: "profx-academy.firebasestorage.app",
  messagingSenderId: "591171557129",
  appId: "1:591171557129:web:098ffcb9b54b9fb3cea5d8",
  measurementId: "G-VLD97TLH76",
};

// Inițializează app-ul și exportă ce ai nevoie
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };