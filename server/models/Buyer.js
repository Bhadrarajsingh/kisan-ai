import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  contactPerson: {
    type: String,
    trim: true,
  },
  buyerType: {
    type: String,
    enum: ['Trader', 'Wholesaler', 'Food Processor', 'Retailer', 'Institutional Buyer', 'Agro-Exporter'],
    default: 'Trader',
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
  },
  location: {
    state: { type: String, default: 'Rajasthan' },
    district: { type: String, default: 'Jaipur' },
    block: { type: String, default: 'Chomu Mandi' },
    address: { type: String, default: 'APMC Mandi Yard' },
  },
  verified: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  demandCrops: [{
    cropName: String,
    requiredQuantity: Number,
    unit: String,
    buyingPriceRange: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Buyer || mongoose.model('Buyer', buyerSchema);
