import React, { useState } from 'react';
import { Settings, Music, Check } from 'lucide-react';
import { GlassCard } from '../GlassCard/GlassCard';
import { useMusic } from '../../hooks/useMusic';
import './MusicPlayer.css';

export const MusicPlayer: React.FC = () => {
    const { spotifyUrl, updatePlaylist } = useMusic();
    const [isEditing, setIsEditing] = useState(false);
    const [inputUrl, setInputUrl] = useState('');

    const getEmbedUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            // Replace /playlist/, /track/, /album/ with /embed/...
            // Example: https://open.spotify.com/playlist/xxx -> https://open.spotify.com/embed/playlist/xxx
            return urlObj.origin + '/embed' + urlObj.pathname + '?utm_source=generator&theme=0';
        } catch (e) {
            return url;
        }
    };

    const handleSave = () => {
        if (inputUrl.trim()) {
            updatePlaylist(inputUrl.trim());
        }
        setIsEditing(false);
    };

    const startEditing = () => {
        setInputUrl(spotifyUrl);
        setIsEditing(true);
    };

    return (
        <GlassCard className="music-player-card">
            <div className="music-header">
                <div className="music-title">
                    <Music size={18} />
                    <span>Focus Music</span>
                </div>
                <button
                    className="icon-btn"
                    onClick={isEditing ? handleSave : startEditing}
                    title={isEditing ? "Save" : "Change Playlist"}
                >
                    {isEditing ? <Check size={18} /> : <Settings size={18} />}
                </button>
            </div>

            {isEditing ? (
                <div className="music-edit">
                    <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="Paste Spotify Link..."
                        className="music-input"
                        autoFocus
                    />
                    <p className="music-help">Paste a link to a Song, Playlist, or Album</p>
                </div>
            ) : (
                <div className="iframe-container">
                    <iframe
                        style={{ borderRadius: '12px' }}
                        src={getEmbedUrl(spotifyUrl)}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title="Spotify Player"
                    />
                </div>
            )}
        </GlassCard>
    );
};
