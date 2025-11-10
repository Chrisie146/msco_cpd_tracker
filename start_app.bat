@echo off
echo ============================================
echo    SAICA CPD Tracker - Quick Start
echo ============================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download from: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found. Installing dependencies...
npm install

if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo Installation complete! Starting application...
echo.
echo The app will open at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the application
echo.

npm run dev:all