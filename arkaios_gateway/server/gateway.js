case 'read': {
  const url = body?.params?.target;
  if (!url) return bad(400, 'missing target');

  try {
    const resp = await fetch(url, { timeout: 15000 });
    if (!resp.ok) return bad(resp.status, 'fetch_failed');
    const text = await resp.text();

    // si detectas JSON, intenta parsear
    let parsed = null;
    try { parsed = JSON.parse(text); } catch (_) {}

    return ok({ target: url, size: text.length, json: parsed, sample: text.slice(0, 1000) });
  } catch (e) {
    return bad(500, 'read_exception', { message: String(e) });
  }
}
// ... tus requires y app = express() ...

// Bridge (X25519, sesiones, colas, logs)
try {
  app.use('/bridge', require('./bridge'));
  console.log('Bridge routes mounted');
} catch (e) {
  console.warn('Bridge not mounted:', e.message);
}
// Bridge (X25519, sesiones, colas, logs)
try {
  const bridge = require('./bridge');
  app.use('/bridge', bridge);
  console.log('Bridge routes mounted');
} catch (e) {
  console.warn('Bridge not mounted:', e.message);
}

// ... app.listen(...)
