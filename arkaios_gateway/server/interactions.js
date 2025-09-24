const fs = require('fs');
const path = require('path');

const LOG_PATH = process.env.INTERACTIONS_LOG || 'interactions_log.txt';

// ring buffer simple en memoria
const recent = [];
const tickets = new Map(); // id -> record

function appendLog(obj){
  const line = JSON.stringify({ ...obj, ts: new Date().toISOString() }) + '\n';
  try { fs.appendFileSync(path.join(process.cwd(), LOG_PATH), line); } catch(e){}
  recent.push(obj); if (recent.length > 500) recent.shift();
}

function newId(){ return (Date.now().toString(36)+Math.random().toString(36).slice(2,6)).toUpperCase(); }

module.exports.attach = function attach(app){
  // 1) Puter -> abre ticket
  app.post('/aida/interactions/request_validation', (req,res)=>{
    const { agent_id='unknown', module='', summary='' } = req.body||{};
    if(!module || !summary) return res.status(400).json({ok:false,error:'missing_module_or_summary'});
    const id = newId();
    const rec = { id, agent_id, module, summary, status:'pending', suggestions:[] };
    tickets.set(id, rec);
    appendLog({ type:'request_validation', id, agent_id, module, summary });
    return res.json({ ok:true, id, status:rec.status, hint:'Use /aida/interactions/suggest_patch to reply' });
  });

  // 2) Copilot (u otra IA) -> sugiere parche
  app.post('/aida/interactions/suggest_patch', (req,res)=>{
    const { agent_id='copilot', ticket, patch='', notes='' } = req.body||{};
    if(!ticket || !patch) return res.status(400).json({ok:false,error:'missing_ticket_or_patch'});
    const rec = tickets.get(ticket);
    if(!rec) return res.status(404).json({ok:false,error:'ticket_not_found'});
    const sug = { agent_id, patch, notes, ts: Date.now() };
    rec.suggestions.push(sug);
    rec.status = 'suggested';
    appendLog({ type:'suggest_patch', id:ticket, agent_id, notes, len:patch.length });
    return res.json({ ok:true, id:ticket, status:rec.status, suggestions:rec.suggestions.length });
  });

  // 3) Listado y detalle
  app.get('/aida/interactions', (req,res)=>{
    const limit = Math.max(1, Math.min(500, parseInt(req.query.limit||'50',10)));
    res.json({ ok:true, items: recent.slice(-limit) });
  });
  app.get('/aida/interactions/:id', (req,res)=>{
    const rec = tickets.get(req.params.id);
    if(!rec) return res.status(404).json({ok:false,error:'ticket_not_found'});
    res.json({ ok:true, ticket: rec });
  });
};
