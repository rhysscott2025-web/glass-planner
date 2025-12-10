import React from 'react';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="app-layout">
            <main className="app-container">
                {children}
            </main>
        </div>
    );
};
