/**
 * logs.js — Express Router
 * ------------------------
 * CRUD endpoints for the DailyLog collection.
 *
 * GET    /api/logs?petId=xxx  — get all logs for a pet (sorted by date desc)
 * GET    /api/logs/:id        — get single log
 * POST   /api/logs            — create log
 * PUT    /api/logs/:id        — update log
 * DELETE /api/logs/:id        — delete log
 */
const express  = require('express');
const router   = express.Router();
const DailyLog = require('../models/DailyLog');
const Pet      = require('../models/Pet');

/* ── GET /api/logs ──────────────────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const { petId, limit = 50, skip = 0 } = req.query;
    const filter = petId ? { petId } : {};
    const logs = await DailyLog.find(filter)
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(Number(skip));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET /api/logs/:id ──────────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const log = await DailyLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── POST /api/logs ─────────────────────────────────────── */
router.post('/', async (req, res) => {
  try {
    const log   = new DailyLog(req.body);
    const saved = await log.save();
    
    // If a weight was included, automatically push it to the pet's weightHistory
    if (req.body.weight !== undefined && req.body.weight !== null && req.body.weight !== '') {
      await Pet.findByIdAndUpdate(req.body.petId, {
        $push: { weightHistory: { date: req.body.date || new Date(), weight: Number(req.body.weight) } }
      });
    }
    
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ── PUT /api/logs/:id ──────────────────────────────────── */
router.put('/:id', async (req, res) => {
  try {
    const updated = await DailyLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Log not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ── DELETE /api/logs/:id ───────────────────────────────── */
router.delete('/:id', async (req, res) => {
  try {
    const log = await DailyLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
