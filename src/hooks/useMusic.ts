import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

const DEFAULT_PLAYLIST = "https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM"; // Lofi Girl

export const useMusic = () => {
    const { user } = useAuth();
    const [spotifyUrl, setSpotifyUrl] = useState(DEFAULT_PLAYLIST);

    useEffect(() => {
        if (!user) {
            setSpotifyUrl(DEFAULT_PLAYLIST);
            return;
        }

        const docRef = doc(db, `users/${user.uid}/settings/music`);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setSpotifyUrl(docSnap.data().url || DEFAULT_PLAYLIST);
            } else {
                setDoc(docRef, { url: DEFAULT_PLAYLIST });
            }
        });

        return () => unsubscribe();
    }, [user]);

    const updatePlaylist = async (url: string) => {
        if (!user) return;
        setSpotifyUrl(url); // Optimistic
        await setDoc(doc(db, `users/${user.uid}/settings/music`), { url });
    };

    return { spotifyUrl, updatePlaylist };
};
