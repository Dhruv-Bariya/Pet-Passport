/**
 * petApi.js
 * ---------
 * Axios wrapper for all PetPassport API calls.
 * Base URL points to the Express server (proxied via Vite in dev).
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Pets ───────────────────────────────────────────────────────────────────
export const getPets       = ()         => api.get('/pets');
export const getPetById    = (id)       => api.get(`/pets/${id}`);
export const createPet     = (data)     => api.post('/pets', data);
export const updatePet     = (id, data) => api.put(`/pets/${id}`, data);
export const deletePet     = (id)       => api.delete(`/pets/${id}`);

// Add a single weight entry to a pet's history
export const addWeightEntry = (id, entry) =>
  api.post(`/pets/${id}/weight`, entry);

// ── Daily Logs ─────────────────────────────────────────────────────────────
export const getLogsByPet  = (petId)       => api.get(`/logs?petId=${petId}`);
export const createLog     = (data)        => api.post('/logs', data);
export const updateLog     = (id, data)    => api.put(`/logs/${id}`, data);
export const deleteLog     = (id)          => api.delete(`/logs/${id}`);

// ── Medical Records ────────────────────────────────────────────────────────
export const getRecordsByPet = (petId)    => api.get(`/records?petId=${petId}`);
export const createRecord    = (data)     => api.post('/records', data);
export const updateRecord    = (id, data) => api.put(`/records/${id}`, data);
export const deleteRecord    = (id)       => api.delete(`/records/${id}`);

export default api;
