// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import firebase from 'firebase/app';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADvZplXDJdMMw6oAcakmpBdFFZXTEWHP4",
  authDomain: "supple-rex-405614.firebaseapp.com",
  projectId: "supple-rex-405614",
  storageBucket: "supple-rex-405614.appspot.com",
  messagingSenderId: "544013108675",
  appId: "1:544013108675:web:b32ecca70329c839d7e976",
  measurementId: "G-3879S0DXNJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Uzyskaj dostęp do Firestore poprzez getFirestore

export default db; // Eksportuj obiekt db jako domyślny
