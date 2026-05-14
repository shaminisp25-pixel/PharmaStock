# Integration Setup & Verification Checklist

## Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Redis running (optional but recommended)
- `.env` files configured for both backend and frontend

---

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
# Copy and edit .env file
cp .env.example .env

# Required environment variables:
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/pharmastock
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=another-secret-here
ALLOWED_ORIGINS=http://localhost:3000
REDIS_URL=redis://localhost:6379
```

### 3. Setup Database

```bash
# Run Prisma migrations
npm run prisma:migrate

# (Optional) Seed sample data
npm run prisma:seed
```

### 4. Start Backend

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

✅ Backend should be running at `http://localhost:5000`

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_PREFIX=/api/v1
NEXT_PUBLIC_ENABLE_HTTPS=false
NEXT_PUBLIC_TOKEN_STORAGE=secure-localStorage
NEXT_PUBLIC_APP_NAME=PharmaStock
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_DEFAULT_PAGE_SIZE=10
```

### 3. Start Frontend

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

✅ Frontend should be running at `http://localhost:3000`

---

## Integration Verification

### Manual Testing

#### 1. Test Authentication

- [ ] Navigate to `http://localhost:3000/login`
- [ ] Try demo account:
  - Email: `john@pharmastock.com`
  - Password: `password123`
- [ ] Should redirect to dashboard
- [ ] Verify token stored in localStorage
- [ ] Refresh page - should stay logged in
- [ ] Check API requests have `Authorization` header

#### 2. Test Token Refresh

- [ ] Open browser DevTools (Network tab)
- [ ] Log in and wait 15 minutes OR
- [ ] Manually set `localStorage.access_token` expiry to now
- [ ] Make API request
- [ ] Should auto-refresh token
- [ ] Request should succeed

#### 3. Test API Endpoints

**Dashboard**

- [ ] Navigate to Dashboard
- [ ] Should load stats (expiry alerts, total alerts, drugs, stock)
- [ ] Stats should update in real-time

**Drugs**

- [ ] Navigate to Drugs page
- [ ] Should load drug list from API
- [ ] Search functionality works
- [ ] Pagination works

**Batches**

- [ ] Navigate to Batches page
- [ ] Should load batch list
- [ ] Filtering by status/warehouse works
- [ ] Expiry date colors show correctly (green/yellow/red)

**Alerts**

- [ ] Navigate to Alerts page
- [ ] Should load alerts from API
- [ ] Stats at top show correct counts
- [ ] Can filter by type and warehouse

**Reports, Users, Audit**

- [ ] Pages load without errors
- [ ] API calls succeed

#### 4. Test Error Handling

**401 Unauthorized**

- [ ] Delete `localStorage.access_token`
- [ ] Refresh dashboard page
- [ ] Should redirect to login
- [ ] Error message appears

**404 Not Found**

- [ ] Navigate to non-existent path like `/invalid`
- [ ] Should show 404 error

**Network Error**

- [ ] Open DevTools → Network tab
- [ ] Throttle network (slow 3G)
- [ ] Make API request
- [ ] Should show loading state and handle timeout

**Rate Limiting (429)**

- [ ] Make 101 requests rapidly to backend
- [ ] Should see rate limit error
- [ ] Frontend auto-retries

#### 5. Test Registration

- [ ] Navigate to `/register`
- [ ] Fill in registration form
- [ ] Submit
- [ ] Should create user and auto-login
- [ ] Should redirect to dashboard

#### 6. Test Logout

- [ ] On any page, logout (via profile menu or API call)
- [ ] `localStorage` should be cleared
- [ ] Should redirect to login
- [ ] Refresh token cookie should be cleared

---

## API Integration Checklist

### Authentication Endpoints

- [ ] POST `/auth/register` - Creates new user
- [ ] POST `/auth/login` - Authenticates and returns tokens
- [ ] POST `/auth/refresh` - Refreshes access token
- [ ] POST `/auth/logout` - Logs out user
- [ ] POST `/auth/change-password` - Changes password

### Drug Endpoints

- [ ] GET `/drugs` - Lists all drugs (paginated)
- [ ] GET `/drugs/{id}` - Gets single drug
- [ ] POST `/drugs` - Creates new drug
- [ ] PATCH `/drugs/{id}` - Updates drug
- [ ] DELETE `/drugs/{id}` - Deletes drug
- [ ] GET `/drugs/search?q=term` - Searches drugs

### Batch Endpoints

- [ ] GET `/batches` - Lists all batches
- [ ] GET `/batches/{id}` - Gets single batch
- [ ] POST `/batches` - Creates new batch
- [ ] PATCH `/batches/{id}` - Updates batch
- [ ] PATCH `/batches/{id}/status` - Updates batch status
- [ ] POST `/batches/{id}/dispatch` - Dispatches batch
- [ ] POST `/batches/scan` - Scans batch barcode
- [ ] DELETE `/batches/{id}` - Deletes batch
- [ ] GET `/batches/stats/expiry` - Gets expiry statistics

### Alert Endpoints

- [ ] GET `/alerts` - Lists all alerts
- [ ] GET `/alerts/{id}` - Gets single alert
- [ ] PATCH `/alerts/{id}/resolve` - Resolves alert
- [ ] DELETE `/alerts/{id}` - Deletes alert
- [ ] GET `/alerts/stats` - Gets alert statistics

### User Endpoints

- [ ] GET `/users` - Lists all users
- [ ] GET `/users/me` - Gets current user
- [ ] GET `/users/{id}` - Gets single user
- [ ] POST `/users` - Creates new user
- [ ] PATCH `/users/{id}` - Updates user
- [ ] DELETE `/users/{id}` - Deletes user
- [ ] PATCH `/users/{id}/role` - Updates user role
- [ ] PATCH `/users/{id}/warehouse` - Updates user warehouse

### Report Endpoints

- [ ] POST `/reports/expiry` - Generates expiry report
- [ ] POST `/reports/dispatch` - Generates dispatch report
- [ ] POST `/reports/stock` - Generates stock report
- [ ] POST `/reports/temperature` - Generates temperature report
- [ ] GET `/reports/{id}/export` - Exports report

### Audit Endpoints

- [ ] GET `/audit` - Lists audit logs
- [ ] GET `/audit/export` - Exports audit logs

### Import Endpoints

- [ ] POST `/import` - Uploads file
- [ ] POST `/import/validate` - Validates file

---

## Security Verification

### Frontend Security

- [ ] HTTPS enabled in production
- [ ] Access tokens in localStorage (not XSS-proof but readable)
- [ ] Refresh tokens in httpOnly cookies (XSS-proof)
- [ ] No sensitive data in localStorage
- [ ] No API keys exposed in frontend code
- [ ] Environment variables properly configured

### Backend Security

- [ ] Helmet headers enabled
- [ ] CORS properly configured
- [ ] HTTPS enforced in production
- [ ] Rate limiting enabled
- [ ] Input validation with Zod
- [ ] SQL injection prevention via Prisma
- [ ] Password hashing with bcrypt
- [ ] JWT secrets strong and unique
- [ ] Error messages don't expose sensitive info
- [ ] Audit logging enabled

---

## Performance Checklist

### Frontend

- [ ] Dashboard loads < 2 seconds
- [ ] Drug list loads < 1 second
- [ ] Search is responsive
- [ ] Pagination works smoothly
- [ ] Images optimized
- [ ] No console errors
- [ ] No memory leaks

### Backend

- [ ] Database queries optimized
- [ ] No N+1 queries
- [ ] Indexes created on foreign keys
- [ ] Cache working (Redis)
- [ ] Response times < 500ms
- [ ] No timeout errors

---

## Deployment Readiness

### Pre-Deployment

- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Logs configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] SSL certificates ready
- [ ] DNS configured
- [ ] CDN configured (if applicable)

### Deployment Steps

**Backend**

```bash
# Build
npm run build

# Verify build
npm run lint

# Run tests
npm run test

# Deploy to production
# (Use your deployment tool: Docker, PM2, Kubernetes, etc.)
```

**Frontend**

```bash
# Build
npm run build

# Verify build
ls -la .next

# Deploy to production
# (Use your hosting: Vercel, Netlify, AWS, etc.)
```

---

## Monitoring Setup

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npm install @sentry/node
```

### DataDog (APM)

```bash
npm install dd-trace
```

### LogRocket (Session Replay)

```bash
npm install logrocket
```

---

## Common Issues & Solutions

### Issue: 401 Unauthorized on API calls

**Solution:**

- Check if token is in localStorage
- Verify backend JWT_SECRET matches
- Check token expiry
- Try refreshing token

### Issue: CORS Error

**Solution:**

- Add frontend URL to ALLOWED_ORIGINS
- Check credentials: true in fetch
- Verify preflight requests allowed

### Issue: API timeout

**Solution:**

- Check backend is running
- Verify network connectivity
- Increase timeout in api-client.ts
- Check for slow database queries

### Issue: Can't login

**Solution:**

- Verify user exists in database
- Check password hashing
- Verify JWT secrets configured
- Check environment variables

### Issue: Token not refreshing

**Solution:**

- Check refreshToken in cookies
- Verify refresh endpoint works
- Check JWT_REFRESH_SECRET
- Monitor network tab

---

## Support Resources

- **API Documentation**: `http://localhost:5000/api-docs`
- **Backend README**: `/backend/README.md`
- **Backend Setup Guide**: `/backend/SETUP_GUIDE.md`
- **Integration Guide**: `/INTEGRATION_GUIDE.md`
- **Implementation Summary**: `/backend/IMPLEMENTATION_SUMMARY.md`

---

## Sign Off

- [ ] All checklist items completed
- [ ] System tested and verified
- [ ] Ready for production deployment
- [ ] Team trained on system
- [ ] Documentation updated
- [ ] Monitoring alerts configured

**Date**: ******\_\_\_\_******
**Team**: ******\_\_\_\_******
