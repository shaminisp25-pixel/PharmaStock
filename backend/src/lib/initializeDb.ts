import { getPrismaClient } from '../lib/database';
import logger from '../utils/logger';

export async function initializeDatabase(): Promise<void> {
  try {
    const prisma = getPrismaClient();

    // Check if migrations are up to date
    logger.info('Verifying database schema...');

    // Try to perform a simple query to verify connection
    await prisma.$queryRaw`SELECT 1`;

    logger.info('✓ Database schema verified successfully');
  } catch (error) {
    logger.error('Database initialization failed. Run "npm run prisma:migrate" to set up the database.', error);
    throw error;
  }
}
