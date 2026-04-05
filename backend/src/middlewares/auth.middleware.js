const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { formatResponse } = require('../utils/response.utils');
const { env } = require('../config');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      formatResponse(false, null, MESSAGES.NOT_AUTHORIZED)
    );
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatResponse(false, null, MESSAGES.USER_NOT_FOUND)
      );
    }

    next();
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      formatResponse(false, null, MESSAGES.TOKEN_FAILED)
    );
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        formatResponse(false, null, MESSAGES.ROLE_FORBIDDEN(req.user.role))
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
