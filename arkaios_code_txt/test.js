const arkaios = require('./main.js');

// Esperar y probar un solo comando
setTimeout(async () => {
    try {
        console.log('Testing ARKAIOS...');
        const response = await arkaios.processCommand('Hello');
        console.log('ARKAIOS responded:', response);
    } catch (error) {
        console.error('Error:', error.message);
    }
}, 3000);
