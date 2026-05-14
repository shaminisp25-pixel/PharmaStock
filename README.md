# PharmaStock - Pharmaceutical Warehouse Management System

<div align="center">

**Production-Ready | Fully Integrated | Enterprise Security**

[Quick Start](#quick-start) • [Architecture](#architecture) • [Documentation](#documentation) • [Deployment](#deployment)

</div>

---

## 🎯 Overview

PharmaStock is a **complete pharmaceutical warehouse management system** built with modern web technologies, featuring a secure REST API backend and responsive Next.js frontend with real-time data synchronization.

### Key Statistics

- **50+** API Endpoints
- **9** Frontend Pages
- **11** API Services
- **8** Database Models
- **7** Security Layers
- **Production-Ready** Code

---

## ✨ Features

### Dashboard & Analytics
- Real-time statistics (expiry alerts, total drugs, stock overview)
- Activity timeline and recent events
- At-a-glance inventory status

### Inventory Management
- **Drugs**: Complete drug catalog with manufacturer info
- **Batches**: Inventory tracking with expiry dates and temperature
- **Alerts**: Automated alerts for expiry, stock, temperature, dispatch, import

### Administration
- **User Management**: Role-based access control (4 roles: Admin, Manager, Warehouse Staff, Viewer)
- **Audit Logs**: Complete audit trail of all system activities
- **Warehouse Management**: Multi-warehouse support with scoped access

### Reporting
- **Expiry Reports**: Track expiring drugs
- **Stock Reports**: Current inventory levels
- **Dispatch Reports**: Shipment tracking
- **Export Capabilities**: PDF and CSV exports

### Data Management
- **Import/Export**: Bulk data import with validation
- **Search & Filter**: Advanced filtering across all modules
- **Pagination**: Efficient data loading

### Security
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- HttpOnly secure cookies
- Automatic token refresh
- Rate limiting and DDoS protection
- Audit logging for compliance

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+ (optional, for caching)

### 5-Minute Setup

```bash
# Backend Setup
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL in .env
npm run prisma:migrate
npm run dev

# Frontend Setup (in new terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev

# Open browser
# http://localhost:3000

# Demo Login
# Email: john@pharmastock.com
# Password: password123
```

For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md)

---

## 📁 Project Structure

```
PharmaStock/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── services/         # Business logic
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Express middlewares
│   │   ├── utils/            # Utilities
│   │   └── config/           # Configuration
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # Home
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── drugs/
│   │   ├── batches/
│   │   ├── alerts/
│   │   ├── reports/
│   │   ├── users/
│   │   └── audit/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api-client.ts        # HTTP client
│   │   │   ├── api-services.ts      # API endpoints
│   │   │   └── auth-context.tsx     # Auth state
│   │   └── components/
│   └── package.json
│
├── QUICK_START.md              # 15-min setup guide
├── INTEGRATION_GUIDE.md         # Comprehensive integration
├── ARCHITECTURE.md              # System architecture
├── INTEGRATION_CHECKLIST.md    # Verification checklist
├── QUICK_REFERENCE.md          # Code examples
└── INTEGRATION_SUMMARY.md      # Feature summary
```

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────┐
│  Frontend (Next.js)              │
│  • 9 Pages                       │
│  • React Components              │
│  • Auth Context                  │
│  • Typed API Services            │
└──────────┬──────────────────────┘
           │ HTTPS
┌──────────┴──────────────────────┐
│  Backend (Express.js)            │
│  • 50+ Endpoints                 │
│  • JWT Authentication            │
│  • RBAC Authorization            │
│  • Prisma ORM                    │
└──────────┬──────────────────────┘
           │
┌──────────┴──────────────────────┐
│  Data Layer                      │
│  • PostgreSQL                    │
│  • Redis Cache                   │
│  • File Storage                  │
└─────────────────────────────────┘
```

### Security Layers

1. **HTTPS/TLS** - Encrypted transport
2. **Rate Limiting** - DDoS protection (100 req/15min)
3. **CORS** - Origin validation
4. **Helmet** - Security headers
5. **Authentication** - JWT tokens
6. **Authorization** - RBAC
7. **Input Validation** - Zod schemas
8. **Audit Logging** - Activity tracking

For detailed architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📚 API Endpoints

### Available Services

| Service | Endpoints | Features |
|---------|-----------|----------|
| **Auth** | 5 | Login, Register, Refresh, Logout, Change Password |
| **Drugs** | 6 | CRUD, Search, Pagination |
| **Batches** | 8 | CRUD, Dispatch, Scan, Statistics |
| **Alerts** | 4 | Get, Resolve, Statistics |
| **Users** | 8 | CRUD, Role Assignment, Warehouse Assignment |
| **Reports** | 4 | Generate, Export (PDF/CSV) |
| **Import** | 2 | Upload, Validate |
| **Audit** | 2 | Query, Export |
| **Warehouse** | 5 | CRUD |

### Access API Documentation

```bash
# After starting backend
http://localhost:5000/api-docs
```

Swagger UI provides interactive API testing

---

## 🔐 Authentication & Security

### Token Flow

```
1. User registers/logs in
2. Backend generates tokens:
   - Access Token (15 min, localStorage)
   - Refresh Token (7 days, httpOnly cookie)
3. Frontend auto-attaches access token to requests
4. On 401 response:
   - Frontend auto-refreshes token
   - Retries original request
5. On token expiry (no refresh):
   - User logged out
   - Redirected to login
```

### User Roles

- **Admin**: Full system access
- **Manager**: Warehouse management + reporting
- **Warehouse Staff**: Inventory operations
- **Viewer**: Read-only access

---

## 📖 Documentation

### Getting Started
- [QUICK_START.md](./QUICK_START.md) - 15-minute setup guide
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Code examples and patterns

### Understanding the System
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and data flows
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Comprehensive integration guide
- [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) - Feature overview

### Verification & Deployment
- [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md) - Setup verification
- Backend docs: `backend/IMPLEMENTATION_SUMMARY.md`
- Backend setup: `backend/SETUP_GUIDE.md`

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript 5+
- **UI**: React 18+ with Tailwind CSS
- **State**: React Context API
- **HTTP**: Fetch API with custom wrapper
- **Type Safety**: TypeScript + Zod

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4+
- **Language**: TypeScript 5+
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5+
- **Cache**: Redis 7+
- **Auth**: JWT + Bcrypt
- **Validation**: Zod 3+
- **Logging**: Winston + Morgan
- **Security**: Helmet + CORS

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose / Kubernetes
- **Database**: AWS RDS / Cloud SQL
- **Cache**: Redis Cloud / ElastiCache
- **CDN**: CloudFlare / CloudFront

---

## 📊 Performance

### Target Metrics

**Frontend**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Bundle Size: < 200KB (gzipped)

**Backend**
- API Response Time: < 200ms (p95)
- Database Query Time: < 100ms (p95)
- Throughput: > 1000 requests/sec
- Memory: < 500MB

---

## 🚢 Deployment

### Docker Deployment

```bash
# Build Docker images
docker-compose build

# Start all services
docker-compose up

# Services:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database: PostgreSQL on 5432
# Cache: Redis on 6379
```

### Production Environment

```env
# Backend .env
NODE_ENV=production
PORT=5000
DATABASE_URL=<production-db>
JWT_SECRET=<strong-secret>
JWT_REFRESH_SECRET=<strong-secret>
ALLOWED_ORIGINS=https://yourdomain.com
REDIS_URL=<production-redis>

# Frontend .env.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_PREFIX=/api/v1
NEXT_PUBLIC_ENABLE_HTTPS=true
```

For detailed deployment guide, see [INTEGRATION_GUIDE.md - Deployment section](./INTEGRATION_GUIDE.md)

---

## 📋 Common Commands

### Backend

```bash
cd backend

# Development
npm run dev                      # Start dev server with hot reload
npm run build                    # Build TypeScript
npm start                        # Start production build

# Database
npm run prisma:migrate          # Create & run migrations
npm run prisma:migrate:deploy   # Deploy migrations to production
npm run prisma:seed             # Seed sample data
npm run prisma:studio           # Open database GUI

# Code quality
npm run lint                    # Run ESLint
npm run format                  # Format with Prettier
npm run test                    # Run tests
```

### Frontend

```bash
cd frontend

# Development
npm run dev                      # Start dev server with hot reload
npm run build                    # Build for production
npm start                        # Start production build

# Code quality
npm run lint                    # Run ESLint
npm run format                  # Format with Prettier
npm run test                    # Run tests
npm run analyze                 # Analyze bundle size
```

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Ensure database is running
psql -U postgres

# Check PORT is not in use
lsof -i :5000

# Reinstall dependencies
npm install

# Run migrations
npm run prisma:migrate
```

### Frontend won't start

```bash
# Check backend is running on port 5000
curl http://localhost:5000/health

# Check NEXT_PUBLIC_API_URL in .env.local
cat frontend/.env.local

# Reinstall dependencies
npm install
```

### Can't login

```bash
# Verify user exists in database
npm run prisma:studio

# Check environment variables
cat backend/.env

# Verify JWT secrets are set
grep JWT_SECRET backend/.env
```

For more issues, see [QUICK_START.md - Troubleshooting](./QUICK_START.md)

---

## 📝 License

Proprietary - All rights reserved

---

## 👥 Support

For questions or issues:

1. Check relevant documentation file
2. Review Swagger API docs: `http://localhost:5000/api-docs`
3. Check browser console for frontend errors (F12)
4. Check backend logs in terminal
5. Review database: `npm run prisma:studio`

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Backend health check: `http://localhost:5000/health`
- [ ] Swagger UI loaded: `http://localhost:5000/api-docs`
- [ ] Frontend can access API
- [ ] Demo login works
- [ ] All pages load data
- [ ] Token refresh works
- [ ] Logout clears data
- [ ] Error handling works
- [ ] Rate limiting works
- [ ] Audit logging works
- [ ] All tests pass
- [ ] No console errors

See [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md) for detailed verification

---

## 🎓 Learning Resources

### Understanding the Code

1. **Start with**: [QUICK_START.md](./QUICK_START.md) (15 min)
2. **Then read**: [ARCHITECTURE.md](./ARCHITECTURE.md) (30 min)
3. **Code examples**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) (15 min)
4. **Deep dive**: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) (1 hour)

### Key Files to Review

- Frontend: `frontend/src/lib/api-services.ts` - All API endpoints
- Backend: `backend/src/app.ts` - Express setup
- Database: `backend/prisma/schema.prisma` - Data models
- Types: `frontend/src/lib/api-services.ts` - TypeScript interfaces

---

## 🎉 Ready to Get Started?

1. **Clone repository** and navigate to project
2. **Follow** [QUICK_START.md](./QUICK_START.md) (5 minutes)
3. **Log in** with demo account
4. **Explore** all pages and features
5. **Review** architecture and code
6. **Deploy** to production

**Happy coding! 🚀**

---

<div align="center">

**Built with ❤️ for pharmaceutical warehouse management**

*Production-Ready • Enterprise Security • Modern Stack*

</div>
