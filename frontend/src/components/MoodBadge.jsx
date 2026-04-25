/**
 * MoodBadge.jsx
 * -------------
 * Small pill badge that shows the pet's mood with an emoji and colour.
 */
import React from 'react';
import { moodConfig } from '../data/mockData';

export default function MoodBadge({ mood }) {
  const cfg = moodConfig[mood] ?? { label: mood, emoji: '•', color: '#64748b', bg: '#f1f5f9' };
  return (
    <span
      className="pill text-xs"
      style={{ background: cfg.bg, color: cfg.color, fontWeight: 600 }}
    >
      {cfg.emoji} {cfg.label}
    </span>
  );
}
