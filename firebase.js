import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAqBfh3pKMD68iSkWpZx7wE5DJEM3t6KI0",
  authDomain: "proyecto-deficiencias-viales.firebaseapp.com",
  projectId: "proyecto-deficiencias-viales",
  storageBucket: "proyecto-deficiencias-viales.firebasestorage.app",
  messagingSenderId: "142657418507",
  appId: "1:142657418507:web:4ff8c0cfca4c9f6f26de0e",
  measurementId: "G-7QF4NRJHGV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);