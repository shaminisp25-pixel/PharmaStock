import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  API_PREFIX: z.string().default('/api/v1'),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Bcrypt
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),

  // File Upload
  MAX_FILE_SIZE_MB: z.string().transform(Number).default('10'),
  UPLOAD_TEMP_DIR: z.string().default('./tmp/uploads'),

  // Alerts
  EXPIRY_WARN_DAYS_1: z.string().transform(Number).default('30'),
  EXPIRY_WARN_DAYS_2: z.string().transform(Number).default('60'),
  EXPIRY_WARN_DAYS_3: z.string().transform(Number).default('90'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  AUTH_RATE_LIMIT_MAX: z.string().transform(Number).default('10'),

  // External Integrations
  ERP_WEBHOOK_SECRET: z.string().min(10),
  PRESCRIPTION_API_URL: z.string().url(),
  PRESCRIPTION_API_KEY: z.string().min(10),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),

  // CORS
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001'),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

export function initEnv(): Env {
  try {
    env = envSchema.parse(process.env);
    console.log('✓ Environment variables validated successfully');
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

export function getEnv(): Env {
  if (!env) {
    throw new Error('Environment not initialized. Call initEnv() first.');
  }
  return env;
}
