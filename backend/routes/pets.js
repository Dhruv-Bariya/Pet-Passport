/**
 * pets.js — Express Router
 * ------------------------
 * CRUD endpoints for the Pet collection.
 *
 * GET    /api/pets          — list all pets
 * GET    /api/pets/:id      — get single pet
 * POST   /api/pets          — create pet
 * PUT    /api/pets/:id      — update pet
 * DELETE /api/pets/:id      — delete pet (cascades to logs & records)
 * POST   /api/pets/:id/weight — push a new weight entry
 */
const express = require('express');
const router  = express.Router();
const Pet          = require('../models/Pet');
const DailyLog     = require('../models/DailyLog');
const MedicalRecord = require('../models/MedicalRecord');

/* ── GET /api/pets ──────────────────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET /api/pets/:id ──────────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── POST /api/pets ─────────────────────────────────────── */
router.post('/', async (req, res) => {
  try {
    const pet = new Pet(req.body);
    const saved = await pet.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ── PUT /api/pets/:id ──────────────────────────────────── */
router.put('/:id', async (req, res) => {
  try {
    const updated = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Pet not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ── DELETE /api/pets/:id ───────────────────────────────── */
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    // Cascade delete related documents
    await Promise.all([
      DailyLog.deleteMany({ petId: req.params.id }),
      MedicalRecord.deleteMany({ petId: req.params.id }),
    ]);

    res.json({ message: 'Pet and all related data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── POST /api/pets/:id/weight ──────────────────────────── */
router.post('/:id/weight', async (req, res) => {
  try {
    const { date, weight } = req.body;
    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      { $push: { weightHistory: { date, weight } } },
      { new: true, runValidators: true }
    );
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
