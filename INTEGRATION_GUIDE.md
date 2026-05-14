# Backend & Frontend Integration Guide

## Production-Level Secure Integration

This document outlines the complete integration between the PharmaStock backend and frontend with production-level security measures.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Security Implementation](#security-implementation)
3. [Authentication Flow](#authentication-flow)
4. [API Communication](#api-communication)
5. [Error Handling](#error-handling)
6. [Data Validation](#data-validation)
7. [Deployment](#deployment)
8. [Testing](#testing)

---

## Architecture Overview

### Layers

```
┌─────────────────────────────────────────┐
│      Frontend (Next.js)                  │
├─────────────────────────────────────────┤
│  UI Components | Pages                   │
│  ↓                                       │
│  Auth Context | State Management         │
│  ↓                                       │
│  API Services Layer                      │
│  ↓                                       │
│  HTTP Client (Secure)                    │
├─────────────────────────────────────────┤
│      Network (HTTPS)                     │
├─────────────────────────────────────────┤
│      Backend (Express.js)                │
├─────────────────────────────────────────┤
│  Rate Limiting | CORS                    │
│  ↓                                       │
│  Authentication Middleware               │
│  ↓                                       │
│  RBAC & Authorization                    │
│  ↓                                       │
│  Route Handlers                          │
│  ↓                                       │
│  Services & Business Logic                │
│  ↓                                       │
│  Database & External APIs                 │
└─────────────────────────────────────────┘
```

### Frontend Structure

```
src/lib/
├── api-client.ts          # HTTP Client with token management
├── api-services.ts        # Typed API endpoints
└── auth-context.tsx       # Global authentication state

app/
├── layout.tsx             # Root layout with providers
├── page.tsx               # Home/redirect page
├── login/page.tsx         # Login page
├── register/page.tsx      # Registration page
├── dashboard/page.tsx     # Dashboard
├── drugs/page.tsx         # Drug catalog
├── batches/page.tsx       # Batch management
├── alerts/page.tsx        # Alerts
├── reports/page.tsx       # Reports
├── users/page.tsx         # User management
└── audit/page.tsx         # Audit logs
```

---

## Security Implementation

### 1. Token Management

**Access Token**
- Short-lived (15 minutes)
- Stored in localStorage (for SPA accessibility)
- Sent in `Authorization: Bearer <token>` header
- Automatically refreshed before expiration

**Refresh Token**
- Long-lived (7 days)
- HttpOnly cookie (server set-cookie)
- Used only for token refresh endpoint
- Rotated on each refresh

```typescript
// api-client.ts
private async refreshAccessToken(): Promise<string> {
  const response = await fetch(`${this.baseUrl}/auth/refresh`, {
    method: 'POST',
    credentials: 'include', // Sends httpOnly cookies
  });

  const data = await response.json();
  const newToken = data.data?.accessToken;
  this.setTokens(newToken);
  return newToken;
}
```

### 2. CORS Configuration

Backend (`src/app.ts`):
```typescript
app.use(cors({
  origin: env.ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
}));
```

Frontend (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_PREFIX=/api/v1
```

### 3. Security Headers

Backend implements:
- **Helmet.js** - Sets HTTP security headers
- **HSTS** - Enforces HTTPS
- **CSP** - Prevents XSS attacks
- **X-Frame-Options** - Prevents clickjacking
- **X-Content-Type-Options** - Prevents MIME type sniffing

### 4. Rate Limiting

Backend:
- Global rate limit: 100 requests/15 minutes per IP
- Auth endpoints: 5 requests/15 minutes (stricter)
- Automatically enforced by middleware

Frontend:
- Retries with exponential backoff on 429 responses
- Max retry: 10 seconds

### 5. Input Validation

Frontend:
- Client-side validation for UX
- Form field validation
- File type/size validation

Backend:
- Zod schema validation on all endpoints
- Sanitizes and validates all inputs
- Rejects unknown fields

### 6. Error Handling

Errors are never exposed to frontend:
- Server errors (500) return generic message
- Stack traces logged internally only
- Sensitive data filtered from responses

---

## Authentication Flow

### Registration Flow

```
User → Register Page → AuthService.register()
    ↓
HTTP POST /auth/register (skipAuth: true)
    ↓
Backend validates input → Creates user → Hashes password
    ↓
HTTP 201 Created → Returns user data
    ↓
Frontend auto-logs in user
    ↓
useAuth({ email, password }) → login()
    ↓
Stores tokens + user data in localStorage
    ↓
Redirects to /dashboard
```

### Login Flow

```
User → Login Page → Email + Password
    ↓
AuthService.login(email, password)
    ↓
HTTP POST /auth/login (skipAuth: true)
    ↓
Backend validates credentials → Generates tokens
    ↓
Sets refreshToken in httpOnly cookie
    ↓
HTTP 200 OK → Returns { user, accessToken }
    ↓
Frontend stores accessToken in localStorage
    ↓
AuthContext updates with user data
    ↓
useRequireAuth() hook validates on page load
    ↓
Redirects to /dashboard if authenticated
```

### Token Refresh Flow

```
API Request with expired token
    ↓
Response 401 Unauthorized
    ↓
apiClient detects 401 → Calls refreshAccessToken()
    ↓
HTTP POST /auth/refresh (with httpOnly cookie)
    ↓
Backend validates refreshToken → Generates new accessToken
    ↓
Sets new refreshToken in httpOnly cookie
    ↓
HTTP 200 OK → Returns { accessToken }
    ↓
Frontend stores new accessToken
    ↓
Retries original request with new token
    ↓
If refresh fails → Logout user & redirect to /login
```

### Logout Flow

```
User clicks Logout
    ↓
useAuth().logout()
    ↓
HTTP POST /auth/logout
    ↓
Backend invalidates refresh token
    ↓
Frontend clears localStorage
    ↓
AuthContext resets to null
    ↓
Redirects to /login
```

---

## API Communication

### HTTP Client Features

**Automatic Request Retries**
```typescript
// Retries on:
// - 408 Request Timeout
// - 429 Too Many Requests
// - 5xx Server Errors

// Exponential backoff: 1s, 2s, 4s, 8s, 10s (max)
// Max 3 retries
```

**Request Interceptors**
```typescript
private buildHeaders(options: RequestOptions) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!options.skipAuth) {
    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}
```

**Response Interceptors**
```typescript
if (!response.ok) {
  if (response.status === 401) {
    // Handle token refresh
  }
  if (response.status === 429) {
    // Handle rate limiting
  }
  if (response.status >= 500) {
    // Retry server errors
  }
  
  throw this.handleError(response);
}
```

### Typed API Services

All API endpoints are strongly typed:

```typescript
// drugs/page.tsx
const data = await DrugService.getAll(page, 10, searchTerm);
// Returns: Paginated<Drug>

const drug = await DrugService.getById(id);
// Returns: Drug

await DrugService.create({
  name: 'New Drug',
  manufacturer: 'Bayer',
  // ... other fields
});
// Returns: Drug with ID
```

### API Endpoints Reference

| Service | Method | Endpoint | Auth | Permissions |
|---------|--------|----------|------|-------------|
| **Auth** | POST | /auth/register | No | - |
| | POST | /auth/login | No | - |
| | POST | /auth/refresh | Yes | - |
| | POST | /auth/logout | Yes | - |
| | POST | /auth/change-password | Yes | - |
| **Drugs** | GET | /drugs | Yes | drugs:read |
| | GET | /drugs/{id} | Yes | drugs:read |
| | POST | /drugs | Yes | drugs:create |
| | PATCH | /drugs/{id} | Yes | drugs:update |
| | DELETE | /drugs/{id} | Yes | drugs:delete |
| **Batches** | GET | /batches | Yes | batches:read |
| | GET | /batches/{id} | Yes | batches:read |
| | POST | /batches | Yes | batches:create |
| | PATCH | /batches/{id} | Yes | batches:update |
| | POST | /batches/{id}/dispatch | Yes | batches:dispatch |
| | POST | /batches/scan | Yes | batches:read |
| **Alerts** | GET | /alerts | Yes | alerts:read |
| | GET | /alerts/{id} | Yes | alerts:read |
| | PATCH | /alerts/{id}/resolve | Yes | alerts:resolve |
| **Users** | GET | /users | Yes | users:read |
| | GET | /users/me | Yes | - |
| | POST | /users | Yes | users:create |
| | PATCH | /users/{id} | Yes | users:update |
| | DELETE | /users/{id} | Yes | users:delete |
| **Reports** | POST | /reports/expiry | Yes | reports:generate |
| | POST | /reports/dispatch | Yes | reports:generate |
| | GET | /reports/{id}/export | Yes | reports:export |
| **Import** | POST | /import | Yes | import:upload |
| **Audit** | GET | /audit | Yes | audit:read |
| | GET | /audit/export | Yes | audit:export |

---

## Error Handling

### Frontend Error Handling

```typescript
try {
  const data = await DrugService.getAll(page, 10);
  setDrugs(data.data);
} catch (err) {
  // Error is already standardized by apiClient
  const message = err instanceof Error 
    ? err.message 
    : 'Failed to load drugs';
  
  setError(message);
  
  // User-friendly messages:
  // - Network errors
  // - 401: "Please log in again"
  // - 403: "You don't have permission"
  // - 404: "Resource not found"
  // - 429: "Too many requests, please try again"
  // - 5xx: "Server error, please try again"
}
```

### Error Recovery Strategies

1. **Auto-Retry** (Automatic)
   - Network timeouts
   - Server errors (5xx)
   - Rate limiting (429)

2. **Manual Retry** (User)
   - Display error message with retry button
   - Show error toast notification
   - Log error for debugging

3. **Token Refresh** (Automatic)
   - Detects 401 Unauthorized
   - Refreshes token automatically
   - Retries request with new token

4. **Session Expiry** (Redirect)
   - Refresh token invalid
   - Clears localStorage
   - Redirects to /login

---

## Data Validation

### Frontend Validation

**Login Form**
```typescript
if (!email || !password) {
  setError('Please fill in all fields');
  return;
}

if (!email.includes('@')) {
  setError('Please enter a valid email address');
  return;
}

if (password.length < 8) {
  setError('Password must be at least 8 characters');
  return;
}
```

**File Upload Validation**
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

if (file.size > MAX_FILE_SIZE) {
  setError('File size exceeds 5MB limit');
  return;
}

if (!['application/vnd.ms-excel', 'text/csv'].includes(file.type)) {
  setError('Only CSV and Excel files are supported');
  return;
}
```

### Backend Validation

**Zod Schema**
```typescript
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(255),
  role: z.enum(['ADMIN', 'MANAGER', 'WAREHOUSE_STAFF', 'VIEWER']),
});
```

**Request Validation Middleware**
```typescript
router.post(
  '/register',
  validate(registerSchema),  // Validates request body
  AuthController.register,
);
```

---

## Deployment

### Environment Configuration

Frontend (`.env.local`):
```
# API Configuration
NEXT_PUBLIC_API_URL=https://api.pharmastock.com
NEXT_PUBLIC_API_PREFIX=/api/v1

# Security
NEXT_PUBLIC_ENABLE_HTTPS=true
NEXT_PUBLIC_TOKEN_STORAGE=secure-localStorage

# App Configuration
NEXT_PUBLIC_APP_NAME=PharmaStock
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_DEFAULT_PAGE_SIZE=10
```

Backend (`.env`):
```
# Server
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v1

# Database
DATABASE_URL=postgresql://user:pass@host:5432/pharmastock

# JWT
JWT_SECRET=<very-long-random-string>
JWT_REFRESH_SECRET=<another-long-random-string>
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
ALLOWED_ORIGINS=https://pharmastock.com,https://www.pharmastock.com

# Redis
REDIS_URL=redis://redis:6379

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Docker Deployment

Frontend Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Backend Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

Docker Compose:
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:5000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/pharmastock
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: pharmastock
      POSTGRES_PASSWORD: password

  redis:
    image: redis:7-alpine
```

---

## Testing

### Frontend Testing

**Unit Tests (Jest + React Testing Library)**
```typescript
describe('AuthService', () => {
  it('should login with valid credentials', async () => {
    const result = await AuthService.login(
      'user@test.com',
      'password123'
    );
    
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('user');
  });

  it('should throw error on invalid credentials', async () => {
    await expect(
      AuthService.login('user@test.com', 'wrong')
    ).rejects.toThrow();
  });
});
```

**Integration Tests**
```typescript
describe('Login Flow', () => {
  it('should login and redirect to dashboard', async () => {
    render(<LoginPage />);
    
    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      'user@test.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText(/password/i),
      'password123'
    );
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });
});
```

### Backend Testing

**API Tests (Supertest)**
```typescript
describe('GET /api/v1/drugs', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/v1/drugs');
    expect(res.status).toBe(401);
  });

  it('should return drugs with valid token', async () => {
    const res = await request(app)
      .get('/api/v1/drugs')
      .set('Authorization', `Bearer ${validToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
```

---

## Performance Optimization

### Frontend Optimizations

1. **Code Splitting**
   - Route-based code splitting with Next.js
   - Lazy load heavy components

2. **API Call Optimization**
   - Parallel requests: `Promise.all()`
   - Pagination: Load 10 items at a time
   - Caching: Use React Query or SWR

3. **Bundle Size**
   - Tree shaking unused code
   - Minimize dependencies
   - Use dynamic imports

### Backend Optimizations

1. **Database**
   - Indexes on frequently queried fields
   - Connection pooling
   - Query optimization

2. **Caching**
   - Redis caching for expensive queries
   - Token blacklist caching
   - Session caching

3. **Load Balancing**
   - Multiple backend instances
   - Load balancer (nginx/HAProxy)
   - Sticky sessions for API compatibility

---

## Monitoring & Logging

### Frontend Logging
```typescript
// src/utils/logger.ts
import { apiClient } from './api-client';

export const logError = (error: Error) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service (Sentry, DataDog, etc.)
    fetch('/api/v1/logs', {
      method: 'POST',
      body: JSON.stringify({ error: error.message, stack: error.stack }),
    });
  } else {
    console.error(error);
  }
};
```

### Backend Logging
```typescript
// Uses Winston logger
logger.info('User logged in', { userId, timestamp });
logger.warn('Rate limit exceeded', { ip, limit });
logger.error('Database connection failed', { error });
```

### Metrics to Monitor

1. **API Performance**
   - Response times
   - Error rates
   - Throughput

2. **Authentication**
   - Login success/failure rates
   - Token refresh rates
   - Session duration

3. **Data**
   - Database query times
   - Cache hit rates
   - Slow queries

---

## Checklist for Production

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Redis replication configured
- [ ] Monitoring and alerting set up
- [ ] Error tracking (Sentry, DataDog)
- [ ] Analytics configured
- [ ] Load balancing configured
- [ ] SSL certificates installed
- [ ] Rate limiting tuned
- [ ] Logging configured
- [ ] Security headers verified
- [ ] API documentation deployed
- [ ] CORS origins verified
- [ ] Deployment scripts automated
- [ ] Disaster recovery plan documented

---

## Support & Troubleshooting

### Common Issues

**Token Refresh Loop**
- Check JWT secrets match between backend and frontend
- Verify refreshToken cookie is being set
- Check token expiry times

**CORS Errors**
- Verify ALLOWED_ORIGINS environment variable
- Check credentials: true in fetch options
- Verify preflight requests are allowed

**API Timeouts**
- Increase timeout in api-client.ts
- Check backend performance
- Verify network connectivity

**Login Redirects to Login**
- Check if refreshToken is valid
- Verify localStorage access
- Check browser cookie settings

---

## Contact & Support

For issues or questions, please contact the PharmaStock development team.
