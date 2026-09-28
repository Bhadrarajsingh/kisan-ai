import mongoose from 'mongoose';

const advisorySchema = new mongoose.Schema({
  locationId: {
    type: String,
    required: true,
    index: true,
  },
  cropId: {
    type: String,
    required: true,
    index: true,
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'Elevated', 'High', 'Critical'],
    default: 'Moderate',
  },
  status: {
    type: String,
    enum: ['Favorable for Sowing', 'Wait for Sowing', 'Prepare Irrigation', 'Ensure Field Drainage', 'Watch Dry Spell', 'Optimal Growth'],
    default: 'Favorable for Sowing',
  },
  statusHindi: String,
  messageEnglish: {
    type: String,
    required: true,
  },
  messageHindi: {
    type: String,
    required: true,
  },
  actionItemsEnglish: [String],
  actionItemsHindi: [String],
  uncertaintyDisclaimer: {
    type: String,
    default: 'Note: These advisories are model-based probabilistic estimates and should be supplemented with local KVK guidance and actual soil moisture testing.',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.Advisory || mongoose.model('Advisory', advisorySchema);
