# 🚀 Quick Server Startup Commands

## Terminal 1: Backend Server
```bash
cd c:\Users\Jaya\ Suriya\ T\ R\Desktop\pharma\backend
npm run dev
```

**Expected Output:**
```
✅ [express] Server listening on port 5000
✅ Connected to PostgreSQL database
✅ Swagger API docs: http://localhost:5000/api-docs
```

---

## Terminal 2: Frontend Server (New Terminal Window)
```bash
cd c:\Users\Jaya\ Suriya\ T\ R\Desktop\pharma\frontend
npm run dev
```

**Expected Output:**
```
✅ Ready - started server on 0.0.0.0:3000, url: http://localhost:3000
✅ Local: http://localhost:3000/
```

---

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Web Application |
| **Backend API** | http://localhost:5000 | API Endpoints |
| **API Docs** | http://localhost:5000/api-docs | Swagger Documentation |
| **Login Page** | http://localhost:3000/login | User Authentication |
| **Dashboard** | http://localhost:3000/dashboard | Main Application |

---

## ✅ Test Login

Once both servers are running:

1. Open http://localhost:3000 in your browser
2. You'll be redirected to login page
3. Enter credentials:
   - **Email**: admin@pharmastock.com
   - **Password**: SecurePass123!
4. Click "Sign In"
5. You should see the dashboard with light cyan theme

---

## 🔍 Verify Setup

### Check Backend Health
```bash
curl http://localhost:5000/api/v1/health
# Should return: { "status": "ok" }
```

### Check Frontend Running
Open http://localhost:3000 in browser
- You should see the login page
- Page should have light cyan background
- Demo credentials box should show in pastel cyan color

### Check CORS
- Network tab in DevTools should show successful OPTIONS request
- Response headers should include `access-control-allow-origin: http://localhost:3000`

---

## 📋 Troubleshooting Checklist

- [ ] Backend running on port 5000?
- [ ] Frontend running on port 3000?
- [ ] Both started with `npm run dev`?
- [ ] Can access http://localhost:3000?
- [ ] Can access http://localhost:5000/api-docs?
- [ ] Login page shows light cyan theme?
- [ ] Demo credentials visible in pastel box?
- [ ] No console errors in DevTools?
- [ ] No CORS errors in Network tab?
- [ ] All CSS styling visible?

---

## 🆘 If Something Goes Wrong

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill it (Windows)
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm run dev
```

### Clear Cache & Rebuild
```bash
# Frontend
cd frontend
rm -r .next
npm run dev

# Backend
cd backend
npm run dev
```

### Check Logs
```bash
# Backend should show SQL migrations
# Frontend should show Next.js compilation messages
```

---

## 🎯 Success Indicators

✅ Both servers showing "ready" or "listening"
✅ No red error messages in console
✅ Browser loads http://localhost:3000
✅ Login page displays with light cyan theme
✅ Can see demo credentials box in pastel cyan
✅ Can type into form fields
✅ Buttons are cyan color (#06B6D4)
✅ Card background is white (#FFFFFF)

---

## 📱 Frontend Design Features

**Login Page:**
- Light cyan gradient background
- White card with borders
- Cyan primary buttons
- Pastel cyan demo credentials box
- Dark gray text

**Register Page:**
- Same light theme as login
- Pastel feature boxes (green, blue, pink)
- Role selection dropdown
- Terms checkbox

**Dashboard:**
- Dark teal sidebar (#1A4D52)
- White header with search
- 4 pastel stat cards
- Charts with pastel colors
- Professional table layout

---

**Status**: ✅ Ready to Run
**Configuration**: Complete
**Design**: Modernized with Light Cyan Theme
**API**: Connected and Ready

🚀 **Go ahead and start both servers!**
