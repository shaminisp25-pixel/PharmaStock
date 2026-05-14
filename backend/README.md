# Pharmaceutical Warehouse Management System — Express.js Backend

A production-ready RESTful API built with Node.js, Express.js, TypeScript, and PostgreSQL for managing pharmaceutical inventory, batch lifecycle, expiry monitoring, and regulatory compliance.

## Features

- **Role-Based Access Control (RBAC)** with 4 user roles: Admin, Pharmacist, Warehouse Staff, Inspector
- **JWT Authentication** with refresh tokens stored in Redis
- **Pharmaceutical Batch Management** with expiry monitoring and alerts
- **Drug Inventory Tracking** with temperature and storage requirements
- **Bulk Import/Export** support for CSV/XLSX
- **Audit Trail** for all modifications
- **RESTful API** with standardized response format
- **Production-Ready** security with helmet, CORS, rate limiting
- **Comprehensive Logging** with Winston
- **Automatic Expiry Checks** via cron jobs
- **Docker Support** for easy deployment

## Tech Stack

- **Runtime**: Node.js 20+ LTS
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Cache/Queue**: Redis 7+
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: helmet, bcryptjs, cors, express-rate-limit
- **Logging**: Winston, Morgan

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- npm or yarn

## Quick Start

### 1. Clone & Setup

```bash
cd backend
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your configuration
```

**Required environment variables:**
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://pharma:pharmapass@localhost:5432/pharma_db
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your-32-char-secret-key-here
JWT_REFRESH_SECRET=your-32-char-secret-key-here
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) View database
npm run prisma:studio
```

### 4. Start Development Server

```bash
npm run dev
```

Server starts at `http://localhost:5000`

Health check: `GET http://localhost:5000/health`

## Using Docker Compose

```bash
# Start all services (API, PostgreSQL, Redis)
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f api
```

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

```
POST   /auth/register          Register a new user
POST   /auth/login             Login and get access token
POST   /auth/refresh           Refresh access token
POST   /auth/logout            Logout (invalidate refresh token)
PATCH  /auth/change-password   Change user password
```

### Core Resources

```
Users:
  GET    /users                 List all users (admin only)
  GET    /users/:id             Get user details
  POST   /users                 Create user (admin only)
  PATCH  /users/:id             Update user (admin only)
  DELETE /users/:id             Delete user (admin only)

Warehouses:
  GET    /warehouses            List all warehouses
  GET    /warehouses/:id        Get warehouse details
  POST   /warehouses            Create warehouse (admin only)
  PATCH  /warehouses/:id        Update warehouse (admin only)
  DELETE /warehouses/:id        Delete warehouse (admin only)

Drugs:
  GET    /drugs                 List all drugs
  GET    /drugs/:id             Get drug details
  POST   /drugs                 Create drug (admin, pharmacist)
  PATCH  /drugs/:id             Update drug (admin, pharmacist)
  DELETE /drugs/:id             Delete drug (admin only)

Batches:
  GET    /batches               List all batches
  GET    /batches/:id           Get batch details
  POST   /batches               Create batch (admin, warehouse_staff)
  PATCH  /batches/:id/status    Update batch status (admin, pharmacist)
  POST   /batches/:id/dispatch  Dispatch batch (admin, pharmacist)
  POST   /batches/scan          Scan barcode
  DELETE /batches/:id           Delete batch (admin only)

Alerts:
  GET    /alerts                List all alerts
  GET    /alerts/:id            Get alert details
  PATCH  /alerts/:id/resolve    Resolve alert (admin, pharmacist)

Audit:
  GET    /audit                 List audit logs (admin, inspector only)

Import:
  POST   /import/drugs/upload   Upload drug data (CSV/XLSX)
  GET    /import/logs           View import history
  GET    /import/template       Download import template

Reports:
  GET    /reports/expiry        Expiry report
  GET    /reports/dispatch      Dispatch report
  GET    /reports/stock         Stock report
  GET    /reports/temperature-sensitive   Temperature-sensitive items
```

### Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Invalid format" }
  ]
}
```

## Role-Based Access Control

| Feature | Admin | Pharmacist | Warehouse Staff | Inspector |
|---------|-------|-----------|-----------------|-----------|
| User Management | ✓ | ✗ | ✗ | ✗ |
| Drug Management | ✓ | ✓ | ✗ | ✗ |
| Batch Creation | ✓ | ✗ | ✓ | ✗ |
| Batch Dispatch | ✓ | ✓ | ✗ | ✗ |
| Alert Resolution | ✓ | ✓ | ✗ | ✗ |
| Reports (Read) | ✓ | ✓ | ✗ | ✓ |
| Audit Logs | ✓ | ✗ | ✗ | ✓ |

## Development Commands

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Run linter
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration (env, database)
│   ├── controllers/         # Route handlers
│   ├── middlewares/         # Express middlewares
│   ├── services/            # Business logic
│   ├── routes/              # API routes
│   ├── jobs/                # Cron jobs
│   ├── utils/               # Utilities (logger, validators, responses)
│   ├── app.ts               # Express app setup
│   └── index.ts             # Server entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── logs/                    # Application logs
├── tmp/                     # Temporary files
├── docker-compose.yml       # Docker services
├── Dockerfile               # Docker image
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## Security Features

- ✓ **Helmet.js** for HTTP headers security
- ✓ **CORS** with configurable origins
- ✓ **Rate Limiting** on all endpoints
- ✓ **JWT Authentication** with short-lived tokens
- ✓ **Refresh Token Rotation** stored in Redis
- ✓ **Bcrypt Password Hashing** with 12 rounds
- ✓ **Input Validation** with Zod
- ✓ **SQL Injection Prevention** via Prisma
- ✓ **API Key Authentication** for webhooks
- ✓ **Audit Logging** for all modifications
- ✓ **Warehouse Scoping** for data isolation

## Monitoring

- Logs are stored in `logs/` directory
- Check `logs/error.log` for errors
- Check `logs/combined.log` for all logs
- Winston logger with configurable levels

## Troubleshooting

### Database Connection Error
```bash
# Verify PostgreSQL is running
psql -U pharma -d pharma_db

# Check DATABASE_URL in .env
```

### Redis Connection Error
```bash
# Verify Redis is running
redis-cli ping
# Should return: PONG
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
PORT=5001
```

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m "Add my feature"`
3. Push to branch: `git push origin feature/my-feature`
4. Create Pull Request

## License

MIT
