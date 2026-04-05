/**
 * Config barrel export
 */
const env = require('./env');
const connectDB = require('./db');

module.exports = { env, connectDB };
