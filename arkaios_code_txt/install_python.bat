@echo off
chcp 65001 >nul

:: Buscar Python instalado
for /f "tokens=*" %%i in ('dir /s /b "C:\Python*\python.exe" 2^>nul') do set PYTHON_EXE=%%i & goto found_python

for /f "tokens=*" %%i in ('dir /s /b "C:\Program Files\Python*\python.exe" 2^>nul') do set PYTHON_EXE=%%i & goto found_python

for /f "tokens=*" %%i in ('dir /s /b "%USERPROFILE%\AppData\Local\Programs\Python\Python*\python.exe" 2^>nul') do set PYTHON_EXE=%%i & goto found_python

echo ❌ Python no encontrado
echo Instalando Python automaticamente...
powershell -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe' -OutFile '%TEMP%\python_installer.exe'"
start /wait %TEMP%\python_installer.exe /quiet InstallAllUsers=1 PrependPath=1
del %TEMP%\python_installer.exe

:: Intentar nuevamente después de instalar
for /f "tokens=*" %%i in ('dir /s /b "C:\Python*\python.exe" 2^>nul') do set PYTHON_EXE=%%i & goto found_python

echo ❌ Aun no se encuentra Python. Por favor reinicia tu equipo.
pause
exit /b 1

:found_python
echo ✅ Python encontrado: %PYTHON_EXE%
%PYTHON_EXE% --version
echo.

:: Ejecutar el servidor ARKAIOS
echo Iniciando servidor ARKAIOS...
%PYTHON_EXE% server_arkaios.py

if %errorlevel% neq 0 (
    echo.
    echo El servidor se cerró. Reiniciando en 5 segundos...
    timeout /t 5 /nobreak >nul
    goto found_python
)

pause