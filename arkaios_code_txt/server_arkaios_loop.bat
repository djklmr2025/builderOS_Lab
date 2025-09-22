@echo off
chcp 65001 >nul
title ARKAIOS Server - Ejecucion Continua
color 0A

set PYTHON_EXE=python
set MAX_RESTARTS=100
set RESTART_DELAY=3

echo.
echo ================================================
echo    ARKAIOS SERVER - EJECUCION CONTINUA
echo ================================================
echo.
echo Configuracion:
echo Python: %PYTHON_EXE%
echo Reinicios maximos: %MAX_RESTARTS%
echo Delay entre reinicios: %RESTART_DELAY% segundos
echo.
echo Presiona Ctrl+C para salir completamente
echo.

set /a restart_count=0

:start_server
set /a restart_count+=1

echo.
echo [%date% %time%] Iniciando servidor (Intento #%restart_count%)...
echo.

%PYTHON_EXE% server_arkaios.py
set exit_code=%errorlevel%

echo.
if %exit_code% equ 0 (
    echo [%date% %time%] Servidor cerrado normalmente
    goto :end
) else (
    echo [%date% %time%] Servidor cerrado con codigo de error: %exit_code%
)

if %restart_count% geq %MAX_RESTARTS% (
    echo.
    echo [%date% %time%] Se alcanzo el limite maximo de reinicios (%MAX_RESTARTS%)
    goto :end
)

echo [%date% %time%] Reiniciando en %RESTART_DELAY% segundos...
timeout /t %RESTART_DELAY% /nobreak >nul
goto :start_server

:end
echo.
echo ================================================
echo    SERVIDOR ARKAIOS DETENIDO
echo ================================================
echo Ultimo codigo de salida: %exit_code%
echo Total de reinicios: %restart_count%
echo.
pause