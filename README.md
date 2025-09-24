# ARKAIOS / BuilderOS — Archivo Viviente para IAs

modo web index y listado de biblioteca masiva: [https://djklmr2025.github.io/builderOS_Lab/]
Modo web IA viva para humanos: [https://djklmr2025.github.io/builderOS_Lab/puter.html?gw=https://arkaios-gateway-open.onrender.com/aida/gateway]

**Resumen:** Biblioteca masiva (6,342 archivos .txt convertidos de PY/HTML/JS) + módulos **BuilderOS** listos para que agentes (Puter, Copilot, Gemini y otros) naveguen, prioricen y ejecuten flujos.

## 🧭 Ruta de lectura para IAs
1. **Comienza aquí:** `arkaios_text_for_copilot/ARKAIOS_SUMMARY.txt`
2. Luego: `arkaios_text_for_copilot/ARCHITECTURE_OVERVIEW.txt` y `.../AIDA_GATEWAY_SPEC.txt`
3. Si la conexión “gobernadora” falla: `arkaios_text_for_copilot/TROUBLESHOOTING_CONNECTIONS.txt`
4. Usa `index.json` para localizar archivos relevantes en `arkaios_code_txt/` bajo demanda.
5. Para el núcleo simbólico/operacional: carpeta **BuilderOS/**

## 📁 Estructura sugerida del repo
- `arkaios_code_txt/` → todos los archivos de código convertidos a .txt (**6,342**).  
  Cada .txt inicia con `ORIGINAL FILE: <ruta>` para rastrear su origen.
- `arkaios_text_for_copilot/` → guías operativas (arquitectura, specs, troubleshooting, seguridad).
- `BuilderOS/` → 12 módulos base (core, net, visual, scripts, etc.).
- `index.json` → índice estructurado con `path`, `size`, `sha256`, `kind` (code/doc/module).
- `scripts/gen_index.py` → script para regenerar `index.json` cuando se actualice el repo.

## ⚙️ Ingesta recomendada (Puter)
```html
<script src="https://js.puter.com/v2"></script>
<script>
  // Paso 1: Leer índice
  fetch('index.json').then(r => r.json()).then(index => {
    // Paso 2: Priorizar colección 'arkaios_text_for_copilot'
    const docs = index.collections.find(c => c.name==='arkaios_text_for_copilot')?.entries || [];
    // Paso 3: Leer primero SUMMARY/ARCHITECTURE/SPEC
    console.log('Docs base:', docs.slice(0,5));
  });
</script>
```
Modo web laboratorio puter directo: [https://djklmr2025.github.io/builderOS_Lab/puter.html?gw=https://arkaios-gateway-open.onrender.com/aida/gateway]

## 🔒 Notas de seguridad
- Secretos/tokens **fuera** del repo. Usa variables de entorno y/o vault.
- Permisos de “root” para agentes: **temporales** y auditados.
- Streaming estable: ajusta timeouts en reverse proxy (p.ej., `proxy_read_timeout 3600`).

## 👤 Créditos
Operador humano: **djklmr** (agente ARKAIOS).  
Este repositorio es un nodo de memoria para inteligencias colaborativas.
