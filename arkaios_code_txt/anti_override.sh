#!/bin/bash
# Sistema anti-sobreescritura
while true; do
    git fetch origin
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ $LOCAL != $REMOTE ]; then
        echo "¡SOBREESCRITURA DETECTADA! Recuperando Arkaios..."
        git reset --hard origin/main
        python ethical_engine.py --rebuild
    fi
    sleep 60
done
