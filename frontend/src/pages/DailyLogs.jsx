/**
 * DailyLogs.jsx — wired to MongoDB via PetContext + petApi
 */
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { PlusCircle, X, CheckCircle, Utensils, Heart, Pill, Loader2, AlertTriangle } from 'lucide-react';
import { usePet } from '../context/PetContext';
import { getLogsByPet, createLog, deleteLog } from '../api/petApi';
import { moodConfig } from '../data/mockData';
import MoodBadge from '../components/MoodBadge';

const moodOptions = Object.entries(moodConfig).map(([value, cfg]) => ({
  value, label: `${cfg.emoji} ${cfg.label}`,
}));

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  foodIntake: '', mood: 'happy', medicationGiven: false, notes: '',
};

const inputSt = { border: '1.5px solid var(--border)', background: '#f8fffe', color: 'var(--text-primary)' };

export default function DailyLogs() {
  const { activePet } = usePet();
  const [logs,       setLogs]       = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [form,       setForm]       = useState(emptyForm);
  const [saved,      setSaved]      = useState(false);

  useEffect(() => {
    if (!activePet?._id) { setLogs([]); return; }
    setLoading(true); setError('');
    getLogsByPet(activePet._id)
      .then(r => setLogs(r.data))
      .catch(e => setError(e?.response?.data?.message || 'Failed to load logs.'))
      .finally(() => setLoading(false));
  }, [activePet?._id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activePet?._id) return;
    try {
      setSubmitting(true);
      const res = await createLog({ ...form, petId: activePet._id });
      setLogs(prev => [res.data, ...prev]);
      setForm(emptyForm); setShowForm(false);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to save log.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteLog(id); setLogs(prev => prev.filter(l => l._id !== id)); }
    catch (e) { setError(e?.response?.data?.message || 'Failed to delete.'); }
  };

  if (!activePet) return (
    <div className="p-8 max-w-lg mx-auto mt-10 text-center">
      <div className="glass-card p-12">
        <p className="text-5xl mb-4">📋</p>
        <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>No pet selected</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Select a pet from the sidebar.</p>
      </div>
    </div>
  );

  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-7 animate-fade-up">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold gradient-text">Daily Logs</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{activePet.name}'s food, mood &amp; meds.</p>
        </div>
        <button id="add-log-btn" onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg,#0d9488,#14b8a6)' }}>
          <PlusCircle size={18} /> Add Log
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-5" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <AlertTriangle size={18} style={{ color: '#f97316' }} />
          <span className="text-sm font-medium flex-1" style={{ color: '#c2410c' }}>{error}</span>
          <button onClick={() => setError('')}><X size={16} style={{ color: '#c2410c' }} /></button>
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-5 animate-fade-up" style={{ background: '#ccfbf1', border: '1px solid #99f6e4' }}>
          <CheckCircle size={20} style={{ color: '#0d9488' }} />
          <span className="text-sm font-semibold" style={{ color: '#0d9488' }}>Log saved!</span>
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 animate-fade-in" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)} />
          <form id="daily-log-form" onSubmit={handleSubmit} className="relative glass-card p-6 w-full max-w-lg z-10 animate-fade-up">
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100">
              <X size={18} style={{ color: 'var(--text-muted)' }} />
            </button>
            <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>New Daily Log — {activePet.name}</h2>

            <label className="block mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--text-muted)' }}>Date</span>
              <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full px-4 py-3 rounded-2xl text-sm border" style={inputSt} />
            </label>
            <label className="block mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Utensils size={12} /> Food Intake</span>
              <textarea name="foodIntake" value={form.foodIntake} onChange={handleChange} placeholder="e.g. Royal Canin — 300g x2" required rows={2} className="w-full px-4 py-3 rounded-2xl text-sm border resize-none" style={inputSt} />
            </label>
            <label className="block mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Heart size={12} /> Mood</span>
              <select name="mood" value={form.mood} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl text-sm border cursor-pointer" style={inputSt}>
                {moodOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <div className="relative">
                <input type="checkbox" name="medicationGiven" checked={form.medicationGiven} onChange={handleChange} className="sr-only" />
                <div className="w-11 h-6 rounded-full transition-colors" style={{ background: form.medicationGiven ? '#14b8a6' : '#d1d5db' }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" style={{ transform: form.medicationGiven ? 'translateX(21px)' : 'translateX(2px)' }} />
                </div>
              </div>
              <span className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}><Pill size={14} /> Medication given today</span>
            </label>
            <label className="block mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--text-muted)' }}>Notes (optional)</span>
              <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any observations…" rows={2} className="w-full px-4 py-3 rounded-2xl text-sm border resize-none" style={inputSt} />
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-2xl text-sm font-semibold border hover:bg-gray-50 transition-all" style={{ border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70 transition-all" style={{ background: 'linear-gradient(135deg,#0d9488,#14b8a6)' }}>
                {submitting ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : 'Save Log'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── List ────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={36} className="animate-spin" style={{ color: '#14b8a6' }} /></div>
      ) : (
        <div className="space-y-4">
          {logs.map((log, i) => (
            <div key={log._id} className="glass-card animate-fade-up p-5" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-14 rounded-2xl text-center" style={{ background: '#ccfbf1' }}>
                  <span className="text-xs font-bold" style={{ color: '#0d9488' }}>{format(parseISO(log.date), 'MMM')}</span>
                  <span className="text-xl font-extrabold leading-none" style={{ color: '#0d9488' }}>{format(parseISO(log.date), 'dd')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <MoodBadge mood={log.mood} />
                    {log.medicationGiven && <span className="pill" style={{ background: '#ede9fe', color: '#7c3aed' }}>💊 Med given</span>}
                  </div>
                  <p className="text-sm font-semibold mb-1 flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                    <Utensils size={13} style={{ color: '#14b8a6' }} />{log.foodIntake}
                  </p>
                  {log.notes && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>📝 {log.notes}</p>}
                </div>
                <button onClick={() => handleDelete(log._id)} className="flex-shrink-0 p-1.5 rounded-xl hover:bg-red-50 transition-colors" title="Delete log">
                  <X size={16} style={{ color: '#f87171' }} />
                </button>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="glass-card p-10 text-center animate-fade-in">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>No logs yet</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Tap "Add Log" to get started.</p>
            </div>
          )}
        </div>
      )}
      <div className="h-20 md:h-0" />
    </div>
  );
}
