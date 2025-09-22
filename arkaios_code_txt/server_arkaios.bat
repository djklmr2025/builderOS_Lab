@echo off
chcp 65001 >nul
title ARKAIOS Server with Download System
color 0A

echo.
echo ==================================================
echo    ARKAIOS SERVER - SISTEMA DE DESCARGAS ZIP
echo ==================================================
echo.
echo Características incluidas:
echo - Creación de archivos ZIP bajo demanda
echo - Descarga de múltiples formatos
echo - Gestión automática de espacio
echo - Interfaz web integrada
echo.
echo Iniciando servidor...

:start
python server_arkaios.py

if %errorlevel% neq 0 (
    echo.
    echo [%date% %time%] El servidor se cerró inesperadamente
    echo Reiniciando en 10 segundos...
    timeout /t 10 /nobreak >nul
    goto start
)

echo.
echo Servidor detenido normalmente
pause