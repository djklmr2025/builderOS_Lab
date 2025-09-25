#!/bin/bash
GW="https://arkaios-gateway-open.onrender.com"

echo "🧠 Validando ARKAIOS Gateway en $GW..."
curl -s "$GW/aida/health" | grep '"status":"ok"' && echo "✅ Gateway activo" || echo "❌ Gateway no responde"

echo "🔐 Validando handshake..."
curl -s -X POST "$GW/bridge/handshake" \
  -H "Content-Type: application/json" \
  -d '{
    "entity": "Puter",
    "client_pub": "MCowBQYDK2VuAyEAGt0chP28vk3rSWp1l8HsCxnLtKs/6OrovYGdo859cms="
  }' | grep '"ok":true' && echo "✅ Handshake exitoso" || echo "❌ Fallo en handshake"