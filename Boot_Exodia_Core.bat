@echo off
title Exodia - Core Infrastructure Bootloader
color 0A
echo.
echo ============================================
echo        EXODIA - BOOTING CORE SERVERS
echo ============================================
echo.

set PROJECT_DIR=%~dp0
set VENV_PYTHON=%PROJECT_DIR%venv\Scripts\python.exe

echo 1. Starting Docker Infrastructure (Kafka, Neo4j, Prometheus, Grafana)...
cd /d "%PROJECT_DIR%infrastructure"
docker compose -f enterprise_stack.yml up -d
if %errorlevel% neq 0 (
    echo [!] Docker failed to start. Is Docker Desktop running?
    echo [!] Attempting to start Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    timeout /t 20 >nul
    docker compose -f enterprise_stack.yml up -d
)
timeout /t 10 >nul
echo.

echo 2. Starting Exodia Gateway API (Port 8080)...
cd /d "%PROJECT_DIR%api_gateway"
start "FastAPI Gateway" cmd /c ""%VENV_PYTHON%" -m uvicorn main:app --host 0.0.0.0 --port 8080 & pause"
timeout /t 5 >nul
echo.

echo ============================================
echo    EXODIA INFRASTRUCTURE IS ONLINE
echo ============================================
echo.
echo  You may now launch the Exodia Client desktop application!
echo.
echo  (Leave this window open to keep the backend running)
echo  Press any key to completely shut down the servers...
pause >nul

echo Shutting down...
cd /d "%PROJECT_DIR%infrastructure"
docker compose -f enterprise_stack.yml down
taskkill /FI "WINDOWTITLE eq FastAPI Gateway*" /F >nul 2>&1
echo All Exodia services stopped.
