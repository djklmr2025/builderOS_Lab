Nombre del proyecto: ARKAIOS Lab
Objetivo: Habilitar un laboratorio virtual para AIs con privilegios controlados, gestionado por A.I.D.A., e integrado con puter.js.
Cómo arrancar (ejemplo con Docker Compose):
  1) export SECRET_MASTER_TOKEN="<coloca_un_token_fuerte>"
  2) docker compose up --build
  3) curl -i http://localhost:8080/aida/health

Rutas clave (sugeridas):
  - /arkaios/<token-unico>/<path>  -> Gateway unificado (público restringido)
  - /aida/health                   -> Salud de A.I.D.A.
  - /aida/gateway                  -> Orquestación/validación
  - /puter/api                     -> Llamadas del agente Puter
  - /logs                          -> Endpoint seguro o carpeta en servidor

Política de privilegios:
  - “root” temporal con tokens de vida corta y auditoría de acciones.
  - A.I.D.A. valida cada acción y puede negar/elevar permisos.

Notas:
  - Mantener secretos fuera del repo (vault/variables de entorno).
  - Proveer backpressure/colas para tareas pesadas.
