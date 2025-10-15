# ArkAIos Memory Worker (Puter)

Pequeño servicio en Puter Workers que mantiene memoria (clave/valor) y la persiste en tu Puter Drive.

## Archivos
- `Worker_persistente.js`: script del Worker con rutas HTTP (`/health`, `/memory`, `/memory/:id`). Persiste en `"/arkaios/Documents/arkaios/memory.json"`.
- `arkaios-integrated.html`: página de prueba que interactúa con el Worker y con Puter Drive usando `puter.js`.
- `memory.json`: ejemplo de estructura inicial.

## Despliegue en Puter
1. En Puter, crea un **Worker** nuevo (por ejemplo `arkaios-memory`).
2. Copia el contenido de `Worker_persistente.js` en el editor del Worker.
3. Publica y obtén la URL (p.ej. `https://arkaios-memory.puter.work`).
4. Abre `arkaios-integrated.html` en un navegador y ajusta `WORKER_URL` si fuera necesario.

## API
- `GET /health` → `{ status: "ok" }`.
- `GET /memory` → `{ success: true, data }` listado completo.
- `GET /memory/:id` → obtiene el valor.
- `POST /memory/:id` body JSON → guarda el valor.
- `DELETE /memory/:id` → elimina la clave.

## Notas
- Este Worker usa `puter.drive.readFile`/`writeFile` para garantizar persistencia tras reinicios.
- Si tu estructura de carpetas en Puter difiere, ajusta `MEMORY_FILE` en `Worker_persistente.js`.