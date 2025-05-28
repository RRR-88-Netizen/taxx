// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBN-X8Ob5x6tGaYX8AWlREdSeMhDBQuBr8",
  authDomain: "taxx-aa723.firebaseapp.com",
  projectId: "taxx-aa723",
  storageBucket: "taxx-aa723.firebasestorage.app",
  messagingSenderId: "56750900913",
  appId: "1:56750900913:web:89c5d9328505f6c2c78490",
  measurementId: "G-4C4S2G7R2D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);