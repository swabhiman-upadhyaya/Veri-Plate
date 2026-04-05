const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { sendOtp, verifyOtp } = require('../controllers/auth.controller');
const { MESSAGES } = require('../constants');

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 requests per window
  message: { success: false, data: null, error: MESSAGES.TOO_MANY_OTP },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
