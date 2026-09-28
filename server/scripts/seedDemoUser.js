/**
 * KisanAI Demo User Seed Script
 * Run: node scripts/seedDemoUser.js
 * 
 * Creates the demo Ramesh Patel user with properly hashed password in MongoDB Atlas.
 * Safe to run multiple times (upserts, not duplicates).
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: { type: String, lowercase: true, unique: true },
  password: { type: String, select: false },
  role: { type: String, default: 'farmer' },
  language: { type: String, default: 'hi' },
  farmSizeAcres: { type: Number, default: 5.0 },
  primaryCrop: { type: String, default: 'Soybean' },
  kisanId: { type: String, default: () => `KISAN-${Math.floor(100000 + Math.random() * 900000)}` },
  location: {
    state: { type: String, default: 'Rajasthan' },
    district: { type: String, default: 'Jaipur' },
    block: { type: String, default: 'Chomu' },
    panchayat: { type: String, default: 'Morija' },
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const DEMO_USERS = [
  {
    name: 'Ramesh Patel',
    email: 'ramesh.farmer@kisan.in',
    password: 'password123',
    phone: '9876543210',
    role: 'farmer',
    language: 'hi',
    farmSizeAcres: 5.0,
    primaryCrop: 'Soybean',
    kisanId: 'KISAN-782941',
    location: { state: 'Rajasthan', district: 'Jaipur', block: 'Chomu', panchayat: 'Morija' },
  },
  {
    name: 'Admin KisanAI',
    email: 'admin@kisan.in',
    password: 'admin123',
    phone: '9000000001',
    role: 'admin',
    language: 'en',
    farmSizeAcres: 0,
    primaryCrop: 'N/A',
    kisanId: 'KISAN-000001',
    location: { state: 'Delhi', district: 'New Delhi', block: 'Central', panchayat: 'HQ' },
  },
];

async function seed() {
  console.log('🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 10000,
  });
  console.log('✅ Connected to MongoDB Atlas');

  for (const demoUser of DEMO_USERS) {
    const hashed = await bcrypt.hash(demoUser.password, 12);

    const result = await User.findOneAndUpdate(
      { email: demoUser.email },
      {
        $set: {
          name: demoUser.name,
          phone: demoUser.phone,
          password: hashed,
          role: demoUser.role,
          language: demoUser.language,
          farmSizeAcres: demoUser.farmSizeAcres,
          primaryCrop: demoUser.primaryCrop,
          kisanId: demoUser.kisanId,
          location: demoUser.location,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Demo user seeded: ${result.email} | password: ${demoUser.password} | role: ${result.role}`);
  }

  console.log('\n📋 Summary:');
  console.log('   Farmer login : ramesh.farmer@kisan.in / password123');
  console.log('   Admin login  : admin@kisan.in / admin123');
  console.log('\n✅ Seed complete. You can now restart the server.');
  
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
