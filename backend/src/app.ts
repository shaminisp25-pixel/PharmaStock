import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { getEnv } from './config/env';
import { globalLimiter } from './middlewares/rateLimit.middleware';
import { errorHandler } from './middlewares/error.middleware';
import logger from './utils/logger';
import routes from './routes';
import { specs } from './config/swagger';

export function createApp(): Application {
  const app = express();
  const env = getEnv();

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true },
    noSniff: true,
    xssFilter: true,
  }));

  app.use(cors({
    origin: env.ALLOWED_ORIGINS.split(','),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    credentials: true,
  }));

  app.set('trust proxy', 1);

  // Body parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(compression());
  app.use(cookieParser());

  // Logging
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.http(message.trim()),
    },
  }));

  // Rate limiting
  app.use(globalLimiter);

  // Swagger Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      docExpansion: 'list',
    },
    customCss: '.swagger-ui .topbar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }',
  }));

  // Redirect root to API docs
  app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });

  // API Routes
  app.use(`${env.API_PREFIX}`, routes);

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date(),
      uptime: process.uptime(),
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      path: req.path,
    });
  });

  // Global error handler — MUST be last
  app.use(errorHandler);

  return app;
}
