/**
 * AddPetModal.jsx
 * ---------------
 * Full-screen modal form to add a new pet with all details.
 * Calls createPet() from PetContext on submit.
 */
import React, { useState } from 'react';
import { X, PawPrint, Loader2, CheckCircle } from 'lucide-react';
import { usePet } from '../context/PetContext';
import PetAvatar from './PetAvatar';

const SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];
const GENDERS = ['Male', 'Female', 'Unknown'];

const emptyForm = {
  name:        '',
  species:     'Dog',
  breed:       '',
  age:         '',
  gender:      'Unknown',
  color:       '',
  microchipId: '',
  ownerName:   '',
};

export default function AddPetModal({ onClose }) {
  const { createPet } = usePet();
  const [form,    setForm]    = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err,     setErr]     = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.name.trim())      return setErr('Pet name is required.');
    if (!form.ownerName.trim()) return setErr('Owner name is required.');
    try {
      setLoading(true);
      await createPet({
        ...form,
        age: form.age !== '' ? Number(form.age) : undefined,
      });
      setSuccess(true);
      setTimeout(() => onClose(), 1200);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to add pet. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    border: '1.5px solid var(--border)',
    background: '#f8fffe',
    color: 'var(--text-primary)',
    borderRadius: '14px',
    padding: '10px 16px',
    fontSize: '0.875rem',
    width: '100%',
    transition: 'box-shadow 0.2s',
  };

  const Label = ({ children }) => (
    <span className="block text-xs font-semibold uppercase tracking-wider mb-1"
      style={{ color: 'var(--text-muted)' }}>{children}</span>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative glass-card w-full max-w-lg z-10 animate-fade-up overflow-y-auto"
        style={{ maxHeight: '92vh' }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-6 py-4 rounded-t-3xl z-10"
          style={{
            background: 'linear-gradient(135deg,#0d9488,#14b8a6)',
          }}
        >
          <div className="flex items-center gap-3">
            <PawPrint size={22} className="text-white" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">Add New Pet</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Avatar preview */}
          <div className="flex justify-center mb-2">
            <PetAvatar name={form.name || '?'} size={72} />
          </div>

          {/* Error */}
          {err && (
            <div className="p-3 rounded-2xl text-sm font-medium"
              style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' }}>
              ⚠️ {err}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-2xl text-sm font-semibold"
              style={{ background: '#ccfbf1', color: '#0d9488' }}>
              <CheckCircle size={18} /> Pet added successfully!
            </div>
          )}

          {/* Name */}
          <div>
            <Label>Pet Name *</Label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Biscuit" required style={inputStyle} />
          </div>

          {/* Species + Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Species *</Label>
              <select name="species" value={form.species} onChange={handleChange} style={inputStyle}>
                {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <Label>Gender</Label>
              <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Breed + Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Breed</Label>
              <input name="breed" value={form.breed} onChange={handleChange}
                placeholder="e.g. Golden Retriever" style={inputStyle} />
            </div>
            <div>
              <Label>Age (years)</Label>
              <input name="age" value={form.age} onChange={handleChange}
                type="number" min="0" max="100" placeholder="e.g. 3" style={inputStyle} />
            </div>
          </div>

          {/* Color */}
          <div>
            <Label>Color / Coat</Label>
            <input name="color" value={form.color} onChange={handleChange}
              placeholder="e.g. Golden, Black & White" style={inputStyle} />
          </div>

          {/* Microchip */}
          <div>
            <Label>Microchip ID</Label>
            <input name="microchipId" value={form.microchipId} onChange={handleChange}
              placeholder="e.g. MC-2024-00123" style={inputStyle} />
          </div>

          {/* Owner */}
          <div>
            <Label>Owner Name *</Label>
            <input name="ownerName" value={form.ownerName} onChange={handleChange}
              placeholder="e.g. Alex Johnson" required style={inputStyle} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold border transition-all hover:bg-gray-50"
              style={{ border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg,#0d9488,#14b8a6)' }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : '🐾 Add Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
