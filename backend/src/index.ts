import 'dotenv/config';
import { initEnv, getEnv } from './config/env';
import { createApp } from './app';
import { PrismaClient } from '@prisma/client';
import logger from './utils/logger';
import { startExpiryCheckJob } from './jobs/expiryCheck.job';

const prisma = new PrismaClient();

async function main() {
  try {
    // Initialize environment
    initEnv();
    const env = getEnv();

    // Test database connection
    await prisma.$connect();
    logger.info('✓ Database connected successfully');

    // Create Express app
    const app = createApp();

    // Start expiry check job
    startExpiryCheckJob();

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
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      await prisma.$disconnect();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Fatal error during startup', error);
    process.exit(1);
  }
}

main();
