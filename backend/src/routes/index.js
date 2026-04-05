/**
 * Route Aggregator
 * Mounts all route modules onto the Express app
 */
const authRoutes = require('./auth.routes');
const vehicleRoutes = require('./vehicle.routes');
const liveRoutes = require('./live.routes');

const mountRoutes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api', vehicleRoutes);
  app.use('/api/live', liveRoutes);
};

module.exports = mountRoutes;
