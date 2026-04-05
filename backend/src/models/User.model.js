const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  otp: {
    type: String,
    select: false // Do not return OTP hash in queries by default
  },
  otpExpires: {
    type: Date,
    select: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
