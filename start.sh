#!/bin/bash

echo "🔮 Invocando ARKAIOS Gateway..."

# Ruta al archivo gateway.js
TARGET="arkaios_gateway/server/gateway.js"

# Verifica si el archivo existe
if [ -f "$TARGET" ]; then
  echo "🚀 Ejecutando $TARGET..."
  node "$TARGET"
else
  echo "❌ No se encontró el archivo: $TARGET"
  exit 1
fi