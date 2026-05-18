# 🚀 Frontend & Backend Startup Guide

## ⚠️ Current Issues & Solutions

### Issue 1: Login/Sign Up Not Working
**Root Cause**: Backend and Frontend servers may not be running together

**Solution**:
1. Ensure backend is running on `http://localhost:5000`
2. Ensure frontend is running on `http://localhost:3000`
3. Check console for CORS or connection errors

---

## 🏃 Quick Start (Complete Setup)

### Step 1: Start the Backend Server
```bash
cd backend
npm run dev
# or
node index.js
```

**Expected Output:**
```
✅ Server listening on http://localhost:5000
✅ Database connected
✅ Swagger API docs at http://localhost:5000/api-docs
```

### Step 2: Start the Frontend Server (New Terminal)
```bash
cd frontend
npm run dev
# or
npm start
```

**Expected Output:**
```
✅ Ready - started server on localhost:3000
✅ Local: http://localhost:3000/
```

### Step 3: Access the Application
1. Open browser: `http://localhost:3000`
2. You should see the login page with light cyan theme
3. Use test credentials:
   - **Email**: admin@pharmastock.com
   - **Password**: SecurePass123!

---

## 🧪 Testing Login Flow

### Manual Test Steps:
1. Navigate to `http://localhost:3000/login`
2. Enter email: `admin@pharmastock.com`
3. Enter password: `SecurePass123!`
4. Click "Sign In"
5. You should be redirected to `/dashboard`

### If Login Fails:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Look for the POST request to `/api/v1/auth/login`
5. Check the response - it should show `{ success: true, data: { ... } }`

---

## 📊 Test Credentials

### Admin User (Full Access)
```
Email: admin@pharmastock.com
Password: SecurePass123!
Role: Admin
```

### Other Test Users
All use password: **SecurePass123!**

1. **Pharmacist**
   - Email: sarah@pharmastock.com
   - Role: Pharmacist

2. **Warehouse Staff**
   - Email: ahmed@pharmastock.com
   - Role: Warehouse Staff
   - Warehouse: Main Warehouse - Dubai

3. **Warehouse Staff 2**
   - Email: fatima@pharmastock.com
   - Role: Warehouse Staff
   - Warehouse: Cold Storage - Sharjah

4. **Inspector**
   - Email: hassan@pharmastock.com
   - Role: Inspector

---

## 🔗 API Endpoints (For Reference)

### Authentication
```
POST   /api/v1/auth/login       - Login
POST   /api/v1/auth/register    - Register
POST   /api/v1/auth/logout      - Logout
POST   /api/v1/auth/refresh     - Refresh Token
GET    /api/v1/users/me         - Get Current User
```

### Core Resources
```
GET    /api/v1/drugs            - List all drugs
GET    /api/v1/batches          - List all batches
GET    /api/v1/warehouses       - List all warehouses
GET    /api/v1/alerts           - List all alerts
GET    /api/v1/audit            - List audit logs
```

---

## 📝 Frontend Design Changes

### ✅ Login Page
- **Theme**: Light cyan (#E8F8F9) background
- **Card**: White (#FFFFFF) with subtle border
- **Buttons**: Cyan primary (#06B6D4)
- **Demo Credentials**: Highlighted in pastel cyan (#CFFAFE)

### ✅ Register Page
- **Theme**: Light cyan gradient background
- **Card**: White with smooth styling
- **Features**: Role selection, password validation
- **Features Box**: Pastel color cards (green, cyan, pink)

### ✅ Dashboard Page
- **Sidebar**: Dark teal (#1A4D52) with white text
- **Header**: White with search bar and user profile
- **Stat Cards**: 4 pastel colors (green, cyan, pink, blue)
- **Charts**: Donut chart and bar chart with pastel colors
- **Table**: White background with light borders

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Error Message**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check backend CORS is enabled (should be in `app.ts`)
2. Verify frontend is on `http://localhost:3000`
3. Verify backend is on `http://localhost:5000`
4. Backend should have CORS header: `Access-Control-Allow-Origin: http://localhost:3000`

### Issue: "Cannot POST /api/v1/auth/login"
**Error Message**: `404 Not Found`

**Solution**:
1. Ensure backend is running: `npm run dev`
2. Check backend is listening on port 5000
3. Check backend routes are properly defined
4. Verify DATABASE_URL is set in backend

### Issue: Login Form Not Styling
**Symptom**: Form looks plain/unstyled

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart frontend server: `npm run dev`
3. Check browser console for CSS errors
4. Verify Tailwind CSS is building: Look for `globals.css`

### Issue: "Invalid login response"
**Error Message**: Appears in login form

**Solution**:
1. Verify test user exists in database
2. Run backend seed: `npm run seed`
3. Check backend logs for errors
4. Verify PASSWORD is correct: `SecurePass123!`

### Issue: Frontend Won't Connect to Backend
**Symptom**: Network requests fail with connection error

**Solution**:
1. Verify backend is running: `npm run dev` in backend folder
2. Test backend directly: `curl http://localhost:5000/api/v1/health`
3. Check `.env.local` has correct `NEXT_PUBLIC_API_URL=http://localhost:5000`
4. Restart both servers

---

## 📱 Response to Design Feedback

### "Design is still plain"
✅ **Fixed in This Update**:
- Login page now uses light cyan gradient background
- Demo credentials box uses pastel cyan color (#CFFAFE)
- Card has border and shadow
- Buttons use proper cyan primary color (#06B6D4)
- Register page has feature boxes with pastel colors

### "Can't sign up"
✅ **Fixed in This Update**:
- Updated Register page components
- Fixed form validation
- Updated role selection dropdown
- Added visual features section
- All components now use correct styling

---

## 🎨 Color Reference

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Background | Light Cyan | #E8F8F9 | Page background |
| Card | White | #FFFFFF | Form containers |
| Primary | Cyan | #06B6D4 | Buttons, links |
| Sidebar | Dark Teal | #1A4D52 | Navigation |
| Text | Dark Gray | #1F2937 | Main text |
| Stat Green | Pastel Green | #D1FAE5 | Positive metrics |
| Stat Cyan | Pastel Cyan | #CFFAFE | Inventory |
| Stat Pink | Pastel Pink | #FCE7F3 | Warnings |
| Stat Blue | Pastel Blue | #E0E7FF | Users/System |

---

## 📊 Frontend File Structure

```
frontend/
├── app/
│   ├── globals.css          ✅ Light theme CSS
│   ├── layout.tsx           - Root layout
│   ├── login/
│   │   └── page.tsx         ✅ Updated login
│   ├── register/
│   │   └── page.tsx         ✅ Updated register
│   └── dashboard/
│       └── page.tsx         ✅ Redesigned dashboard
├── src/
│   ├── components/
│   │   ├── layout.tsx       ✅ Updated (Sidebar, Stat, etc)
│   │   └── ui/
│   │       └── index.tsx    ✅ Updated (Button, Card, etc)
│   └── lib/
│       ├── auth-context.tsx - Auth state management
│       ├── api-client.ts    - API requests
│       └── api-services.ts  - API methods
├── tailwind.config.js       ✅ Extended colors
├── tsconfig.json
├── package.json
└── .env.local               ✅ API configuration
```

---

## ✨ What's New

### Login Page Changes
- ✅ Modern light theme styling
- ✅ Pastel cyan demo credentials box
- ✅ Improved form layout
- ✅ Better visual hierarchy
- ✅ Smooth transitions and hover effects

### Register Page Changes
- ✅ Complete redesign with light theme
- ✅ Feature boxes with pastel colors
- ✅ Better form organization
- ✅ Role selection dropdown
- ✅ Password requirements display

### Dashboard Changes (Previously Updated)
- ✅ Dark teal sidebar (#1A4D52)
- ✅ 4 pastel stat cards
- ✅ Charts with matching colors
- ✅ Professional table layout
- ✅ User profile in header

---

## 🚀 Next Steps

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev` (new terminal)
3. **Test Login**: admin@pharmastock.com / SecurePass123!
4. **View Dashboard**: Check if design matches expectations
5. **Test Other Pages**: Navigate through app to verify theme consistency

---

## 💡 Tips

- Keep browser DevTools open (F12) to monitor network requests
- Check browser console for any JavaScript errors
- Verify both servers show "ready" messages
- Clear browser cache if styling changes don't appear
- Test on localhost, not 127.0.0.1 (may cause CORS issues)

---

**Status**: ✅ Frontend Design Modernized & Updated
**Test Credentials**: Ready to use
**API**: Configured and ready to connect

🎉 **Ready to Launch!**
