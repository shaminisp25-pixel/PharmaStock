# PharmaStock API Documentation

## Overview

Swagger/OpenAPI documentation has been successfully integrated into the PharmaStock backend API. The documentation is automatically generated and provides interactive API testing capabilities.

## Accessing the Documentation

### Local Development

1. Start the backend server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:

   ```
   http://localhost:5000/api-docs
   ```

3. You'll see the Swagger UI interface with all API endpoints documented

### Production

- Access the API docs at: `{your-domain}/api-docs`

## Features

### ✅ Interactive API Testing

- Try out API endpoints directly from the documentation
- No need for external tools like Postman
- Real-time response examples

### ✅ Authentication

The documentation supports two authentication methods:

#### JWT Bearer Token (Most Endpoints)

1. Login to get an access token
2. Click the **Authorize** button in Swagger UI
3. Select **BearerAuth**
4. Paste your token in format: `Bearer {your_token}`
5. Click **Authorize**

#### API Key Authentication (Integration Endpoints)

1. Click the **Authorize** button
2. Select **ApiKeyAuth**
3. Enter your API key in the header
4. Click **Authorize**

### ✅ Comprehensive Endpoint Documentation

All endpoints are organized by resource:

- **Authentication** - Login, register, token refresh
- **Users** - User management (CRUD operations)
- **Warehouses** - Warehouse management
- **Drugs** - Drug catalog management
- **Batches** - Batch inventory tracking
- **Alerts** - System alerts and notifications
- **Audit** - Audit logging
- **Import** - Bulk data import
- **Reports** - Business reports
- **Integration** - ERP and third-party integrations

## API Endpoints Summary

### Authentication (`/auth`)

| Method | Endpoint                | Description          |
| ------ | ----------------------- | -------------------- |
| POST   | `/auth/register`        | Register new user    |
| POST   | `/auth/login`           | User login           |
| POST   | `/auth/refresh`         | Refresh access token |
| POST   | `/auth/logout`          | User logout          |
| PATCH  | `/auth/change-password` | Change password      |

### Users (`/users`)

| Method | Endpoint      | Description                |
| ------ | ------------- | -------------------------- |
| GET    | `/users`      | List all users (paginated) |
| GET    | `/users/{id}` | Get user by ID             |
| POST   | `/users`      | Create new user            |
| PATCH  | `/users/{id}` | Update user                |
| DELETE | `/users/{id}` | Delete user                |

### Warehouses (`/warehouses`)

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/warehouses`      | List warehouses       |
| GET    | `/warehouses/{id}` | Get warehouse details |
| POST   | `/warehouses`      | Create warehouse      |
| PATCH  | `/warehouses/{id}` | Update warehouse      |
| DELETE | `/warehouses/{id}` | Delete warehouse      |

### Drugs (`/drugs`)

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| GET    | `/drugs`      | List all drugs   |
| GET    | `/drugs/{id}` | Get drug details |
| POST   | `/drugs`      | Create drug      |
| PATCH  | `/drugs/{id}` | Update drug      |
| DELETE | `/drugs/{id}` | Delete drug      |

### Batches (`/batches`)

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| GET    | `/batches`               | List batches        |
| GET    | `/batches/{id}`          | Get batch details   |
| POST   | `/batches`               | Create batch        |
| PATCH  | `/batches/{id}/status`   | Update batch status |
| POST   | `/batches/{id}/dispatch` | Dispatch batch      |
| POST   | `/batches/scan`          | Scan batch          |
| DELETE | `/batches/{id}`          | Delete batch        |

### Alerts (`/alerts`)

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| GET    | `/alerts`              | List alerts       |
| GET    | `/alerts/{id}`         | Get alert details |
| PATCH  | `/alerts/{id}/resolve` | Resolve alert     |

### Audit (`/audit`)

| Method | Endpoint | Description    |
| ------ | -------- | -------------- |
| GET    | `/audit` | Get audit logs |

### Import (`/import`)

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| GET    | `/import/logs`         | Get import logs        |
| GET    | `/import/logs/{id}`    | Get import log details |
| GET    | `/import/template`     | Download CSV template  |
| POST   | `/import/drugs/upload` | Upload drugs from CSV  |

### Reports (`/reports`)

| Method | Endpoint                         | Description                 |
| ------ | -------------------------------- | --------------------------- |
| GET    | `/reports/expiry`                | Get expiry report           |
| GET    | `/reports/dispatch`              | Get dispatch report         |
| GET    | `/reports/stock`                 | Get stock report            |
| GET    | `/reports/temperature-sensitive` | Temperature-sensitive drugs |

### Integration (`/integration`)

| Method | Endpoint                           | Description          |
| ------ | ---------------------------------- | -------------------- |
| POST   | `/integration/erp/sync`            | Sync with ERP system |
| POST   | `/integration/prescription/lookup` | Lookup prescription  |

## Authentication

### Login Flow

```bash
1. Call POST /auth/login with credentials
2. Receive accessToken and refreshToken
3. Use accessToken in Authorization header: Bearer {accessToken}
4. When token expires, use POST /auth/refresh to get new token
```

### Role-Based Access Control (RBAC)

The API implements role-based access control. Roles:

- **ADMIN** - Full access to all endpoints
- **MANAGER** - Can manage users, warehouses, drugs, batches
- **WAREHOUSE_STAFF** - Can view inventory, manage batches
- **VIEWER** - Read-only access

Each endpoint requires specific permissions. Check the Swagger docs for required permissions.

## Response Format

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

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [{ "id": "uuid", "name": "Item 1" }],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

## Rate Limiting

The API implements rate limiting:

- **Global limit**: 100 requests per 15 minutes
- **Auth limit**: 10 requests per 15 minutes (login, register)
- **Import limit**: Custom limits for bulk operations

If rate limit exceeded, you'll receive HTTP 429 (Too Many Requests).

## Security Headers

The API includes security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- HSTS (HTTP Strict Transport Security)

## CORS

Cross-Origin Resource Sharing is configured for:

- Allowed methods: GET, POST, PATCH, DELETE
- Allowed headers: Content-Type, Authorization, X-API-Key
- Credentials are supported

## Common HTTP Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created              |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Authentication required  |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource not found          |
| 409  | Conflict - Resource already exists      |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Server Error - Internal error           |

## Examples

### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Create Drug

```bash
curl -X POST http://localhost:5000/api/v1/drugs \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "drugName": "Aspirin",
    "manufacturer": "Bayer",
    "composition": "500mg",
    "category": "Analgesic"
  }'
```

### List Batches

```bash
curl -X GET "http://localhost:5000/api/v1/batches?page=1&limit=10" \
  -H "Authorization: Bearer {token}"
```

## Troubleshooting

### Can't access documentation

- Ensure backend is running: `npm run dev`
- Check if port 5000 is available
- Try accessing directly: `http://localhost:5000/api-docs`

### Authentication errors

- Verify token is valid and not expired
- Check token format: `Bearer {token}`
- Ensure you have required permissions for the endpoint

### Rate limit exceeded

- Wait for the rate limit window to reset (15 minutes)
- Consider optimizing your API calls
- Contact administrator for higher limits if needed

## Support

For API issues or questions:

- Check the Swagger documentation at `/api-docs`
- Review error messages for detailed information
- Check audit logs for action history
- Contact the PharmaStock team

---

**API Version**: 1.0.0  
**Last Updated**: May 2024  
**Base URL**: `/api/v1`
