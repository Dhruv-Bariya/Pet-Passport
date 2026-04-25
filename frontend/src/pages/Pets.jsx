/**
 * Pets.jsx — /pets page
 * ---------------------
 * Full pet management page:
 *  - Grid of pet cards (avatar, name, species, breed, age, gender)
 *  - "+ Add New Pet" button → AddPetModal
 *  - Edit name button → EditPetNameModal
 *  - Delete pet button with confirmation
 *  - Active pet highlighted with teal ring
 */
import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, PawPrint, Loader2, AlertTriangle } from 'lucide-react';
import { usePet } from '../context/PetContext';
import PetAvatar from '../components/PetAvatar';
import AddPetModal from '../components/AddPetModal';
import EditPetNameModal from '../components/EditPetNameModal';

export default function Pets() {
  const { pets, activePet, setActivePet, deletePet, loading, error } = usePet();
  const [showAdd,    setShowAdd]    = useState(false);
  const [editPet,    setEditPet]    = useState(null);   // pet to rename
  const [confirmDel, setConfirmDel] = useState(null);   // pet to delete
  const [deleting,   setDeleting]   = useState(false);

  const handleDelete = async () => {
    if (!confirmDel) return;
    try {
      setDeleting(true);
      await deletePet(confirmDel._id);
      setConfirmDel(null);
    } catch {
      // error handled by context
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-7 animate-fade-up">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold gradient-text">My Pets</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {pets.length} pet{pets.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          id="add-pet-btn"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg,#0d9488,#14b8a6)' }}
        >
          <PlusCircle size={18} /> Add New Pet
        </button>
      </div>

      {/* ── Loading ─────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={36} className="animate-spin" style={{ color: '#14b8a6' }} />
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────── */}
      {error && !loading && (
        <div className="glass-card p-6 flex items-center gap-4"
          style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <AlertTriangle size={24} style={{ color: '#f97316' }} />
          <div>
            <p className="font-semibold text-sm" style={{ color: '#9a3412' }}>
              Backend not reachable
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#c2410c' }}>
              {error} — Make sure MongoDB and the backend are running.
            </p>
          </div>
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────── */}
      {!loading && !error && pets.length === 0 && (
        <div className="glass-card p-16 text-center animate-fade-in">
          <p className="text-5xl mb-4">🐾</p>
          <p className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
            No pets yet
          </p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Add your first pet to start tracking health, diet, and medical records.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#0d9488,#14b8a6)' }}
          >
            <PlusCircle size={18} /> Add Your First Pet
          </button>
        </div>
      )}

      {/* ── Pet Cards Grid ──────────────────────────────────── */}
      {!loading && pets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pets.map((pet, i) => {
            const isActive = activePet?._id === pet._id;
            return (
              <div
                key={pet._id}
                className="glass-card animate-fade-up p-5 cursor-pointer transition-all"
                style={{
                  animationDelay: `${i * 60}ms`,
                  border: isActive ? '2px solid #14b8a6' : '1px solid var(--border)',
                  boxShadow: isActive
                    ? '0 0 0 4px rgba(20,184,166,0.12), 0 4px 24px rgba(20,184,166,0.15)'
                    : undefined,
                }}
                onClick={() => setActivePet(pet)}
              >
                {/* Active badge */}
                {isActive && (
                  <div className="flex justify-end mb-2">
                    <span className="pill text-[10px]"
                      style={{ background: '#ccfbf1', color: '#0d9488' }}>
                      ✓ Active
                    </span>
                  </div>
                )}

                {/* Avatar + name */}
                <div className="flex flex-col items-center text-center mb-4">
                  <PetAvatar name={pet.name} size={80} />
                  <h2 className="text-xl font-extrabold mt-3 mb-0.5"
                    style={{ color: 'var(--text-primary)' }}>
                    {pet.name}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <span className="pill text-[11px]"
                      style={{ background: '#ccfbf1', color: '#0d9488' }}>
                      {pet.species}
                    </span>
                    <span className="pill text-[11px]"
                      style={{ background: '#ffedd5', color: '#c2410c' }}>
                      {pet.gender}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs mb-5" style={{ color: 'var(--text-secondary)' }}>
                  {pet.breed     && <p>🐕 <span className="font-medium">{pet.breed}</span></p>}
                  {pet.age != null && <p>🎂 <span className="font-medium">{pet.age} years old</span></p>}
                  {pet.color     && <p>🎨 <span className="font-medium">{pet.color}</span></p>}
                  {pet.microchipId && <p>💾 <span className="font-medium">{pet.microchipId}</span></p>}
                  {pet.ownerName && <p>👤 <span className="font-medium">{pet.ownerName}</span></p>}
                </div>

                {/* Actions */}
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setEditPet(pet)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                    style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}
                  >
                    <Pencil size={13} /> Rename
                  </button>
                  <button
                    onClick={() => setConfirmDel(pet)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                    style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add Pet Modal ───────────────────────────────────── */}
      {showAdd && <AddPetModal onClose={() => setShowAdd(false)} />}

      {/* ── Edit Name Modal ─────────────────────────────────── */}
      {editPet && <EditPetNameModal pet={editPet} onClose={() => setEditPet(null)} />}

      {/* ── Delete Confirm Modal ────────────────────────────── */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 animate-fade-in"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}
            onClick={() => setConfirmDel(null)}
          />
          <div className="relative glass-card p-6 w-full max-w-sm z-10 animate-fade-up text-center">
            <p className="text-4xl mb-3">🗑️</p>
            <h3 className="text-lg font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
              Delete {confirmDel.name}?
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              This will permanently delete <strong>{confirmDel.name}</strong> and all their
              logs and medical records. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDel(null)}
                className="flex-1 py-2.5 rounded-2xl text-sm font-semibold border transition-all hover:bg-gray-50"
                style={{ border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg,#e11d48,#f43f5e)' }}
              >
                {deleting ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : '🗑️ Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-20 md:h-0" />
    </div>
  );
}
