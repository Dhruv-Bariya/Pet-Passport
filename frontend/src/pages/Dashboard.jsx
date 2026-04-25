/**
 * Dashboard.jsx
 * -------------
 * Main summary view — pet profile card, stat cards, weight chart,
 * and a quick-view of the last 3 daily logs.
 *
 * Wired to real MongoDB backend via PetContext + petApi.js.
 * Pencil icon next to pet name opens EditPetNameModal.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO, differenceInDays } from 'date-fns';
import {
  Scale, Syringe, CalendarCheck, ClipboardList,
  ChevronRight, Activity, Pencil, AlertTriangle, Loader2,
} from 'lucide-react';

import { usePet } from '../context/PetContext';
import { getLogsByPet, getRecordsByPet } from '../api/petApi';
import { moodConfig } from '../data/mockData';
import PetAvatar      from '../components/PetAvatar';
import WeightChart    from '../components/WeightChart';
import StatCard       from '../components/StatCard';
import MoodBadge      from '../components/MoodBadge';
import EditPetNameModal from '../components/EditPetNameModal';

/* ── Helpers ─────────────────────────────────────────────── */
function getUpcomingVaccine(records) {
  const upcoming = records
    .filter((r) => r.status === 'upcoming' && r.type === 'Vaccine')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  if (!upcoming.length) return null;
  const days = differenceInDays(parseISO(upcoming[0].date), new Date());
  return { record: upcoming[0], daysLeft: days };
}

function getLatestWeight(history = []) {
  if (!history.length) return null;
  return history[history.length - 1];
}

/* ── Component ───────────────────────────────────────────── */
export default function Dashboard() {
  const { activePet, loading: petLoading, error: petError } = usePet();

  const [logs,      setLogs]      = useState([]);
  const [records,   setRecords]   = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [showEdit,  setShowEdit]  = useState(false);

  /* ── Fetch logs + records when activePet changes ─────── */
  useEffect(() => {
    if (!activePet?._id) { setLogs([]); setRecords([]); return; }
    setDataLoading(true);
    Promise.all([
      getLogsByPet(activePet._id),
      getRecordsByPet(activePet._id),
    ])
      .then(([logsRes, recsRes]) => {
        setLogs(logsRes.data.slice(0, 5));
        setRecords(recsRes.data);
      })
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, [activePet?._id]);

  /* ── Loading / error states ───────────────────────────── */
  if (petLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="animate-spin" style={{ color: '#14b8a6' }} />
      </div>
    );
  }

  if (petError) {
    return (
      <div className="p-8 max-w-lg mx-auto mt-10">
        <div className="glass-card p-6 flex items-center gap-4"
          style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <AlertTriangle size={28} style={{ color: '#f97316' }} />
          <div>
            <p className="font-bold text-sm" style={{ color: '#9a3412' }}>Backend not reachable</p>
            <p className="text-xs mt-1" style={{ color: '#c2410c' }}>
              {petError} — Start MongoDB and run <code>npm run dev</code> in the backend folder.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!activePet) {
    return (
      <div className="p-8 max-w-lg mx-auto mt-10 text-center">
        <div className="glass-card p-12">
          <p className="text-5xl mb-4">🐾</p>
          <p className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>No pet selected</p>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            Go to <strong>My Pets</strong> to add your first pet.
          </p>
          <Link
            to="/pets"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#0d9488,#14b8a6)', textDecoration: 'none' }}
          >
            Manage Pets
          </Link>
        </div>
      </div>
    );
  }

  const latestWeight = getLatestWeight(activePet.weightHistory);
  const nextVaccine  = getUpcomingVaccine(records);
  const recentLog    = logs[0];

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto">

      {/* ── Page header ──────────────────────────────────── */}
      <div className="animate-fade-up mb-7">
        <h1 className="text-2xl md:text-3xl font-extrabold gradient-text">
          Good morning, {activePet.ownerName?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Here's what's happening with {activePet.name} today.
        </p>
      </div>

      {/* ── Pet Profile Card ─────────────────────────────── */}
      <div
        className="glass-card animate-fade-up delay-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,253,250,0.95) 100%)',
        }}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <PetAvatar name={activePet.name} size={100} />
          <span
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: '#14b8a6', border: '2px solid white' }}
          >
            ✓
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-1">
            <h2 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
              {activePet.name}
            </h2>
            {/* Edit Name Button */}
            <button
              onClick={() => setShowEdit(true)}
              title="Rename pet"
              className="w-7 h-7 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{ background: '#f0fdfa', border: '1px solid #99f6e4' }}
            >
              <Pencil size={13} style={{ color: '#0d9488' }} />
            </button>
            <span
              className="pill text-xs"
              style={{ background: '#ccfbf1', color: '#0d9488' }}
            >
              {activePet.species}
            </span>
            <span
              className="pill text-xs"
              style={{ background: '#ffedd5', color: '#c2410c' }}
            >
              {activePet.gender}
            </span>
          </div>
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
            {activePet.breed} · {activePet.age} years old
          </p>

          {/* Quick traits */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            {activePet.color      && <span>🎨 {activePet.color}</span>}
            {activePet.microchipId && <span>💾 {activePet.microchipId}</span>}
            {activePet.ownerName  && <span>👤 {activePet.ownerName}</span>}
          </div>
        </div>

        {/* Current mood from latest log */}
        {recentLog && (
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Today's mood
            </p>
            <MoodBadge mood={recentLog.mood} />
          </div>
        )}
      </div>

      {/* ── Stat Cards Row ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Scale size={20} />}
          label="Current Weight"
          value={latestWeight ? `${latestWeight.weight} kg` : '—'}
          sub={latestWeight ? format(parseISO(latestWeight.date), 'dd MMM yyyy') : ''}
          accentColor="#0d9488"
          bgLight="#ccfbf1"
          delay={0}
        />
        <StatCard
          icon={<Activity size={20} />}
          label="Age"
          value={activePet.age != null ? `${activePet.age} yrs` : '—'}
          sub={activePet.breed || ''}
          accentColor="#f97316"
          bgLight="#ffedd5"
          delay={100}
        />
        <StatCard
          icon={<Syringe size={20} />}
          label="Next Vaccine"
          value={nextVaccine ? `${nextVaccine.daysLeft}d` : 'N/A'}
          sub={nextVaccine ? format(parseISO(nextVaccine.record.date), 'dd MMM yyyy') : 'All up to date'}
          accentColor="#3b82f6"
          bgLight="#dbeafe"
          delay={200}
        />
        <StatCard
          icon={<ClipboardList size={20} />}
          label="Log Entries"
          value={logs.length}
          sub="recent logs"
          accentColor="#8b5cf6"
          bgLight="#ede9fe"
          delay={300}
        />
      </div>

      {/* ── Weight Chart + Recent Logs ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Weight Chart  (3/5 width on lg) */}
        <div className="lg:col-span-3">
          <WeightChart data={activePet.weightHistory || []} />
        </div>

        {/* Recent Logs  (2/5 width on lg) */}
        <div className="lg:col-span-2 glass-card animate-fade-up delay-300 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Recent Logs
            </h3>
            <Link
              to="/logs"
              className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
              style={{ color: '#14b8a6', textDecoration: 'none' }}
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {dataLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 size={24} className="animate-spin" style={{ color: '#14b8a6' }} />
            </div>
          ) : logs.length === 0 ? (
            <p className="text-xs text-center py-6" style={{ color: 'var(--text-muted)' }}>
              No logs yet — <Link to="/logs" style={{ color: '#14b8a6' }}>add one</Link>!
            </p>
          ) : (
            <div className="space-y-3">
              {logs.slice(0, 4).map((log) => (
                <div
                  key={log._id}
                  className="flex items-start gap-3 p-3 rounded-2xl hover:bg-teal-50/60 transition-colors"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <MoodBadge mood={log.mood} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {log.foodIntake?.slice(0, 40)}{log.foodIntake?.length > 40 ? '…' : ''}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {format(parseISO(log.date), 'dd MMM yyyy')}
                      {log.medicationGiven && <span className="ml-2">💊 Med given</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Upcoming Appointments ────────────────────────── */}
      <div className="glass-card animate-fade-up delay-400 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            Upcoming Appointments
          </h3>
          <Link
            to="/records"
            className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ color: '#14b8a6', textDecoration: 'none' }}
          >
            Full Timeline <ChevronRight size={14} />
          </Link>
        </div>

        {dataLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 size={22} className="animate-spin" style={{ color: '#14b8a6' }} />
          </div>
        ) : records.filter(r => r.status === 'upcoming').length === 0 ? (
          <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
            🎉 No upcoming appointments
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {records
              .filter((r) => r.status === 'upcoming')
              .map((rec) => {
                const daysLeft = differenceInDays(parseISO(rec.date), new Date());
                const isUrgent = daysLeft <= 14;
                return (
                  <div
                    key={rec._id}
                    className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{
                      background: isUrgent ? '#fff7ed' : '#f0fdfa',
                      border: `1px solid ${isUrgent ? '#fed7aa' : '#99f6e4'}`,
                    }}
                  >
                    <span className="text-2xl">{rec.type === 'Vaccine' ? '💉' : '🩺'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {rec.type} — {rec.description?.slice(0, 35)}…
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {format(parseISO(rec.date), 'dd MMM yyyy')} · {rec.vet}
                      </p>
                    </div>
                    <span
                      className="pill flex-shrink-0"
                      style={{
                        background: isUrgent ? '#ffedd5' : '#ccfbf1',
                        color: isUrgent ? '#c2410c' : '#0d9488',
                      }}
                    >
                      {daysLeft}d
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Edit name modal */}
      {showEdit && <EditPetNameModal pet={activePet} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
