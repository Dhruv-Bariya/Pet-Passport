/**
 * Pet.js — Mongoose Model
 * -----------------------
 * Represents a pet profile in the database.
 * Includes embedded weightHistory subdocuments.
 */
const mongoose = require('mongoose');

/* ── Subdocument: Weight Entry ──────────────────────────── */
const weightEntrySchema = new mongoose.Schema(
  {
    date:   { type: Date,   required: true, default: Date.now },
    weight: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

/* ── Main Schema ─────────────────────────────────────────── */
const petSchema = new mongoose.Schema(
  {
    name:    { type: String, required: [true, 'Pet name is required'], trim: true },
    species: {
      type: String,
      required: true,
      enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'],
      default: 'Dog',
    },
    breed:         { type: String, trim: true, default: '' },
    age:           { type: Number, min: 0, max: 100 },
    gender:        { type: String, enum: ['Male', 'Female', 'Unknown'], default: 'Unknown' },
    color:         { type: String, default: '' },
    microchipId:   { type: String, default: '' },
    ownerName:     { type: String, required: true, trim: true },
    avatarUrl:     { type: String, default: '' },           // S3 / Cloudinary URL
    weightHistory: { type: [weightEntrySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pet', petSchema);
