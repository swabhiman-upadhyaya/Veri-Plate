/**
 * Reusable response/error messages
 */
const MESSAGES = {
  // Auth
  PROVIDE_EMAIL: 'Please provide an email',
  PROVIDE_EMAIL_OTP: 'Please provide email and OTP',
  OTP_SENT: (email) => `OTP sent to ${email}`,
  OTP_INVALID: 'Invalid or expired OTP',
  OTP_EXPIRED: 'OTP has expired',
  OTP_WRONG: 'Invalid OTP',
  EMAIL_SEND_FAIL: 'Email could not be sent. Please check configuration.',
  NOT_AUTHORIZED: 'Not authorized to access this route',
  TOKEN_FAILED: 'Not authorized, token failed',
  USER_NOT_FOUND: 'User no longer exists',
  ROLE_FORBIDDEN: (role) => `User role ${role} is not authorized to access this route`,

  // Vehicle / Lookup
  PROVIDE_PLATE_OR_IMAGE: 'Provide either plateNumber or image (base64)',
  VEHICLE_NOT_FOUND: 'Vehicle not found in database',
  PLATE_ALREADY_EXISTS: 'Plate number already exists',

  // Rate Limit
  TOO_MANY_OTP: 'Too many OTP requests from this IP, please try again after 5 minutes',

  // General
  SERVER_HEALTHY: 'Server is healthy and running',
  INTERNAL_ERROR: 'Internal Server Error',
};

module.exports = MESSAGES;
