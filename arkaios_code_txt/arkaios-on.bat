@echo off
chcp 65001 >nul
title ARKAIOS Server - Python Portable
color 0A

echo.
echo ==================================================
echo    ARKAIOS CON PYTHON PORTABLE
echo ==================================================
echo.

:: Configurar rutas
set PORTABLE_PYTHON=python_portable
set PYTHON_URL=https://www.python.org/ftp/python/3.11.9/python-3.11.9-embed-amd64.zip

:: Verificar si ya existe la versión portable
if exist "%PORTABLE_PYTHON%\python.exe" (
    echo ✓ Python portable detectado
    goto start_server
)

echo.
echo Python portable no encontrado. Descargando...
echo.

:: Crear directorio
if not exist "%PORTABLE_PYTHON%" mkdir "%PORTABLE_PYTHON%"

:: Descargar Python portable
powershell -Command "Invoke-WebRequest -Uri '%PYTHON_URL%' -OutFile 'python_temp.zip'"

:: Extraer
powershell -Command "Expand-Archive -Path 'python_temp.zip' -DestinationPath '%PORTABLE_PYTHON%'"
del python_temp.zip 2>nul

:: Descargar pip
cd "%PORTABLE_PYTHON%"
powershell -Command "Invoke-WebRequest -Uri 'https://bootstrap.pypa.io/get-pip.py' -OutFile 'get-pip.py'"
python.exe get-pip.py
del get-pip.py 2>nul

cd ..

:: Instalar dependencias
echo.
echo Instalando dependencias de ARKAIOS...
"%PORTABLE_PYTHON%\python.exe" -m pip install flask flask-cors

:start_server
echo.
echo ==================================================
echo    INICIANDO SERVIDOR ARKAIOS
echo ==================================================
echo.

:restart
"%PORTABLE_PYTHON%\python.exe" server_arkaios.py

if %errorlevel% neq 0 (
    echo.
    echo [%date% %time%] El servidor se cerró inesperadamente
    echo Reiniciando en 5 segundos...
    timeout /t 5 /nobreak >nul
    goto restart
)

echo.
echo Servidor detenido normalmente
pause