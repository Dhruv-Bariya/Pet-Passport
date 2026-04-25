/**
 * MedicalRecord.js — Mongoose Model
 * -----------------------------------
 * Tracks vet visits, vaccines, and surgeries for a pet.
 */
const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    petId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Pet',
      required: [true, 'petId is required'],
      index:    true,
    },
    type: {
      type:     String,
      enum:     ['Vaccine', 'Checkup', 'Surgery'],
      required: [true, 'Record type is required'],
    },
    description: {
      type:     String,
      required: [true, 'Description is required'],
      trim:     true,
    },
    date: {
      type:     Date,
      required: [true, 'Date is required'],
    },
    nextDueDate: {
      type:    Date,
      default: null,
    },
    vet: {
      type:    String,
      default: '',
      trim:    true,
    },
    clinic: {
      type:    String,
      default: '',
      trim:    true,
    },
    // Derived: 'upcoming' if date is in the future, 'completed' if in the past
    // Stored for fast filter queries
    status: {
      type:    String,
      enum:    ['upcoming', 'completed'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

// Auto-set status before saving
medicalRecordSchema.pre('save', function (next) {
  this.status = this.date > new Date() ? 'upcoming' : 'completed';
  next();
});

medicalRecordSchema.index({ petId: 1, date: -1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
