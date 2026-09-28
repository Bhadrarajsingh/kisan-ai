import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  locationId: {
    type: String,
    required: true,
    index: true,
  },
  locationName: String,
  type: {
    type: String,
    enum: ['monsoon_onset', 'dry_spell', 'heavy_rain', 'rainfall_deficit', 'advisory_update', 'heat_stress'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleHindi: String,
  message: {
    type: String,
    required: true,
  },
  messageHindi: String,
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    default: 'moderate',
  },
  timeframe: {
    type: String,
    default: 'Next 3-7 days',
  },
  metricValue: String, // e.g. "Dry Spell Prob: 68%"
  actionRequired: String,
  actionRequiredHindi: String,
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Alert || mongoose.model('Alert', alertSchema);
