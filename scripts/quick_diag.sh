#!/usr/bin/env bash
set -euo pipefail
GW="${GW:-https://arkaios-gateway-open.onrender.com}"
INDEX="${INDEX:-https://djklmr2025.github.io/builderOS_Lab/index.json}"

echo "== Ping health =="
curl -fsS "$GW/aida/health" | sed 's/.*/&/'

echo "== Test echo =="
curl -fsS -X POST "$GW/aida/gateway" \
  -H "Content-Type: application/json" \
  -d '{"agent_id":"diag","action":"echo","params":{"msg":"hola"}}' | sed 's/.*/&/'

echo "== Test plan (index) =="
curl -fsS -X POST "$GW/aida/gateway" \
  -H "Content-Type: application/json" \
  -d "{\"agent_id\":\"diag\",\"action\":\"plan\",\"params\":{\"objective\":\"mapear index\",\"index\":\"$INDEX\"}}" | sed 's/.*/&/'
