/**
 * MedicalRecords.jsx — wired to MongoDB via PetContext + petApi
 */
import React, { useState, useEffect } from 'react';
import { format, parseISO, differenceInDays, isFuture } from 'date-fns';
import { PlusCircle, X, CheckCircle, Syringe, Stethoscope, Microscope, Loader2, AlertTriangle } from 'lucide-react';
import { usePet } from '../context/PetContext';
import { getRecordsByPet, createRecord, deleteRecord } from '../api/petApi';
import { recordTypeConfig } from '../data/mockData';

const TypeIcon = ({ type, size = 18 }) => {
  if (type === 'Vaccine') return <Syringe size={size} />;
  if (type === 'Surgery') return <Microscope size={size} />;
  return <Stethoscope size={size} />;
};

const emptyForm = { type: 'Vaccine', description: '', date: '', nextDueDate: '', vet: '', clinic: '' };
const inputSt = { border: '1.5px solid var(--border)', background: '#f8fffe', color: 'var(--text-primary)' };
const labelSt = { color: 'var(--text-muted)' };

export default function MedicalRecords() {
  const { activePet } = usePet();
  const [records,    setRecords]   = useState([]);
  const [loading,    setLoading]   = useState(false);
  const [submitting, setSubmitting]= useState(false);
  const [error,      setError]     = useState('');
  const [showForm,   setShowForm]  = useState(false);
  const [form,       setForm]      = useState(emptyForm);
  const [saved,      setSaved]     = useState(false);
  const [filterType, setFilter]    = useState('All');

  useEffect(() => {
    if (!activePet?._id) { setRecords([]); return; }
    setLoading(true); setError('');
    getRecordsByPet(activePet._id)
      .then(r => setRecords(r.data.sort((a, b) => new Date(b.date) - new Date(a.date))))
      .catch(e => setError(e?.response?.data?.message || 'Failed to load records.'))
      .finally(() => setLoading(false));
  }, [activePet?._id]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activePet?._id) return;
    try {
      setSubmitting(true);
      const payload = { ...form, petId: activePet._id, status: isFuture(new Date(form.date)) ? 'upcoming' : 'completed' };
      const res = await createRecord(payload);
      setRecords(prev => [res.data, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
      setForm(emptyForm); setShowForm(false);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to save record.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteRecord(id); setRecords(prev => prev.filter(r => r._id !== id)); }
    catch (e) { setError(e?.response?.data?.message || 'Failed to delete.'); }
  };

  if (!activePet) return (
    <div className="p-8 max-w-lg mx-auto mt-10 text-center">
      <div className="glass-card p-12">
        <p className="text-5xl mb-4">🩺</p>
        <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>No pet selected</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Select a pet from the sidebar.</p>
      </div>
    </div>
  );

  const displayed = filterType === 'All' ? records : records.filter(r => r.type === filterType);
  const upcoming  = records.filter(r => r.status === 'upcoming');
  const completed = records.filter(r => r.status === 'completed');

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-7 animate-fade-up">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold gradient-text">Medical Records</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {activePet.name} · {upcoming.length} upcoming · {completed.length} completed
          </p>
        </div>
        <button id="add-appointment-btn" onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg,#0d9488,#14b8a6)' }}>
          <PlusCircle size={18} /> Add Record
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
          <span className="text-sm font-semibold" style={{ color: '#0d9488' }}>Record added!</span>
        </div>
      )}

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap mb-6 animate-fade-up delay-100">
        {['All', 'Vaccine', 'Checkup', 'Surgery'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="pill cursor-pointer transition-all hover:opacity-80"
            style={{ background: filterType === f ? '#14b8a6' : '#e2f8f5', color: filterType === f ? '#fff' : '#0d9488', fontWeight: 600, fontSize: '0.75rem', padding: '6px 14px' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 animate-fade-in" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)} />
          <form id="medical-record-form" onSubmit={handleSubmit} className="relative glass-card p-6 w-full max-w-lg z-10 animate-fade-up overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100">
              <X size={18} style={{ color: 'var(--text-muted)' }} />
            </button>
            <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>New Medical Record — {activePet.name}</h2>

            <label className="block mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={labelSt}>Record Type</span>
              <select name="type" value={form.type} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl text-sm border" style={inputSt}>
                <option value="Vaccine">💉 Vaccine</option>
                <option value="Checkup">🩺 Checkup</option>
                <option value="Surgery">🔬 Surgery</option>
              </select>
            </label>
            <label className="block mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={labelSt}>Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the visit…" required rows={3} className="w-full px-4 py-3 rounded-2xl text-sm border resize-none" style={inputSt} />
            </label>
            <label className="block mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={labelSt}>Date</span>
              <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full px-4 py-3 rounded-2xl text-sm border" style={inputSt} />
            </label>
            <label className="block mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={labelSt}>Next Due Date (optional)</span>
              <input type="date" name="nextDueDate" value={form.nextDueDate} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl text-sm border" style={inputSt} />
            </label>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={labelSt}>Vet Name</span>
                <input type="text" name="vet" value={form.vet} onChange={handleChange} placeholder="Dr. Name" className="w-full px-4 py-3 rounded-2xl text-sm border" style={inputSt} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider mb-1 block" style={labelSt}>Clinic</span>
                <input type="text" name="clinic" value={form.clinic} onChange={handleChange} placeholder="Clinic name" className="w-full px-4 py-3 rounded-2xl text-sm border" style={inputSt} />
              </label>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-2xl text-sm font-semibold border hover:bg-gray-50 transition-all" style={{ border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70 transition-all" style={{ background: 'linear-gradient(135deg,#0d9488,#14b8a6)' }}>
                {submitting ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={36} className="animate-spin" style={{ color: '#14b8a6' }} /></div>
      ) : (
        <div className="relative">
          {displayed.map((rec, i) => {
            const cfg = recordTypeConfig[rec.type] || recordTypeConfig.Checkup;
            const isUpcoming = rec.status === 'upcoming';
            const daysLeft = isUpcoming ? differenceInDays(parseISO(rec.date), new Date()) : null;
            return (
              <div key={rec._id} className="relative flex gap-5 mb-6 animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                {i < displayed.length - 1 && (
                  <div className="absolute" style={{ left: '19px', top: '40px', bottom: '-24px', width: '2px', background: 'linear-gradient(to bottom, var(--teal-400), rgba(20,184,166,0.1))' }} />
                )}
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10"
                  style={{ background: isUpcoming ? cfg.bg : '#f1f5f9', color: isUpcoming ? cfg.color : '#94a3b8', border: `2px solid ${isUpcoming ? cfg.color : 'transparent'}`, boxShadow: isUpcoming ? `0 0 0 4px ${cfg.bg}` : 'none' }}>
                  <TypeIcon type={rec.type} size={16} />
                </div>
                <div className="flex-1 glass-card p-4" style={{ border: isUpcoming ? `1.5px solid ${cfg.color}33` : '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="pill text-xs" style={{ background: cfg.bg, color: cfg.color }}>{cfg.icon} {rec.type}</span>
                        <span className="pill text-xs" style={{ background: isUpcoming ? '#fff7ed' : '#f0fdf4', color: isUpcoming ? '#c2410c' : '#16a34a' }}>
                          {isUpcoming ? '🔔 Upcoming' : '✅ Completed'}
                        </span>
                        {isUpcoming && <span className="pill text-xs font-bold" style={{ background: '#ffedd5', color: '#c2410c' }}>{daysLeft >= 0 ? `in ${daysLeft}d` : 'overdue'}</span>}
                      </div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{rec.description}</p>
                      <p className="text-xs mt-1.5 space-x-2" style={{ color: 'var(--text-muted)' }}>
                        <span>📅 {format(parseISO(rec.date), 'dd MMM yyyy')}</span>
                        {rec.vet    && <span>· 👨‍⚕️ {rec.vet}</span>}
                        {rec.clinic && <span>· 🏥 {rec.clinic}</span>}
                      </p>
                      {rec.nextDueDate && <p className="text-xs mt-1" style={{ color: '#0d9488' }}>🔁 Next due: {format(parseISO(rec.nextDueDate), 'dd MMM yyyy')}</p>}
                    </div>
                    <button onClick={() => handleDelete(rec._id)} className="p-1.5 rounded-xl hover:bg-red-50 transition-colors flex-shrink-0" title="Remove record">
                      <X size={15} style={{ color: '#f87171' }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {displayed.length === 0 && (
            <div className="glass-card p-10 text-center animate-fade-in">
              <p className="text-4xl mb-3">🩺</p>
              <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>No records found</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Add your pet's first medical record.</p>
            </div>
          )}
        </div>
      )}
      <div className="h-20 md:h-0" />
    </div>
  );
}
