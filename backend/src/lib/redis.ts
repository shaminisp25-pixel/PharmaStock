import Redis from 'ioredis';
import { getEnv } from '../config/env';
import logger from '../utils/logger';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const env = getEnv();
    try {
      redis = new Redis(env.REDIS_URL, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
      });

      redis.on('connect', () => {
        logger.info('✓ Redis connected successfully');
      });

      redis.on('error', (error) => {
        logger.error('Redis connection error', error);
      });

      redis.on('close', () => {
        logger.warn('Redis connection closed');
      });
    } catch (error) {
      logger.error('Failed to create Redis client', error);
      throw error;
    }
  }

  return redis;
}

export async function connectRedis(): Promise<void> {
  try {
    const client = getRedisClient();
    await client.ping();
    logger.info('✓ Redis connection verified');
  } catch (error) {
    logger.error('Failed to connect to Redis', error);
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    logger.info('Redis disconnected');
  }
}
