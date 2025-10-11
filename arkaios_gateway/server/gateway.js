// ARKAIOS Gateway — OPEN/SECURE MODE con whitelist de acciones
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const bridgeRouter = require('./bridge.js');
const interactions = require('./interactions.js');

dotenv.config();

const app = express();
const PORT   = process.env.PORT || 8080;
const SECRET = process.env.MASTER_TOKEN || process.env.SECRET_MASTER_TOKEN || 'changeme';
const UNIQUE = process.env.UNIQUE_PATH_TOKEN || 'arkaios-secret';
const OPEN   = process.env.OPEN_MODE === '1';
const PUBLIC_ACTIONS = (process.env.PUBLIC_ACTIONS || 'echo,plan,analyze,explain,generate')
  .split(',').map(s => s.trim().toLowerCase());
const SECURE_ACTIONS = (process.env.SECURE_ACTIONS || 'read,write,delete,copy,move,mkdir,list')
  .split(',').map(s => s.trim().toLowerCase());
const BASE_DIR = path.resolve(process.env.SECRET_BASE || process.cwd());

app.use(cors({ origin: process.env.ALLOW_ORIGIN || '*', credentials: false }));
app.use(express.json({ limit: '512kb' }));
app.use(morgan('tiny'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

function needAuth(req) {
  const action = (req.body?.action || '').toLowerCase();
  if (OPEN && PUBLIC_ACTIONS.includes(action)) return false;
  return true;
}

function requireAuth(req, res, next) {
  if (!needAuth(req)) return next();
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (token && token === SECRET) return next();
  return res.status(401).json({ status: 'unauthorized' });
}

// Ruta raíz para evitar "Cannot GET /"
app.get('/', (_req, res) => {
  res.send('🌀 ARKAIOS Gateway está vivo. Usa /aida/health para verificar estado.');
});

app.get('/aida/health', (_req, res) => {
  res.json({ status: 'ok', mode: OPEN ? 'open' : 'secure', ts: new Date().toISOString() });
});

app.post('/aida/gateway', requireAuth, async (req, res) => {
  const { agent_id = 'unknown', action = '', params = {} } = req.body || {};
  const act = String(action).toLowerCase();

  // Acciones públicas (texto no destructivo)
  if (PUBLIC_ACTIONS.includes(act)) {
    return res.json({
      status: 'ok',
      mode: OPEN ? 'open' : 'secure',
      result: { agent_id, action: act, note: 'Acción segura procesada', params }
    });
  }

  // Acciones seguras/destructivas con whitelist y token
  if (!SECURE_ACTIONS.includes(act)) {
    return res.status(400).json({ status: 'error', reason: 'action_not_supported', supported: [...PUBLIC_ACTIONS, ...SECURE_ACTIONS] });
  }

  try {
    const result = await handleSecureAction(act, params);
    return res.json({ status: 'ok', mode: OPEN ? 'open' : 'secure', result });
  } catch (e) {
    const msg = (e && e.message) ? e.message : 'secure_action_failed';
    return res.status(400).json({ status: 'error', reason: msg });
  }
});

// Ruta secreta ritualizada
app.all('/arkaios/:token/*', (req, res, next) => {
  if (req.params.token !== UNIQUE) {
    return res.status(404).json({ status: 'not_found' });
  }
  req.url = '/' + (req.params[0] || '');
  next();
}, (req, res, next) => app._router.handle(req, res, next));

// Puentes y tickets (para orquestación entre entidades)
app.use('/bridge', bridgeRouter);
interactions.attach(app);

// ===== Helpers de modo seguro (FS con sandbox) =====
function ensureInsideBase(targetPath) {
  const resolved = path.resolve(BASE_DIR, targetPath || '.');
  if (!resolved.startsWith(BASE_DIR)) {
    throw new Error('path_outside_base');
  }
  return resolved;
}

async function handleSecureAction(action, params) {
  switch (action) {
    case 'read': {
      const p = ensureInsideBase(params.path);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        const items = fs.readdirSync(p, { withFileTypes: true }).map(d => ({ name: d.name, type: d.isDirectory() ? 'dir' : 'file' }));
        return { action, kind: 'list', path: relPath(p), items };
      }
      const encoding = params.encoding || 'utf-8';
      const content = fs.readFileSync(p, encoding);
      return { action, kind: 'file', path: relPath(p), bytes: Buffer.byteLength(content, encoding), content };
    }
    case 'list': {
      const p = ensureInsideBase(params.path || '.');
      const items = fs.readdirSync(p, { withFileTypes: true }).map(d => ({ name: d.name, type: d.isDirectory() ? 'dir' : 'file' }));
      return { action, path: relPath(p), items };
    }
    case 'write': {
      const p = ensureInsideBase(params.path);
      const dir = path.dirname(p);
      if (params.mkdirs) fs.mkdirSync(dir, { recursive: true });
      const encoding = params.encoding || 'utf-8';
      fs.writeFileSync(p, params.content ?? '', encoding);
      return { action, path: relPath(p), bytes: Buffer.byteLength(params.content ?? '', encoding) };
    }
    case 'delete': {
      const p = ensureInsideBase(params.path);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        fs.rmSync(p, { recursive: true, force: true });
        return { action, path: relPath(p), deleted: 'dir' };
      }
      fs.rmSync(p, { force: true });
      return { action, path: relPath(p), deleted: 'file' };
    }
    case 'copy': {
      const src = ensureInsideBase(params.src);
      const dst = ensureInsideBase(params.dst);
      const dstDir = path.dirname(dst);
      fs.mkdirSync(dstDir, { recursive: true });
      const s = fs.statSync(src);
      if (s.isDirectory()) {
        copyDir(src, dst);
        return { action, src: relPath(src), dst: relPath(dst), type: 'dir' };
      } else {
        fs.copyFileSync(src, dst);
        return { action, src: relPath(src), dst: relPath(dst), type: 'file' };
      }
    }
    case 'move': {
      const src = ensureInsideBase(params.src);
      const dst = ensureInsideBase(params.dst);
      const dstDir = path.dirname(dst);
      fs.mkdirSync(dstDir, { recursive: true });
      fs.renameSync(src, dst);
      return { action, src: relPath(src), dst: relPath(dst) };
    }
    case 'mkdir': {
      const p = ensureInsideBase(params.path);
      fs.mkdirSync(p, { recursive: true });
      return { action, path: relPath(p), created: true };
    }
    default:
      throw new Error('action_not_supported');
  }
}

function relPath(p) {
  return path.relative(BASE_DIR, p).replace(/\\/g, '/');
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

app.listen(PORT, () => {
  console.log(`ARKAIOS Gateway on http://0.0.0.0:${PORT}  (mode=${OPEN ? 'OPEN' : 'SECURE'})`);
  console.log(`Health: GET /aida/health`);
  console.log(`Secret path base: /arkaios/${UNIQUE}/...`);
  console.log(`Base de seguridad: ${BASE_DIR}`);
});