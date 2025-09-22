@echo off
chcp 65001 >nul
title Instalacion de Dependencias ARKAIOS
color 0B

echo.
echo ========================================
echo    INSTALANDO DEPENDENCIAS ARKAIOS
echo ========================================
echo.

echo Instalando Flask y dependencias basicas...
pip install flask flask-cors

echo.
echo Instalando Google auth (opcional)...
pip install google-auth google-auth-oauthlib google-auth-httplib2

echo.
echo Verificando instalacion...
python -c "import flask; print('✓ Flask instalado correctamente')"
python -c "try: import google.auth; print('✓ Google auth instalado'); except: print('✗ Google auth no disponible')"

echo.
echo ========================================
echo    INSTALACION COMPLETADA
echo ========================================
echo.
pause