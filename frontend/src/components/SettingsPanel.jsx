/**
 * SettingsPanel.jsx
 * -----------------
 * Slide-out settings drawer with Theme Picker (6 themes).
 * Opened by the Settings gear in the Sidebar.
 */
import React from 'react';
import { X, Settings, Check, Palette, Bell, Shield, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function ThemeCard({ t, isActive, onSelect }) {
  return (
    <button
      onClick={() => onSelect(t.id)}
      className="w-full text-left p-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{
        border: isActive ? `2px solid ${t.preview[0]}` : '1.5px solid var(--border)',
        background: isActive ? `${t.preview[0]}12` : 'var(--bg-primary)',
        boxShadow: isActive ? `0 0 0 4px ${t.preview[0]}18` : 'none',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Color swatches */}
        <div className="flex gap-1 flex-shrink-0">
          {t.preview.map((c, i) => (
            <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
              style={{ background: c }} />
          ))}
        </div>

        {/* Name + description */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold flex items-center gap-1.5"
            style={{ color: 'var(--text-primary)' }}>
            <span>{t.emoji}</span> {t.name}
            {t.dark && (
              <span className="pill text-[9px] ml-1"
                style={{ background: '#1e1b2e', color: '#c084fc', fontSize: '9px', padding: '1px 6px' }}>
                DARK
              </span>
            )}
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
            {t.description}
          </p>
        </div>

        {/* Active checkmark */}
        {isActive && (
          <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: t.preview[0] }}>
            <Check size={11} className="text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Full gradient preview bar */}
      <div className="mt-2 h-1.5 rounded-full overflow-hidden">
        <div className="h-full w-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${t.preview.join(', ')})` }} />
      </div>
    </button>
  );
}

export default function SettingsPanel({ onClose }) {
  const { theme, themeId, setTheme, themes } = useTheme();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 animate-fade-in"
        style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}
        onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 flex flex-col animate-slide-in-right"
        style={{
          width: 'min(360px, 100vw)',
          background: 'var(--bg-card)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
          borderLeft: '1px solid var(--border)',
        }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(135deg, var(--teal-600), var(--teal-500))',
          }}>
          <div className="flex items-center gap-2.5">
            <Settings size={20} className="text-white" />
            <h2 className="text-base font-extrabold text-white">Settings</h2>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Theme Section ─────────────────────────────── */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--teal-100)' }}>
                <Palette size={14} style={{ color: 'var(--teal-600)' }} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  App Theme
                </h3>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Choose your visual style — saved automatically
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {themes.map(t => (
                <ThemeCard
                  key={t.id}
                  t={t}
                  isActive={themeId === t.id}
                  onSelect={setTheme}
                />
              ))}
            </div>

            {/* Active theme preview pill */}
            <div className="mt-4 p-3 rounded-2xl flex items-center gap-2"
              style={{ background: 'var(--teal-100)', border: '1px solid var(--teal-200)' }}>
              <span className="text-lg">{theme.emoji}</span>
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--teal-700)' }}>
                  Active: {theme.name}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--teal-600)' }}>
                  Theme applied across all pages instantly
                </p>
              </div>
            </div>
          </div>

          {/* ── Divider ───────────────────────────────────── */}
          <div style={{ height: 1, background: 'var(--border)', margin: '0 20px' }} />

          {/* ── Notifications Section (placeholder) ───────── */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--teal-100)' }}>
                <Bell size={14} style={{ color: 'var(--teal-600)' }} />
              </div>
              <h3 className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                Notifications
              </h3>
            </div>
            {['Vaccine reminders', 'Medication alerts', 'Weight check reminders'].map(item => (
              <div key={item} className="flex items-center justify-between py-2.5 px-1">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                <div className="w-10 h-5 rounded-full cursor-pointer transition-colors"
                  style={{ background: 'var(--teal-500)' }}>
                  <div className="w-4 h-4 rounded-full bg-white shadow ml-auto mt-0.5 mr-0.5" />
                </div>
              </div>
            ))}
          </div>

          {/* ── Divider ───────────────────────────────────── */}
          <div style={{ height: 1, background: 'var(--border)', margin: '0 20px' }} />

          {/* ── Privacy / About (placeholder) ─────────────── */}
          <div className="p-5 space-y-2">
            {[
              { Icon: Shield, label: 'Privacy & Data' },
              { Icon: Info,   label: 'About PetPassport v1.0' },
            ].map(({ Icon, label }) => (
              <button key={label}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all hover:opacity-80"
                style={{ background: 'var(--teal-50)', border: '1px solid var(--border)' }}>
                <Icon size={15} style={{ color: 'var(--teal-600)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 text-center text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          PetPassport · All settings saved locally
        </div>
      </div>
    </>
  );
}
