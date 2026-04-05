/**
 * Express Application Setup
 * Separated from server.js for testability
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const errorHandler = require('./middlewares/error.middleware');
const mountRoutes = require('./routes');
const { formatResponse } = require('./utils/response.utils');
const { HTTP_STATUS, MESSAGES } = require('./constants');

const app = express();

// ─── Security & Parsing Middlewares ──────────────────────────
// Disable helmet's restrictive CSP so the React frontend (port 5173) can
// load output images/videos that are served from this Express server (port 5000)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

const path = require('path');
// Serve generated static media outputs — allow cross-origin access
app.use('/outputs', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, '../outputs')));

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json(
    formatResponse(true, { status: MESSAGES.SERVER_HEALTHY })
  );
});

// ─── Mount Routes ────────────────────────────────────────────
mountRoutes(app);

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND);
  next(new Error(`Route not found: ${req.originalUrl}`));
});

// ─── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

module.exports = app;
