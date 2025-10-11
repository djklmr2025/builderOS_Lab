# ARKAIOS Puter Lab — OPEN MODE
- `docs/puter.html` → consola Puter para Pages.
- `server/` → gateway sin bearer para acciones de texto (OPEN_MODE=1).
- Para permitir acciones de archivos (leer, escribir, borrar, copiar, mover, mkdir, listar), usa modo seguro: `OPEN_MODE=0` con `MASTER_TOKEN` y define `SECRET_BASE` como sandbox.
- Configurable por `PUBLIC_ACTIONS` (texto) y `SECURE_ACTIONS` (archivo) en `.env`.
