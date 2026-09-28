import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  farmerId: {
    type: String,
    required: true,
    default: 'usr-kisan-101',
  },
  farmerName: {
    type: String,
    required: true,
    default: 'Ramesh Patel',
  },
  farmerPhone: {
    type: String,
    default: '9876543210',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  hindiName: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Grains', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Spices', 'Dairy', 'Other'],
    default: 'Grains',
  },
  variety: {
    type: String,
    trim: true,
    default: 'Desi / Local Variety',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unit: {
    type: String,
    enum: ['kg', 'quintal', 'ton'],
    default: 'kg',
  },
  expectedPrice: {
    type: Number,
    required: true,
  },
  minOrderQuantity: {
    type: Number,
    default: 50,
  },
  negotiable: {
    type: Boolean,
    default: true,
  },
  qualityGrade: {
    type: String,
    enum: ['Grade A (Premium)', 'Grade B (Standard)', 'Grade C (Fair)'],
    default: 'Grade A (Premium)',
  },
  moisturePercent: {
    type: Number,
    default: 11.5,
  },
  organicStatus: {
    type: String,
    enum: ['Certified Organic', 'Naturally Grown (No Chemicals)', 'Conventional'],
    default: 'Naturally Grown (No Chemicals)',
  },
  harvestDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  location: {
    state: { type: String, default: 'Rajasthan' },
    district: { type: String, default: 'Jaipur' },
    block: { type: String, default: 'Chomu' },
    village: { type: String, default: 'Morija' },
  },
  images: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['active', 'pending_offer', 'sold', 'unlisted'],
    default: 'active',
  },
  aiVerification: {
    isVerified: { type: Boolean, default: true },
    confidence: { type: Number, default: 94 },
    detectedCategory: { type: String, default: 'Grains' },
    qualityIndicator: { type: String, default: 'Clean, mature grains with low visual foreign matter' },
    suggestedDescription: { type: String, default: 'Freshly harvested produce with optimal moisture profile.' },
    disclaimer: { type: String, default: 'AI visual indicator only; does not replace laboratory certified analysis.' }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
