@echo off
echo ==============================================
echo [ACTIS EXODIA] Initiating Boot Sequence...
echo ==============================================
echo.

echo 1. Starting Kafka Stream Processor...
cd C:\Users\Lenovo\.gemini\antigravity\scratch\ACTIS_Exodia\message_broker
docker compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running! Please open Docker Desktop and try again.
    pause
    exit /b
)
echo.

echo 2. Waking up Apache Flink Real-Time Enrichment Job...
cd C:\Users\Lenovo\.gemini\antigravity\scratch\ACTIS_Exodia\data_pipeline
start "Apache Flink Processor" cmd /c "C:\Users\Lenovo\.gemini\antigravity\scratch\langchain_project\venv\Scripts\python.exe flink_enrichment_job.py & pause"
timeout /t 5 >nul
echo.

echo 3. Waking up Llama 3.2 AI Agent (Kafka Listener)...
cd C:\Users\Lenovo\.gemini\antigravity\scratch\ACTIS_Exodia\ai_engine
start "ACTIS AI Agent" cmd /c "C:\Users\Lenovo\.gemini\antigravity\scratch\langchain_project\venv\Scripts\python.exe kafka_listener.py & pause"
timeout /t 5 >nul
echo.

echo 4. Starting Hubble eBPF Network Simulator...
cd C:\Users\Lenovo\.gemini\antigravity\scratch\ACTIS_Exodia\message_broker
C:\Users\Lenovo\.gemini\antigravity\scratch\langchain_project\venv\Scripts\python.exe hubble_simulator.py

echo.
echo ==============================================
echo ACTIS Exodia is fully operational.
echo Check the new terminal window to see the AI's real-time threat analysis!
echo ==============================================
pause
