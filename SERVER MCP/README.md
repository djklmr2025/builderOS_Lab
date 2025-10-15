# SERVER MCP

Carpeta con configuraciones mínimas para integrar servidores MCP en TRAE.

## Archivos

- `arkaios-mcp-stdio.json`: configuración mínima (STDIO) apuntando a `arkaios-lab-starter`.
- `arkaios-mcp-http.json`: configuración mínima (HTTP) apuntando a `http://localhost:8090/mcp`.

## Uso en TRAE

1. Abre TRAE → pestaña "MCP" → "Configure Manually".
2. Pega el contenido del JSON deseado y confirma.
3. Pruebas rápidas:
   - Ejecuta `arkaios.health` (debe responder `gateway.ok: true` en modo OPEN).
   - Para chat: `arkaios.chat` con `{"prompt":"Hola desde TRAE"}`.

## Levantar los servidores

### HTTP (`mcp-http`)

- Inicia con PM2:
  - `pm2 start ecosystem.config.cjs --only mcp-http --update-env`
  - o ejecuta `start_pm2_both.bat` desde `arkaios-lab-starter` para levantar `cosmos-den` y `mcp-http` juntos.
- Verifica:
  - `pm2 logs mcp-http --lines 30`
  - `curl http://localhost:8090/mcp/health` (si existe endpoint de health).

### STDIO (`arkaios-mcp`)

- En TRAE, usa `arkaios-mcp-stdio.json`. Requiere Node en PATH (`node`).
- Si Node no está en PATH, usa `command: "c:\\Program Files\\nodejs\\node.exe"`.

## Variables y notas

- `AIDA_GATEWAY_URL`: gateway OPEN: `https://arkaios-gateway-open.onrender.com/aida/gateway`.
- `AIDA_AUTH_TOKEN`: dejar vacío para OPEN; usar `Bearer` en modo SECURE.
- `LOCAL_BASE`: base local (`http://127.0.0.1:3000`) para UI si corresponde.
- Windows: utiliza rutas `cwd` con `c:\\` y evita comillas en JSON.

## Estado de pruebas

- Cuando `mcp-http` está en ejecución, el endpoint queda disponible en `http://localhost:8090/mcp`.
- Confirma con `pm2 list` y `pm2 logs` antes de configurar en TRAE.