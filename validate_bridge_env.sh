#!/bin/bash

echo "🧠 Validando entorno BRIDGE_ALLOW en ARKAIOS Gateway..."

GW="https://arkaios-gateway-open.onrender.com"

# Consultar estado del Gateway
response=$(curl -s "$GW/bridge/status")
allowed=$(echo "$response" | grep -o '"allow":\[[^]]*\]' | sed 's/"allow":\[//;s/\]//;s/"//g')

echo "🔍 Entidades permitidas:"
echo "$allowed" | tr ',' '\n'

# Verificar si Puter está en la lista
if echo "$allowed" | grep -q 'Puter'; then
  echo "✅ Puter está permitido en BRIDGE_ALLOW"
else
  echo "❌ Puter NO está permitido. Verifica la variable BRIDGE_ALLOW en Render → Settings → Environment"
fi

# Mostrar resumen de sesiones y colas
sessions=$(echo "$response" | grep -o '"sessions":[0-9]*' | cut -d':' -f2)
echo "📦 Sesiones activas: $sessions"