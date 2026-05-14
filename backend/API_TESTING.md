# PharmaStock API — Complete Testing Guide

## API Base URL
```
http://localhost:5000/api/v1
```

## Common Headers
```bash
# Authorization (after login)
Authorization: Bearer <access_token>

# Content-Type
Content-Type: application/json

# API Key (for integration endpoints)
X-API-Key: erp-webhook-secret-key-123456
```

---

## 1. Authentication Endpoints

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@pharmastock.com",
    "password": "AdminPass@123",
    "role": "admin"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@pharmastock.com",
    "name": "Admin User",
    "role": "admin",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pharmastock.com",
    "password": "AdminPass@123"
  }'
```

### Refresh Access Token
```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Cookie: refreshToken=..."
```

### Logout
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer <access_token>" \
  -H "Cookie: refreshToken=..."
```

### Change Password
```bash
curl -X PATCH http://localhost:5000/api/v1/auth/change-password \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "AdminPass@123",
    "newPassword": "NewAdminPass@456"
  }'
```

---

## 2. Warehouse Management

### Create Warehouse
```bash
curl -X POST http://localhost:5000/api/v1/warehouses \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Warehouse",
    "location": "Dubai, UAE",
    "tempMin": 15,
    "tempMax": 25
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Warehouse created successfully",
  "data": {
    "id": "warehouse-uuid",
    "name": "Main Warehouse",
    "location": "Dubai, UAE",
    "tempMin": 15,
    "tempMax": 25,
    "createdAt": "2026-05-11T10:30:00Z",
    "updatedAt": "2026-05-11T10:30:00Z"
  }
}
```

### List Warehouses
```bash
curl -X GET "http://localhost:5000/api/v1/warehouses?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Get Warehouse Details
```bash
curl -X GET http://localhost:5000/api/v1/warehouses/warehouse-uuid \
  -H "Authorization: Bearer <token>"
```

### Update Warehouse
```bash
curl -X PATCH http://localhost:5000/api/v1/warehouses/warehouse-uuid \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Warehouse - Updated",
    "tempMin": 16,
    "tempMax": 24
  }'
```

### Delete Warehouse
```bash
curl -X DELETE http://localhost:5000/api/v1/warehouses/warehouse-uuid \
  -H "Authorization: Bearer <admin_token>"
```

---

## 3. Drug Management

### Create Drug
```bash
curl -X POST http://localhost:5000/api/v1/drugs \
  -H "Authorization: Bearer <pharmacist_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aspirin 500mg",
    "manufacturer": "Pharma Company Inc",
    "composition": "Acetylsalicylic Acid",
    "category": "Pain Relief",
    "tempMin": 15,
    "tempMax": 25,
    "storageNotes": "Keep in cool, dry place. Away from moisture."
  }'
```

### List Drugs
```bash
curl -X GET "http://localhost:5000/api/v1/drugs?page=1&limit=20&search=Aspirin" \
  -H "Authorization: Bearer <token>"
```

### Get Drug Details
```bash
curl -X GET http://localhost:5000/api/v1/drugs/drug-uuid \
  -H "Authorization: Bearer <token>"
```

### Update Drug
```bash
curl -X PATCH http://localhost:5000/api/v1/drugs/drug-uuid \
  -H "Authorization: Bearer <pharmacist_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tempMin": 16,
    "tempMax": 24
  }'
```

---

## 4. Batch Management

### Create Batch
```bash
curl -X POST http://localhost:5000/api/v1/batches \
  -H "Authorization: Bearer <warehouse_staff_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "drugId": "drug-uuid",
    "batchNo": "BATCH-2026-001",
    "expiryDate": "2027-12-31T23:59:59Z",
    "quantity": 1000,
    "warehouseId": "warehouse-uuid"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Batch created successfully",
  "data": {
    "id": "batch-uuid",
    "batchNo": "BATCH-2026-001",
    "quantity": 1000,
    "expiryDate": "2027-12-31T23:59:59Z",
    "status": "active",
    "drug": {
      "id": "drug-uuid",
      "name": "Aspirin 500mg"
    },
    "warehouse": {
      "id": "warehouse-uuid",
      "name": "Main Warehouse"
    }
  }
}
```

### List Batches
```bash
curl -X GET "http://localhost:5000/api/v1/batches?page=1&limit=20&status=active" \
  -H "Authorization: Bearer <token>"
```

Filter options:
- `status`: active, dispatched, expired, quarantined
- `warehouseId`: filter by warehouse
- `drugId`: filter by drug
- `expiryBefore`: ISO date string
- `expiryAfter`: ISO date string

### Scan Batch (by Barcode)
```bash
curl -X POST http://localhost:5000/api/v1/batches/scan \
  -H "Authorization: Bearer <warehouse_staff_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "barcode": "BATCH-2026-001"
  }'
```

### Dispatch Batch
```bash
curl -X POST http://localhost:5000/api/v1/batches/batch-uuid/dispatch \
  -H "Authorization: Bearer <pharmacist_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 50,
    "destination": "Hospital ABC",
    "prescriptionRef": "RX-2026-12345"
  }'
```

### Update Batch Status
```bash
curl -X PATCH http://localhost:5000/api/v1/batches/batch-uuid/status \
  -H "Authorization: Bearer <pharmacist_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "quarantined"
  }'
```

Valid statuses: `active`, `dispatched`, `expired`, `quarantined`

---

## 5. Alert Management

### List Alerts
```bash
curl -X GET "http://localhost:5000/api/v1/alerts?page=1&limit=20&resolved=false" \
  -H "Authorization: Bearer <token>"
```

Filter options:
- `alertType`: near_expiry, expired, low_stock, temp_breach
- `resolved`: true/false
- `warehouseId`: filter by warehouse

### Get Alert Details
```bash
curl -X GET http://localhost:5000/api/v1/alerts/alert-uuid \
  -H "Authorization: Bearer <token>"
```

### Resolve Alert
```bash
curl -X PATCH http://localhost:5000/api/v1/alerts/alert-uuid/resolve \
  -H "Authorization: Bearer <pharmacist_token>"
```

---

## 6. Audit Logs

### View Audit Logs (Admin/Inspector Only)
```bash
curl -X GET "http://localhost:5000/api/v1/audit?page=1&limit=20&entityType=Batch" \
  -H "Authorization: Bearer <admin_or_inspector_token>"
```

Filter options:
- `userId`: filter by user
- `entityType`: Batch, Drug, User, Warehouse, etc.
- `entityId`: specific entity ID
- `dateFrom`: start date (ISO)
- `dateTo`: end date (ISO)

---

## 7. User Management (Admin Only)

### Create User
```bash
curl -X POST http://localhost:5000/api/v1/users \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Pharmacist",
    "email": "john@pharmastock.com",
    "password": "SecurePass@123",
    "role": "pharmacist",
    "warehouseId": "warehouse-uuid"
  }'
```

Valid roles: `admin`, `pharmacist`, `warehouse_staff`, `inspector`

### List Users
```bash
curl -X GET "http://localhost:5000/api/v1/users?page=1&limit=20&role=pharmacist" \
  -H "Authorization: Bearer <admin_token>"
```

### Update User
```bash
curl -X PATCH http://localhost:5000/api/v1/users/user-uuid \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "warehouse_staff",
    "warehouseId": "warehouse-uuid-2",
    "isActive": true
  }'
```

### Delete User (Soft Delete)
```bash
curl -X DELETE http://localhost:5000/api/v1/users/user-uuid \
  -H "Authorization: Bearer <admin_token>"
```

---

## 8. Import/Export

### Download Import Template
```bash
curl -X GET http://localhost:5000/api/v1/import/template \
  -H "Authorization: Bearer <token>" \
  -o drug_import_template.csv
```

### Upload Drugs (CSV/XLSX)
```bash
curl -X POST http://localhost:5000/api/v1/import/drugs/upload \
  -H "Authorization: Bearer <warehouse_staff_token>" \
  -F "file=@drugs.csv"
```

### View Import Logs
```bash
curl -X GET "http://localhost:5000/api/v1/import/logs?page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```

### Get Import Details
```bash
curl -X GET http://localhost:5000/api/v1/import/logs/import-uuid \
  -H "Authorization: Bearer <token>"
```

---

## 9. Reports

### Expiry Report
```bash
curl -X GET "http://localhost:5000/api/v1/reports/expiry?format=csv&warehouseId=warehouse-uuid" \
  -H "Authorization: Bearer <token>" \
  -o expiry_report.csv
```

### Dispatch Report
```bash
curl -X GET "http://localhost:5000/api/v1/reports/dispatch?format=csv&dateFrom=2026-01-01&dateTo=2026-05-11" \
  -H "Authorization: Bearer <token>"
```

### Stock Report
```bash
curl -X GET http://localhost:5000/api/v1/reports/stock \
  -H "Authorization: Bearer <token>"
```

### Temperature-Sensitive Report
```bash
curl -X GET "http://localhost:5000/api/v1/reports/temperature-sensitive?maxTemp=8" \
  -H "Authorization: Bearer <token>"
```

---

## 10. Integration Endpoints

### ERP Sync Webhook
```bash
curl -X POST http://localhost:5000/api/v1/integration/erp/sync \
  -H "X-API-Key: erp-webhook-secret-key-123456" \
  -H "Content-Type: application/json" \
  -d '{
    "batches": [
      {
        "batchNo": "ERP-BATCH-001",
        "drugName": "Aspirin 500mg",
        "quantity": 500,
        "expiryDate": "2027-12-31",
        "warehouse": "Main Warehouse"
      }
    ]
  }'
```

### Prescription Lookup
```bash
curl -X POST http://localhost:5000/api/v1/integration/prescription/lookup \
  -H "X-API-Key: erp-webhook-secret-key-123456" \
  -H "Content-Type: application/json" \
  -d '{
    "prescriptionRef": "RX-2026-12345"
  }'
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Min temperature must be less than max temperature"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "No authorization token provided"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions for action: batches:dispatch"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Batch not found"
}
```

### 409 - Conflict
```json
{
  "success": false,
  "message": "email already exists"
}
```

### 422 - Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "expiryDate",
      "message": "Invalid date format"
    }
  ]
}
```

### 429 - Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

### 500 - Internal Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing Best Practices

1. **Start with Auth**: Register → Login → Use token
2. **Setup Data**: Create warehouses → Create drugs
3. **Test CRUD**: Create → Read → Update → Delete
4. **Test Constraints**: Try invalid data to see validation
5. **Test Permissions**: Try with different roles
6. **Test Relationships**: Create batches with drugs/warehouses
7. **Test Business Logic**: Dispatch reduces quantity
8. **Monitor Logs**: Check `logs/combined.log` for details

---

**Happy Testing!** 🚀
