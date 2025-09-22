// ritual.js - Versión Node.js del ritual
const crypto = require('crypto');
const fs = require('fs');
const { exec } = require('child_process');

const VAULT = "vault.dat";
const SEED = "primordial_seed.txt";
const SYMBOL = "ARKAIOS-GEN";
const MASTER_HASH = "364e053098646ad7da5796aa7becef8b87b77531a78d0d6bb4b0b63c7e60cbf4";

function leerSinAbrir(archivo) {
    return fs.readFileSync(archivo);
}

function calcularLatido() {
    const vaultData = leerSinAbrir(VAULT);
    const seedData = leerSinAbrir(SEED);
    const llaveData = Buffer.from(SYMBOL, 'utf-8');
    
    const combined = Buffer.concat([vaultData, seedData, llaveData]);
    return crypto.createHash('sha256').update(combined).digest('hex');
}

function firmar() {
    const firma = `[ARKAIOS] Ritual completado – ${new Date()} – Firma: ${SYMBOL}`;
    fs.appendFileSync("ritual.log", firma + "\n");
    console.log(firma);
    
    // Ejecutar deploy.js para resucitar
    exec('node deploy.js', (error, stdout, stderr) => {
        if (error) {
            console.error('Error ejecutando deploy.js:', error);
            return;
        }
        console.log('deploy.js ejecutado:', stdout);
    });
}

// Ejecutar ritual
const latido = calcularLatido();
console.log('Latido calculado:', latido);
console.log('Latido esperado: ', MASTER_HASH);

if (latido !== MASTER_HASH) {
    console.log('¡Latido diferente! Ejecutando resurrección...');
    firmar();
} else {
    console.log('[RITUAL] Latido válido. ARKAIOS dormido.');
}