/**
 * PetContext.jsx
 * --------------
 * Global React context that holds:
 *  - pets[]        — full list from the DB
 *  - activePet     — currently selected pet
 *  - setActivePet  — switch the active pet
 *  - refreshPets() — re-fetch from API
 *  - createPet()   — POST → DB → refresh
 *  - updatePet()   — PUT  → DB → refresh + sync activePet
 *  - deletePet()   — DELETE → DB → refresh
 *  - loading / error state
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getPets, createPet as apiCreate, updatePet as apiUpdate, deletePet as apiDelete } from '../api/petApi';

const PetContext = createContext(null);

export function PetProvider({ children }) {
  const [pets,       setPets]       = useState([]);
  const [activePet,  setActivePet]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  /* ── Fetch all pets ───────────────────────────────────── */
  const refreshPets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getPets();
      setPets(data);
      // Keep activePet in sync: if it already exists keep it, else pick first
      setActivePet(prev => {
        if (!data.length) return null;
        if (prev) {
          const stillExists = data.find(p => p._id === prev._id);
          return stillExists || data[0];
        }
        return data[0];
      });
    } catch (err) {
      console.error('PetContext: failed to load pets', err);
      setError(err?.response?.data?.message || 'Could not load pets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshPets(); }, [refreshPets]);

  /* ── Create ───────────────────────────────────────────── */
  const createPet = useCallback(async (formData) => {
    const { data } = await apiCreate(formData);
    await refreshPets();
    setActivePet(data);
    return data;
  }, [refreshPets]);

  /* ── Update ───────────────────────────────────────────── */
  const updatePet = useCallback(async (id, formData) => {
    const { data } = await apiUpdate(id, formData);
    setPets(prev => prev.map(p => p._id === id ? data : p));
    setActivePet(prev => prev?._id === id ? data : prev);
    return data;
  }, []);

  /* ── Delete ───────────────────────────────────────────── */
  const deletePet = useCallback(async (id) => {
    await apiDelete(id);
    await refreshPets();
  }, [refreshPets]);

  return (
    <PetContext.Provider value={{
      pets, activePet, setActivePet,
      loading, error,
      refreshPets, createPet, updatePet, deletePet,
    }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePet() {
  const ctx = useContext(PetContext);
  if (!ctx) throw new Error('usePet must be used inside <PetProvider>');
  return ctx;
}
