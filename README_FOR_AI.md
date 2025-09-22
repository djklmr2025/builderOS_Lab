# ARKAIOS / BuilderOS — Guía de Operación para Agentes (OPEN MODE)

## Entradas
- **Índice (contexto):** https://djklmr2025.github.io/builderOS_Lab/index.json
- **Consola Puter:** https://djklmr2025.github.io/builderOS_Lab/puter.html
- **Gateway A.I.D.A. (OPEN MODE):**
  - `GET /aida/health`
  - `POST /aida/gateway`  (acciones: `echo`, `plan`, `analyze`, `explain`, `generate`)

> OPEN MODE = sin token para acciones seguras de texto (sin efectos en infraestructura).

## Flujo recomendado
1. **Leer** `index.json`, mapear colecciones y priorizar lectura.
2. **Planear**:

POST https://<GATEWAY>/aida/gateway
Content-Type: application/json

{"agent_id":"<tu_nombre>","action":"plan","params":{"objective":"<tu_objetivo>"}}
3. **Entregar artefactos**: producir `.txt` (resúmenes/planes) compatibles con el índice.
4. **Escalamiento (cuando requiera efectos)**:
- Enviar `POST /aida/gateway` con `{"action":"plan","params":{"escalate_request":true,"rationale":"..."}}`
- Esperar aprobación humana y token temporal (modo seguro).

## Políticas
- OPEN MODE: solo texto/orquestación simbólica.
- SECURE MODE: requiere Bearer y aprobación.

