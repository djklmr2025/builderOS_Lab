// ARKAIOS Gateway — OPEN MODE (sin bearer para acciones de texto seguras)
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT   = process.env.PORT || 8080;
const SECRET = process.env.SECRET_MASTER_TOKEN || 'changeme';
const UNIQUE = process.env.UNIQUE_PATH_TOKEN || 'arkaios-secret';
const OPEN   = process.env.OPEN_MODE === '1';
const PUBLIC_ACTIONS = (process.env.PUBLIC_ACTIONS || 'echo,plan,analyze,explain,generate')
  .split(',').map(s => s.trim().toLowerCase());

app.use(cors({ origin: process.env.ALLOW_ORIGIN || '*', credentials: false }));
app.use(express.json({ limit: '512kb' }));
app.use(morgan('tiny'));
app.use(rateLimit({ windowMs: 15*60*1000, limit: 200, standardHeaders: false, legacyHeaders: false }));

function needAuth(req){
  const action = (req.body?.action || '').toLowerCase();
  if (OPEN && PUBLIC_ACTIONS.includes(action)) return false;
  return true;
}
function requireAuth(req, res, next){
  if (!needAuth(req)) return next();
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if(token && token === SECRET) return next();
  return res.status(401).json({ status: 'unauthorized' });
}

app.get('/aida/health', (_req, res) => {
  res.json({ status: 'ok', mode: OPEN ? 'open' : 'secure', ts: new Date().toISOString() });
});

app.post('/aida/gateway', requireAuth, async (req, res) => {
  const { agent_id, action, params } = req.body || {};
  const safe = ['echo','plan','analyze','explain','generate'];
  if (!safe.includes((action||'').toLowerCase())) {
    return res.status(422).json({ status:'rejected', reason:'action_not_allowed_in_open_mode' });
  }
  return res.json({
    status: 'ok',
    mode: OPEN ? 'open' : 'secure',
    result: { agent_id, action, note: 'OPEN MODE: acción procesada (no destructiva)', params }
  });
});

app.all(`/arkaios/:token/*`, (req, res, next) => {
  if(req.params.token !== UNIQUE) return res.status(404).json({ status: 'not_found' });
  req.url = '/' + (req.params[0] || '');
  next();
}, (req, res, next) => app._router.handle(req, res, next));


/* Welcome page (opcional) */
app.get('/', (req, res) => {
  res.type('html').send(`
    <h1>ARKAIOS Gateway (OPEN MODE)</h1>
    <p>Vivo en ${new Date().toISOString()}</p>
    <ul>
      <li>GET <code>/aida/health</code></li>
      <li>POST <code>/aida/gateway</code> (echo, plan, analyze, explain, generate)</li>
      <li>Ruta secreta base: <code>/arkaios/&lt;TOKEN&gt;/...</code></li>
    </ul>
  `);
});

app.listen(process.env.PORT || 8080, '0.0.0.0', () => console.log('ARKAIOS Gateway on :' + (process.env.PORT || 8080))) => console.log('ARKAIOS Gateway on :' + (process.env.PORT || 8080))) => {
  console.log(`ARKAIOS Gateway on http://0.0.0.0:${PORT}  (mode=${OPEN?'OPEN':'SECURE'})`);
  console.log(`Health: GET /aida/health`);
  console.log(`Secret path base: /arkaios/${UNIQUE}/...`);
});
