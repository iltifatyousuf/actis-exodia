@echo off
title ACTIS Exodia - Enterprise Threat Intelligence Platform
color 0A
echo.
echo ============================================
echo    ACTIS EXODIA - BOOTING ALL SYSTEMS
echo ============================================
echo.

set PROJECT_DIR=%~dp0
set VENV_PYTHON=%PROJECT_DIR%venv\Scripts\python.exe

REM Check if venv exists, if not create it
if not exist "%VENV_PYTHON%" (
    echo [!] Virtual environment not found. Creating one...
    python -m venv "%PROJECT_DIR%venv"
    "%VENV_PYTHON%" -m pip install --upgrade pip
    "%VENV_PYTHON%" -m pip install -r "%PROJECT_DIR%requirements.txt"
)

echo 1. Starting Docker Infrastructure (Kafka, Flink, Prometheus, Grafana)...
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

echo 2. Starting Apache Flink Enrichment Job...
cd /d "%PROJECT_DIR%data_pipeline"
start "Flink Processor" cmd /c ""%VENV_PYTHON%" flink_enrichment_job.py & pause"
timeout /t 5 >nul
echo.

echo 3. Starting Llama 3.2 AI Agent (Kafka Listener)...
cd /d "%PROJECT_DIR%ai_engine"
start "ACTIS AI Agent" cmd /c ""%VENV_PYTHON%" kafka_listener.py & pause"
timeout /t 5 >nul
echo.

echo 4. Starting FastAPI Gateway (Port 8080)...
cd /d "%PROJECT_DIR%api_gateway"
start "FastAPI Gateway" cmd /c ""%VENV_PYTHON%" -m uvicorn main:app --host 0.0.0.0 --port 8080 & pause"
timeout /t 5 >nul
echo.

echo 5. Starting Hubble eBPF Threat Simulator...
cd /d "%PROJECT_DIR%message_broker"
start "Hubble Simulator" cmd /c ""%VENV_PYTHON%" hubble_simulator.py & pause"
timeout /t 3 >nul
echo.

echo ============================================
echo    EXODIA IS FULLY ONLINE
echo ============================================
echo.
echo  Grafana Dashboard:    http://localhost:3000
echo  Prometheus:           http://localhost:9090
echo  Flink Dashboard:      http://localhost:8082
echo  FastAPI Gateway:      http://localhost:8080/docs
echo  AI Metrics:           http://localhost:8000
echo.
echo  Press any key to shut down all services...
pause >nul

echo Shutting down...
cd /d "%PROJECT_DIR%infrastructure"
docker compose -f enterprise_stack.yml down
taskkill /FI "WINDOWTITLE eq Flink Processor*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq ACTIS AI Agent*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq FastAPI Gateway*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Hubble Simulator*" /F >nul 2>&1
echo All services stopped.
