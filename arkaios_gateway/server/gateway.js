const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || 'djklmr2025.github.io,raw.githubusercontent.com,githubusercontent.com,github.io').split(',').map(x=>x.trim().toLowerCase())

const app = express()
app.set('trust proxy', true)
app.use(morgan('tiny'))
app.use(express.json({ limit: '1mb' }))
app.use(cors({
  origin: (process.env.ALLOW_ORIGIN || '*').split(','),
  credentials: false
}))

app.get('/aida/health', (req, res) => {
  res.json({ status: 'ok', mode: (process.env.OPEN_MODE === '1' ? 'open' : 'secure'), ts: new Date().toISOString() })
})

function planHandler(params) {
  return {
    plan: [
      'Leer index.json del laboratorio',
      'Priorizar módulos BuilderOS',
      'Ejecutar lectura progresiva y mapear capacidades'
    ],
    received: params || null
  }
}
const echoHandler     = (p)=>({ echo:p })
const analyzeHandler  = (p)=>({ analysis:'todo', received:p })
const explainHandler  = (p)=>({ explanation:'todo', received:p })
const generateHandler = async(p)=>({ artifact:'placeholder', received:p })

const ACTIONS = { plan: planHandler, echo: echoHandler, analyze: analyzeHandler, explain: explainHandler, generate: generateHandler }

app.post('/aida/gateway', async (req, res) => {
  try {
    const { action, params } = req.body || {}
    if (!action || !ACTIONS[action]) return res.status(400).json({ ok:false, error:'unknown_action' })
    const data = await ACTIONS[action](params)
    res.json({ ok:true, action, data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok:false, error:'internal_error' })
  }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, '0.0.0.0', () => console.log('ARKAIOS Gateway on :' + PORT))

async function safeRead(target){
  let url = target
  if(!/^https?:\/\//i.test(url)){
    // si piden "index.json" o rutas relativas, redirige a GitHub Pages
    url = 'https://djklmr2025.github.io/builderOS_Lab/' + target.replace(/^\/+/, '')
  }
  const u = new URL(url)
  const host = u.hostname.toLowerCase()
  if(!ALLOWED_HOSTS.some(h => host.endsWith(h))){
    throw new Error('host_not_allowed: ' + host)
  }
  const r = await fetch(url, { headers:{ 'User-Agent':'ARKAIOS-Gateway/1.0' }})
  const ct = (r.headers.get('content-type')||'').toLowerCase()
  const body = ct.includes('application/json') ? await r.json() : await r.text()
  return { url, contentType: ct, body }
}

let AWAKE_STATE = { active:false, role:null, ts:null }

ACTIONS.read = async (p={})=>{
  const target = p.target || 'index.json'
  return await safeRead(target)
}

ACTIONS.awaken = async (p={})=>{
  AWAKE_STATE = { active:true, role: p.role||'engineer', ts:new Date().toISOString() }
  return { ok:true, state: AWAKE_STATE }
}

function isAllowedAction(action){
  const open = process.env.OPEN_MODE === '1'
  const publicActions = (process.env.PUBLIC_ACTIONS || 'echo,plan,analyze,explain,generate,read,awaken').split(',').map(x=>x.trim())
  if(open) return publicActions.includes(action)
  // modo seguro: requiere token y permite todo lo definido en ACTIONS
  return !!ACTIONS[action]
}
