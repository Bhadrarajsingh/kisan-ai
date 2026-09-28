import mongoose from 'mongoose';

const climateIndexSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  enso: {
    status: {
      type: String,
      enum: ['El Niño', 'La Niña', 'Neutral'],
      default: 'Neutral',
    },
    index: {
      type: Number, // ONI index (e.g. -0.4)
      default: -0.4,
    },
    description: String,
  },
  iod: {
    status: {
      type: String,
      enum: ['Positive', 'Negative', 'Neutral'],
      default: 'Positive',
    },
    index: {
      type: Number, // DMI index (e.g. +0.5)
      default: 0.5,
    },
    description: String,
  },
  mjoPhase: {
    type: Number, // Phase 1-8
    default: 4,
  },
  mjoAmplitude: {
    type: Number,
    default: 1.2,
  },
  mjoStatus: {
    type: String,
    default: 'Active over Maritime Continent / Bay of Bengal',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ClimateIndex || mongoose.model('ClimateIndex', climateIndexSchema);
