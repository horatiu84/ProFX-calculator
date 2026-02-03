import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configurația Firebase pentru Trading Journal (trades)
const tradesFirebaseConfig = {
  apiKey: "AIzaSyDkl3IMy-cDv_tGEU_07OJvFpq1ru-Zoa4",
  authDomain: "trading-journal-f8e65.firebaseapp.com",
  projectId: "trading-journal-f8e65",
  storageBucket: "trading-journal-f8e65.firebasestorage.app",
  messagingSenderId: "1054523013178",
  appId: "1:1054523013178:web:d3768792123d3f38d71d03",
  measurementId: "G-9N4P036YNE"
};

// Inițializează app-ul separat pentru trades (cu un nume unic)
const tradesApp = initializeApp(tradesFirebaseConfig, 'tradesApp');
const tradesDb = getFirestore(tradesApp);

export { tradesDb };
