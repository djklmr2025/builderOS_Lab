const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

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
