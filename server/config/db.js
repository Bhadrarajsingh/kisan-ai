import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri === 'your_mongodb_uri_here') {
    console.warn('⚠️  MONGODB_URI not set in .env — please add your MongoDB Atlas connection string.');
    isConnected = false;
    return false;
  }

  if (isConnected) return true;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,  // Atlas needs a bit more time than localhost
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Atlas connection FAILED: ${error.message}`);
    console.warn('   Falling back to in-memory data store. Fix your MONGODB_URI in .env to persist data.');
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  database: isConnected ? mongoose.connection.name : 'In-Memory Cache (No Atlas URI)',
  host: isConnected ? mongoose.connection.host : 'Not connected'
});
