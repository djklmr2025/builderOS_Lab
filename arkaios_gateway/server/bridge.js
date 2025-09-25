const express = require('express');
const crypto  = require('crypto');
const fs      = require('fs');
const path    = require('path');

const router = express.Router();
router.use(express.json());

// -------- Config --------
const TTL_MS = Number(process.env.BRIDGE_TTL_MS || 15 * 60 * 1000); // 15 min
const ALLOW_ENTITIES = (process.env.BRIDGE_ALLOW || 'Puter,Copilot,Gemini,ARKAIOS')
  .split(',').map(s => s.trim()).filter(Boolean);

// Memoria
const sessions = new Map();  // sessionId -> {entity, created, serverPub}
const queues   = new Map();  // entity    -> [{from,to,payload,ts}]

function ensureQueue(name) {
  if (!queues.has(name)) queues.set(name, []);
  return queues.get(name);
}

function isExpired(s) {
  return (Date.now() - s.created) > TTL_MS;
}

function logLine(obj) {
  try {
    const line = JSON.stringify({ ts: Date.now(), ...obj }) + '\n';
    const fp = path.join(process.cwd(), 'logs', 'bridge.jsonl');
    fs.appendFileSync(fp, line);
  } catch (e) {
    // en Render el FS es efímero; igual sirve para depurar
  }
}

// ---- Rutas ----

// Handshake: crea sesión y devuelve clave pública del servidor (SPKI base64)
router.post('/handshake', (req, res) => {
  const { entity, client_pub } = req.body || {};
  if (!entity || !client_pub) return res.status(400).json({ ok:false, error:'missing_fields' });
  if (!ALLOW_ENTITIES.includes(entity)) return res.status(403).json({ ok:false, error:'entity_not_allowed' });

  // Par de claves X25519 del servidor (SPKI base64)
  const { publicKey: srvPub } = crypto.generateKeyPairSync('x25519');
  const serverPubB64 = srvPub.export({ type:'spki', format:'der' }).toString('base64');

  const session = crypto.randomUUID();
  sessions.set(session, { entity, created: Date.now(), serverPub: serverPubB64 });

  logLine({ op:'handshake', entity, session });
  res.json({ ok:true, session, server_pub: serverPubB64, ttl_ms: TTL_MS });
});

// Enqueue: guarda mensaje dirigido a "to"
router.post('/enqueue', (req, res) => {
  const { session } = req.query;
  const s = sessions.get(session);
  if (!s || isExpired(s)) return res.status(401).json({ ok:false, error:'invalid_or_expired_session' });

  const { from, to, payload } = req.body || {};
  if (!from || !to) return res.status(400).json({ ok:false, error:'missing_from_or_to' });
  if (!ALLOW_ENTITIES.includes(to)) return res.status(403).json({ ok:false, error:'to_not_allowed' });

  const msg = { from, to, payload: payload ?? {}, ts: Date.now() };
  ensureQueue(to).push(msg);

  logLine({ op:'enqueue', session, from, to });
  res.json({ ok:true, queued:1 });
});

// Pull: entrega mensajes nuevos para la entidad de la sesión
router.get('/pull', (req, res) => {
  const { session } = req.query;
  const since = Number(req.query.since || 0);
  const s = sessions.get(session);
  if (!s || isExpired(s)) return res.status(401).json({ ok:false, error:'invalid_or_expired_session' });

  const box = ensureQueue(s.entity);
  const msgs = box.filter(m => m.ts > since);

  logLine({ op:'pull', session, entity:s.entity, count: msgs.length });
  res.json({ ok:true, now: Date.now(), messages: msgs, next_since: Date.now() });
});

// Status: conteos y (opcional) sesiones
router.get('/status', (req, res) => {
  const include = String(req.query.include_sessions || '0') === '1';
  const qstats = {};
  for (const [k, v] of queues.entries()) qstats[k] = v.length;

  const out = { ok:true, sessions: sessions.size, queues:qstats, allow: ALLOW_ENTITIES };
  if (include) {
    out.sessions_detail = Array.from(sessions.entries()).map(([id,s]) => ({ id, entity:s.entity, created:s.created }));
  }
  res.json(out);
});

module.exports = router;
