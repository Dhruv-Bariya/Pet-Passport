/**
 * PetAvatar.jsx
 * -------------
 * SVG-based pet avatar with a teal/orange gradient background.
 * Renders a generated paw-print icon when no photo URL is provided.
 */
import React from 'react';
import { PawPrint } from 'lucide-react';

export default function PetAvatar({ src, name = 'Pet', size = 96, className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`object-cover rounded-full ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Gradient initials fallback
  const initials = name.charAt(0).toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-full flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 45%, #fb923c 100%)',
        boxShadow: '0 4px 20px rgba(20,184,166,0.35)',
      }}
    >
      <PawPrint
        size={size * 0.42}
        className="text-white"
        strokeWidth={1.8}
      />
    </div>
  );
}
