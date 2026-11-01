@echo off
rem Double-click to start the Sherubtse website on this computer (see deploy\windows\site.ps1).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0site.ps1" start
pause
