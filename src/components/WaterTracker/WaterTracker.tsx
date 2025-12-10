import React from 'react';
import { GlassWater, Plus, Minus } from 'lucide-react';
import { GlassCard } from '../GlassCard/GlassCard';
import { useWater } from '../../hooks/useWater';
import './WaterTracker.css';

export const WaterTracker: React.FC = () => {
    const { glasses, goal, addGlass, removeGlass } = useWater();

    return (
        <GlassCard className="water-tracker">
            <div className="water-header">
                <h3>Hydration</h3>
                <div className="water-controls">
                    <button className="water-btn" onClick={removeGlass} aria-label="Remove glass">
                        <Minus size={24} color="#ffffff" strokeWidth={3} />
                    </button>
                    <button className="water-btn" onClick={addGlass} aria-label="Add glass">
                        <Plus size={24} color="#ffffff" strokeWidth={3} />
                    </button>
                </div>
            </div>

            <div className="water-grid">
                {Array.from({ length: goal }).map((_, i) => (
                    <GlassWater
                        key={i}
                        size={24}
                        className={`water-glass ${i < glasses ? 'filled' : ''}`}
                        strokeWidth={2.5}
                    />
                ))}
            </div>

            <div className="water-progress-text">
                {glasses} / {goal} glasses
            </div>
        </GlassCard>
    );
};
