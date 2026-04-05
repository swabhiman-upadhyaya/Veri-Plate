/**
 * Server Entry Point
 * Connects to database and starts listening
 */
const app = require('./app');
const { env, connectDB } = require('./config');

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Start Express server
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

startServer();
