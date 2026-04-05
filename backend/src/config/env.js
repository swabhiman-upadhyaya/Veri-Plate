/**
 * Environment Configuration
 * Centralizes all environment variable access with defaults
 */
require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',

  // External API
  EXTERNAL_VEHICLE_API_URL: process.env.EXTERNAL_VEHICLE_API_URL,
  EXTERNAL_VEHICLE_API_KEY: process.env.EXTERNAL_VEHICLE_API_KEY,

  // Email
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
  EMAIL_PASS: process.env.EMAIL_PASS || 'etherealpass',
  FROM_NAME: process.env.FROM_NAME || 'VeriPlate',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@veriplate.com',
};

module.exports = env;
