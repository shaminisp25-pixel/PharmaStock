import winston from 'winston';
import { getEnv } from '../config/env';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const transports = [
  // Console transport
  new winston.transports.Console(),
  // File transport for errors
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // File transport for all logs
  new winston.transports.File({
    filename: 'logs/combined.log',
  }),
];

// Create logger with default level, will be reconfigured after initEnv
const baseLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
});

type LogMeta = unknown;

interface AppLogger {
  error(message: string, meta?: LogMeta): void;
  warn(message: string, meta?: LogMeta): void;
  info(message: string, meta?: LogMeta): void;
  http(message: string, meta?: LogMeta): void;
  debug(message: string, meta?: LogMeta): void;
  level: string;
}

function writeLog(level: keyof typeof levels, message: string, meta?: LogMeta): void {
  if (meta instanceof Error) {
    baseLogger.log({
      level,
      message,
      errorMessage: meta.message,
      stack: meta.stack,
    });
    return;
  }

  if (meta && typeof meta === 'object') {
    baseLogger.log({
      level,
      message,
      ...meta as Record<string, unknown>,
    });
    return;
  }

  if (meta !== undefined) {
    baseLogger.log({
      level,
      message: `${message} ${String(meta)}`,
    });
    return;
  }

  baseLogger.log({ level, message });
}

const logger: AppLogger = {
  error: (message, meta) => writeLog('error', message, meta),
  warn: (message, meta) => writeLog('warn', message, meta),
  info: (message, meta) => writeLog('info', message, meta),
  http: (message, meta) => writeLog('http', message, meta),
  debug: (message, meta) => writeLog('debug', message, meta),
  get level() {
    return baseLogger.level;
  },
  set level(level: string) {
    baseLogger.level = level;
  },
};

// Function to reconfigure logger with actual env level
export function configureLogger() {
  try {
    const env = getEnv();
    logger.level = env.LOG_LEVEL;
  } catch (error) {
    // Logger will use default level if env is not initialized yet
  }
}

export default logger;
