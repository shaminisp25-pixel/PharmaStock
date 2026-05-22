# PharmaStock Frontend - Quick Reference Guide

## 🚀 Quick Start (30 seconds)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# Visit http://localhost:3000
```

**Demo Login**: admin@pharmastock.com / SecurePass123

---

## 📚 Available Hooks

### Authentication

```typescript
import { useLogin, useRegister, useChangePassword, useLogout } from '@/services/hooks';

const { mutateAsync: login, isPending } = useLogin();
const { mutateAsync: register } = useRegister();
const { mutateAsync: changePassword } = useChangePassword();
const { mutateAsync: logout } = useLogout();
```

### Users

```typescript
import { useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser } from '@/services/hooks';

const { data: users, isLoading } = useUsers({ page: 1, limit: 20 });
const { data: user } = useUser(userId);
const { mutateAsync: create } = useCreateUser();
const { mutateAsync: update } = useUpdateUser();
const { mutateAsync: delete: deleteUser } = useDeleteUser();
```

### Warehouses

```typescript
import { useWarehouses, useWarehouse, useCreateWarehouse, useUpdateWarehouse, useDeleteWarehouse } from '@/services/entityHooks';

const { data: warehouses } = useWarehouses();
const { data: warehouse } = useWarehouse(id);
const { mutateAsync: create } = useCreateWarehouse();
const { mutateAsync: update } = useUpdateWarehouse();
const { mutateAsync: delete: deleteWarehouse } = useDeleteWarehouse();
```

### Drugs

```typescript
import { useDrugs, useDrug, useCreateDrug, useUpdateDrug, useDeleteDrug } from '@/services/entityHooks';

const { data: drugs, isLoading } = useDrugs({ page: 1, limit: 20 });
const { data: drug } = useDrug(id);
const { mutateAsync: create } = useCreateDrug();
const { mutateAsync: update } = useUpdateDrug();
const { mutateAsync: delete: deleteDrug } = useDeleteDrug();
```

### Batches

```typescript
import { useBatches, useBatch, useCreateBatch, useUpdateBatchStatus, useDispatchBatch, useScanBatch, useDeleteBatch } from '@/services/entityHooks';

const { data: batches } = useBatches({ page: 1, limit: 20, status: 'active' });
const { data: batch } = useBatch(id);
const { mutateAsync: create } = useCreateBatch();
const { mutateAsync: updateStatus } = useUpdateBatchStatus();
const { mutateAsync: dispatch } = useDispatchBatch();
const { mutateAsync: scan } = useScanBatch();
const { mutateAsync: delete: deleteBatch } = useDeleteBatch();
```

### Alerts

```typescript
import { useAlerts, useAlert, useResolveAlert } from '@/services/entityHooks';

const { data: alerts } = useAlerts({ page: 1, limit: 50 });
const { data: alert } = useAlert(id);
const { mutateAsync: resolve } = useResolveAlert();
```

### Audit, Import & Reports

```typescript
import { useAuditLogs, useImportLogs, useImportLog, useUploadBatches, useDownloadTemplate, useExpiryReport, useDispatchReport, useStockReport } from '@/services/reportHooks';

const { data: auditLogs } = useAuditLogs();
const { data: importLogs } = useImportLogs();
const { data: importLog } = useImportLog(id);
const { mutateAsync: upload } = useUploadBatches();
const { mutateAsync: downloadTemplate } = useDownloadTemplate();
const { mutateAsync: expiryReport } = useExpiryReport();
const { mutateAsync: dispatchReport } = useDispatchReport();
const { data: stockReport } = useStockReport();
```

---

## 🎨 Available UI Components

### Button

```typescript
import { Button } from '@/components/ui/button';

<Button variant="primary" size="lg" isLoading={loading}>
  Click me
</Button>

// Variants: primary, secondary, destructive, outline, ghost
// Sizes: sm, md, lg
```

### Input

```typescript
import { Input } from '@/components/ui/input';

<Input
  label="Email"
  type="email"
  placeholder="user@example.com"
  error={errors.email?.message}
  helperText="Enter a valid email"
  {...register('email')}
/>
```

### Card

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Actions
  </CardFooter>
</Card>
```

### Badge

```typescript
import { Badge } from '@/components/ui/badge';

<Badge variant="success">Active</Badge>
<Badge variant="destructive">Expired</Badge>
<Badge variant="warning">Expiring Soon</Badge>

// Variants: default, primary, success, warning, destructive
```

### Skeleton

```typescript
import { Skeleton, TableSkeleton } from '@/components/ui/skeleton';

<Skeleton className="h-4 w-1/2" />
<Skeleton variant="circular" className="w-12 h-12" />
<TableSkeleton /> // Pre-built table loader
```

### Toast

```typescript
import { useToast } from '@/components/ui/use-toast';

const { toast } = useToast();

toast({
  title: 'Success',
  description: 'Operation completed',
  variant: 'default' // or 'destructive'
});
```

---

## 🏗️ Store Usage

### Authentication Store

```typescript
import { useAuthStore } from '@/store';

const { 
  user,              // Current user object
  isAuthenticated,   // Boolean
  accessToken,       // JWT token
  setUser,          // Update user
  setAccessToken,   // Update token
  login,            // Set user + token
  logout            // Clear everything
} = useAuthStore();
```

### UI Store

```typescript
import { useUIStore } from '@/store';

const {
  sidebarOpen,      // Boolean
  setSidebarOpen,   // Toggle sidebar
  theme,            // 'light' | 'dark' | 'system'
  setTheme          // Change theme
} = useUIStore();
```

---

## 📝 Common Code Patterns

### Fetch Data with Loading

```typescript
'use client';

import { useDrugs } from '@/services/entityHooks';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  const { data, isLoading } = useDrugs();

  if (isLoading) return <Skeleton className="h-20" />;

  return <div>{/* Render data */}</div>;
}
```

### Create/Update Form

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateDrug } from '@/services/entityHooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  manufacturer: z.string().min(1, 'Required'),
});

export default function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const { mutateAsync: create, isPending } = useCreateDrug();

  const onSubmit = async (data) => {
    await create(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Name" error={errors.name?.message} {...register('name')} />
      <Input label="Manufacturer" error={errors.manufacturer?.message} {...register('manufacturer')} />
      <Button type="submit" isLoading={isPending}>Submit</Button>
    </form>
  );
}
```

### Pagination Table

```typescript
'use client';

import { useState } from 'react';
import { useDrugs } from '@/services/entityHooks';
import { Button } from '@/components/ui/button';

export default function Page() {
  const [page, setPage] = useState(1);
  const { data } = useDrugs({ page, limit: 20 });

  return (
    <>
      <table>
        {/* Table content */}
      </table>
      <div className="flex gap-2 mt-4">
        <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Previous
        </Button>
        <Button disabled={page === data?.meta?.totalPages} onClick={() => setPage(p => p + 1)}>
          Next
        </Button>
      </div>
    </>
  );
}
```

### Search & Filter

```typescript
'use client';

import { useState } from 'react';
import { useDrugs } from '@/services/entityHooks';
import { Input } from '@/components/ui/input';

export default function Page() {
  const [search, setSearch] = useState('');
  const { data: drugs } = useDrugs({ limit: 1000 });

  const filtered = drugs?.data?.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <>
      <Input
        placeholder="Search drugs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* Render filtered */}
    </>
  );
}
```

---

## 🔄 Type Definitions

```typescript
import type { 
  User, 
  Warehouse, 
  Drug, 
  Batch, 
  Alert, 
  ImportLog,
  AuditLog,
  UserRole,
  BatchStatus,
  AlertType,
  PaginatedResponse,
  ApiResponse
} from '@/types';
```

---

## 🛠️ Debugging

### Log Data

```typescript
console.log('State:', { data, isLoading, error });
```

### Check Environment

```typescript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

### React Query DevTools (Optional)

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

## 📖 File Locations

| What | Where |
|------|-------|
| API Hooks | `services/` |
| UI Components | `components/ui/` |
| Layouts | `components/layouts/` |
| Pages | `app/(app)/` |
| Types | `types/index.ts` |
| Stores | `store/index.ts` |
| Config | `lib/` |

---

## 🚀 Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm run start

# Lint
npm run lint

# Type check
tsc --noEmit
```

---

## 🎯 Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional
NEXT_PUBLIC_APP_NAME=PharmaStock
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

---

## 📞 Quick Help

**Build failing?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**API not connecting?**
```bash
# Check backend is running
curl http://localhost:5000/health
```

**Styling issues?**
```bash
# Rebuild Tailwind
npm run build
```

---

**More info**: See `README.md` and `DEVELOPMENT_GUIDE.md`

---

Built with ❤️ • Ready for Production • Type-Safe • Enterprise-Grade
