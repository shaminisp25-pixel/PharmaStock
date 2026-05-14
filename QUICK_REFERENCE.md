# Quick Reference: Backend & Frontend Integration

## API Client Usage

### Authentication

```typescript
import { useAuth } from "@/lib/auth-context";

export default function MyComponent() {
  const { user, isAuthenticated, login, logout, error } = useAuth();

  // Login
  try {
    await login("user@example.com", "password123");
  } catch (err) {
    console.error("Login failed:", err);
  }

  // Logout
  await logout();

  // Check authentication
  if (isAuthenticated) {
    console.log("Logged in as:", user?.name);
  }
}
```

### API Services

```typescript
import {
  DrugService,
  BatchService,
  AlertService,
  UserService,
  ReportService,
  ImportService,
} from '@/lib/api-services';

// Drugs
const drugs = await DrugService.getAll(1, 10, 'search term');
const drug = await DrugService.getById('drug-id');
await DrugService.create({ name: 'New Drug', ... });
await DrugService.update('drug-id', { name: 'Updated' });
await DrugService.delete('drug-id');

// Batches
const batches = await BatchService.getAll(1, 10, { status: 'active' });
const batch = await BatchService.getById('batch-id');
await BatchService.dispatch('batch-id', { quantity: 100, ... });
const stats = await BatchService.getExpiryStats();

// Alerts
const alerts = await AlertService.getAll(1, 10, { type: 'expiry' });
await AlertService.resolve('alert-id', 'Resolution note');
const stats = await AlertService.getStats();

// Users
const users = await UserService.getAll(1, 10);
const currentUser = await UserService.getCurrentUser();
await UserService.assignRole('user-id', 'MANAGER');
await UserService.assignWarehouse('user-id', 'warehouse-id');

// Reports
const report = await ReportService.generateExpiry({ ... });
const blob = await ReportService.export('report-id', 'pdf');

// Import
const result = await ImportService.upload(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

---

## Page Structure Template

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/auth-context';
import { SomeService } from '@/lib/api-services';
import { Card, Button } from '@/components/ui';
import { AppLayout, PageHeader, Section } from '@/components/layout';

export default function MyPage() {
  // Require authentication
  const user = useRequireAuth();

  // State
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await SomeService.getAll(1, 10);
        setData(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render
  return (
    <AppLayout>
      <PageHeader
        title="Page Title"
        subtitle="Page description"
        actions={<Button variant="primary">Action</Button>}
      />

      <Section title="Section Title">
        {error ? (
          <Card className="p-6 bg-danger-50">
            <p className="text-danger-700">{error}</p>
          </Card>
        ) : isLoading ? (
          <Card className="p-6 text-center">
            <p className="text-text-secondary">Loading...</p>
          </Card>
        ) : data.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-text-secondary">No data found</p>
          </Card>
        ) : (
          <div>
            {/* Render data */}
          </div>
        )}
      </Section>
    </AppLayout>
  );
}
```

---

## Error Handling Patterns

### Try-Catch Pattern

```typescript
try {
  const result = await DrugService.getAll(1, 10);
} catch (err) {
  const message = err instanceof Error ? err.message : "Unknown error";
  setError(message);
}
```

### Error Boundaries

```typescript
import { useEffect } from "react";

useEffect(() => {
  const load = async () => {
    try {
      // API call
    } catch (err) {
      // Handle error
      if (err.status === 401) {
        // Unauthorized - redirect to login
      } else if (err.status === 403) {
        // Forbidden - show permission error
      } else if (err.status === 404) {
        // Not found
      } else if (err.status === 429) {
        // Rate limited - show retry message
      } else {
        // Other errors
      }
    }
  };

  load();
}, []);
```

---

## Common Patterns

### Pagination

```typescript
const [page, setPage] = useState(1);
const [total, setTotal] = useState(0);

useEffect(() => {
  const loadData = async () => {
    const result = await DrugService.getAll(page, 10);
    setData(result.data);
    setTotal(result.total);
  };
  loadData();
}, [page]);

// In render
<Button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
  Previous
</Button>
<Button onClick={() => setPage(p => p + 1)} disabled={page * 10 >= total}>
  Next
</Button>
```

### Filtering

```typescript
const [filters, setFilters] = useState({ status: '', category: '' });

useEffect(() => {
  const loadData = async () => {
    const result = await DrugService.getAll(1, 10, filters.category);
    // ...
  };
  loadData();
}, [filters]);

// In render
<Select
  value={filters.status}
  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
/>
```

### Search with Debounce

```typescript
import { useCallback, useEffect, useState } from 'react';

const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  const loadData = async () => {
    const result = await DrugService.getAll(1, 10, debouncedSearch);
    // ...
  };
  loadData();
}, [debouncedSearch]);

// In render
<Input
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

### Modal with Form

```typescript
const [showModal, setShowModal] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (formData) => {
  try {
    setIsSubmitting(true);
    await DrugService.create(formData);
    setShowModal(false);
    // Refresh list
  } catch (err) {
    setError(err.message);
  } finally {
    setIsSubmitting(false);
  }
};

// In render
{showModal && (
  <Modal
    title="Add Drug"
    onClose={() => setShowModal(false)}
  >
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" isLoading={isSubmitting}>
        Create
      </Button>
    </form>
  </Modal>
)}
```

---

## Frontend Type Definitions

```typescript
// src/lib/api-services.ts

export interface Drug {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  temperature: number;
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id: string;
  drugId: string;
  warehouseId: string;
  quantity: number;
  expiryDate: string;
  batchNumber: string;
  status: "active" | "dispatched" | "expired";
  temperature?: number;
  createdAt: string;
  updatedAt: string;
  drug?: Drug;
}

export interface Alert {
  id: string;
  type: "expiry" | "stock" | "temperature" | "dispatch" | "import";
  severity: "critical" | "error" | "warning" | "info";
  title: string;
  message: string;
  resolved: boolean;
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

---

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_PREFIX=/api/v1
NEXT_PUBLIC_ENABLE_HTTPS=false
NEXT_PUBLIC_TOKEN_STORAGE=secure-localStorage
NEXT_PUBLIC_APP_NAME=PharmaStock
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_DEFAULT_PAGE_SIZE=10
```

### Backend (.env)

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
ALLOWED_ORIGINS=http://localhost:3000
REDIS_URL=redis://localhost:6379
```

---

## Debugging Tips

### Check Token Storage

```javascript
// In browser console
localStorage.getItem("access_token");
localStorage.getItem("user");
localStorage.getItem("refresh_token");
```

### Monitor API Calls

```javascript
// All requests go through apiClient
// Check Network tab in DevTools
// Filter by /api/v1
// Verify Authorization header is present
```

### Enable Debug Logging

```typescript
// In api-client.ts
private makeRequest() {
  console.log('Request:', url, options);
  // ... rest of code
}
```

### Check User Authentication

```typescript
// In any component
const { user, isAuthenticated } = useAuth();
console.log("User:", user);
console.log("Is authenticated:", isAuthenticated);
```

---

## Production Checklist

- [ ] Environment variables set correctly
- [ ] HTTPS enabled
- [ ] CORS origins updated
- [ ] Database migrations applied
- [ ] Error tracking configured
- [ ] Logging configured
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Rate limiting tuned
- [ ] SSL certificates installed
- [ ] All tests passing
- [ ] Performance optimized

---

## Support

For issues or questions, refer to:

- `/INTEGRATION_GUIDE.md` - Detailed integration guide
- `/INTEGRATION_CHECKLIST.md` - Setup and verification checklist
- `/backend/IMPLEMENTATION_SUMMARY.md` - Backend API documentation
- `http://localhost:5000/api-docs` - Swagger API documentation
