import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { getEnv } from '../config/env';

const prisma = new PrismaClient();
const env = getEnv();

export function startExpiryCheckJob() {
  // Runs daily at 00:05
  cron.schedule('5 0 * * *', async () => {
    try {
      logger.info('Starting expiry check job...');

      const now = new Date();
      const thresholds = [
        env.EXPIRY_WARN_DAYS_1,
        env.EXPIRY_WARN_DAYS_2,
        env.EXPIRY_WARN_DAYS_3,
      ];

      for (const days of thresholds) {
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() + days);

        // Find batches expiring in this threshold
        const batches = await prisma.batch.findMany({
          where: {
            status: 'active',
            expiryDate: {
              lte: cutoff,
              gt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Don't duplicate yesterday's
            },
            alerts: {
              none: {
                alertType: 'near_expiry',
                resolved: false,
              },
            },
          },
        });

        // Create alerts for each batch
        for (const batch of batches) {
          await prisma.alert.create({
            data: {
              batchId: batch.id,
              alertType: 'near_expiry',
            },
          });
        }

        logger.info(`Created ${batches.length} near_expiry alerts for ${days}+ day threshold`);
      }

      // Flag already-expired active batches
      const now2 = new Date();
      const expiredBatches = await prisma.batch.findMany({
        where: {
          status: 'active',
          expiryDate: { lt: now2 },
        },
      });

      // Update expired batches
      if (expiredBatches.length > 0) {
        await prisma.batch.updateMany({
          where: {
            status: 'active',
            expiryDate: { lt: now2 },
          },
          data: { status: 'expired' },
        });

        // Create expired alerts
        for (const batch of expiredBatches) {
          const existingAlert = await prisma.alert.findFirst({
            where: {
              batchId: batch.id,
              alertType: 'expired',
              resolved: false,
            },
          });

          if (!existingAlert) {
            await prisma.alert.create({
              data: {
                batchId: batch.id,
                alertType: 'expired',
              },
            });
          }
        }

        logger.info(`Marked ${expiredBatches.length} batches as expired and created alerts`);
      }

      logger.info('Expiry check job completed successfully');
    } catch (error) {
      logger.error('Expiry check job failed', error);
    }
  });

  logger.info('Expiry check cron job scheduled');
}
