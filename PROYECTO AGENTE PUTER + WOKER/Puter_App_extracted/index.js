// ArkAIos Memory Worker (Persistente)
// Entrypoint del Worker con rutas: /health, /key, /key-info, /memory
// Sin dependencia del objeto global `puter`. Usa fs si está disponible;
// si no, usa memoria efímera en proceso.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
};

const MEM_PATH = './memory.json';

let fsModulePromise = (async () => {
  try {
    // Intento cargar fs (Node). En algunos runtimes no existirá.
    return await import('node:fs/promises');
  } catch (e) {
    return null;
  }
})();

let inMemoryStore = {};

function mask(s) {
  if (!s) return null;
  return s.length <= 6 ? s : `${s.slice(0, 3)}...${s.slice(-3)}`;
}

async function readMemory() {
  const fs = await fsModulePromise;
  if (fs) {
    try {
      const txt = await fs.readFile(MEM_PATH, 'utf8');
      return txt ? JSON.parse(txt) : {};
    } catch (e) {
      return {};
    }
  }
  return inMemoryStore;
}

async function writeMemory(obj) {
  const fs = await fsModulePromise;
  if (fs) {
    await fs.writeFile(MEM_PATH, JSON.stringify(obj, null, 2), 'utf8');
    return true;
  }
  inMemoryStore = obj;
  return true;
}

async function setValue(id, value) {
  const mem = await readMemory();
  mem[id] = value;
  await writeMemory(mem);
  return { id, value };
}

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...corsHeaders, ...headers },
  });
}

async function handleFetch(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') {
    return new Response('', { headers: { ...corsHeaders } });
  }

  if (path === '/health') {
    return jsonResponse({ status: 'ok', message: 'Worker activo ✅' });
  }

  if (path === '/key-info') {
    const mem = await readMemory();
    const api = mem['__api_key'];
    const master = mem['__master_token'];
    return jsonResponse({
      initialized: !!api,
      mask: mask(api),
      master_initialized: !!master,
      master_mask: mask(master),
      hint: "El API key se guarda en memory.json bajo '__api_key'",
    });
  }

  if (path === '/key') {
    return jsonResponse({
      api_key_hint: "Guárdalo en memory.json con id '__api_key'",
      master_hint: "Guárdalo en '__master_token'",
    });
  }

  if (path.startsWith('/memory')) {
    const parts = path.split('/').filter(Boolean); // ['memory', ...]

    if (method === 'POST' && parts.length === 1) {
      let body = null;
      try {
        body = await request.json();
      } catch (e) {
        body = null;
      }
      const id = body?.id;
      const value = body?.value;
      if (!id) {
        return jsonResponse({ ok: false, error: 'id requerido' }, 400);
      }
      const saved = await setValue(id, value);
      return jsonResponse({ ok: true, saved });
    }

    if (method === 'GET' && parts.length === 2) {
      const id = parts[1];
      const mem = await readMemory();
      const value = mem[id] ?? null;
      return jsonResponse({ id, value });
    }

    if (method === 'GET' && parts.length === 1) {
      const mem = await readMemory();
      return jsonResponse({ keys: Object.keys(mem) });
    }
  }

  return jsonResponse({ error: 'Path not found', path }, 404);
}

export default { fetch: handleFetch };

// Compatibilidad CommonJS si el runtime lo permite
try {
  // eslint-disable-next-line no-undef
  module.exports = { fetch: handleFetch };
} catch (e) {
  // Ignorar si module no existe (ESM/Workers)
}