import 'dotenv/config';
import { initEnv, getEnv } from './config/env';
import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './lib/database';
import { connectRedis, disconnectRedis } from './lib/redis';
import { initializeDatabase } from './lib/initializeDb';
import logger, { configureLogger } from './utils/logger';
import { startExpiryCheckJob } from './jobs/expiryCheck.job';

async function main() {
  try {
    // Initialize environment
    initEnv();
    configureLogger();
    const env = getEnv();

    // Connect to database
    await connectDatabase();

    // Initialize database schema
    await initializeDatabase();

    // Connect to Redis
    try {
      await connectRedis();
    } catch (error) {
      logger.warn('Redis not available, running without caching');
    }

    // Create Express app
    const app = createApp();

    // Start expiry check job
    try {
      startExpiryCheckJob();
    } catch (error) {
      logger.warn('Expiry check job failed to start', error);
    }

    // Start server
    const PORT = env.PORT;
    app.listen(PORT, () => {
      logger.info(`
╔════════════════════════════════════════════════════════╗
║  PharmaStock Backend Server                           ║
║  Environment: ${env.NODE_ENV.padEnd(37)}║
║  Port: ${PORT.toString().padEnd(46)}║
║  API: http://localhost:${PORT}${env.API_PREFIX}${' '.repeat(23 - env.API_PREFIX.length)}║
╚════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Shutting down gracefully...');
      await disconnectDatabase();
      await disconnectRedis();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      await disconnectDatabase();
      await disconnectRedis();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Fatal error during startup', error);
    process.exit(1);
  }
}

main();


