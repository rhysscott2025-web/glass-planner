
import React from 'react';
import './GlassCard.css';
import { clsx } from 'clsx';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  ...props 
}) => {
  return (
    <div 
      className={clsx('glass-card', `glass-card--${variant}`, className)} 
      {...props}
    >
      {children}
    </div>
  );
};
