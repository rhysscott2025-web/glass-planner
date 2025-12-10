import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your project's config keys from the Firebase Console
// Settings -> Project Settings -> General -> Your apps -> SDK setup/configuration
const firebaseConfig = {
    apiKey: "AIzaSyCx08kCM2mHxN7uKPM3-hyd0w4jkoNszas",
    authDomain: "glass-planner-8fa5a.firebaseapp.com",
    projectId: "glass-planner-8fa5a",
    storageBucket: "glass-planner-8fa5a.firebasestorage.app",
    messagingSenderId: "217510209554",
    appId: "1:217510209554:web:a14f37f35185994a3410cb",
    measurementId: "G-2LLLTQYJM8"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
