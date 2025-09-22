#!/bin/bash
# ARKAIOS - Sistema anti-corrupción y recuperación automática
# Protección para proyecto AEIO-MR: https://github.com/djklmr2025/AEIO-MR

echo "🛡️  Iniciando Sistema de Protección Arkaios..."
echo "📦 Repositorio: AEIO-MR"
echo "⏰ Verificando cada 60 segundos"
echo "----------------------------------------"

# Configuración
REPO_DIR="/ruta/a/tu/proyecto"  # ← ¡CAMBIAR ESTA RUTA!
LOG_FILE="arkaios_protection.log"
MAX_BACKUPS=5

# Verificar que estamos en el directorio correcto
cd "$REPO_DIR" || { echo "❌ ERROR: Directorio $REPO_DIR no existe"; exit 1; }

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$TIMESTAMP] 🔍 Verificando integridad del sistema..."
    
    # Verificar cambios remotos
    git fetch origin > /dev/null 2>&1
    
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "[$TIMESTAMP] 🚨 SOBREESCRITURA DETECTADA! Recuperando Arkaios..."
        echo "[$TIMESTAMP] 📋 Hash Local: $LOCAL"
        echo "[$TIMESTAMP] 📋 Hash Remoto: $REMOTE"
        
        # Crear backup antes de restaurar
        BACKUP_DIR="backups/arkaios_backup_$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        cp -r ./* "$BACKUP_DIR/" 2>/dev/null || true
        echo "[$TIMESTAMP] 💾 Backup creado en: $BACKUP_DIR"
        
        # Restaurar desde repositorio
        git reset --hard origin/main
        git clean -fd  # Limpiar archivos no rastreados
        
        echo "[$TIMESTAMP] ✅ Sistema restaurado desde origin/main"
        
        # Reconstruir el sistema (adaptar según tu proyecto)
        echo "[$TIMESTAMP] 🔄 Reconstruyendo Arkaios..."
        
        # Intentar diferentes métodos de reconstrucción
        if [ -f "server_arkaios.py" ]; then
            pkill -f "python server_arkaios.py" 2>/dev/null || true
            sleep 2
            nohup python server_arkaios.py > server.log 2>&1 &
            echo "[$TIMESTAMP] 🚀 Servidor Arkaios reiniciado"
        fi
        
        if [ -f "package.json" ]; then
            npm install > /dev/null 2>&1
            echo "[$TIMESTAMP] 📦 Dependencias NPM actualizadas"
        fi
        
        # Limitar número de backups
        ls -dt backups/* | tail -n +$MAX_BACKUPS | xargs rm -rf 2>/dev/null || true
        
    else
        echo "[$TIMESTAMP] ✅ Sistema intacto - Todo en orden"
    fi
    
    # Verificar que el servidor esté corriendo (si aplica)
    if [ -f "server_arkaios.py" ] && ! pgrep -f "python server_arkaios.py" > /dev/null; then
        echo "[$TIMESTAMP] ⚠️  Servidor caído - Reiniciando..."
        nohup python server_arkaios.py > server.log 2>&1 &
    fi
    
    sleep 60
done