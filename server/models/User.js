import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Never return password in queries by default
  },
  role: {
    type: String,
    enum: ['farmer', 'agronomist', 'admin', 'extension_officer'],
    default: 'farmer',
  },
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en',
  },
  farmSizeAcres: {
    type: Number,
    default: 4.5,
  },
  primaryCrop: {
    type: String,
    default: 'Soybean',
  },
  kisanId: {
    type: String,
    unique: true,
    default: () => `KISAN-${Math.floor(100000 + Math.random() * 900000)}`,
  },
  location: {
    state: { type: String, default: 'India' },
    district: { type: String, default: 'District' },
    block: { type: String, default: 'Block' },
    panchayat: { type: String, default: 'Gram Panchayat' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: compare entered password with hashed
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
