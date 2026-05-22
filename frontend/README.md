# PharmaStock Frontend

A modern, enterprise-grade pharmaceutical management system built with Next.js, TypeScript, and Tailwind CSS.

## 🎯 Overview

PharmaStock Frontend is a comprehensive pharmacy management dashboard designed for professionals. It features:

- **Modern UI/UX**: Inspired by Stripe, Linear, and Vercel dashboards
- **Real-time Analytics**: Dashboard with charts and KPIs
- **Inventory Management**: Manage drugs and warehouses
- **Batch Tracking**: Monitor pharmaceutical batches and expiry dates
- **Alert System**: Automatic alerts for expiry and low stock
- **Dispatch Management**: Track batch distributions
- **Reporting**: Generate CSV exports and reports
- **User Management**: Role-based access control
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (Express.js on port 5000)

## 🚀 Getting Started

### 1. Installation

```bash
cd frontend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Demo Login

- Email: `admin@pharmastock.com`
- Password: `SecurePass123`

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (app)/              # Protected routes
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── batches/
│   │   ├── dispatch/
│   │   ├── alerts/
│   │   ├── reports/
│   │   ├── users/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── auth/login/
│   └── layout.tsx
├── components/
│   ├── ui/                 # Reusable components
│   └── layouts/            # Layout components
├── lib/
│   ├── apiClient.ts
│   ├── queryClient.ts
│   └── utils.ts
├── services/
│   ├── hooks.ts
│   ├── entityHooks.ts
│   └── reportHooks.ts
├── store/                  # Zustand stores
├── types/                  # TypeScript types
└── providers/
```

## 🔐 Authentication

Login flow:
1. Visit `/auth/login`
2. Enter credentials
3. Tokens stored in Zustand + localStorage
4. Automatic token refresh
5. Auto-logout on expiry

## 📡 API Integration

All API calls use TanStack Query with automatic error handling.

Query hook example:
```typescript
const { data: drugs } = useDrugs({ page: 1, limit: 20 });
```

Mutation hook example:
```typescript
const createMutation = useCreateDrug();
await createMutation.mutateAsync(drugData);
```

## 🎨 Design System

**Colors**: Indigo primary, Emerald success, Amber warning, Red destructive

**Components**: Button, Input, Card, Badge, Skeleton, Toast

## 🚢 Production Build

```bash
npm run build
npm run start
```

## 📚 Documentation

- [Next.js Docs](https://nextjs.org)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
- [Zod](https://zod.dev)

## 📄 License

MIT

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
