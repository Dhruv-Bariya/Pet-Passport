/**
 * EditPetNameModal.jsx
 * --------------------
 * Lightweight modal to rename the active pet.
 * Calls updatePet() from PetContext on save.
 */
import React, { useState } from 'react';
import { X, Pencil, Loader2, CheckCircle } from 'lucide-react';
import { usePet } from '../context/PetContext';

export default function EditPetNameModal({ pet, onClose }) {
  const { updatePet } = usePet();
  const [name,    setName]    = useState(pet?.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err,     setErr]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setErr('Name cannot be empty.');
    if (name.trim() === pet.name) return onClose();
    setErr('');
    try {
      setLoading(true);
      await updatePet(pet._id, { name: name.trim() });
      setSuccess(true);
      setTimeout(() => onClose(), 900);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to update name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative glass-card p-6 w-full max-w-sm z-10 animate-fade-up"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <X size={18} style={{ color: 'var(--text-muted)' }} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#ccfbf1' }}>
            <Pencil size={16} style={{ color: '#0d9488' }} />
          </div>
          <h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Rename Pet
          </h2>
        </div>

        {/* Error */}
        {err && (
          <div className="mb-4 p-3 rounded-2xl text-sm font-medium"
            style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' }}>
            ⚠️ {err}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-2xl text-sm font-semibold"
            style={{ background: '#ccfbf1', color: '#0d9488' }}>
            <CheckCircle size={16} /> Name updated!
          </div>
        )}

        {/* Input */}
        <label className="block mb-5">
          <span className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--text-muted)' }}>New Name</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter pet name…"
            autoFocus
            required
            className="w-full px-4 py-3 rounded-2xl text-sm font-medium border transition-all"
            style={{
              border: '1.5px solid var(--border)',
              background: '#f8fffe',
              color: 'var(--text-primary)',
            }}
          />
        </label>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold border transition-all hover:bg-gray-50"
            style={{ border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || success}
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-1.5 transition-all hover:opacity-90 disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg,#0d9488,#14b8a6)' }}
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : '✓ Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
