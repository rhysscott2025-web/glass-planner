import React from 'react';
import { GlassCard } from '../GlassCard/GlassCard';
import './LandingPage.css';

interface LandingPageProps {
    onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    return (
        <div className="landing-container">
            <GlassCard className="login-card">
                <h1 className="landing-title">Glass Planner</h1>
                <p className="landing-subtitle">Clarity for your busy life</p>

                <div className="login-actions">
                    <button onClick={onLogin} className="login-btn google-btn">
                        Sign in with Google
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};
