@echo off
chcp 65001 >nul
title ARKAIOS Server - Inicio Simple
color 0A

echo.
echo ========================================
echo    INICIANDO SERVIDOR ARKAIOS
echo ========================================
echo.
echo Servidor: http://127.0.0.1:5000
echo Health:   http://127.0.0.1:5000/health
echo Docs:     http://127.0.0.1:5000/docs
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

python server_arkaios.py

echo.
echo Servidor detenido
pause