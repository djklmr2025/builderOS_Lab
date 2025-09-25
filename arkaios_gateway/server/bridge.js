const crypto = require('crypto');

function b64(buf){ return Buffer.from(buf).toString('base64'); }
function b64d(s){ return Buffer.from(s, 'base64'); }
function sha256hex(s){ return crypto.createHash('sha256').update(s).digest('hex'); }
function todayYMD(){ const d=new Date(); return d.toISOString().slice(0,10).replace(/-/g,''); }
function ymdOffset(off){ const d=new Date(); d.setUTCDate(d.getUTCDate()+off); return d.toISOString().slice(0,10).replace(/-/g,''); }

const PHRASE = process.env.PROOF_PHRASE || 'χρῆσθαι φῶς κρυπτόν ἀριθμός: 8412197';
const ENTITIES = (process.env.BRIDGE_ENTITIES||'ARKAIOS,Puter,Copilot,Gemini')
  .split(',').map(s=>s.trim()).filter(Boolean);

// Sesiones en memoria: sid -> { entity, key(Base64), ts }
const SESS = new Map();
// Buzones: entity -> [{id, from, to, ts, fragments:[{i,total,data}], meta}]
const INBOX = new Map();
for (const e of ENTITIES) INBOX.set(e, []);

function verifyProof(entity, proof){
  // Proof-of-Agent “suave”: sha256(PHRASE:YYYYMMDD) primeros 12 hex
  const cand = [
    sha256hex(`${PHRASE}:${todayYMD()}`).slice(0,12),
    sha256hex(`${PHRASE}:${ymdOffset(-1)}`).slice(0,12), // tolerancia 1 día
  ];
  return ENTITIES.includes(entity) && cand.includes((proof||'').toLowerCase());
}

function newSid(){ return (Date.now().toString(36)+Math.random().toString(36).slice(2,10)).toUpperCase(); }

function splitFragments(ciphB64, size=1024){
  const buf=b64d(ciphB64);
  const total=Math.ceil(buf.length/size)||1;
  const arr=[];
  for(let i=0;i<total;i++){
    const chunk = buf.subarray(i*size, (i+1)*size);
    arr.push({ i, total, data: b64(chunk) });
  }
  return arr;
}

function attach(app){
  const base = process.env.SECRET_ROUTE ? `/${process.env.SECRET_ROUTE}/bridge` : '/bridge';

  // === 1) Handshake: devuelve sid + key (32 bytes base64)
  app.post(`${base}/handshake`, app.json(), (req,res)=>{
    const { entity, proof } = req.body||{};
    if(!verifyProof(entity, proof)) return res.status(401).json({ok:false,error:'proof_invalid_or_entity_denied'});
    const sid = newSid();
    const key = crypto.randomBytes(32); // session key (Base64)
    SESS.set(sid, { entity, key: b64(key), ts: Date.now() });
    return res.json({ ok:true, sid, key: b64(key), entity, expires: Date.now()+3600_000 });
  });

  // Middleware sesión
  function auth(req,res,next){
    const h=(req.get('authorization')||'').split(' ');
    if(h[0]!=='Bearer' || !h[1]) return res.status(401).json({ok:false,error:'missing_bearer'});
    const s = SESS.get(h[1]); if(!s) return res.status(401).json({ok:false,error:'session_not_found_or_expired'});
    req.session = s; req.sid=h[1]; next();
  }

  // === 2) Enviar mensaje cifrado a otro entity (server NO descifra)
  app.post(`${base}/send`, auth, app.json(), (req,res)=>{
    const { to, ciphertext, meta } = req.body||{};
    if(!to || !ciphertext) return res.status(400).json({ok:false,error:'missing_to_or_ciphertext'});
    if(!INBOX.has(to)) return res.status(404).json({ok:false,error:'recipient_unknown'});
    const frags = splitFragments(ciphertext, 1024);
    const msg = { id:newSid(), from:req.session.entity, to, ts:Date.now(), fragments:frags, meta:meta||{} };
    INBOX.get(to).push(msg);
    // limitar buzón
    if(INBOX.get(to).length>500) INBOX.get(to).shift();
    return res.json({ ok:true, id:msg.id, fragments: frags.length });
  });

  // === 3) Pull: devuelve mensajes desde cierto timestamp (no borra)
  app.get(`${base}/pull`, auth, (req,res)=>{
    const since = parseInt(req.query.since||'0',10);
    const list = (INBOX.get(req.session.entity)||[]).filter(m => m.ts > since).slice(-100);
    return res.json({ ok:true, items:list, now: Date.now() });
  });

  // === 4) Cerrar sesión
  app.post(`${base}/close`, auth, (req,res)=>{
    SESS.delete(req.sid);
    return res.json({ ok:true, closed:true });
  });

  // === 5) Info (debug mínima)
  app.get(`${base}/info`, (req,res)=>{
    res.json({ ok:true, entities:ENTITIES, sessions:[...SESS.keys()].length, route:base });
  });
}

module.exports = { attach };
