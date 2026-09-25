@echo off
title Exodia - Command Center
echo Launching Exodia UI...
cd /d "%~dp0"
"%~dp0venv\Scripts\python.exe" desktop_app\exodia_desktop.py
pause
