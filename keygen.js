// keygen.js
const crypto = require('crypto');

// Generar par de claves X25519
const { publicKey, privateKey } = crypto.generateKeyPairSync('x25519');

// Exportar en formato base64
const pubKeyBase64 = publicKey.export({ type: 'spki', format: 'der' }).toString('base64');
const privKeyBase64 = privateKey.export({ type: 'pkcs8', format: 'der' }).toString('base64');

console.log("🧠 Clave pública (BASE64):");
console.log(pubKeyBase64);

console.log("\n🔐 Clave privada (BASE64):");
console.log(privKeyBase64);