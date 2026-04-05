const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const sendEmail = require('../services/email.service');
const { formatResponse } = require('../utils/response.utils');
const { env } = require('../config');
const { HTTP_STATUS, MESSAGES } = require('../constants');

// Email validation regex (RFC 5322 standard-like)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper to generate JWT token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });

  res.status(statusCode).json(formatResponse(true, {
    token,
    user: { id: user._id, email: user.email, role: user.role }
  }));
};

// @desc    Generate and send OTP
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !emailRegex.test(email)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, null, 'Please provide a valid email address.')
      );
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // 5 minutes expiry
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); 

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, otp: hashedOtp, otpExpires });
    } else {
      user.otp = hashedOtp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your VeriPlate Login OTP',
        message: `Your One-Time Password (OTP) is: ${otp}\nThis is valid for 5 minutes.`
      });
      res.status(HTTP_STATUS.OK).json(
        formatResponse(true, { message: MESSAGES.OTP_SENT(email) })
      );
    } catch (err) {
      console.error('Email error: ', err);
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        formatResponse(false, null, MESSAGES.EMAIL_SEND_FAIL)
      );
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP & Login/Register
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp || !emailRegex.test(email)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, null, 'Please provide a valid email address and OTP.')
      );
    }

    const user = await User.findOne({ email }).select('+otp +otpExpires');
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, null, MESSAGES.OTP_INVALID)
      );
    }

    if (new Date() > user.otpExpires) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, null, MESSAGES.OTP_EXPIRED)
      );
    }

    const isMatch = await bcrypt.compare(otp.toString(), user.otp);
    if (!isMatch) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, null, MESSAGES.OTP_WRONG)
      );
    }

    // OTP matched, clear fields and send token
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    sendTokenResponse(user, HTTP_STATUS.OK, res);
  } catch (error) {
    next(error);
  }
};
