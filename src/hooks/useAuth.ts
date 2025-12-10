import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const useAuth = () => {
    // User object from Firebase or null
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Check your Firebase config.");
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return {
        user,
        // Helper to get display name or email for UI
        userName: user?.displayName || user?.email || null,
        login,
        logout,
        loading
    };
};
