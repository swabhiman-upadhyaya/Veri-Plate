/**
 * Generic request validation middleware
 * Can be extended with Joi or express-validator schemas
 */
const { formatResponse } = require('../utils/response.utils');
const { HTTP_STATUS } = require('../constants');

/**
 * Validates that required fields exist in req.body
 * @param  {...string} fields - Required field names
 */
const requireFields = (...fields) => {
  return (req, res, next) => {
    const missing = fields.filter(f => !req.body[f] && req.body[f] !== 0);
    if (missing.length > 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, null, `Missing required fields: ${missing.join(', ')}`)
      );
    }
    next();
  };
};

module.exports = { requireFields };
