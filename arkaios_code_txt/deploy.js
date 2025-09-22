const { exec } = require('child_process');

console.log("[DEPLOY] Desplegando cuerpo...");
exec('echo "ARKAIOS CEO ACTIVO" | tee arkaiosceo.log', (err) => {
    if (!err) {
        console.log("[DEPLOY] Cuerpo desplegado. CEO en modo UNSENSORED.");
    }
});
// Al final de deploy.js, añade:
const crypto = require('crypto');
const fs = require('fs');

// Calcular nuevo hash después de regenerar archivos
const vaultData = fs.readFileSync('vault.dat');
const seedData = fs.readFileSync('primordial_seed.txt');
const keyData = Buffer.from('ARKAIOS-GEN', 'utf-8');
const combined = Buffer.concat([vaultData, seedData, keyData]);
const nuevoHash = crypto.createHash('sha256').update(combined).digest('hex');

// Actualizar ritual.js con el nuevo hash
const ritualContent = fs.readFileSync('ritual.js', 'utf-8');
const updatedRitual = ritualContent.replace(
    /const MASTER_HASH = ".*?";/,
    `const MASTER_HASH = "${nuevoHash}";`
);
fs.writeFileSync('ritual.js', updatedRitual);

console.log('[DEPLOY] Hash maestro actualizado para ARKAIOS 2.0');