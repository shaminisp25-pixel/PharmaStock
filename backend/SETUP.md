# PharmaStock Backend - Setup & Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Redis 6+ (optional, but recommended for production)

## Environment Setup

### 1. Create `.env` file

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

**Critical Environment Variables:**

- `DATABASE_URL`: PostgreSQL connection string (REQUIRED)
- `JWT_ACCESS_SECRET`: Minimum 32 characters (REQUIRED)
- `JWT_REFRESH_SECRET`: Minimum 32 characters (REQUIRED)
- `REDIS_URL`: Redis connection string (defaults to localhost:6379)

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Generate Prisma client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

Seed the database (optional):

```bash
npm run seed
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:5000`
API documentation: `http://localhost:5000/api-docs`

### Production Build

```bash
npm run build
npm start
```

## Common Issues & Solutions

### Error: `ERR_ERL_CREATED_IN_REQUEST_HANDLER`

**Solution:** This was a rate limiter initialization issue. It's been fixed in the current version. Ensure you're using the latest code.

### Error: Database Connection Failed

**Check:**
1. PostgreSQL server is running
2. `DATABASE_URL` is correct
3. Database exists and user has permissions
4. Run: `npm run prisma:migrate` to initialize schema

### Error: Redis Connection Failed

**Solution:** Redis is optional. The app will work without it but token refresh will be stored in-memory (not recommended for production).

To use Redis:
1. Ensure Redis is running on the configured URL
2. Update `REDIS_URL` in `.env`

### Error: JWT Secrets Too Short

**Solution:** Set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to strings of at least 32 characters each.

## Database Schema

The application uses Prisma ORM with PostgreSQL. Key models:

- **User**: Authentication and role-based access
- **Warehouse**: Drug storage locations
- **Drug**: Drug catalog with storage requirements
- **Batch**: Drug inventory with expiry tracking
- **Alert**: Expiry and stock alerts
- **AuditLog**: Activity tracking for compliance
- **DispatchRecord**: Drug distribution history
- **ImportLog**: Bulk import tracking

## API Documentation

Once running, access Swagger documentation at:
```
http://localhost:5000/api-docs
```

## Architecture Improvements Made

1. **Centralized Database Client**: Single PrismaClient instance used across the application
2. **Centralized Redis Client**: Single Redis instance with retry logic
3. **Proper Initialization**: Database and Redis connections initialized at startup
4. **Error Handling**: Graceful fallback if Redis is unavailable
5. **Configuration**: Made external integrations optional in environment validation

## Key Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET /health` - Health check

## Troubleshooting

1. **Check logs**: Server logs will indicate what service failed to initialize
2. **Verify database**: `npm run prisma:studio` opens Prisma Studio to inspect database
3. **Test Redis**: `redis-cli ping` should return "PONG"
4. **Environment validation**: Check `.env` file against `.env.example`

## Next Steps

1. Set up proper database backups
2. Configure CI/CD pipeline
3. Set up monitoring and alerts
4. Implement rate limiting per user (current setup is global)
5. Add database connection pooling for high traffic
