import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  locationId: {
    type: String,
    unique: true,
    index: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  block: {
    type: String,
    required: true,
  },
  panchayat: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  elevation: Number,
  agroClimaticZone: String,
  geometry: {
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon'],
      default: 'Polygon',
    },
    coordinates: Array,
  },
  soilType: String,
  historicalRainfallAvgMm: Number,
}, { timestamps: true });

export default mongoose.models.Location || mongoose.model('Location', locationSchema);
