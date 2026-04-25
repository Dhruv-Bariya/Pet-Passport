/**
 * DailyLog.js — Mongoose Model
 * ----------------------------
 * Stores a single day's food, mood, and medication data for a pet.
 */
const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema(
  {
    petId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Pet',
      required: [true, 'petId is required'],
      index:    true,
    },
    date: {
      type:    Date,
      default: Date.now,
      index:   true,
    },
    foodIntake: {
      type:     String,
      required: [true, 'Food intake description is required'],
      trim:     true,
    },
    mood: {
      type:    String,
      enum:    ['happy', 'energetic', 'lethargic', 'anxious', 'sick'],
      default: 'happy',
    },
    medicationGiven: {
      type:    Boolean,
      default: false,
    },
    notes: {
      type:    String,
      default: '',
      trim:    true,
    },
  },
  { timestamps: true }
);

// Compound index — quickly fetch all logs for a pet sorted by date
dailyLogSchema.index({ petId: 1, date: -1 });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
