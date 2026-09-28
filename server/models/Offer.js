import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  farmerId: {
    type: String,
    required: true,
  },
  farmerName: {
    type: String,
    required: true,
  },
  buyerId: {
    type: String,
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  buyerPhone: {
    type: String,
    default: '9829012345',
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: 'kg',
  },
  offeredPrice: {
    type: Number,
    required: true,
  },
  counterPrice: {
    type: Number,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryType: {
    type: String,
    enum: ['Buyer Pickup', 'Farmer Delivery', 'Third-Party Transport'],
    default: 'Buyer Pickup',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'countered', 'rejected', 'converted_to_order'],
    default: 'pending',
  },
  message: {
    type: String,
    trim: true,
  },
  history: [{
    sender: String, // 'buyer' or 'farmer'
    price: Number,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Offer || mongoose.model('Offer', offerSchema);
