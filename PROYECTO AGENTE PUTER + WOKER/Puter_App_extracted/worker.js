const FILE_NAME = "memory.json";

// --- Cargar memoria desde archivo ---
async function loadMemory() {
  try {
    const file = await fs.readFile(FILE_NAME, "utf-8");
    return JSON.parse(file);
  } catch (e) {
    return {}; // si no existe, memoria vacía
  }
}

// --- Guardar memoria en archivo ---
async function saveMemory(memory) {
  await fs.writeFile(FILE_NAME, JSON.stringify(memory, null, 2));
}

// --- Manejador principal ---
async function handleRequest(request) {
  const url = new URL(request.url);
  const { pathname } = url;
  let memory = await loadMemory();

  // GET /memory
  if (request.method === "GET" && pathname === "/memory") {
    return new Response(JSON.stringify(memory), { status: 200 });
  }

  // POST /memory/:id
  if (request.method === "POST" && pathname.startsWith("/memory/")) {
    const id = pathname.split("/")[2];
    const body = await request.json();
    memory[id] = body;
    await saveMemory(memory);
    return new Response(JSON.stringify({ success: true, id, data: body }), { status: 200 });
  }

  // DELETE /memory/:id
  if (request.method === "DELETE" && pathname.startsWith("/memory/")) {
    const id = pathname.split("/")[2];
    delete memory[id];
    await saveMemory(memory);
    return new Response(JSON.stringify({ success: true, deleted: id }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Ruta no encontrada" }), { status: 404 });
}

// --- Listener obligatorio en Puter Workers ---
onfetch(async (req) => {
  return await handleRequest(req);
});
