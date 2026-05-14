# Production Deployment Checklist

## Pre-Deployment Security Verification

- [ ] **Environment Variables**
  - [ ] All 20+ env vars are set in production
  - [ ] JWT secrets are at least 32 characters
  - [ ] Secrets stored in secure secrets manager (not .env file)
  - [ ] `NODE_ENV=production` is set
  - [ ] ALLOWED_ORIGINS configured correctly

- [ ] **Authentication & Tokens**
  - [ ] JWT_ACCESS_SECRET changed from default
  - [ ] JWT_REFRESH_SECRET changed from default
  - [ ] Access token expiry is 15m
  - [ ] Refresh tokens stored in Redis (not cookies)
  - [ ] Password hashing rounds set to 12+
  - [ ] Refresh token rotation on login

- [ ] **Database**
  - [ ] PostgreSQL 15+ running in production
  - [ ] Database connection string uses SSL/TLS
  - [ ] All Prisma migrations applied (`prisma migrate deploy`)
  - [ ] Database backups configured
  - [ ] Connection pooling enabled (PgBouncer or similar)

- [ ] **Cache & Sessions**
  - [ ] Redis 7+ running and healthy
  - [ ] Redis persistence enabled (RDB or AOF)
  - [ ] Redis replication configured for HA
  - [ ] Redis password authentication enabled
  - [ ] Refresh tokens TTL correctly set to 7 days

- [ ] **API Security**
  - [ ] HTTPS enforced (no HTTP in production)
  - [ ] HSTS header enabled (max-age: 31536000)
  - [ ] CORS origins whitelist configured
  - [ ] Rate limiting enabled on auth routes (10/15min)
  - [ ] Global rate limiting enabled (100/15min)
  - [ ] API key for webhooks is strong and unique
  - [ ] `X-API-Key` header validation active

- [ ] **File Uploads**
  - [ ] File size limits enforced (max 10MB)
  - [ ] MIME type validation enforced
  - [ ] Temp files deleted after processing
  - [ ] Upload directory outside web root
  - [ ] Virus scanning configured (optional)

- [ ] **Logging & Monitoring**
  - [ ] Winston logger configured
  - [ ] Log rotation enabled
  - [ ] Error logs sent to monitoring service
  - [ ] Stack traces disabled in production responses
  - [ ] No sensitive data logged (passwords, tokens, PII)
  - [ ] Audit logs written for all mutations

- [ ] **Role-Based Access Control**
  - [ ] Admin role can't be granted to regular users
  - [ ] Inspector role is read-only (tested)
  - [ ] Warehouse staff scoping enforced in code
  - [ ] Pharmacist dispatch permissions validated
  - [ ] All 25+ permissions working correctly

- [ ] **Error Handling**
  - [ ] Global error handler catches all errors
  - [ ] Stack traces not exposed in production
  - [ ] Standard error response format used
  - [ ] Validation errors return 422
  - [ ] Not found errors return 404
  - [ ] Permission denied returns 403

- [ ] **Cron Jobs**
  - [ ] Expiry check job running daily at 00:05
  - [ ] Job errors caught and logged
  - [ ] Job doesn't crash server on failure
  - [ ] Alerts created for near-expiry batches (30/60/90 days)
  - [ ] Expired batches marked as 'expired' status

- [ ] **Health Check & Monitoring**
  - [ ] Health endpoint `/health` returning 200
  - [ ] Database connectivity confirmed in health check
  - [ ] Redis connectivity confirmed in health check
  - [ ] Uptime tracking functional
  - [ ] Liveness probes configured (Kubernetes)

- [ ] **Performance**
  - [ ] Database indexes on frequently queried fields
  - [ ] N+1 query problems eliminated (Prisma includes used)
  - [ ] Compression middleware enabled
  - [ ] API response times < 500ms (p95)
  - [ ] Connection pooling optimized

- [ ] **Scaling & Reliability**
  - [ ] Stateless application (no server-side sessions)
  - [ ] Load balancing configured
  - [ ] Database replication/backup in place
  - [ ] Redis failover configured
  - [ ] Graceful shutdown handling implemented

- [ ] **Audit & Compliance**
  - [ ] Audit logs capturing user, action, entity, timestamp
  - [ ] Before/after state recorded for updates
  - [ ] IP address and User-Agent logged
  - [ ] Audit logs immutable and retained 90+ days
  - [ ] Data deletion policies documented

## Testing Checklist

- [ ] **Authentication Tests**
  - [ ] Register with valid data ✓
  - [ ] Register duplicate email returns 409 ✓
  - [ ] Login with correct credentials ✓
  - [ ] Login with wrong password returns 401 ✓
  - [ ] Access token required for protected routes ✓
  - [ ] Expired token returns 401 ✓
  - [ ] Refresh token works and returns new access token ✓
  - [ ] Logout invalidates refresh token ✓

- [ ] **RBAC Tests**
  - [ ] Admin can create users ✓
  - [ ] Pharmacist can't create users ✓
  - [ ] Inspector gets 403 on write operations ✓
  - [ ] Warehouse staff access limited to their warehouse ✓
  - [ ] All permission guards working ✓

- [ ] **Data Validation**
  - [ ] Required fields enforced ✓
  - [ ] Email format validated ✓
  - [ ] Expiry date must be in future ✓
  - [ ] Temperature ranges validated ✓
  - [ ] Batch number uniqueness enforced ✓
  - [ ] Quantity must be positive ✓

- [ ] **Business Logic**
  - [ ] Batch creation links drug and warehouse ✓
  - [ ] Dispatch reduces batch quantity ✓
  - [ ] Insufficient quantity prevents dispatch ✓
  - [ ] Batch scan finds by batch number ✓
  - [ ] Alert creation for near-expiry batches ✓
  - [ ] Status transitions valid ✓

- [ ] **Error Handling**
  - [ ] Database errors return 500 with generic message ✓
  - [ ] Validation errors return 422 with details ✓
  - [ ] Not found returns 404 ✓
  - [ ] Conflict errors return 409 ✓
  - [ ] Unauthorized returns 401 ✓
  - [ ] Forbidden returns 403 ✓

- [ ] **Rate Limiting**
  - [ ] Global limiter allows 100 requests/15min ✓
  - [ ] Auth limiter allows 10 requests/15min ✓
  - [ ] Import limiter allows 20 requests/hour ✓
  - [ ] Returns 429 when limit exceeded ✓

## Deployment Steps

### 1. Infrastructure Setup
```bash
# Provision PostgreSQL 15+ database
# Provision Redis 7+ cache
# Configure network security groups
# Setup SSL certificates
# Configure DNS records
```

### 2. Environment Configuration
```bash
# Create .env.production with production secrets
# Store secrets in secrets manager (AWS Secrets Manager, etc.)
# Configure log aggregation (CloudWatch, Datadog, etc.)
```

### 3. Database Migration
```bash
# Run Prisma migrations
npx prisma migrate deploy

# Verify all tables created
npx prisma db execute "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
```

### 4. Application Deployment
```bash
# Build production image
docker build -t pharmastock-backend:latest .

# Push to registry
docker push your-registry/pharmastock-backend:latest

# Deploy to orchestration platform
kubectl apply -f deployment.yaml

# Or run on server
npm run build && npm start
```

### 5. Post-Deployment Verification
```bash
# Check health endpoint
curl https://api.pharmastock.com/health

# Verify database connection
curl -H "Authorization: Bearer <token>" https://api.pharmastock.com/api/v1/warehouses

# Check logs
tail -f logs/combined.log

# Monitor uptime and errors
# Check alert notifications
```

### 6. Monitoring Setup
- [ ] APM configured (Datadog, New Relic, etc.)
- [ ] Log aggregation active
- [ ] Alerts configured for:
  - [ ] High error rate
  - [ ] Slow response times
  - [ ] Database connection failures
  - [ ] Redis connection failures
  - [ ] Disk space warnings

## Ongoing Maintenance

- [ ] Daily: Check error logs
- [ ] Weekly: Review performance metrics
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Annually: Full penetration test

---

**Status**: ✅ Ready for Production
