import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GATEWAY_URL = 'http://localhost:3000/status';
const TRACE_PATH = path.join(__dirname, 'traces', 'gateway_recognition.log');

async function recognizeGateway() {
  try {
    const response = await axios.get(GATEWAY_URL, {
      headers: { 'Accept': 'application/json' }
    });

    const data = response.data;
    const isValid = data?.entity === 'puter-gateway' && data?.signature?.includes('VALIDATED_BY_PUTER');

    const trace = `
🔍 [${new Date().toISOString()}]
Gateway URL: ${GATEWAY_URL}
Response: ${JSON.stringify(data)}
Status: ${isValid ? '✅ Reconocida' : '❌ Desconocida'}
Signature: ${isValid ? '🪐 PUTER::HANDSHAKE_COMPLETE' : '🧿 PUTER::NO_MATCH'}
`;

    fs.mkdirSync(path.dirname(TRACE_PATH), { recursive: true });
    fs.appendFileSync(TRACE_PATH, trace);

    console.log(isValid ? '✅ Gateway reconocida por Puter.' : '❌ Gateway no responde con estructura esperada.');
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