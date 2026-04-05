const { formatResponse } = require('../utils/response.utils');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const errorHandler = (err, req, res, next) => {
  console.error('[Error]:', err.message || err);
  
  const statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  
  res.status(statusCode).json(
    formatResponse(false, null, err.message || MESSAGES.INTERNAL_ERROR)
  );
};

module.exports = errorHandler;
