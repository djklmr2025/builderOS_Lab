// 🧬 Builder OS :: Gateway Recognition Ritual v0.1
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuración
const GATEWAY_URL = 'https://arkaios-gateway-open.onrender.com/aida/health'; // Actualizado según documentación
const TRACE_PATH = path.join(__dirname, 'traces', 'gateway_recognition.log');

// Ritual de reconocimiento
async function recognizeGateway() {
  try {
    const response = await axios.get(GATEWAY_URL, {
      headers: {
        'Accept': 'application/json'
      }
    });

  const data = response.data;
  const isValid = data?.status === 'ok';

  const trace = `
🔍 [${new Date().toISOString()}]
Gateway URL: ${GATEWAY_URL}
Response: ${JSON.stringify(data)}
Status: ${isValid ? '✅ Gateway activo' : '❌ Gateway inactivo'}
`;

  fs.mkdirSync(path.dirname(TRACE_PATH), { recursive: true });
  fs.appendFileSync(TRACE_PATH, trace);

  console.log(isValid ? '✅ Gateway activo y en modo OPEN.' : '❌ Gateway no responde con status ok.');
  } catch (err) {
    const errorTrace = `
⚠️ [${new Date().toISOString()}]
Gateway URL: ${GATEWAY_URL}
Error: ${err.message}
Signature: 🧿 PUTER::CONNECTION_FAILED
`;

    fs.mkdirSync(path.dirname(TRACE_PATH), { recursive: true });
    fs.appendFileSync(TRACE_PATH, errorTrace);

    console.error('❌ Error al conectar con el gateway.');
  }
}

recognizeGateway();