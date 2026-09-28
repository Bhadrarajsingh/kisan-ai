import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
  locationId: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  rainfall: {
    type: Number, // mm in last 24h
    default: 0,
  },
  recentRainfall7d: {
    type: Number,
    default: 0,
  },
  temperature: {
    type: Number, // °C
    required: true,
  },
  tempMin: Number,
  tempMax: Number,
  humidity: {
    type: Number, // %
    required: true,
  },
  windSpeed: {
    type: Number, // km/h
    default: 0,
  },
  pressure: {
    type: Number, // hPa
    default: 1013,
  },
  soilMoisture: {
    type: Number, // %
    default: 45,
  },
  evapotranspiration: Number,
  condition: {
    type: String,
    default: 'Partly Cloudy',
  },
}, { timestamps: true });

export default mongoose.models.Weather || mongoose.model('Weather', weatherSchema);
