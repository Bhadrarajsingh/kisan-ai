import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
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
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: 'kg',
  },
  agreedPrice: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'processing', 'ready_for_pickup', 'in_transit', 'completed', 'cancelled'],
    default: 'confirmed',
  },
  deliveryType: {
    type: String,
    enum: ['Buyer Pickup', 'Farmer Delivery'],
    default: 'Buyer Pickup',
  },
  pickupLocation: {
    address: String,
    village: String,
    block: String,
    district: String,
    state: String,
  },
  pickupDate: {
    type: String,
  },
  trackingNotes: [{
    status: String,
    note: String,
    timestamp: { type: Date, default: Date.now },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
