// Worker con persistencia usando Puter Drive
// Archivo: Worker_persistente.js

// Ruta del archivo de memoria (persistente en tu Puter Drive)
const MEMORY_FILE = "/arkaios/Documents/arkaios/memory.json";

// CORS headers para permitir llamadas desde tu sitio puter.site
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key, Authorization"
};

// Cargar memoria desde JSON en Drive
async function loadMemory() {
  try {
    const file = await puter.drive.readFile(MEMORY_FILE, "utf-8");
    return JSON.parse(file);
  } catch (e) {
    return {}; // Si no existe, devuelve objeto vacío
  }
}

// Guardar memoria en JSON en Drive
async function saveMemory(data) {
  await puter.drive.writeFile(
    MEMORY_FILE,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

// --- Auth helpers: API Key + MASTER_TOKEN ---------------------------------
function extractTokensFromRequest(request) {
  const h = request.headers;
  const tokens = [];
  const headerKey = h.get("x-api-key");
  if (headerKey) tokens.push(headerKey);
  const masterHeader = h.get("x-master-token");
  if (masterHeader) tokens.push(masterHeader);
  const auth = h.get("authorization");
  const bearer = auth && auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (bearer) tokens.push(bearer);
  return tokens;
}

async function requireApiKey(request) {
  const providedTokens = extractTokensFromRequest(request);
  const memory = await loadMemory();
  if (!memory.__api_key) {
    // Generate and persist a new API key on first use
    const newKey = (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function")
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    memory.__api_key = newKey;
    // Si no hay master token, usar el mismo valor para simplificar
    if (!memory.__master_token) {
      memory.__master_token = newKey;
    }
    await saveMemory(memory);
  }
  const valid = new Set([memory.__api_key, memory.__master_token].filter(Boolean));
  return providedTokens.some(t => valid.has(t));
}

function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: "invalid_api_key" }), {
    status: 401,
    headers: CORS_HEADERS,
  });
}

// Healthcheck
router.get("/health", () => {
  return new Response(JSON.stringify({ status: "ok", message: "Worker activo ✅" }), {
    headers: CORS_HEADERS
  });
});

// Ruta raíz informativa
router.get("/", () => {
  return new Response(
    JSON.stringify({
      service: "ArkAIos Memory Worker",
      message: "Usa /health, /memory o /memory/:id",
      routes: ["/health", "/memory", "/memory/:id"],
    }),
    { headers: CORS_HEADERS }
  );
});

// Obtener toda la memoria
router.get("/memory", async ({ request }) => {
  if (!(await requireApiKey(request))) return unauthorizedResponse();
  const data = await loadMemory();
  return new Response(JSON.stringify({ success: true, data }), { headers: CORS_HEADERS });
});

// Leer memoria por id
router.get("/memory/:id", async ({ params, request }) => {
  if (!(await requireApiKey(request))) return unauthorizedResponse();
  const data = await loadMemory();
  if (data[params.id] !== undefined) {
    return new Response(
      JSON.stringify({ success: true, id: params.id, value: data[params.id] }),
      { headers: CORS_HEADERS }
    );
  }
  return new Response(JSON.stringify({ error: `No se encontró memoria para '${params.id}'` }), {
    headers: CORS_HEADERS,
    status: 404
  });
});

// Guardar memoria por id
router.post("/memory/:id", async ({ params, request }) => {
  if (!(await requireApiKey(request))) return unauthorizedResponse();
  const body = await request.json();
  const data = await loadMemory();
  data[params.id] = body;
  await saveMemory(data);
  return new Response(JSON.stringify({ success: true, id: params.id, value: body }), {
    headers: CORS_HEADERS
  });
});

// Eliminar memoria por id
router.delete("/memory/:id", async ({ params, request }) => {
  if (!(await requireApiKey(request))) return unauthorizedResponse();
  const data = await loadMemory();
  if (data[params.id] !== undefined) {
    delete data[params.id];
    await saveMemory(data);
    return new Response(
      JSON.stringify({ success: true, message: `Memoria de '${params.id}' eliminada` }),
      { headers: CORS_HEADERS }
    );
  }
  return new Response(JSON.stringify({ error: `No se encontró memoria para '${params.id}'` }), {
    headers: CORS_HEADERS,
    status: 404
  });
});

// Información básica sobre el estado del API key (sin exponerlo)
router.get("/key-info", async () => {
  const memory = await loadMemory();
  const key = memory.__api_key || null;
  const masked = key ? `${key.slice(0, 4)}…${key.slice(-4)}` : null;
  const mkey = memory.__master_token || null;
  const mmasked = mkey ? `${mkey.slice(0, 4)}…${mkey.slice(-4)}` : null;
  return new Response(
    JSON.stringify({
      initialized: Boolean(key),
      mask: masked,
      master_initialized: Boolean(mkey),
      master_mask: mmasked,
      hint: "El API key se guarda en memory.json bajo '__api_key'",
    }),
    { headers: CORS_HEADERS }
  );
});

// Endpoint de bootstrapping DEV: expone API key y master token
// Nota: úsalo solo en desarrollo; para producción, elimina o restringe.
router.get("/key", async () => {
  const memory = await loadMemory();
  if (!memory.__api_key) {
    const newKey = (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function")
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    memory.__api_key = newKey;
    if (!memory.__master_token) memory.__master_token = newKey;
    await saveMemory(memory);
  }
  return new Response(
    JSON.stringify({ api_key: memory.__api_key, master_token: memory.__master_token }),
    { headers: CORS_HEADERS }
  );
});

// Responder preflight OPTIONS
router.options("/memory/:id", () => new Response("", { headers: CORS_HEADERS }));
router.options("/memory", () => new Response("", { headers: CORS_HEADERS }));
router.options("/health", () => new Response("", { headers: CORS_HEADERS }));
router.options("/", () => new Response("", { headers: CORS_HEADERS }));
// Preflight para key-info
router.options("/key-info", () => new Response("", { headers: CORS_HEADERS }));
