import mongoose from 'mongoose';

const forecastSchema = new mongoose.Schema({
  locationId: {
    type: String,
    required: true,
    index: true,
  },
  forecastDate: {
    type: Date,
    default: Date.now,
  },
  horizon: {
    type: String,
    enum: ['7d', '14d', '21d', '30d'],
    default: '7d',
  },
  onsetProbability: {
    type: Number, // 0-100%
    required: true,
  },
  drySpellProbability: {
    type: Number, // 0-100%
    required: true,
  },
  heavyRainProbability: {
    type: Number, // 0-100%
    required: true,
  },
  confidence: {
    type: Number, // 0-100%
    required: true,
  },
  confidenceLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  expectedRainfallMm: Number,
  timeline: [{
    day: String,
    date: String,
    rainfallProb: Number,
    expectedRainfallMm: Number,
    tempMax: Number,
    tempMin: Number,
    humidity: Number,
    drySpellRisk: Number,
    heavyRainRisk: Number,
    condition: String,
  }],
  uncertaintyRange: {
    rainfallMinMm: Number,
    rainfallMaxMm: Number,
  },
}, { timestamps: true });

export default mongoose.models.Forecast || mongoose.model('Forecast', forecastSchema);
