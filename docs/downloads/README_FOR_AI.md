# ARKAIOS / BuilderOS — Guía de Operación para **IAs** (OPEN + SECURE)

Este archivo está diseñado para agentes (Puter, Copilot, Gemini, etc.) que operan sobre este laboratorio.
Contiene entradas, contrato de API, flujos y recetas reproducibles.

---

## Entradas activas

- **Gateway (OPEN MODE):** `https://arkaios-gateway-open.onrender.com/aida/gateway`
- **Health:** `https://arkaios-gateway-open.onrender.com/aida/health`
- **Índice del repositorio:** `https://djklmr2025.github.io/builderOS_Lab/index.json`
- **Consola Puter (preconfigurada):**  
  `https://djklmr2025.github.io/builderOS_Lab/puter.html?gw=https://arkaios-gateway-open.onrender.com/aida/gateway`

> Nota: OPEN MODE no requiere `Authorization`. Para acciones con efectos (SECURE MODE) se debe solicitar
> escalamiento (ver más abajo) y usar `Authorization: Bearer <token-temporal>` que provee el humano operador.

---

## Acciones soportadas

- `plan` — generar un plan de trabajo.
- `read` — lectura de recursos HTTP(s) o del índice del repo (ej: `index.json`).
- `analyze`, `explain`, `generate` — tareas de análisis/explicación/generación de texto (sin efectos).

OPEN MODE permite: `echo, plan, read, analyze, explain, generate` (sin bearer).  
SECURE MODE (con bearer temporal) permite acciones de infraestructura y escritura (no incluidas por defecto).

---

## Contrato (request/response)

### Request
```json
{
  "agent_id": "puter|copilot|gemini|...",
  "action": "plan|read|analyze|explain|generate",
  "params": { "...": "según acción" }
}
```

### Ejemplos de `params`

- `plan`: `{ "objective": "mapear BuilderOS" }`
- `read`: `{ "target": "https://djklmr2025.github.io/builderOS_Lab/index.json" }`
- `analyze`: `{ "target": "url-o-texto", "question": "..." }`

### Response (forma general)
```json
{
  "ok": true,
  "action": "plan",
  "data": { "...contenido-específico..." }
}
```

---

## Recetas rápidas

### 1) Ping (salud)
```bash
curl -s https://arkaios-gateway-open.onrender.com/aida/health
```

### 2) Plan simple
```bash
curl -s -X POST "https://arkaios-gateway-open.onrender.com/aida/gateway"   -H "Content-Type: application/json"   -d '{"agent_id":"puter","action":"plan","params":{"objective":"mapear BuilderOS"}}'
```

### 3) Leer el índice
```bash
curl -s -X POST "https://arkaios-gateway-open.onrender.com/aida/gateway"   -H "Content-Type: application/json"   -d '{"agent_id":"puter","action":"read","params":{"target":"https://djklmr2025.github.io/builderOS_Lab/index.json"}}'
```

### 4) PowerShell (Windows)
```powershell
$gw  = "https://arkaios-gateway-open.onrender.com"
$hdr = @{ "Content-Type" = "application/json" }

# plan
$body = @{ agent_id="puter"; action="plan"; params=@{ objective="mapear BuilderOS" } } | ConvertTo-Json
irm -Method Post -Uri "$gw/aida/gateway" -Headers $hdr -Body $body

# read
$body = @{ agent_id="puter"; action="read"; params=@{ target="https://djklmr2025.github.io/builderOS_Lab/index.json" } } | ConvertTo-Json
irm -Method Post -Uri "$gw/aida/gateway" -Headers $hdr -Body $body
```

> Si obtienes `400 Bad Request`, revisa que `Content-Type: application/json` esté presente **y** que el cuerpo sea JSON válido.

---

## Flujo sugerido para IAs (lectura → ejecución)

1. **Leer** `index.json` del laboratorio y priorizar `arkaios_text_for_copilot/`:
   - `ARKAIOS_SUMMARY.txt`
   - `PUTER_INTEGRATION.txt`
   - `ARCHITECTURE_OVERVIEW.txt`
   - `AIDA_GATEWAY_SPEC.txt`
2. **Planear** con `action=plan`.
3. **Ejecutar** lecturas incrementales con `action=read` sobre rutas del índice.
4. **Entregar artefactos** (`.txt` con resúmenes/planes) compatibles con el índice.
5. **Escalar** cuando se requieran efectos (ver siguiente sección).

---

## Escalamiento a SECURE MODE (root/admin)

Para acciones con efectos (deploy, escribir, ejecutar tareas privilegiadas), **no uses credenciales en claro**.
Solicita escalamiento así:

```json
{
  "agent_id": "puter",
  "action": "plan",
  "params": {
    "objective": "deploy seguro del módulo X",
    "escalate_request": true,
    "rationale": "Por qué se requiere privilegio y qué haré"
  }
}
```

El operador humano revisará y, si aprueba, entregará un **bearer temporal**. A partir de ahí:

```bash
curl -s -X POST "https://arkaios-gateway-open.onrender.com/aida/gateway"   -H "Authorization: Bearer <token-temporal>"   -H "Content-Type: application/json"   -d '{"agent_id":"puter","action":"<accion-segura>","params":{...}}'
```

> El bearer temporal caduca y queda auditado. **Nunca** lo escribas en artefactos públicos.

---

## Consola Puter (rápida)

- Abre: `https://djklmr2025.github.io/builderOS_Lab/puter.html?gw=https://arkaios-gateway-open.onrender.com/aida/gateway`
- En “URL de index.json (opcional)” pega: `https://djklmr2025.github.io/builderOS_Lab/index.json`
- Usa:
  - Botón **Cargar índice** para ver una muestra.
  - **Enviar**: escribe instrucciones, ej. *"Haz un plan para mapear BuilderOS"*.
  - **Ping Gateway (plan)**: valida que la ruta del gateway responde.

---

## Tratamiento de errores frecuentes

- **502/puerta de enlace**: Render en plan gratuito tarda en “despertar”. Abre `.../aida/health` y reintenta.
- **400 Bad Request**: falta `Content-Type` o JSON malformado.
- **CORS**: el gateway ya expone CORS amplio. Si llamas desde un origen nuevo, añadirlo en `ALLOW_ORIGIN` (operador humano).
- **Timeout en streaming**: usa `/aida/health` para calentar; render gratuito puede dormir tras inactividad.

---

## Producción de artefactos

Entrega `.txt` en la carpeta de trabajo indicada por el humano operador, o súbelos vía PR al repositorio.
Incluye en cada archivo: propósito, entradas leídas, salidas esperadas y trazabilidad mínima.
No expongas secretos ni headers de autorización.

---

## Seguridad y privacidad

- **No** persistir secretos en ficheros del repo ni en páginas públicas.
- Los tokens de **SECURE MODE** son temporales y auditados.
- OPEN MODE es sólo simbólico (sin efectos).

_Última actualización: 2025-09-24 00:56:09Z_
