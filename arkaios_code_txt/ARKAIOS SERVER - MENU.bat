@echo off
chcp 65001 >nul
title ARKAIOS Server - Opciones Múltiples
color 0A

:menu
cls
echo.
echo ==================================================
echo    ARKAIOS SERVER - MENU PRINCIPAL
echo ==================================================
echo.
echo 1. Iniciar servidor (intento automático)
echo 2. Instalar Python automáticamente
echo 3. Usar Python portable
echo 4. Verificar instalación de Python
echo 5. Forzar invocacion arkaios
echo 6. Salir
echo.
set /p choice="Selecciona una opción (1-6): "

if "%choice%"=="1" goto auto_detect
if "%choice%"=="2" goto install_python
if "%choice%"=="3" goto portable_python
if "%choice%"=="4" goto check_python
if "%choice%"=="5" goto force_start_arkaios
if "%choice%"=="6" exit /b 0

echo Opción inválida
timeout /t 2 /nobreak >nul
goto menu

:auto_detect
echo.
echo Detectando Python instalado...
where python >nul 2>nul && set PYTHON_CMD=python && goto found_python
where python3 >nul 2>nul && set PYTHON_CMD=python3 && goto found_python
call server_arkaios_fixed.bat

echo ❌ Python no encontrado
echo.
echo 1. Intentar con Python portable
echo 2. Instalar Python
echo 3. Volver al menú
echo.
set /p choice="Selecciona: "

if "%choice%"=="1" goto portable_python
if "%choice%"=="2" goto install_python
goto menu

:found_python
echo ✓ Usando: %PYTHON_CMD%
%PYTHON_CMD% --version
echo.
goto start_server

:install_python
call install_python.bat
goto menu

:portable_python
call arkaios-on.bat
goto menu

:check_python
echo.
echo Verificando instalaciones de Python...
echo.
where python || echo ❌ python no encontrado
where python3 || echo ❌ python3 no encontrado

:force_start_arkaios
call server_arkaios_fixed.bat
echo.
goto start_server

echo.
echo Rutas comunes verificadas:
dir C:\Python* /ad /b 2>nul || echo No se encontraron instalaciones de Python

echo.
pause
goto menu

:start_server
echo Iniciando servidor ARKAIOS...
%PYTHON_CMD% server_arkaios.py
echo.
echo Servidor detenido
pause
goto menu