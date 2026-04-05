/**
 * Formats standard API responses
 * @param {boolean} success - true or false
 * @param {any} data - payload
 * @param {string} error - error message if any
 */
const formatResponse = (success, data = {}, error = null) => {
  return {
    success,
    data,
    error
  };
};

module.exports = { formatResponse };
