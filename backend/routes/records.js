/**
 * records.js — Express Router
 * ---------------------------
 * CRUD endpoints for the MedicalRecord collection.
 *
 * GET    /api/records?petId=xxx        — list records for a pet
 * GET    /api/records?petId=xxx&status=upcoming — upcoming only
 * GET    /api/records/:id             — get single record
 * POST   /api/records                 — create record
 * PUT    /api/records/:id             — update record
 * DELETE /api/records/:id             — delete record
 */
const express       = require('express');
const router        = express.Router();
const MedicalRecord = require('../models/MedicalRecord');

/* ── GET /api/records ───────────────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const { petId, status, type } = req.query;
    const filter = {};
    if (petId)  filter.petId  = petId;
    if (status) filter.status = status;
    if (type)   filter.type   = type;

    const records = await MedicalRecord.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET /api/records/:id ───────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── POST /api/records ──────────────────────────────────── */
router.post('/', async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);
    const saved  = await record.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ── PUT /api/records/:id ───────────────────────────────── */
router.put('/:id', async (req, res) => {
  try {
    const updated = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ── DELETE /api/records/:id ────────────────────────────── */
router.delete('/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
