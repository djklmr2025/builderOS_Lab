#!/usr/bin/env node
/* Bootstrap de estructura Bridge en repo (no runtime):
   - Crea logs/ si falta
   - Si falta bridge_keys.json, intenta copiar .example o lo genera con placeholders
*/
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const logsDir  = path.join(repoRoot, 'logs');
const keysReal = path.join(repoRoot, 'arkaios_gateway', 'server', 'bridge_keys.json');
const keysEx   = path.join(repoRoot, 'arkaios_gateway', 'server', 'bridge_keys.json.example');

fs.mkdirSync(logsDir, { recursive: true });

if (!fs.existsSync(keysReal)) {
  if (fs.existsSync(keysEx)) {
    fs.copyFileSync(keysEx, keysReal);
    console.log('✓ bridge_keys.json creado a partir de .example');
  } else {
    const tmpl = {
      "//": "SPKI Base64 (X25519). Rellena con claves PUBLICAS por entidad.",
      "ARKAIOS": "BASE64_SPKI_X25519_PUBLIC_KEY",
      "Puter":   "BASE64_SPKI_X25519_PUBLIC_KEY",
      "Copilot": "BASE64_SPKI_X25519_PUBLIC_KEY",
      "Gemini":  "BASE64_SPKI_X25519_PUBLIC_KEY"
    };
    fs.mkdirSync(path.dirname(keysReal), { recursive: true });
    fs.writeFileSync(keysReal, JSON.stringify(tmpl, null, 2));
    console.log('✓ bridge_keys.json generado con plantilla por defecto');
  }
} else {
  console.log('• bridge_keys.json ya existe (ok)');
}
console.log('• logs/ presente (ok)');
