/**
 * Database Configuration
 * Handles MongoDB connection via Mongoose
 */
const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
