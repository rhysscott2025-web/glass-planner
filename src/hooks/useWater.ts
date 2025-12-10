import { useState, useEffect } from 'react';

const STORAGE_KEY = 'glass-planner-water';

interface WaterState {
    glasses: number;
    lastUpdated: string; // ISO date string YYYY-MM-DD
}

export function useWater(goal: number = 8) {
    const [glasses, setGlasses] = useState(0);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            try {
                const parsed: WaterState = JSON.parse(saved);
                if (parsed.lastUpdated === today) {
                    setGlasses(parsed.glasses);
                } else {
                    // New day, reset
                    setGlasses(0);
                }
            } catch (e) {
                console.error('Failed to parse water state', e);
                setGlasses(0);
            }
        }
    }, []);

    const updateGlasses = (newCount: number) => {
        const today = new Date().toISOString().split('T')[0];
        const clamped = Math.max(0, Math.min(newCount, goal + 5)); // Allow a bit over goal, but not infinite
        setGlasses(clamped);

        const state: WaterState = {
            glasses: clamped,
            lastUpdated: today
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    };

    const addGlass = () => updateGlasses(glasses + 1);
    const removeGlass = () => updateGlasses(glasses - 1);

    return {
        glasses,
        goal,
        addGlass,
        removeGlass,
        progress: Math.min(100, (glasses / goal) * 100)
    };
}
