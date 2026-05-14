# Swagger API Documentation - Quick Reference

## 🚀 Getting Started (2 steps)

### Step 1: Start the Backend
```bash
cd backend
npm install  # If not done already
npm run dev
```

### Step 2: Open Documentation
- **URL**: http://localhost:5000/api-docs
- **Root Redirect**: http://localhost:5000/ (automatically redirects to /api-docs)

---

## 📍 API Base URL
- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://api.pharmastock.com/api/v1`

---

## 🔑 Authentication

### How to Authenticate in Swagger UI

1. **Get Access Token**
   - POST `/auth/login`
   - Provide credentials
   - Copy `accessToken` from response

2. **Authorize Requests**
   - Click **"Authorize"** button (top right)
   - Paste token as: `Bearer YOUR_ACCESS_TOKEN`
   - Click "Authorize"
   - All requests will include the token

3. **Refresh Token**
   - When token expires: POST `/auth/refresh`
   - Get new `accessToken`
   - Update in Authorize dialog

---

## 📚 API Endpoints by Category

### 🔐 Authentication (`/auth`)
```
POST   /auth/register              Register new user
POST   /auth/login                 User login
POST   /auth/refresh               Refresh access token
POST   /auth/logout                User logout (requires auth)
PATCH  /auth/change-password       Change password (requires auth)
```

### 👤 Users (`/users`) — Admin only
```
GET    /users                      List users (paginated)
GET    /users/{id}                 Get user details
POST   /users                      Create user
PATCH  /users/{id}                 Update user
DELETE /users/{id}                 Delete user
```

### 🏭 Warehouses (`/warehouses`)
```
GET    /warehouses                 List warehouses
GET    /warehouses/{id}            Get warehouse
POST   /warehouses                 Create warehouse
PATCH  /warehouses/{id}            Update warehouse
DELETE /warehouses/{id}            Delete warehouse
```

### 💊 Drugs (`/drugs`)
```
GET    /drugs                      List drugs
GET    /drugs/{id}                 Get drug details
POST   /drugs                      Create drug
PATCH  /drugs/{id}                 Update drug
DELETE /drugs/{id}                 Delete drug
```

### 📦 Batches (`/batches`)
```
GET    /batches                    List batches
GET    /batches/{id}               Get batch details
POST   /batches                    Create batch
PATCH  /batches/{id}/status        Update status
POST   /batches/{id}/dispatch      Dispatch batch
POST   /batches/scan               Scan batch
DELETE /batches/{id}               Delete batch
```

### ⚠️ Alerts (`/alerts`)
```
GET    /alerts                     List alerts
GET    /alerts/{id}                Get alert details
PATCH  /alerts/{id}/resolve        Resolve alert
```

### 📋 Audit (`/audit`)
```
GET    /audit                      Get audit logs
```

### 📥 Import (`/import`)
```
GET    /import/logs                Get import logs
GET    /import/logs/{id}           Get import log details
GET    /import/template            Download CSV template
POST   /import/drugs/upload        Upload drugs from CSV
```

### 📊 Reports (`/reports`)
```
GET    /reports/expiry             Expiry report
GET    /reports/dispatch           Dispatch report
GET    /reports/stock              Stock report
GET    /reports/temperature-sensitive  Temperature report
```

### 🔗 Integration (`/integration`)
```
POST   /integration/erp/sync       Sync with ERP system
POST   /integration/prescription/lookup  Lookup prescription
```

---

## 🧪 Testing Examples

### 1. Register a User
```json
POST /auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe",
  "role": "WAREHOUSE_STAFF"
}
```

### 2. Login
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

### 3. Create Warehouse
```json
POST /warehouses
Authorization: Bearer {token}
{
  "name": "Main Warehouse",
  "location": "Downtown",
  "capacity": 10000
}
```

### 4. Create Drug
```json
POST /drugs
Authorization: Bearer {token}
{
  "drugName": "Aspirin",
  "manufacturer": "Bayer",
  "composition": "500mg",
  "category": "Analgesic"
}
```

### 5. Create Batch
```json
POST /batches
Authorization: Bearer {token}
{
  "batchNumber": "BATCH001",
  "drugId": "drug-uuid",
  "warehouseId": "warehouse-uuid",
  "quantity": 1000,
  "expiryDate": "2025-12-31",
  "tempMin": 15,
  "tempMax": 25,
  "storageNotes": "Keep in cool, dry place"
}
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "uuid",
    "name": "Item name",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### List Response (Paginated)
```json
{
  "success": true,
  "data": {
    "items": [
      { "id": "uuid", "name": "Item 1" },
      { "id": "uuid", "name": "Item 2" }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## ⏱️ Rate Limiting

- **Global**: 100 requests per 15 minutes
- **Auth**: 10 requests per 15 minutes
- **Import**: 20 requests per hour

**Response**: HTTP 429 if limit exceeded

---

## 🔐 Roles & Permissions

### ADMIN
- Full access to all endpoints
- User management
- System configuration

### MANAGER
- Manage warehouses, drugs, batches
- Create and update users
- View reports

### WAREHOUSE_STAFF
- Create and manage batches
- Import drugs
- View inventory

### VIEWER
- Read-only access
- View all data
- Generate reports

---

## 🛠️ Common Operations

### Workflow: Add a Drug & Batch

1. **Login** → Get token
2. **Get Warehouse ID** → GET /warehouses
3. **Create Drug** → POST /drugs
4. **Create Batch** → POST /batches
5. **View Batch** → GET /batches/{id}

### Workflow: Dispatch a Batch

1. **List Batches** → GET /batches
2. **Dispatch Batch** → POST /batches/{id}/dispatch
3. **View Alerts** → GET /alerts
4. **Resolve Alert** → PATCH /alerts/{id}/resolve

### Workflow: Generate Report

1. **Get Report** → GET /reports/{type}
2. **Download as CSV/JSON**

---

## ✅ HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Server Error - Internal error |

---

## 🐛 Troubleshooting

### Can't Access /api-docs
```bash
# Check if backend is running
lsof -i :5000

# Restart backend
npm run dev
```

### Authentication Not Working
- Ensure token format: `Bearer {token}`
- Check token hasn't expired
- Try `/auth/refresh` to get new token

### Rate Limited
- Wait 15 minutes (or 1 hour for import)
- Reduce request frequency

### Invalid Request
- Check parameter types
- Verify required fields
- See error message in response

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `SWAGGER_GUIDE.md` | Comprehensive user guide |
| `API_TESTING.md` | 40+ curl examples |
| `SETUP_GUIDE.md` | Setup instructions |
| `README.md` | General documentation |
| `DEPLOYMENT_CHECKLIST.md` | Production deployment |
| `IMPLEMENTATION_SUMMARY.md` | Project overview |

---

## 🔗 Quick Links

- **Swagger UI**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health
- **API Base**: http://localhost:5000/api/v1

---

## 💡 Tips

### For Development
- Use Swagger UI for testing
- Copy curl commands from Swagger UI
- Use "Try it out" for quick testing

### For Integration
- Store tokens securely
- Refresh tokens before expiry
- Implement retry logic for 5xx errors
- Log API responses for debugging

### For Production
- Use environment-specific URLs
- Implement request/response logging
- Set up monitoring and alerts
- Keep documentation updated

---

## 📞 Support

- Check `SWAGGER_GUIDE.md` for detailed guide
- See curl examples in `API_TESTING.md`
- Review error messages in Swagger UI
- Check logs: `backend/logs/app.log`

---

**Happy Testing! 🚀**

For more details, see `SWAGGER_GUIDE.md` or access the interactive documentation at `/api-docs`
