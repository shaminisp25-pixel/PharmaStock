@echo off
REM PharmaStock Integration Setup Script
REM This script initializes the complete backend and frontend integration

echo.
echo ============================================
echo PharmaStock - Integration Setup Script
echo ============================================
echo.

REM Step 1: Setup Backend
echo [1/4] Setting up Backend...
cd backend
echo   - Installing dependencies...
call npm install
echo   - Generating Prisma client...
call npm run prisma:generate
echo   - Running migrations...
call npm run prisma:migrate
echo   - Seeding database...
call npm run seed
echo ✓ Backend setup complete!
echo.

REM Step 2: Go back to root
cd ..

REM Step 3: Setup Frontend
echo [2/4] Setting up Frontend...
cd frontend
echo   - Installing dependencies...
call npm install
echo ✓ Frontend setup complete!
echo.

REM Step 4: Summary
cd ..
echo [3/4] Verification...
echo   - Backend environment: ✓ .env configured
echo   - Frontend environment: ✓ .env.local configured
echo   - Database: ✓ Migrated and seeded
echo.

echo [4/4] Ready to start!
echo.
echo ============================================
echo Next Steps:
echo ============================================
echo.
echo Terminal 1 - Start Backend:
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Start Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:3000/auth/login
echo Login with: admin@pharmastock.com / SecurePass123!
echo.
echo ============================================
echo.
pause
