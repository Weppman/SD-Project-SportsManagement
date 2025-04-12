import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCtnpp9hKaS5XcX96JUuUCPV1FS5EKU3Rg",
    authDomain: "sportsfacility-ce031.firebaseapp.com",
    projectId: "sportsfacility-ce031",
    storageBucket: "sportsfacility-ce031.firebasestorage.app",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
    measurementId: "G-MEASUREMENT_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };