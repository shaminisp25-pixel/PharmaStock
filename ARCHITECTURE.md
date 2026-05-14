# System Architecture & Data Flow

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER (HTTPS)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    NEXT.JS FRONTEND                              │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                   │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │              UI PAGES & COMPONENTS                          │ │  │
│  │  ├─────────────────────────────────────────────────────────────┤ │  │
│  │  │  • Dashboard     • Drugs      • Batches                     │ │  │
│  │  │  • Alerts        • Reports    • Users                       │ │  │
│  │  │  • Audit         • Login      • Register                    │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                         ↓                                           │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │            AUTH CONTEXT (Global State)                      │ │  │
│  │  ├─────────────────────────────────────────────────────────────┤ │  │
│  │  │  User Data  │ Tokens  │ Auth Status  │ Error Handling      │ │  │
│  │  │  useAuth() hook, useHasRole(), useRequireAuth()            │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                         ↓                                           │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │              API SERVICES LAYER                             │ │  │
│  │  ├─────────────────────────────────────────────────────────────┤ │  │
│  │  │  Typed services for all backend endpoints:                  │ │  │
│  │  │  • AuthService    • DrugService    • BatchService           │ │  │
│  │  │  • AlertService   • UserService    • ReportService          │ │  │
│  │  │  • ImportService  • WarehouseService  • AuditService        │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                         ↓                                           │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │          SECURE HTTP CLIENT                                 │ │  │
│  │  ├─────────────────────────────────────────────────────────────┤ │  │
│  │  │  • Token Management (Access + Refresh)                      │ │  │
│  │  │  • Automatic Token Refresh on 401                           │ │  │
│  │  │  • Retry Logic (Exponential Backoff)                        │ │  │
│  │  │  • Request/Response Interceptors                            │ │  │
│  │  │  • Error Standardization                                    │ │  │
│  │  │  • CORS with Credentials                                    │ │  │
│  │  │  • Rate Limit Handling                                      │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                         ↓                                           │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │            localStorage / Cookies                           │ │  │
│  │  ├─────────────────────────────────────────────────────────────┤ │  │
│  │  │  localStorage:        │  HttpOnly Cookies:                  │ │  │
│  │  │  • access_token       │  • refreshToken (HttpOnly)          │ │  │
│  │  │  • user               │  • Secure flag on HTTPS             │ │  │
│  │  │  • refresh_token      │                                     │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────┬──────────────────┘
                                                        │
                                HTTPS (TLS/SSL)         │
                                                        │
┌──────────────────────────────────────────────────────┴──────────────────┐
│                      BACKEND SERVER (EXPRESS.JS)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              SECURITY & MIDDLEWARE LAYER                         │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │  1. Helmet.js Security Headers                                   │  │
│  │  2. CORS Validation (Check Origin)                               │  │
│  │  3. Rate Limiting (100 req/15min, 5 for auth)                   │  │
│  │  4. HSTS (Force HTTPS)                                           │  │
│  │  5. Morgan/Winston Logging                                       │  │
│  │  6. Body Parser (JSON)                                           │  │
│  │  7. Compression (GZIP)                                           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                         ↓                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │         AUTHENTICATION & AUTHORIZATION                           │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │  • JWT Verification (Access Token)                              │  │
│  │  • RBAC (Role-Based Access Control)                             │  │
│  │  • Permission Validation                                        │  │
│  │  • Warehouse Scoping                                            │  │
│  │  • Audit Logging                                                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                         ↓                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              INPUT VALIDATION LAYER                              │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │  • Zod Schema Validation                                         │  │
│  │  • Data Sanitization                                             │  │
│  │  • Type Checking                                                 │  │
│  │  • Reject Unknown Fields                                         │  │
│  │  • File Type & Size Validation                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                         ↓                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              ROUTE HANDLERS & CONTROLLERS                        │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │  • Auth Controller (Register, Login, Refresh, Logout)           │  │
│  │  • Drug Controller (CRUD + Search)                              │  │
│  │  • Batch Controller (CRUD + Dispatch + Scan)                    │  │
│  │  • Alert Controller (Get + Resolve)                             │  │
│  │  • User Controller (CRUD + Role Assignment)                     │  │
│  │  • Report Controller (Generate + Export)                        │  │
│  │  • Import Controller (Upload + Validate)                        │  │
│  │  • Audit Controller (Query + Export)                            │  │
│  │  • Warehouse Controller (CRUD)                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                         ↓                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              BUSINESS LOGIC SERVICES                             │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │  • Auth Service (JWT generation, password hashing)              │  │
│  │  • Drug Service (CRUD operations)                               │  │
│  │  • Batch Service (Inventory management)                         │  │
│  │  • Alert Service (Alert generation and resolution)              │  │
│  │  • User Service (User management)                               │  │
│  │  • Warehouse Service (Storage management)                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                         ↓                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │         DATA ACCESS LAYER (Prisma ORM)                           │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │  • SQL Injection Prevention                                      │  │
│  │  • Connection Pooling                                           │  │
│  │  • Query Optimization                                           │  │
│  │  • Migration Management                                         │  │
│  │  • Type-Safe Database Queries                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                         ↓                                                │
│  ┌────────────────┬──────────────────┬──────────────────────────────┐  │
│  │   PostgreSQL   │      Redis       │    External Services         │  │
│  │                │                  │                              │  │
│  │  • Users       │  • Sessions      │  • File Storage              │  │
│  │  • Drugs       │  • Tokens        │  • Email Service             │  │
│  │  • Batches     │  • Cache         │  • Analytics                 │  │
│  │  • Alerts      │  • Blacklist     │                              │  │
│  │  • Audit Logs  │                  │                              │  │
│  │  • Warehouses  │                  │                              │  │
│  │  • Reports     │                  │                              │  │
│  └────────────────┴──────────────────┴──────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Request Flow: User Login

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User fills login form                                          │
│  • email: user@pharmastock.com                                 │
│  • password: password123                                        │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  useAuth().login(email, password)                              │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  AuthService.login()                                           │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  apiClient.post('/auth/login', { email, password })            │
│  • Build headers (no auth needed)                              │
│  • Send request with JSON body                                 │
│                                                                 │
│  ↓ (HTTPS)                                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                       BACKEND                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Middleware Stack:                                              │
│  1. Rate Limit Check: 5 reqs/15min for /auth/login             │
│  2. CORS Validation: Check Origin header                        │
│  3. JSON Parser: Parse request body                             │
│  4. Helmet: Add security headers                                │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  Route: POST /auth/login                                        │
│  • Validation Middleware: Validate with Zod schema              │
│    - Check email format                                         │
│    - Check password is string                                   │
│  • Auth Controller                                              │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  AuthService.login(email, password)                            │
│  1. Query database: Find user by email                          │
│  2. Compare passwords: bcrypt.compare()                         │
│  3. If match:                                                   │
│     - Generate Access Token (15 min expiry)                     │
│     - Generate Refresh Token (7 days expiry)                    │
│     - Store refresh token in Redis (for blacklist)              │
│  4. If no match:                                                │
│     - Throw: "Invalid credentials"                              │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  Return Response (HTTP 200):                                    │
│  {                                                              │
│    "status": "success",                                         │
│    "data": {                                                    │
│      "user": { id, name, email, role, ... },                   │
│      "accessToken": "eyJhbGc..."                               │
│    }                                                            │
│  }                                                              │
│                                                                 │
│  Set-Cookie Header:                                             │
│  • refreshToken=<token>; HttpOnly; Secure; SameSite=Strict     │
│                                                                 │
│  ↓ (HTTPS)                                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                         BROWSER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Parse Response (HTTP 200)                                      │
│  • Extract accessToken from data                                │
│  • Extract user from data                                       │
│  • Browser automatically stores refreshToken in HttpOnly cookie │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  apiClient.setAuthData(user, accessToken)                      │
│  • Store accessToken in localStorage                            │
│  • Store user in localStorage                                   │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  useAuth context updates:                                       │
│  • user = { ... }                                              │
│  • isAuthenticated = true                                       │
│  • isLoading = false                                            │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  Components re-render                                           │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  useRequireAuth() on /dashboard validates:                      │
│  • user exists? YES → continue                                 │
│  • isAuthenticated? YES → continue                              │
│  • Render dashboard                                             │
│                                                                 │
│  ✅ Success!                                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow: API Call with Token Refresh

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Component: app/drugs/page.tsx                                       │
│                                                                      │
│  const drugs = await DrugService.getAll(1, 10)                      │
│                                                                      │
│  ↓                                                                   │
│                                                                      │
│  DrugService.getAll(page, limit) calls:                             │
│  apiClient.get('/drugs?page=1&limit=10')                            │
│                                                                      │
│  ↓                                                                   │
│                                                                      │
│  apiClient.buildHeaders()                                            │
│  • Get accessToken from localStorage                                 │
│  • If token exists:                                                 │
│    Authorization: "Bearer eyJhbGc..."                               │
│                                                                      │
│  ↓                                                                   │
│                                                                      │
│  fetch('/api/v1/drugs?page=1&limit=10', {                           │
│    headers: {                                                        │
│      'Content-Type': 'application/json',                             │
│      'Authorization': 'Bearer <token>',  ← Token may be expired!    │
│    }                                                                 │
│  })                                                                  │
│                                                                      │
│  ↓ (HTTPS)                                                           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                         BACKEND                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Middleware:                                                         │
│  • Rate Limit Check: OK                                              │
│  • CORS: OK                                                          │
│                                                                      │
│  ↓                                                                   │
│                                                                      │
│  Auth Middleware:                                                    │
│  • Extract token from Authorization header                           │
│  • Verify JWT signature                                              │
│  • Check expiry: jwt.decode(token, { complete: true })              │
│                                                                      │
│  Case 1: Token Valid                                                 │
│  ───────────────────────────────────────────────────────────────── │
│  • Set req.user = decoded token data                                │
│  • Continue to controller                                           │
│  • Return list of drugs                                             │
│  • Response HTTP 200                                                │
│                                                                      │
│  ↓ (HTTPS)                                                           │
│                                                                      │
│  ✅ Frontend receives drug list                                      │
│                                                                      │
│  Case 2: Token Expired ← THIS CASE                                   │
│  ───────────────────────────────────────────────────────────────── │
│  • Verify JWT throws error: "jwt expired"                           │
│  • Auth middleware catches error                                    │
│  • Return HTTP 401 Unauthorized                                     │
│  • Response body: { status: 'error', message: 'Token expired' }     │
│                                                                      │
│  ↓ (HTTPS)                                                           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                         FRONTEND                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  apiClient.handleResponse()                                          │
│  • Receives HTTP 401                                                 │
│  • Detects status === 401                                            │
│  • NOT a network error, so NO retry                                 │
│                                                                      │
│  ↓                                                                   │
│                                                                      │
│  apiClient.refreshAccessToken()                                      │
│  • Check if refresh already in progress                              │
│    (prevents concurrent refresh requests)                            │
│  • If already in progress: await existing promise                    │
│  • If not:                                                           │
│    1. POST /auth/refresh                                             │
│    2. Credentials: 'include' (sends HttpOnly refreshToken cookie)    │
│                                                                      │
│  ↓ (HTTPS)                                                           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                         BACKEND                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Route: POST /auth/refresh                                           │
│  • Extract refreshToken from HttpOnly cookie                        │
│  • Verify JWT signature                                              │
│  • Check if token is NOT in Redis blacklist                          │
│  • Generate new accessToken                                          │
│  • Generate new refreshToken (rotation)                              │
│  • Store new refreshToken in Redis                                  │
│  • Delete old refreshToken from Redis                                │
│                                                                      │
│  ↓                                                                   │
│                                                                      │
│  Return HTTP 200:                                                    │
│  {                                                                   │
│    "data": {                                                         │
│      "accessToken": "eyJhbGc..." ← NEW TOKEN                        │
│    }                                                                 │
│  }                                                                   │
│                                                                      │
│  Set-Cookie Header:                                                  │
│  • refreshToken=<NEW_TOKEN>; HttpOnly; Secure                      │
│                                                                      │
│  ↓ (HTTPS)                                                           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                         FRONTEND                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  apiClient.refreshAccessToken() succeeds                             │
│  • Extract newAccessToken from response                              │
│  • Store newAccessToken in localStorage                              │
│  • Clear previous refresh promise                                    │
│                                                                      │
│  ↓                                                                   │
│                                                                      │
│  Retry Original Request:                                             │
│  • GET /drugs?page=1&limit=10                                        │
│  • Authorization: "Bearer <NEW_TOKEN>"                               │
│                                                                      │
│  ↓ (HTTPS)                                                           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                         BACKEND                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Auth Middleware:                                                    │
│  • Extract NEW token                                                 │
│  • Verify JWT signature: ✓ Valid                                    │
│  • Check expiry: ✓ Not expired                                      │
│  • Set req.user = decoded data                                      │
│  • Continue                                                          │
│                                                                      │
│  ↓                                                                   │
│                                                                      │
│  DrugController.getAll()                                             │
│  • Query database for drugs                                          │
│  • Return HTTP 200 with drug list                                    │
│                                                                      │
│  ↓ (HTTPS)                                                           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                         FRONTEND                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Parse successful response                                           │
│  • Extract drug data                                                 │
│  • Update component state                                            │
│  • Re-render with new data                                           │
│                                                                      │
│  ✅ Success! All transparent to user                                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Retry Logic: Network Error Recovery

```
Request fails with 500 Server Error
    ↓
apiClient.handleError()
    ↓
Is retryable? (408, 429, 5xx)
    ├─ YES:
    │   ↓
    │   retryCount = 1
    │   ↓
    │   Exponential backoff: 1 second
    │   ↓
    │   Sleep 1 second
    │   ↓
    │   Retry #1 → Fails again
    │   ↓
    │   retryCount = 2
    │   ↓
    │   Exponential backoff: 2 seconds
    │   ↓
    │   Sleep 2 seconds
    │   ↓
    │   Retry #2 → Fails again
    │   ↓
    │   retryCount = 3
    │   ↓
    │   Exponential backoff: 4 seconds (capped at 10s)
    │   ↓
    │   Sleep 4 seconds
    │   ↓
    │   Retry #3 → Fails again
    │   ↓
    │   Max retries exceeded (3 retries)
    │   ↓
    │   Throw error to component
    │   ↓
    │   User sees error message: "Server error, please try again later"
    │
    └─ NO (4xx errors):
        ↓
        Throw error immediately
        ↓
        User sees error message: "Invalid request" or specific error
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND STATE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AuthContext                    Page State                      │
│  ├─ user                        ├─ drugs: Drug[]               │
│  ├─ isAuthenticated             ├─ batches: Batch[]            │
│  ├─ isLoading                   ├─ alerts: Alert[]             │
│  ├─ error                       ├─ isLoading: boolean          │
│  └─ login/logout/refresh        └─ error: string               │
│                                                                 │
│  Updates on:                    Updates on:                     │
│  • Browser refresh              • Component mount               │
│  • Login/Logout                 • Filter change                 │
│  • Token refresh                • Page navigation               │
│  • Manual state set             • Pagination change             │
│                                                                 │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ↓
         ┌──────────────────────┐
         │   API Services       │
         │                      │
         │ DrugService.getAll() │ ← Typed API calls
         │   ↓                  │
         │   GET /drugs         │
         └──────────────────────┘
                   │
                   ↓
         ┌──────────────────────────────────┐
         │    HTTP Client (apiClient.ts)    │
         │                                  │
         │ • buildHeaders()                 │
         │ • Attach token                   │
         │ • handleResponse()                │
         │ • Retry logic                    │
         │ • Token refresh                  │
         └──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
    ┌────────────┐   ┌─────────────────┐
    │ localStorage   │ HttpOnly Cookies│
    ├────────────┤   ├─────────────────┤
    │• access_tk │   │• refreshToken   │
    │• user      │   │• Secure         │
    │• exp_time  │   │• HttpOnly        │
    └────────────┘   │• SameSite       │
                    └─────────────────┘
                   │
                   ↓ (HTTPS)
            ┌──────────────┐
            │  Backend API │
            │              │
            │ Express.js   │
            │ PostgreSQL   │
            │ Redis        │
            └──────────────┘
                   │
                   ↓
         ┌──────────────────────┐
         │   Database Layer     │
         │                      │
         │ Prisma ORM           │
         │ ├─ User              │
         │ ├─ Drug              │
         │ ├─ Batch             │
         │ ├─ Alert             │
         │ ├─ Audit Log         │
         │ └─ ...               │
         └──────────────────────┘
                   │
                   ↑
         ┌──────────────────────┐
         │   Cache Layer        │
         │                      │
         │ Redis                │
         │ ├─ Sessions          │
         │ ├─ Token Blacklist   │
         │ ├─ Cache Data        │
         │ └─ Rate Limit        │
         └──────────────────────┘
```

---

## Security Layers

```
                            User Request
                                 │
                                 ↓
┌──────────────────────────────────────────────────────┐
│  HTTPS/TLS Layer                                      │
│  ✓ Encryption in transit                             │
│  ✓ Certificate validation                            │
└──────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌──────────────────────────────────────────────────────┐
│  Rate Limiting Layer (express-rate-limit)            │
│  ✓ 100 requests/15 minutes per IP                    │
│  ✓ 5 requests/15 minutes for auth endpoints          │
│  ✓ Returns 429 Too Many Requests                     │
└──────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌──────────────────────────────────────────────────────┐
│  CORS Validation Layer                               │
│  ✓ Check Origin header                               │
│  ✓ Allow credentials                                 │
│  ✓ Validate HTTP methods                             │
│  ✓ Handle preflight requests                         │
└──────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌──────────────────────────────────────────────────────┐
│  Security Headers Layer (Helmet.js)                  │
│  ✓ X-Frame-Options: DENY (prevent clickjacking)      │
│  ✓ X-Content-Type-Options: nosniff                   │
│  ✓ Strict-Transport-Security (HSTS)                  │
│  ✓ Content-Security-Policy                           │
│  ✓ Referrer-Policy                                   │
└──────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌──────────────────────────────────────────────────────┐
│  Authentication Layer (JWT Verification)             │
│  ✓ Extract token from Authorization header           │
│  ✓ Verify JWT signature (secret key)                 │
│  ✓ Check token expiration                            │
│  ✓ Reject invalid tokens                             │
│  ✓ Return 401 Unauthorized if invalid                │
└──────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌──────────────────────────────────────────────────────┐
│  Authorization Layer (RBAC)                          │
│  ✓ Extract user role from token                      │
│  ✓ Check role permissions for endpoint               │
│  ✓ Return 403 Forbidden if unauthorized              │
│  ✓ Check warehouse scoping                           │
└──────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌──────────────────────────────────────────────────────┐
│  Input Validation Layer (Zod)                        │
│  ✓ Validate request body schema                      │
│  ✓ Type checking                                     │
│  ✓ Sanitize inputs                                   │
│  ✓ Reject unknown fields                             │
│  ✓ Return 400 Bad Request if invalid                 │
└──────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌──────────────────────────────────────────────────────┐
│  Data Access Layer (Prisma ORM)                      │
│  ✓ Parameterized queries (prevent SQL injection)     │
│  ✓ Type-safe database queries                        │
│  ✓ Connection pooling                                │
│  ✓ Audit logging                                     │
└──────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌──────────────────────────────────────────────────────┐
│  Response Layer                                      │
│  ✓ Error messages sanitized (no stack traces)        │
│  ✓ No sensitive data in response                     │
│  ✓ Proper HTTP status codes                          │
│  ✓ Standard response format                          │
└──────────────────────────────────────────────────────┘
                                 │
                                 ↓
                         ✅ Secure Response
```

---

## Database Schema Overview

```
┌──────────────────────┐
│       User           │
├──────────────────────┤
│ id (PK)              │
│ email (UNIQUE)       │
│ password (hashed)    │
│ name                 │
│ role (ENUM)          │
│ warehouseId (FK)     │
│ createdAt            │
│ updatedAt            │
└──────────────────────┘
        │
        │ 1:N
        ├─────────────────────┬────────────────────┐
        │                     │                    │
        ↓                     ↓                    ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  AuditLog        │  │  Session         │  │  Warehouse       │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ id (PK)          │  │ id (PK)          │  │ id (PK)          │
│ userId (FK)      │  │ userId (FK)      │  │ name             │
│ action           │  │ token            │  │ location         │
│ resource         │  │ expiresAt        │  │ capacity         │
│ timestamp        │  │ createdAt        │  │ createdAt        │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐
│       Drug       │
├──────────────────┤
│ id (PK)          │
│ name             │
│ manufacturer     │
│ category         │
│ temperature      │
│ createdAt        │
└──────────────────┘
        │
        │ 1:N
        ↓
┌──────────────────┐
│      Batch       │
├──────────────────┤
│ id (PK)          │
│ drugId (FK)      │
│ warehouseId (FK) │
│ quantity         │
│ expiryDate       │
│ batchNumber      │
│ status           │
│ temperature      │
│ createdAt        │
└──────────────────┘
        │
        │ 1:N
        ↓
┌──────────────────┐
│      Alert       │
├──────────────────┤
│ id (PK)          │
│ type (ENUM)      │
│ severity (ENUM)  │
│ title            │
│ message          │
│ resolved         │
│ createdAt        │
└──────────────────┘
```

---

## Technology Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5+
- **UI Framework**: React 18+
- **Styling**: Tailwind CSS 3+
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom wrapper
- **Type Safety**: TypeScript interfaces + Zod validation

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4+
- **Language**: TypeScript 5+
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5+
- **Cache**: Redis 7+
- **Authentication**: JWT + Refresh Tokens
- **Validation**: Zod 3+
- **Logging**: Winston 3+ + Morgan
- **Security**: Helmet, CORS, bcrypt
- **API Documentation**: Swagger/OpenAPI 3.0

### Deployment

- **Frontend**: Vercel / Netlify / AWS S3 + CloudFront
- **Backend**: Docker + Kubernetes / AWS ECS / Railway
- **Database**: AWS RDS PostgreSQL / Cloud SQL
- **Cache**: AWS ElastiCache / Redis Cloud
- **CDN**: CloudFlare / AWS CloudFront

---

## Performance Metrics

Target performance characteristics:

```
Frontend
├─ First Contentful Paint: < 1.5s
├─ Largest Contentful Paint: < 2.5s
├─ Time to Interactive: < 3.5s
├─ Cumulative Layout Shift: < 0.1
└─ Bundle Size: < 200KB (gzipped)

Backend
├─ API Response Time: < 200ms (p95)
├─ Database Query Time: < 100ms (p95)
├─ Throughput: > 1000 requests/sec
├─ Memory Usage: < 500MB
└─ CPU Usage: < 80%

Network
├─ HTTPS Handshake: < 500ms
├─ DNS Resolution: < 100ms
└─ Network Latency: < 50ms (local)
```

---

## Monitoring & Observability

```
┌─────────────────────┐
│  Error Tracking     │
│  (Sentry/DataDog)   │
└─────────────────────┘
         │
┌─────────────────────────────────────────┐
│        Application Metrics              │
│                                         │
│ • API response times                    │
│ • Error rates                           │
│ • Request throughput                    │
│ • User authentication events            │
│ • Database query performance            │
└─────────────────────────────────────────┘
         │
┌─────────────────────────────────────────┐
│           Logging                       │
│                                         │
│ • Application logs (Winston)            │
│ • Request logs (Morgan)                 │
│ • Audit logs (Database)                 │
│ • Error logs (Error middleware)         │
└─────────────────────────────────────────┘
         │
┌─────────────────────────────────────────┐
│        Alerting & Dashboard             │
│                                         │
│ • Real-time alerts                      │
│ • Grafana dashboards                    │
│ • Health checks                         │
│ • Uptime monitoring                     │
└─────────────────────────────────────────┘
```
