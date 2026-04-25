/**
 * AlertsPanel.jsx
 * ---------------
 * Slide-out notification drawer opened by the Alerts bell in the Sidebar.
 * Generates smart alerts from:
 *  - Upcoming / overdue medical records (vaccines, checkups)
 *  - Missed medication days from recent logs
 *  - Weight check reminders (no weight entry in 30+ days)
 */
import React, { useMemo } from 'react';
import { X, Bell, Syringe, Stethoscope, Pill, Scale, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { differenceInDays, parseISO, format } from 'date-fns';
import { usePet } from '../context/PetContext';
import { Link } from 'react-router-dom';

/* ── Severity config ────────────────────────────────────── */
const SEV = {
  critical: { color: '#e11d48', bg: '#fff1f2', border: '#fecdd3', dot: '#e11d48' },
  warning:  { color: '#f97316', bg: '#fff7ed', border: '#fed7aa', dot: '#f97316' },
  info:     { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6' },
  success:  { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a' },
};

function Alert({ icon: Icon, title, body, sev, linkTo, linkLabel, time }) {
  const s = SEV[sev] || SEV.info;
  return (
    <div
      className="flex gap-3 p-3.5 rounded-2xl transition-all hover:brightness-[0.97]"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: s.border }}>
        <Icon size={15} style={{ color: s.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold leading-tight" style={{ color: s.color }}>{title}</p>
        <p className="text-xs mt-0.5 leading-snug" style={{ color: '#64748b' }}>{body}</p>
        <div className="flex items-center justify-between mt-1.5">
          {time && <span className="text-[10px]" style={{ color: '#94a3b8' }}>{time}</span>}
          {linkTo && (
            <Link to={linkTo}
              className="text-[11px] font-semibold hover:opacity-70 transition-opacity"
              style={{ color: s.color, textDecoration: 'none' }}>
              {linkLabel} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function useAlerts(activePet, logs, records) {
  return useMemo(() => {
    const alerts = [];
    if (!activePet) return alerts;
    const now = new Date();

    /* ── Medical records ─────────────────────────────────── */
    records.forEach(rec => {
      if (rec.status !== 'upcoming') return;
      const days = differenceInDays(parseISO(rec.date), now);
      const icon = rec.type === 'Vaccine' ? Syringe : Stethoscope;
      if (days < 0) {
        alerts.push({
          id: rec._id, sev: 'critical', icon,
          title: `Overdue: ${rec.type}`,
          body: `${rec.description?.slice(0, 60)}… was due ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago.`,
          time: format(parseISO(rec.date), 'dd MMM yyyy'),
          linkTo: '/records', linkLabel: 'View records',
        });
      } else if (days <= 7) {
        alerts.push({
          id: rec._id, sev: 'critical', icon,
          title: `${rec.type} in ${days} day${days !== 1 ? 's' : ''}!`,
          body: rec.description?.slice(0, 70) + (rec.description?.length > 70 ? '…' : ''),
          time: format(parseISO(rec.date), 'dd MMM yyyy'),
          linkTo: '/records', linkLabel: 'View records',
        });
      } else if (days <= 30) {
        alerts.push({
          id: rec._id, sev: 'warning', icon,
          title: `Upcoming: ${rec.type}`,
          body: `${rec.description?.slice(0, 60)}… in ${days} days.`,
          time: format(parseISO(rec.date), 'dd MMM yyyy'),
          linkTo: '/records', linkLabel: 'View records',
        });
      }
    });

    /* ── Missed medications (last 7 logs) ────────────────── */
    const recentLogs = logs.slice(0, 7);
    const missedMed = recentLogs.filter(l => !l.medicationGiven);
    if (missedMed.length >= 3) {
      alerts.push({
        id: 'missed-med', sev: 'warning', icon: Pill,
        title: 'Medication missed often',
        body: `${missedMed.length} of the last ${recentLogs.length} log days show no medication given.`,
        time: 'Recent logs',
        linkTo: '/logs', linkLabel: 'View logs',
      });
    } else if (missedMed.length === 1 || missedMed.length === 2) {
      alerts.push({
        id: 'missed-med-minor', sev: 'info', icon: Pill,
        title: 'Occasional medication miss',
        body: `Medication wasn't recorded on ${missedMed.length} recent log day${missedMed.length > 1 ? 's' : ''}.`,
        time: 'Recent logs',
        linkTo: '/logs', linkLabel: 'View logs',
      });
    }

    /* ── Weight check reminder ────────────────────────────── */
    const wh = activePet.weightHistory || [];
    if (wh.length === 0) {
      alerts.push({
        id: 'no-weight', sev: 'info', icon: Scale,
        title: 'No weight recorded',
        body: `Add a weight entry for ${activePet.name} to start tracking their health trend.`,
        linkTo: '/', linkLabel: 'Go to Dashboard',
      });
    } else {
      const lastEntry = wh[wh.length - 1];
      const daysSince = differenceInDays(now, parseISO(lastEntry.date));
      if (daysSince >= 30) {
        alerts.push({
          id: 'weight-old', sev: 'warning', icon: Scale,
          title: 'Weight check overdue',
          body: `Last weight for ${activePet.name} was ${daysSince} days ago (${lastEntry.weight} kg).`,
          time: format(parseISO(lastEntry.date), 'dd MMM yyyy'),
          linkTo: '/', linkLabel: 'Go to Dashboard',
        });
      }
    }

    /* ── No logs in 3+ days ───────────────────────────────── */
    if (logs.length > 0) {
      const lastLog = logs[0];
      const daysSince = differenceInDays(now, parseISO(lastLog.date));
      if (daysSince >= 3) {
        alerts.push({
          id: 'no-recent-log', sev: 'info', icon: CheckCircle,
          title: `No log in ${daysSince} days`,
          body: `Last daily log for ${activePet.name} was on ${format(parseISO(lastLog.date), 'dd MMM yyyy')}.`,
          linkTo: '/logs', linkLabel: 'Add a log',
        });
      }
    } else {
      alerts.push({
        id: 'no-logs', sev: 'info', icon: CheckCircle,
        title: 'Start logging daily',
        body: `No daily logs recorded yet for ${activePet.name}. Daily logs help track health over time.`,
        linkTo: '/logs', linkLabel: 'Add first log',
      });
    }

    /* ── All clear ────────────────────────────────────────── */
    if (alerts.length === 0) {
      alerts.push({
        id: 'all-clear', sev: 'success', icon: CheckCircle,
        title: 'All clear! 🎉',
        body: `${activePet.name} is up to date on vaccinations, medications, and checkups.`,
      });
    }

    // Sort: critical first, then warning, then info, then success
    const order = { critical: 0, warning: 1, info: 2, success: 3 };
    return alerts.sort((a, b) => order[a.sev] - order[b.sev]);
  }, [activePet, logs, records]);
}

/* ── Main Panel ─────────────────────────────────────────── */
export default function AlertsPanel({ onClose, logs = [], records = [] }) {
  const { activePet } = usePet();
  const alerts = useAlerts(activePet, logs, records);

  const criticalCount = alerts.filter(a => a.sev === 'critical').length;
  const warningCount  = alerts.filter(a => a.sev === 'warning').length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 animate-fade-in"
        style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Slide-out panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col animate-slide-in-right"
        style={{
          width: 'min(380px, 100vw)',
          background: 'var(--bg-card)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
          borderLeft: '1px solid var(--border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg,#0d9488,#14b8a6)' }}
        >
          <div className="flex items-center gap-2.5">
            <Bell size={20} className="text-white" />
            <div>
              <h2 className="text-base font-extrabold text-white">Smart Alerts</h2>
              {activePet && (
                <p className="text-xs text-teal-100">{activePet.name}'s health notifications</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#e11d48', color: '#fff' }}>
                {criticalCount} urgent
              </span>
            )}
            <button onClick={onClose} className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Summary bar */}
        <div
          className="flex items-center gap-4 px-5 py-3 text-xs font-semibold"
          style={{ background: '#f8fffe', borderBottom: '1px solid var(--border)' }}
        >
          <span style={{ color: '#e11d48' }}>🔴 {criticalCount} Critical</span>
          <span style={{ color: '#f97316' }}>🟠 {warningCount} Warning</span>
          <span style={{ color: '#64748b' }}>{alerts.length} Total</span>
          {!activePet && <span style={{ color: 'var(--text-muted)' }}>— No pet selected</span>}
        </div>

        {/* Alerts list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!activePet ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">🐾</p>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>No pet selected</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Select a pet to see health alerts.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} onClick={onClose}>
                <Alert {...alert} />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 text-center text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          Alerts auto-generated from your pet's data · Updated live
        </div>
      </div>
    </>
  );
}
