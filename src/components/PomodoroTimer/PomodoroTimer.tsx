import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { TimerMode } from '../../hooks/useTimer';
import { useTimer } from '../../hooks/useTimer';
import { GlassCard } from '../GlassCard/GlassCard';
import './PomodoroTimer.css';

export const PomodoroTimer: React.FC = () => {
    const {
        mode,
        setMode,
        timeLeft,
        isRunning,
        toggleTimer,
        resetTimer,
        formatTime,
        progress,
        durations,
        updateDuration
    } = useTimer();

    const [showSettings, setShowSettings] = useState(false);

    return (
        <GlassCard className="timer-card" variant="highlight">
            {showSettings ? (
                <div className="timer-settings">
                    <div className="settings-header">
                        <h3>Timer Settings</h3>
                        <button className="icon-btn" onClick={() => setShowSettings(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="settings-grid">
                        {(['focus', 'short', 'long'] as TimerMode[]).map((m) => (
                            <div key={m} className="setting-item">
                                <label>{m === 'focus' ? 'Focus' : m === 'short' ? 'Short' : 'Long'}</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={durations[m] / 60}
                                    onChange={(e) => updateDuration(m, parseInt(e.target.value) || 1)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="timer-top-controls">
                        <button className="icon-btn" onClick={() => setShowSettings(true)}>
                            <Settings size={18} />
                        </button>
                    </div>
                    <div className="timer-modes">
                        {(['focus', 'short', 'long'] as TimerMode[]).map((m) => (
                            <button
                                key={m}
                                className={clsx('mode-btn', { 'mode-btn--active': mode === m })}
                                onClick={() => setMode(m)}
                            >
                                {m === 'focus' ? 'Focus' : m === 'short' ? 'Short Break' : 'Long Break'}
                            </button>
                        ))}
                    </div>

                    <div className="timer-display-container">
                        <svg className="timer-progress" viewBox="0 0 100 100">
                            <circle
                                className="timer-circle-bg"
                                cx="50" cy="50" r="45"
                            />
                            <circle
                                className="timer-circle-fg"
                                cx="50" cy="50" r="45"
                                style={{
                                    strokeDasharray: 283,
                                    strokeDashoffset: 283 * (1 - progress)
                                }}
                            />
                        </svg>

                        <div className="timer-text">
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="timer-controls">
                        <button className="control-btn main-action" onClick={toggleTimer}>
                            {isRunning ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        <button className="control-btn" onClick={resetTimer}>
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </>
            )}
        </GlassCard>
    );
};
