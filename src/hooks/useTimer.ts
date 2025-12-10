import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export type TimerMode = 'focus' | 'short' | 'long';

const DEFAULT_MODES = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
};

export const useTimer = () => {
    const { user } = useAuth();
    const [durations, setDurations] = useState(DEFAULT_MODES);

    // Sync durations from Firestore
    useEffect(() => {
        if (!user) {
            setDurations(DEFAULT_MODES);
            return;
        }

        const docRef = doc(db, `users/${user.uid}/settings/timer`);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const newDurations = docSnap.data() as typeof DEFAULT_MODES;
                setDurations(newDurations);
                // Update timeLeft if not running, to reflect new settings immediately
                if (!isRunning) {
                    setTimeLeft(newDurations[mode]);
                }
            } else {
                setDoc(docRef, DEFAULT_MODES);
            }
        });

        return () => unsubscribe();
    }, [user]); // Removed isRunning/mode dependencies to avoid loops, only sync on user/mount

    const [mode, setModeState] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(durations.focus);
    const [isRunning, setIsRunning] = useState(false);

    // Custom setter for mode that also resets timer
    const setMode = (newMode: TimerMode) => {
        setModeState(newMode);
        setIsRunning(false);
        setTimeLeft(durations[newMode]);
    };

    // Timer Interval
    useEffect(() => {
        let interval: number;

        if (isRunning && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeLeft]);

    const toggleTimer = () => setIsRunning(!isRunning);

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(durations[mode]);
    };

    const updateDuration = async (newMode: TimerMode, minutes: number) => {
        if (!user) return;

        const newDurations = {
            ...durations,
            [newMode]: minutes * 60,
        };

        setDurations(newDurations);
        await setDoc(doc(db, `users/${user.uid}/settings/timer`), newDurations);
    };



    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = 1 - timeLeft / durations[mode];

    return {
        mode,
        setMode,
        timeLeft,
        isRunning,
        toggleTimer,
        resetTimer,
        formatTime,
        progress,
        durations,
        updateDuration,
    };
};
