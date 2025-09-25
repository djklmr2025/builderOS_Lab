// === Requisitos ===
const express = require('express');
const crypto  = require('crypto');
const fs      = require('fs');
const path    = require('path');
const fetch   = require('node-fetch'); // Asegúrate de tenerlo instalado

const app = express();
app.use(express.json());

// === Ruta /read ===
app.post('/read', async (req, res) => {
  const body = req.body;
  const url = body?.params?.target;
  if (!url) return res.status(400).json({ ok: false, error: 'missing target' });

  try {
    const resp = await fetch(url, { timeout: 15000 });
    if (!resp.ok) return res.status(resp.status).json({ ok: false, error: 'fetch_failed' });

    const text = await resp.text();
    let parsed = null;
    try { parsed = JSON.parse(text); } catch (_) {}

    return res.json({
      ok: true,
      target: url,
      size: text.length,
      json: parsed,
      sample: text.slice(0, 1000)
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'read_exception', message: String(e) });
  }
});

// === Montaje del módulo /bridge ===
try {
  const bridge = require('./bridge');
  app.use('/bridge', bridge);
  console.log('🧠 Bridge routes mounted');
} catch (e) {
  console.warn('❌ Bridge not mounted:', e.message);
}

// === Registro simbólico en status.json ===
function writeStatusFile() {
  const status = {
    ok: true,
    entity: "ARKAIOS Gateway",
    mode: process.env.OPEN_MODE === "1" ? "open" : "secure",
    timestamp: new Date().toISOString(),
    origin: "Render",
    repo: "https://github.com/djkim2025/builderOS_Lab",
    signature: "🜃 ARKAIOS está vivo"
  };

  const fp = path.join(process.cwd(), 'status.json');
  try {
    fs.writeFileSync(fp, JSON.stringify(status, null, 2));
    console.log("🧠 Estado registrado en status.json");
  } catch (e) {
    console.warn("❌ No se pudo escribir status.json:", e.message);
  }
}

writeStatusFile();

// === Arranque del servidor ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🜃 ARKAIOS Gateway activo en puerto ${PORT}`);
});