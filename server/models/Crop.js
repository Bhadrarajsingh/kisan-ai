import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  cropId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  hindiName: String,
  category: {
    type: String,
    enum: ['Kharif', 'Rabi', 'Zaid', 'Cash Crop'],
    default: 'Kharif',
  },
  sowingRainRequirement: {
    minMm: Number, // e.g. 50-75mm cumulative
    description: String,
  },
  drySpellTolerance: {
    maxDays: Number, // days before stress
    criticalStage: String,
  },
  heavyRainThreshold: {
    maxDailyMm: Number, // mm per day
    drainageSensitivity: String,
  },
  optimalTempRange: {
    min: Number,
    max: Number,
  },
  sowingWindow: {
    startMonth: String,
    endMonth: String,
  },
  soilMoistureOptimal: {
    min: Number,
    max: Number,
  },
  icon: String,
  description: String,
}, { timestamps: true });

export default mongoose.models.Crop || mongoose.model('Crop', cropSchema);
