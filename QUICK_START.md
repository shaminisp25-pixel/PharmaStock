# 🚀 Developer Quick Start Guide

Get the entire system running in 15 minutes.

---

## Prerequisites (2 minutes)

Before starting, ensure you have:

```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# PostgreSQL running
psql --version

# Optional: Redis for caching
redis-cli --version
```

---

## Backend Setup (5 minutes)

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

> This installs 300+ packages. Takes 1-2 minutes.

### Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env`:

```env
NODE_ENV=development
PORT=5000

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/pharmastock"

# JWT Secrets (use any random strings)
JWT_SECRET="your-secret-key-12345"
JWT_REFRESH_SECRET="your-refresh-secret-12345"
JWT_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# CORS
ALLOWED_ORIGINS="http://localhost:3000"

# Redis (optional, for caching)
REDIS_URL="redis://localhost:6379"

# Logging
LOG_LEVEL="info"
```

### Step 4: Setup Database

```bash
# Run migrations
npm run prisma:migrate -- --name init

# Optional: Seed sample data
npm run prisma:seed
```

### Step 5: Start Backend

```bash
# Development mode (with hot reload)
npm run dev

# You should see:
# ✓ Server running on http://localhost:5000
# ✓ API docs available at http://localhost:5000/api-docs
```

✅ **Backend is now running!**

---

## Frontend Setup (5 minutes)

### Step 1: Open New Terminal

```bash
# In a new terminal tab/window
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_PREFIX=/api/v1
NEXT_PUBLIC_ENABLE_HTTPS=false
NEXT_PUBLIC_APP_NAME=PharmaStock
```

### Step 4: Start Frontend

```bash
npm run dev

# You should see:
# ✓ Ready in 2.5s
# ✓ Local: http://localhost:3000
```

✅ **Frontend is now running!**

---

## Test the System (3 minutes)

### Open Browser

```
http://localhost:3000
```

### First Test: Auto-Redirect

- Should redirect to `/login` (since you're not authenticated)
- If it shows an error, check that backend is running

### Second Test: Demo Login

On the login page:

1. Email: `john@pharmastock.com`
2. Password: `password123`
3. Click "Sign In"

You should:

- See loading spinner briefly
- Get redirected to `/dashboard`
- See real statistics (drugs, batches, alerts)

### Third Test: Navigation

Browse the different pages:

- **Dashboard** - Shows statistics
- **Drugs** - Lists all drugs from database
- **Batches** - Shows inventory with expiry dates
- **Alerts** - Real alert feed
- **Reports** - Report generation UI
- **Users** - User management
- **Audit** - Audit logs

### Fourth Test: API Documentation

Visit:

```
http://localhost:5000/api-docs
```

This is Swagger UI with all API endpoints documented. Try making test requests here.

---

## Understanding the Architecture

### 3-Tier Architecture

```
┌─────────────────────┐
│  Frontend (Port 3000)
│  • Next.js App Router
│  • React Components
│  • Tailwind CSS
└──────────┬──────────┘
           │ (HTTPS)
┌──────────┴──────────┐
│ Backend (Port 5000)
│ • Express.js API
│ • Business Logic
│ • Authentication
└──────────┬──────────┘
           │
┌──────────┴──────────┐
│ Database (Port 5432)
│ • PostgreSQL
│ • All Data
└─────────────────────┘
```

### Data Flow Example

When you visit Dashboard:

1. **Frontend**: Component mounts, calls `useRequireAuth()`
2. **Auth Check**: Verifies you have valid token
3. **API Call**: Calls `AlertService.getStats()`
4. **HTTP Request**: `GET /api/v1/alerts/stats` with token
5. **Backend**: Verifies token, checks permissions
6. **Database**: Queries alert statistics
7. **Response**: Returns data to frontend
8. **Display**: Dashboard re-renders with real data

---

## Common Commands

### Backend Commands

```bash
cd backend

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Database commands
npm run prisma:migrate         # Create new migration
npm run prisma:migrate:deploy  # Deploy migrations
npm run prisma:seed            # Seed sample data
npm run prisma:studio          # Open database GUI

# View database schema
npm run prisma:generate
```

### Frontend Commands

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Analyze bundle
npm run analyze
```

---

## File Structure

### Backend

```
backend/
├── src/
│   ├── app.ts                 ← Main Express app
│   ├── config/env.ts          ← Environment setup
│   ├── controllers/           ← Route handlers
│   ├── services/              ← Business logic
│   ├── routes/                ← API routes
│   ├── middlewares/           ← Express middlewares
│   ├── utils/                 ← Helpers & utilities
│   └── jobs/                  ← Background jobs
├── prisma/schema.prisma       ← Database schema
├── .env                       ← Environment variables
└── package.json
```

### Frontend

```
frontend/
├── app/
│   ├── page.tsx              ← Home page
│   ├── login/page.tsx        ← Login page
│   ├── dashboard/page.tsx    ← Dashboard
│   └── [other pages]/
├── src/
│   ├── lib/
│   │   ├── api-client.ts     ← HTTP client
│   │   ├── api-services.ts   ← API endpoints
│   │   └── auth-context.tsx  ← Auth state
│   └── components/
│       ├── ui/               ← UI components
│       └── layout.tsx        ← Layout components
├── .env.local                ← Environment variables
└── package.json
```

---

## Key Concepts

### Authentication Flow

1. **User registers** → Password hashed → User stored
2. **User logs in** → Credentials verified → Tokens generated
3. **Tokens stored** → Access token in localStorage, Refresh token in cookie
4. **API requests** → Access token attached to headers
5. **Token expires** → Auto-refresh with refresh token
6. **User logs out** → Tokens cleared from storage

### Token Types

- **Access Token**: Short-lived (15 min), proves authentication
- **Refresh Token**: Long-lived (7 days), used to get new access token

### API Response Format

Every backend response follows this format:

```json
{
  "status": "success",
  "data": {
    /* actual data */
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

Or on error:

```json
{
  "status": "error",
  "message": "User-friendly error message",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Typed API Services

All API calls are type-safe:

```typescript
// This won't compile if types don't match
const drugs: Paginated<Drug> = await DrugService.getAll(1, 10);

// Full type autocomplete
const drug = drugs.data[0];
console.log(drug.name); // TypeScript knows this property exists
```

---

## Debugging

### Check Backend is Running

```bash
curl http://localhost:5000/health
# Should return: {"status":"ok"}
```

### Check Frontend is Running

```bash
curl http://localhost:3000
# Should return HTML content
```

### Check API Connection

Open browser console (F12) and run:

```javascript
fetch("http://localhost:5000/api/v1/health")
  .then((r) => r.json())
  .then((d) => console.log(d));
```

### View Backend Logs

Backend logs are in terminal where you ran `npm run dev`:

```
[2024-01-01 12:00:00] info: GET /api/v1/drugs 200 45ms
[2024-01-01 12:00:01] info: User logged in: john@pharmastock.com
```

### View Frontend Logs

Frontend logs are in browser console (F12):

```
api-client.ts: GET /api/v1/drugs
api-client.ts: Token refreshed, retrying request...
```

### View Database

```bash
cd backend
npm run prisma:studio

# Opens GUI at http://localhost:5555
# Browse all database tables visually
```

---

## Troubleshooting

### Backend won't start

**Error**: `Cannot find module '@prisma/client'`

```bash
npm install
npm run prisma:generate
```

**Error**: `DATABASE_URL not set`

- Check `.env` file exists
- Check `DATABASE_URL` is set correctly
- Check PostgreSQL is running

**Error**: `Port 5000 already in use`

```bash
# Change PORT in .env or kill the process
lsof -i :5000
kill -9 <PID>
```

### Frontend won't start

**Error**: `Cannot find module 'next'`

```bash
npm install
npm run build
```

**Error**: `ECONNREFUSED at http://localhost:5000`

- Backend is not running
- Check backend is on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### Can't login

**Error**: `Invalid credentials`

- Check you're using correct email/password
- Try demo: `john@pharmastock.com` / `password123`
- Check database has users (run seed: `npm run prisma:seed`)

**Error**: `CORS error`

- Check backend `ALLOWED_ORIGINS` includes `http://localhost:3000`
- Check frontend `NEXT_PUBLIC_API_URL` matches backend URL

**Error**: `Token expired immediately`

- Check `JWT_SECRET` and `JWT_REFRESH_SECRET` in backend `.env`
- Check system clock is correct
- Try logging out and logging back in

---

## Next Steps

### Explore the Code

1. **Backend Structure**:
   - View `backend/src/routes/auth.routes.ts` for API endpoint structure
   - View `backend/src/services/auth.service.ts` for business logic
   - View `backend/prisma/schema.prisma` for database schema

2. **Frontend Structure**:
   - View `frontend/src/lib/api-services.ts` for typed API calls
   - View `frontend/app/dashboard/page.tsx` for page example
   - View `frontend/src/components/ui/index.tsx` for component library

### Make Changes

1. **Add a new drug**:
   - Go to http://localhost:3000/drugs
   - Should show drugs from database

2. **Create a new API endpoint**:
   - Add route in `backend/src/routes/`
   - Add service in `backend/src/services/`
   - Add type in `frontend/src/lib/api-services.ts`

3. **Add a new page**:
   - Create `frontend/app/new-page/page.tsx`
   - Use template from existing pages
   - Add to sidebar navigation

### Deploy

1. **Build Frontend**:

   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. **Build Backend**:

   ```bash
   cd backend
   npm run build
   npm start
   ```

3. **Deploy to Production**:
   - See `INTEGRATION_GUIDE.md` for detailed deployment instructions

---

## Resources

📚 **Documentation**

- [INTEGRATION_GUIDE.md](/INTEGRATION_GUIDE.md) - Comprehensive integration guide
- [ARCHITECTURE.md](/ARCHITECTURE.md) - System architecture
- [QUICK_REFERENCE.md](/QUICK_REFERENCE.md) - Code examples
- [INTEGRATION_CHECKLIST.md](/INTEGRATION_CHECKLIST.md) - Setup verification

🔗 **API Documentation**

- http://localhost:5000/api-docs - Swagger UI
- `backend/IMPLEMENTATION_SUMMARY.md` - Backend documentation

💬 **Code Examples**

- `frontend/app/dashboard/page.tsx` - Complete page example
- `frontend/src/lib/api-services.ts` - API service pattern
- `backend/src/controllers/auth.controller.ts` - Controller pattern

---

## Pro Tips

### Tip 1: Use Demo Account

Instead of creating a new user each time, use the demo account:

- Email: `john@pharmastock.com`
- Password: `password123`

### Tip 2: Check Swagger First

Before testing a page, check the API endpoint in Swagger:

```
http://localhost:5000/api-docs
```

Try requests there first to verify API works.

### Tip 3: Use Browser DevTools

Press F12 in browser to:

- View Network tab (see API requests/responses)
- View Console (see errors)
- View Application tab (see localStorage/cookies)

### Tip 4: Auto-format Code

```bash
# Frontend
cd frontend && npm run format

# Backend
cd backend && npm run format
```

### Tip 5: Seed Database

If you want sample data:

```bash
cd backend
npm run prisma:seed
```

---

## Quick Troubleshoot Checklist

- [ ] Node.js 18+ installed? `node --version`
- [ ] PostgreSQL running? Try `psql -U postgres`
- [ ] Backend started? Visit `http://localhost:5000/health`
- [ ] Frontend started? Visit `http://localhost:3000`
- [ ] Can access Swagger? Visit `http://localhost:5000/api-docs`
- [ ] Can login with demo account?
- [ ] Seeing real data on dashboard?
- [ ] Can view other pages without errors?

If everything is ✅, you're ready to develop!

---

## Getting Help

1. **Check logs**: Look at terminal output for error messages
2. **Check browser console**: Press F12, see error details
3. **Check documentation**: Read `/INTEGRATION_GUIDE.md`
4. **Check Swagger**: Test API at `/api-docs`
5. **Check database**: Use `npm run prisma:studio` to view data

---

## What's Next?

Now that your system is running:

1. ✅ Explore all pages in the UI
2. ✅ Try making API calls in Swagger
3. ✅ Read through the codebase
4. ✅ Make small changes and see them live-reload
5. ✅ Deploy to production when ready

**Happy coding! 🚀**
