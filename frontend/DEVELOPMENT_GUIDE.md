# PharmaStock Frontend - Complete Setup & Architecture Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Core Concepts](#core-concepts)
5. [Development Workflow](#development-workflow)
6. [Deployment](#deployment)

## Quick Start

### Installation & Setup (5 minutes)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Update API URL (ensure backend is running on :5000)
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start development server
npm run dev

# Open http://localhost:3000
```

### Demo Credentials

**Login Page**: http://localhost:3000/auth/login
- Email: `admin@pharmastock.com`
- Password: `SecurePass123`

## Architecture Overview

### Technology Stack Breakdown

```
Next.js 16 App Router
├── TypeScript (Type Safety)
├── Tailwind CSS v4 (Styling)
├── Zustand (State Management)
├── TanStack Query (Data Fetching)
├── React Hook Form (Forms)
├── Zod (Validation)
├── Recharts (Charts)
├── Lucide React (Icons)
└── Axios (HTTP Client)
```

### Data Flow Diagram

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │
       ├─→ useQuery Hook ─→ TanStack Query
       │                        │
       ├─→ useMutation Hook ─→ TanStack Query
       │                        │
       └─→ Zustand Store ◄──────┴─→ API Client
                                      │
                            ┌─────────┴─────────┐
                            │  Axios Instance   │
                            │  with Interceptors│
                            └─────────┬─────────┘
                                      │
                            ┌─────────▼─────────┐
                            │   Express Backend │
                            │   (Port 5000)     │
                            └───────────────────┘
```

### Authentication Flow

```
Login Page
    ↓
POST /auth/login
    ↓
Receive: accessToken + user data
    ↓
Store in: Zustand + localStorage
    ↓
Redirect to /dashboard
    ↓
Protected Routes Check (/app/layout.tsx)
    ↓
If !isAuthenticated → Redirect to /auth/login
If authenticated → Show app content
```

## Project Structure

### Root Level

```
frontend/
├── app/                    # Next.js App Router
├── components/             # React Components
├── lib/                    # Utilities & Configuration
├── services/               # API Hooks
├── store/                  # Zustand Stores
├── types/                  # TypeScript Definitions
├── providers/              # React Providers
├── public/                 # Static Files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── eslint.config.mjs
└── README.md
```

### App Directory Structure

```
app/
├── layout.tsx              # Root Layout (Providers Setup)
├── page.tsx                # / → Redirects to /dashboard
├── globals.css             # Design System
├── (app)/                  # Protected Routes Group
│   ├── layout.tsx          # App Layout (Sidebar + Header)
│   ├── dashboard/
│   │   └── page.tsx        # Main Dashboard
│   ├── inventory/
│   │   └── page.tsx        # Drug Management
│   ├── batches/
│   │   └── page.tsx        # Batch Tracking
│   ├── dispatch/
│   │   └── page.tsx        # Dispatch Management
│   ├── alerts/
│   │   └── page.tsx        # Alert Management
│   ├── reports/
│   │   └── page.tsx        # Reports & Analytics
│   ├── users/
│   │   └── page.tsx        # User Management
│   └── settings/
│       └── page.tsx        # Settings & Preferences
└── auth/
    ├── layout.tsx          # Auth Layout (No Sidebar)
    └── login/
        └── page.tsx        # Login Page
```

### Components Structure

```
components/
├── ui/                     # Low-Level UI Components
│   ├── button.tsx          # <Button /> with variants
│   ├── input.tsx           # <Input /> with error states
│   ├── card.tsx            # Card + CardHeader + CardTitle
│   ├── badge.tsx           # Badge with variants
│   ├── skeleton.tsx        # Loading skeleton
│   ├── toaster.tsx         # Toast notifications
│   └── use-toast.ts        # Toast hook
├── layouts/
│   ├── Sidebar.tsx         # Navigation Sidebar
│   └── Header.tsx          # Top Navigation Bar
├── forms/                  # Form Components (Future)
├── tables/                 # Table Components (Future)
├── charts/                 # Chart Components (Future)
└── shared/                 # Shared Components (Future)
```

### Services Structure

```
services/
├── hooks.ts                # Auth + User CRUD hooks
├── entityHooks.ts          # Warehouse, Drug, Batch hooks
└── reportHooks.ts          # Import, Export, Report hooks
```

## Core Concepts

### 1. API Service Layer

Every API endpoint has a corresponding hook:

```typescript
// Fetching data
export const useDrugs = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['drugs', params],
    queryFn: async () => {
      const response = await apiClient.get('/drugs', { params });
      return response.data;
    },
  });
};

// Mutating data
export const useCreateDrug = () => {
  return useMutation({
    mutationFn: async (data: Omit<Drug, 'id' | ...>) => {
      const response = await apiClient.post('/drugs', data);
      return response.data.data;
    },
  });
};
```

### 2. Type Safety

All API responses are fully typed:

```typescript
interface Drug {
  id: string;
  name: string;
  manufacturer: string;
  // ...
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}
```

### 3. State Management

Two Zustand stores handle global state:

```typescript
// Authentication
const { user, isAuthenticated, login, logout } = useAuthStore();

// UI
const { sidebarOpen, setSidebarOpen, theme, setTheme } = useUIStore();
```

### 4. Component Patterns

All components follow consistent patterns:

```typescript
// Button Variants
<Button variant="primary" size="lg" isLoading={loading}>
  Submit
</Button>

// Badge Variants
<Badge variant="success">Active</Badge>

// Card Composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

## Development Workflow

### Adding a New Page

1. **Create page directory**
   ```bash
   mkdir -p app/(app)/myfeature
   ```

2. **Create page.tsx**
   ```typescript
   'use client';
   
   import { useMyData } from '@/services/hooks';
   import { Card, CardHeader, CardTitle } from '@/components/ui/card';
   
   export default function MyFeaturePage() {
     const { data, isLoading } = useMyData();
     
     return (
       <div className="p-6 space-y-6">
         <h1 className="text-3xl font-bold">My Feature</h1>
         {/* Content */}
       </div>
     );
   }
   ```

3. **Add to Sidebar** (`components/layouts/Sidebar.tsx`)
   ```typescript
   const navigation = [
     // ...
     { name: 'My Feature', href: '/myfeature', icon: Icon },
   ];
   ```

### Adding a New API Hook

1. **Create in appropriate service file**
   ```typescript
   // services/entityHooks.ts
   export const useMyEntity = (params?: Params) => {
     return useQuery({
       queryKey: ['myentity', params],
       queryFn: async () => {
         const response = await apiClient.get('/my-endpoint', { params });
         return response.data;
       },
     });
   };
   ```

2. **Use in component**
   ```typescript
   import { useMyEntity } from '@/services/entityHooks';
   
   const { data } = useMyEntity();
   ```

### Adding a New UI Component

1. **Create in components/ui**
   ```typescript
   // components/ui/newcomponent.tsx
   export const NewComponent = React.forwardRef<HTMLElement, Props>(
     ({ children, ...props }, ref) => (
       <element ref={ref} {...props}>
         {children}
       </element>
     )
   );
   ```

2. **Export from components**
3. **Use throughout app**

### Form Handling

All forms use React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
});

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Name" error={errors.name?.message} {...register('name')} />
    </form>
  );
}
```

## Deployment

### Build

```bash
npm run build
```

### Environment (Production)

```env
NEXT_PUBLIC_API_URL=https://api.pharmastock.com
```

### Deploy to Vercel

```bash
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 🚀 Key Files to Know

| File | Purpose |
|------|---------|
| `lib/apiClient.ts` | Axios instance with auth interceptors |
| `lib/queryClient.ts` | TanStack Query configuration |
| `store/index.ts` | Zustand stores (auth, ui) |
| `types/index.ts` | All TypeScript definitions |
| `services/hooks.ts` | Auth & user API hooks |
| `services/entityHooks.ts` | Entity CRUD hooks |
| `components/ui/*.tsx` | Reusable UI components |
| `components/layouts/*.tsx` | Layout components |

## 🛠️ Common Tasks

### Debugging

```typescript
// Log data
console.log('data:', data);

// React DevTools
// TanStack Query DevTools (add @tanstack/react-query-devtools)
```

### API Errors

Errors are automatically caught and displayed:

```typescript
const { mutate, error } = useCreateDrug();
// Error → Toast notification
```

### Styling

Use Tailwind classes consistently:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card className="p-6">
    <p className="text-sm text-muted-foreground">Label</p>
    <p className="text-2xl font-bold mt-2">Value</p>
  </Card>
</div>
```

## 📞 Support

For issues:
1. Check the backend is running (`http://localhost:5000`)
2. Clear cache: `rm -rf .next node_modules && npm install`
3. Check environment variables: `cat .env.local`
4. Review browser console for errors

---

**Happy coding! 🚀**
