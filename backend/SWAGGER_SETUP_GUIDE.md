# Complete Swagger Implementation Guide

## ⚠️ If Swagger Is Not Loading - Follow This Guide

---

## Step 1: Clean Installation

### 1a. Remove Previous Installation

```bash
cd /Users/shamini/Projects/Designpharmastocksaashomepage/backend

# Remove node_modules and package-lock
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force
```

### 1b. Fresh Install

```bash
npm install
```

---

## Step 2: Verify Environment Variables

### Check `.env` file

```bash
cat .env | grep -E "PORT|API_PREFIX"
```

**Expected output:**

```
PORT=5000
API_PREFIX=/api/v1
```

If missing, add to `.env`:

```env
PORT=5000
API_PREFIX=/api/v1
```

---

## Step 3: Replace Swagger Configuration

Create a fresh `src/config/swagger.ts`:

```bash
rm -f src/config/swagger.ts
```

Then create with the working implementation below.

---

## Step 4: Working Swagger Configuration

**File:** `src/config/swagger.ts`

```typescript
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PharmaStock API',
      version: '1.0.0',
      description: 'Pharmaceutical Warehouse Management System API',
      contact: {
        name: 'PharmaStock Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
```

---

## Step 5: Update App Setup

**File:** `src/app.ts` - Make sure this is correct:

```typescript
import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import routes from './routes';

export function createApp(): Application {
  const app = express();

  // ... other middleware ...

  // Swagger Setup (BEFORE routes)
  app.use('/api-docs', swaggerUi.serve);
  app.get(
    '/api-docs',
    swaggerUi.setup(specs, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );

  // API Routes
  app.use('/api/v1', routes);

  return app;
}
```

---

## Step 6: Verify Route Documentation

**Minimum JSDoc Format for Routes:**

```typescript
// Example: auth.routes.ts
import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', (req, res) => {
  // implementation
});

export default router;
```

**Key Points:**

- ✅ Must start with `/**` (JSDoc comment)
- ✅ Must start with `* @swagger`
- ✅ Path must match the route (e.g., `/auth/login`)
- ✅ HTTP method must be `post`, `get`, `patch`, `delete`
- ✅ Must have `responses` defined

---

## Step 7: Build & Run

```bash
# Build TypeScript
npm run build

# Check for errors
echo "Build status: $?"

# Start development server
npm run dev
```

**Expected terminal output:**

```
listening on port 5000
```

---

## Step 8: Access Swagger

Open in browser:

```
http://localhost:5000/api-docs
```

You should see the Swagger UI with:

- ✅ PharmaStock API title
- ✅ All endpoints listed
- ✅ Try it out button available

---

## Troubleshooting

### Issue: Swagger UI Shows But No Endpoints

**Solution:**

1. Check `src/routes/*.ts` files have JSDoc comments
2. Verify JSDoc format is correct (starts with `/**` and `* @swagger`)
3. Ensure path matches route definition
4. Rebuild: `npm run build && npm run dev`

### Issue: Can't Connect to http://localhost:5000/api-docs

**Solution:**

```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process
kill -9 <PID>

# Restart
npm run dev
```

### Issue: "Cannot find module 'swagger-jsdoc'"

**Solution:**

```bash
# Reinstall packages
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Issue: TypeScript Error in swagger.ts

**Solution:**

```bash
# Install missing types
npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc

# Rebuild
npm run build
```

---

## Step 9: Test API Endpoints

### In Swagger UI:

1. **Click on an endpoint** (e.g., `/auth/login`)
2. **Click "Try it out"**
3. **Fill in request body:**
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
4. **Click "Execute"**
5. **See response**

---

## Verification Checklist

- [ ] Environment variables set (PORT=5000, API_PREFIX=/api/v1)
- [ ] swagger-ui-express installed
- [ ] swagger-jsdoc installed
- [ ] src/config/swagger.ts exists
- [ ] src/app.ts has swagger middleware
- [ ] src/routes/\*.ts have JSDoc comments
- [ ] npm run build succeeds with no errors
- [ ] npm run dev starts without errors
- [ ] http://localhost:5000/api-docs is accessible
- [ ] Swagger UI shows endpoints
- [ ] Can click "Try it out" on endpoints

---

## Quick Commands

```bash
# Clone/reset to working state
cd backend

# Remove old installation
rm -rf node_modules package-lock.json

# Fresh install
npm install

# Build
npm run build

# Run development server
npm run dev

# Test access
curl http://localhost:5000/api-docs
```

---

## Working Swagger URL

Once running, access at:

```
http://localhost:5000/api-docs
```

The URL consists of:

- `http://localhost:5000` - Server + Port
- `/api-docs` - Swagger UI endpoint

---

## Common Mistakes to Avoid

❌ **DON'T:**

- Use path `/auth/login` but route at `/login`
- Forget `* @swagger` in JSDoc
- Forget `responses:` in documentation
- Put swagger routes AFTER api routes
- Use wrong case for HTTP methods

✅ **DO:**

- Match documentation path with route path
- Start JSDoc with `/**` and `* @swagger`
- Include proper responses object
- Place swagger middleware BEFORE routes
- Use lowercase HTTP methods (post, get, patch, delete)

---

## File Structure Check

```
backend/
├── src/
│   ├── app.ts                    ✅ Has swagger middleware
│   ├── config/
│   │   └── swagger.ts            ✅ Swagger configuration
│   └── routes/
│       ├── auth.routes.ts        ✅ Has JSDoc comments
│       ├── user.routes.ts        ✅ Has JSDoc comments
│       └── ...
└── package.json                  ✅ Has swagger packages
```

---

## Final Test

```bash
# 1. Ensure backend is running
npm run dev

# 2. In another terminal, test the endpoint
curl -s http://localhost:5000/api-docs | head -20

# 3. Should see HTML with swagger UI
```

---

## Next Steps

1. ✅ Follow steps 1-8 above
2. ✅ Access `http://localhost:5000/api-docs`
3. ✅ Test endpoints in Swagger UI
4. ✅ Generate API documentation

If still not working, run:

```bash
npm run build 2>&1 | grep -i error
```

And share the output for debugging.

---

**Need Help?** Check:

- `npm run build` output for compilation errors
- Terminal output from `npm run dev`
- Console error in browser (F12)
- Network tab showing request to `/api-docs`
