/**
 * ThemeContext.jsx
 * ----------------
 * 6 beautiful themes. Applies CSS variable overrides to :root
 * and injects a <style> tag for gradient-text + glass-card overrides.
 * Persists selection to localStorage.
 */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export const THEMES = [
  {
    id: 'ocean', name: 'Ocean Teal', emoji: '🌊',
    description: 'Fresh teal & orange — the default',
    preview: ['#0d9488', '#14b8a6', '#f97316'], dark: false,
    vars: {
      '--teal-50':'#f0fdfa','--teal-100':'#ccfbf1','--teal-200':'#99f6e4',
      '--teal-400':'#2dd4bf','--teal-500':'#14b8a6','--teal-600':'#0d9488','--teal-700':'#0f766e',
      '--orange-50':'#fff7ed','--orange-100':'#ffedd5','--orange-400':'#fb923c','--orange-500':'#f97316',
      '--bg-primary':'#f8fffe','--bg-card':'#ffffff','--bg-sidebar':'#1a2e2b',
      '--text-primary':'#1a2e2b','--text-secondary':'#4b6b66','--text-muted':'#8ba8a4',
      '--border':'rgba(20,184,166,0.15)',
      '--shadow-sm':'0 2px 8px rgba(20,184,166,0.08)',
      '--shadow-md':'0 4px 24px rgba(20,184,166,0.12)',
      '--shadow-lg':'0 8px 40px rgba(20,184,166,0.18)',
    },
    mainBg: 'linear-gradient(160deg,#f0fdfa 0%,#fff7ed 50%,#f8fffe 100%)',
    gradientText: 'linear-gradient(135deg,#0d9488 0%,#f97316 100%)',
    glassBg: 'rgba(255,255,255,0.85)', glassHover: 'rgba(255,255,255,0.95)',
    sidebarAccent: '#2dd4bf', sidebarActiveBg: 'rgba(45,212,191,0.18)',
  },
  {
    id: 'midnight', name: 'Midnight Purple', emoji: '🌙',
    description: 'Dark mode with rich violet accents',
    preview: ['#7c3aed', '#a855f7', '#ec4899'], dark: true,
    vars: {
      '--teal-50':'#1e1033','--teal-100':'#2d1f4a','--teal-200':'#4a3470',
      '--teal-400':'#c084fc','--teal-500':'#a855f7','--teal-600':'#9333ea','--teal-700':'#7c3aed',
      '--orange-50':'#1f0d1a','--orange-100':'#3d1a30','--orange-400':'#f472b6','--orange-500':'#ec4899',
      '--bg-primary':'#0c0818','--bg-card':'#160f2c','--bg-sidebar':'#09060f',
      '--text-primary':'#ede9fe','--text-secondary':'#c4b5fd','--text-muted':'#7c6e9e',
      '--border':'rgba(168,85,247,0.22)',
      '--shadow-sm':'0 2px 8px rgba(168,85,247,0.15)',
      '--shadow-md':'0 4px 24px rgba(168,85,247,0.22)',
      '--shadow-lg':'0 8px 40px rgba(168,85,247,0.30)',
    },
    mainBg: 'linear-gradient(160deg,#0c0818 0%,#120a24 60%,#0e0a1c 100%)',
    gradientText: 'linear-gradient(135deg,#9333ea 0%,#ec4899 100%)',
    glassBg: 'rgba(28,18,54,0.85)', glassHover: 'rgba(38,26,72,0.95)',
    sidebarAccent: '#c084fc', sidebarActiveBg: 'rgba(168,85,247,0.18)',
  },
  {
    id: 'blossom', name: 'Cherry Blossom', emoji: '🌸',
    description: 'Soft rose & pink — romantic & gentle',
    preview: ['#e11d48', '#f43f5e', '#ec4899'], dark: false,
    vars: {
      '--teal-50':'#fff1f2','--teal-100':'#ffe4e6','--teal-200':'#fecdd3',
      '--teal-400':'#fb7185','--teal-500':'#f43f5e','--teal-600':'#e11d48','--teal-700':'#be123c',
      '--orange-50':'#fdf2f8','--orange-100':'#fce7f3','--orange-400':'#f472b6','--orange-500':'#ec4899',
      '--bg-primary':'#fff5f7','--bg-card':'#ffffff','--bg-sidebar':'#2d1020',
      '--text-primary':'#2d0a18','--text-secondary':'#6b2d42','--text-muted':'#a87484',
      '--border':'rgba(244,63,94,0.15)',
      '--shadow-sm':'0 2px 8px rgba(244,63,94,0.08)',
      '--shadow-md':'0 4px 24px rgba(244,63,94,0.12)',
      '--shadow-lg':'0 8px 40px rgba(244,63,94,0.18)',
    },
    mainBg: 'linear-gradient(160deg,#fff1f2 0%,#fdf2f8 50%,#fff5f7 100%)',
    gradientText: 'linear-gradient(135deg,#e11d48 0%,#ec4899 100%)',
    glassBg: 'rgba(255,255,255,0.85)', glassHover: 'rgba(255,255,255,0.95)',
    sidebarAccent: '#fb7185', sidebarActiveBg: 'rgba(244,63,94,0.18)',
  },
  {
    id: 'ember', name: 'Autumn Ember', emoji: '🍂',
    description: 'Warm orange & amber — cozy autumn feel',
    preview: ['#ea580c', '#f97316', '#f59e0b'], dark: false,
    vars: {
      '--teal-50':'#fff7ed','--teal-100':'#ffedd5','--teal-200':'#fed7aa',
      '--teal-400':'#fb923c','--teal-500':'#f97316','--teal-600':'#ea580c','--teal-700':'#c2410c',
      '--orange-50':'#fffbeb','--orange-100':'#fef3c7','--orange-400':'#fbbf24','--orange-500':'#f59e0b',
      '--bg-primary':'#fffbf5','--bg-card':'#ffffff','--bg-sidebar':'#2d1200',
      '--text-primary':'#3d1500','--text-secondary':'#7c3a0a','--text-muted':'#b86e35',
      '--border':'rgba(249,115,22,0.15)',
      '--shadow-sm':'0 2px 8px rgba(249,115,22,0.08)',
      '--shadow-md':'0 4px 24px rgba(249,115,22,0.12)',
      '--shadow-lg':'0 8px 40px rgba(249,115,22,0.18)',
    },
    mainBg: 'linear-gradient(160deg,#fff7ed 0%,#fffbeb 50%,#fffbf5 100%)',
    gradientText: 'linear-gradient(135deg,#ea580c 0%,#f59e0b 100%)',
    glassBg: 'rgba(255,255,255,0.85)', glassHover: 'rgba(255,255,255,0.95)',
    sidebarAccent: '#fb923c', sidebarActiveBg: 'rgba(249,115,22,0.18)',
  },
  {
    id: 'forest', name: 'Forest Green', emoji: '🌿',
    description: 'Deep greens & lime — fresh and natural',
    preview: ['#16a34a', '#22c55e', '#84cc16'], dark: false,
    vars: {
      '--teal-50':'#f0fdf4','--teal-100':'#dcfce7','--teal-200':'#bbf7d0',
      '--teal-400':'#4ade80','--teal-500':'#22c55e','--teal-600':'#16a34a','--teal-700':'#15803d',
      '--orange-50':'#f7fee7','--orange-100':'#ecfccb','--orange-400':'#a3e635','--orange-500':'#84cc16',
      '--bg-primary':'#f7fdf5','--bg-card':'#ffffff','--bg-sidebar':'#0f2417',
      '--text-primary':'#0a1f0d','--text-secondary':'#2d5a35','--text-muted':'#6b9a74',
      '--border':'rgba(34,197,94,0.15)',
      '--shadow-sm':'0 2px 8px rgba(34,197,94,0.08)',
      '--shadow-md':'0 4px 24px rgba(34,197,94,0.12)',
      '--shadow-lg':'0 8px 40px rgba(34,197,94,0.18)',
    },
    mainBg: 'linear-gradient(160deg,#f0fdf4 0%,#f7fee7 50%,#f7fdf5 100%)',
    gradientText: 'linear-gradient(135deg,#16a34a 0%,#84cc16 100%)',
    glassBg: 'rgba(255,255,255,0.85)', glassHover: 'rgba(255,255,255,0.95)',
    sidebarAccent: '#4ade80', sidebarActiveBg: 'rgba(34,197,94,0.18)',
  },
  {
    id: 'cosmic', name: 'Cosmic Blue', emoji: '🪐',
    description: 'Electric blue & cyan — sleek and futuristic',
    preview: ['#1d4ed8', '#3b82f6', '#06b6d4'], dark: false,
    vars: {
      '--teal-50':'#eff6ff','--teal-100':'#dbeafe','--teal-200':'#bfdbfe',
      '--teal-400':'#60a5fa','--teal-500':'#3b82f6','--teal-600':'#2563eb','--teal-700':'#1d4ed8',
      '--orange-50':'#ecfeff','--orange-100':'#cffafe','--orange-400':'#22d3ee','--orange-500':'#06b6d4',
      '--bg-primary':'#f5f8ff','--bg-card':'#ffffff','--bg-sidebar':'#050e24',
      '--text-primary':'#0a1628','--text-secondary':'#1e3a5f','--text-muted':'#5b7fa8',
      '--border':'rgba(59,130,246,0.15)',
      '--shadow-sm':'0 2px 8px rgba(59,130,246,0.08)',
      '--shadow-md':'0 4px 24px rgba(59,130,246,0.12)',
      '--shadow-lg':'0 8px 40px rgba(59,130,246,0.18)',
    },
    mainBg: 'linear-gradient(160deg,#eff6ff 0%,#ecfeff 50%,#f5f8ff 100%)',
    gradientText: 'linear-gradient(135deg,#2563eb 0%,#06b6d4 100%)',
    glassBg: 'rgba(255,255,255,0.85)', glassHover: 'rgba(255,255,255,0.95)',
    sidebarAccent: '#60a5fa', sidebarActiveBg: 'rgba(59,130,246,0.18)',
  },
];

const ThemeContext = createContext(null);
const STORAGE_KEY = 'petpassport-theme';

function applyTheme(theme) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));

  // Inject style overrides that CSS vars alone can't handle
  let el = document.getElementById('pp-theme-style');
  if (!el) { el = document.createElement('style'); el.id = 'pp-theme-style'; document.head.appendChild(el); }
  el.textContent = `
    .gradient-text {
      background: ${theme.gradientText} !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
    }
    .glass-card {
      background: ${theme.glassBg} !important;
    }
    .glass-card:hover {
      background: ${theme.glassHover} !important;
    }
    body { background-color: ${theme.vars['--bg-primary']} !important; }
  `;
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => localStorage.getItem(STORAGE_KEY) || 'ocean');
  const theme = useMemo(() => THEMES.find(t => t.id === themeId) || THEMES[0], [themeId]);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, themeId);
  }, [theme, themeId]);

  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme: setThemeId, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
