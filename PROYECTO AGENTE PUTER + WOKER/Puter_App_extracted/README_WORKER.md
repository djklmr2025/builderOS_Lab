# ArkAIos Memory Worker (Persistente)

Este Worker proporciona rutas simples para salud, bootstrap de claves y almacenamiento de memoria, sin depender del objeto global `puter`.

## Rutas disponibles
- `GET /health` — verificación de vida: `{ status: "ok", message: "Worker activo ✅" }`
- `GET /key` — pista de inicialización para API key y master token.
- `GET /key-info` — estado de inicialización con máscaras.
- `POST /memory` — guarda un valor: body `{ id, value }`.
- `GET /memory/:id` — lee el valor guardado.
- `GET /memory` — lista de claves presentes.

## Persistencia
- Usa `memory.json` en el directorio del Worker si el runtime tiene `fs` disponible.
- Si `fs` no existe, cae a almacenamiento en memoria del proceso (efímero).

## Empaquetado (ZIP)
1. Ir a la carpeta del proyecto: `C:\Users\djklm\Desktop\ARKAIOS\cosmos-den`.
2. Ejecutar el script:
   - PowerShell: `./builderOS_Lab/PROYECTO AGENTE PUTER + WOKER/zip-worker.ps1`
   - Resultado: `Worker.ready.zip` en la raíz indicada por el script.

## Despliegue en Puter Dev Center
1. Abrir Dev Center y seleccionar el **Worker** asociado a tu App.
2. Subir `Worker.ready.zip` con la opción **Unzip & Overwrite**.
3. Asegurar que el **entrypoint** sea `index.js`.
4. Reiniciar el Worker.

## Pruebas rápidas
Usa `curl.exe` (evita el alias de PowerShell) o `Invoke-RestMethod`.

```powershell
curl.exe "https://arkaios-agent-ai.puter.work/health"
curl.exe "https://arkaios-agent-ai.puter.work/key-info"

# Inicializar claves
$body = @{ id='__api_key'; value='TU_API_KEY' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'https://arkaios-agent-ai.puter.work/memory' -ContentType 'application/json' -Body $body

$body = @{ id='__master_token'; value='TU_MASTER_TOKEN' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'https://arkaios-agent-ai.puter.work/memory' -ContentType 'application/json' -Body $body

curl.exe "https://arkaios-agent-ai.puter.work/key-info"
```

## Solución de problemas
- "ReferenceError: puter is not defined": este Worker no usa `puter`; si ves ese error en otra versión, sustituye sus llamadas por las utilidades de `fs` incluidas aquí.
- 404 en rutas: confirma que el **entrypoint** cargado es el `index.js` de este paquete.


Este Worker persiste datos en tu Puter Drive y se auto-inicializa con un `__api_key` y `__master_token` (si falta, lo iguala al mismo valor) al primer uso.

## Endpoints
- `GET /health` — estado del servicio
- `GET /` — info y rutas
- `GET /memory` — todas las memorias (requiere API key)
- `GET /memory/:id` — leer una memoria (requiere API key)
- `POST /memory/:id` — escribir una memoria (requiere API key)
- `DELETE /memory/:id` — eliminar una memoria (requiere API key)
- `GET /key-info` — estado del API key y master token (enmascarados)

## Autenticación
Envía cualquiera de estos encabezados:
- `x-api-key: <token>`
- `x-master-token: <token>`
- `Authorization: Bearer <token>`

El Worker valida contra `__api_key` y `__master_token` guardados en `memory.json` (persistente en Puter Drive).

## CORS
Permite `*` y los métodos `GET, POST, DELETE, OPTIONS`.

## Instalación en Puter
1. Sube `Worker_persistente.js` (o este ZIP) al área de Workers de Puter.
2. Si un ZIP, descomprime y sobrescribe en tu carpeta de Worker.
3. Haz una petición a cualquier endpoint protegido para inicializar las claves.

## Ubicación de memoria persistente
- `MEMORY_FILE`: `/arkaios/Documents/arkaios/memory.json`

## Nota
Este Worker está diseñado para funcionar sin pasos manuales: genera y persiste el API key al primer acceso.