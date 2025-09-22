@echo off
chcp 65001 >nul
title ARKAIOS Server - Python Fixed
color 0A

echo.
echo ==================================================
echo    ARKAIOS SERVER - USANDO PYTHON INSTALADO
echo ==================================================
echo.

:: Usar Python 3.11 específicamente
set PYTHON_EXE=C:\Users\djklm\AppData\Local\Programs\Python\Python311\python.exe

:: Verificar que existe
if not exist "%PYTHON_EXE%" (
    echo ❌ Python no encontrado en: %PYTHON_EXE%
    echo.
    echo Buscando otras instalaciones...
    for /f "tokens=*" %%i in ('dir /s /b "C:\Python*\python.exe" 2^>nul') do set PYTHON_EXE=%%i
    for /f "tokens=*" %%i in ('dir /s /b "%USERPROFILE%\AppData\Local\Programs\Python\Python*\python.exe" 2^>nul') do set PYTHON_EXE=%%i
)

if not exist "%PYTHON_EXE%" (
    echo ❌ No se pudo encontrar Python instalado
    echo Por favor instala Python desde https://python.org
    pause
    exit /b 1
)

echo ✅ Python encontrado: %PYTHON_EXE%
%PYTHON_EXE% --version

echo.
echo ==================================================
echo    INICIANDO SERVIDOR ARKAIOS
echo ==================================================
echo.

:: Instalar dependencias si no existen
echo Verificando dependencias...
%PYTHON_EXE% -c "import flask" 2>nul
if %errorlevel% neq 0 (
    echo Instalando Flask y dependencias...
    %PYTHON_EXE% -m pip install flask flask-cors
)

:start_server
echo.
echo Iniciando servidor ARKAIOS...
%PYTHON_EXE% server_arkaios.py

if %errorlevel% neq 0 (
    echo.
    echo [%date% %time%] El servidor se cerró inesperadamente
    echo Reiniciando en 5 segundos...
    timeout /t 5 /nobreak >nul
    goto start_server
)

echo.
echo Servidor detenido normalmente
pause