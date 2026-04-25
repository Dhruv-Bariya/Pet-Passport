/**
 * StatCard.jsx
 * ------------
 * Reusable animated stat card used in the Dashboard summary row.
 */
import React from 'react';

export default function StatCard({
  icon,
  label,
  value,
  sub,
  accentColor = '#14b8a6',
  bgLight = '#ccfbf1',
  delay = 0,
}) {
  return (
    <div
      className="glass-card animate-fade-up flex items-center gap-4 p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon bubble */}
      <div
        className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
        style={{ background: bgLight, color: accentColor }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          {label}
        </p>
        <p className="text-2xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
