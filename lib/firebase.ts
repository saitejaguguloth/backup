import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAavXPmCt9ZeI5re0-aKCDvN5D0v9nXYeg",
    authDomain: "napkin-cdd41.firebaseapp.com",
    projectId: "napkin-cdd41",
    storageBucket: "napkin-cdd41.firebasestorage.app",
    messagingSenderId: "820925836724",
    appId: "1:820925836724:web:7a0a63689788da7f7296e1",
    measurementId: "G-W2R25RQ61E"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
export const auth = getAuth(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app;
