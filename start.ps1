# ============================================================
#  Travi! - Start Script for Windows
#  Run from the project root: .\start.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Travi! - AI Travel Planner" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Python
Write-Host "[1/5] Checking Python..." -ForegroundColor Yellow
try {
    $pyVersion = & python --version 2>&1
    Write-Host "      Found: $pyVersion" -ForegroundColor Green
} catch {
    Write-Host "      ERROR: Python not found. Install from https://www.python.org/downloads/" -ForegroundColor Red
    exit 1
}

# 2. Check Node.js
Write-Host "[2/5] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = & node --version 2>&1
    Write-Host "      Found: Node $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "      ERROR: Node.js not found. Install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# 3. Check .env file
Write-Host "[3/5] Checking .env file..." -ForegroundColor Yellow
$envFile = Join-Path $ProjectRoot ".env"
if (-Not (Test-Path $envFile)) {
    Write-Host "      .env not found - creating it now..." -ForegroundColor Yellow
    $groqKey = Read-Host "      Enter your GROQ_API_KEY"
    $mapsKey = Read-Host "      Enter your GOOGLE_MAPS_API_KEY"
    $line1 = "GROQ_API_KEY=" + $groqKey
    $line2 = "GOOGLE_MAPS_API_KEY=" + $mapsKey
    $line3 = "ENVIRONMENT=development"
    $line1, $line2, $line3 | Set-Content -Path $envFile
    Write-Host "      .env created." -ForegroundColor Green
} else {
    Write-Host "      .env found." -ForegroundColor Green
}

# 4. Install Python dependencies
Write-Host "[4/5] Installing Python dependencies..." -ForegroundColor Yellow
Set-Location $ProjectRoot
& python -m pip install -r requirements.txt --quiet
Write-Host "      Done." -ForegroundColor Green

# 5. Install frontend dependencies
Write-Host "[5/5] Installing frontend dependencies..." -ForegroundColor Yellow
$frontendDir = Join-Path $ProjectRoot "frontend"
Set-Location $frontendDir
& npm install --silent
Write-Host "      Done." -ForegroundColor Green

# Launch Backend in a new window
Write-Host ""
Write-Host "Starting Backend  -> http://localhost:8000" -ForegroundColor Cyan
$backendCmd = "Set-Location '" + $ProjectRoot + "'; python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

Start-Sleep -Seconds 2

# Launch Frontend in a new window
Write-Host "Starting Frontend -> http://localhost:5173" -ForegroundColor Cyan
$frontendCmd = "Set-Location '" + $frontendDir + "'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "   App is running!" -ForegroundColor Green
Write-Host "   Open: http://localhost:5173" -ForegroundColor Green
Write-Host "   API:  http://localhost:8000/docs" -ForegroundColor Green
Write-Host "   Close the two new windows to stop." -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

Start-Process "http://localhost:5173"
