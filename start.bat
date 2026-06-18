@echo off
echo ===================================================
echo   CampusConnect - MERN Stack Startup
echo ===================================================
echo.

REM --- Check if MongoDB is running on port 27017 ---
netstat -an | find "27017" | find "LISTENING" >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] MongoDB is NOT running on port 27017.
    echo [!] Please start MongoDB first:
    echo     - If installed as service: net start MongoDB
    echo     - Or run: mongod --dbpath "C:\data\db"
    echo     - Or use MongoDB Atlas cloud URI in server\.env
    echo.
    pause
    exit /b 1
)
echo [OK] MongoDB is running on port 27017.
echo.

REM --- Start backend server ---
echo [1] Starting Express server (port 5000)...
start "CampusConnect Backend" cmd /k "cd /d %~dp0server && node index.js"
timeout /t 2 /nobreak >nul

REM --- Start frontend dev server ---
echo [2] Starting React frontend (port 5173)...
start "CampusConnect Frontend" cmd /k "cd /d %~dp0client && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ===================================================
echo   App is starting!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000/api/health
echo ===================================================
echo.
pause
