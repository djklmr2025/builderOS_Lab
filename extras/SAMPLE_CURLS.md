# Ejemplos rápidos (curl.exe y PowerShell)

## Windows PowerShell (recomendado)
```powershell
$gw   = "https://arkaios-gateway-open.onrender.com"
# Salud
irm "$gw/aida/health"

# Plan básico
$body = @{ agent_id="puter"; action="plan"; params=@{ objective="mapear BuilderOS" } } | ConvertTo-Json
irm -Method Post -Uri "$gw/aida/gateway" -ContentType "application/json" -Body $body

# Leer índice (si 'read' está habilitado)
$body = @{ agent_id="puter"; action="read"; params=@{ target="https://djklmr2025.github.io/builderOS_Lab/index.json" } } | ConvertTo-Json
irm -Method Post -Uri "$gw/aida/gateway" -ContentType "application/json" -Body $body
```

## curl.exe (Windows CMD)
```bat
curl.exe -s "%gw%/aida/health"
curl.exe -s -X POST "%gw%/aida/gateway" -H "Content-Type: application/json" ^
  -d "{"agent_id":"puter","action":"plan","params":{"objective":"mapear BuilderOS"}}"
```

## Bash/Linux/macOS
```bash
GW=https://arkaios-gateway-open.onrender.com
curl -s "$GW/aida/health"
curl -s -X POST "$GW/aida/gateway" -H "Content-Type: application/json"   -d '{"agent_id":"puter","action":"plan","params":{"objective":"mapear BuilderOS"}}'
```
