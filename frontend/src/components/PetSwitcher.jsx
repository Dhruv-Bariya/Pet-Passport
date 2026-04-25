/**
 * PetSwitcher.jsx
 * ---------------
 * Dropdown embedded in the Sidebar to switch the active pet.
 * Shows a "+ Add Pet" button that opens AddPetModal.
 */
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, PlusCircle, Check } from 'lucide-react';
import { usePet } from '../context/PetContext';
import PetAvatar from './PetAvatar';
import AddPetModal from './AddPetModal';

export default function PetSwitcher({ collapsed }) {
  const { pets, activePet, setActivePet, loading } = usePet();
  const [open,    setOpen]    = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (loading) {
    return (
      <div className="mx-2 my-3 px-3 py-2 rounded-2xl animate-pulse"
        style={{ background: 'rgba(255,255,255,0.06)', height: 48 }} />
    );
  }

  return (
    <>
      <div ref={ref} className="relative mx-2 my-2">
        {/* Trigger */}
        <button
          onClick={() => setOpen(o => !o)}
          title={collapsed ? (activePet?.name || 'Select pet') : undefined}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl transition-all hover:bg-white/8 group"
          style={{
            background: open ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <PetAvatar name={activePet?.name || '?'} size={28} />
          {!collapsed && (
            <>
              <span className="flex-1 text-left min-w-0">
                <span className="block text-xs font-semibold truncate" style={{ color: '#e2fdf9' }}>
                  {activePet?.name || 'No pet selected'}
                </span>
                <span className="block text-[10px] truncate" style={{ color: '#5eead4' }}>
                  {activePet?.species || ''}
                </span>
              </span>
              <ChevronDown
                size={14}
                className={`flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                style={{ color: '#5eead4' }}
              />
            </>
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute left-0 right-0 z-50 mt-1 rounded-2xl overflow-hidden animate-fade-up"
            style={{
              background: '#1e3a36',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              minWidth: collapsed ? 180 : undefined,
              left: collapsed ? '100%' : 0,
              marginLeft: collapsed ? 8 : 0,
              top: collapsed ? 0 : undefined,
            }}
          >
            {pets.length === 0 && (
              <p className="px-4 py-3 text-xs" style={{ color: '#5eead4' }}>No pets yet.</p>
            )}
            {pets.map(pet => (
              <button
                key={pet._id}
                onClick={() => { setActivePet(pet); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-white/8 text-left"
              >
                <PetAvatar name={pet.name} size={24} />
                <span className="flex-1 min-w-0">
                  <span className="block text-xs font-semibold truncate" style={{ color: '#e2fdf9' }}>
                    {pet.name}
                  </span>
                  <span className="block text-[10px]" style={{ color: '#5eead4' }}>
                    {pet.species} · {pet.breed || 'Unknown breed'}
                  </span>
                </span>
                {activePet?._id === pet._id && (
                  <Check size={14} style={{ color: '#2dd4bf', flexShrink: 0 }} />
                )}
              </button>
            ))}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => { setOpen(false); setShowAdd(true); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-white/8"
              >
                <PlusCircle size={16} style={{ color: '#2dd4bf', flexShrink: 0 }} />
                <span className="text-xs font-semibold" style={{ color: '#2dd4bf' }}>Add New Pet</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {showAdd && <AddPetModal onClose={() => setShowAdd(false)} />}
    </>
  );
}
