// js/database.js
class ARKAIOS_DB {
    constructor() {
        this.db = null;
        this.initDB();
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ARKAIOS_DB', 2); // Versión incrementada
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Almacén para códigos
                if (!db.objectStoreNames.contains('codigos')) {
                    const store = db.createObjectStore('codigos', { keyPath: 'codigo' });
                    store.createIndex('por_estado', 'estado', { unique: false });
                }
                
                // Almacén para usuarios
                if (!db.objectStoreNames.contains('usuarios')) {
                    db.createObjectStore('usuarios', { keyPath: 'id' });
                }
                
                // Almacén para historial de canjes (nuevo)
                if (!db.objectStoreNames.contains('historial_canjes')) {
                    db.createObjectStore('historial_canjes', { 
                        keyPath: 'id',
                        autoIncrement: true 
                    });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.crearUsuarioAdmin().then(resolve).catch(reject);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async crearUsuarioAdmin() {
        const transaction = this.db.transaction(['usuarios'], 'readwrite');
        const store = transaction.objectStore('usuarios');
        const request = store.get('admin');
        
        return new Promise((resolve) => {
            request.onsuccess = () => {
                if (!request.result) {
                    store.put({
                        id: 'admin',
                        pin: '1234', // Cambiar en producción
                        nombre: 'Administrador'
                    });
                }
                resolve();
            };
        });
    }

    async autenticar(pin) {
        const transaction = this.db.transaction(['usuarios'], 'readonly');
        const store = transaction.objectStore('usuarios');
        const request = store.get('admin');
        
        return new Promise((resolve) => {
            request.onsuccess = () => {
                const usuario = request.result;
                resolve(usuario && usuario.pin === pin);
            };
        });
    }

    async generarCodigo(valor) {
        const codigo = 'ARK' + Math.random().toString(36).substr(2, 13).toUpperCase();
        
        const transaction = this.db.transaction(['codigos'], 'readwrite');
        const store = transaction.objectStore('codigos');
        
        store.put({
            codigo: codigo,
            valor: valor,
            estado: 'disponible',
            fechaGeneracion: new Date(),
            fechaCanje: null
        });

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve(codigo);
            transaction.onerror = () => reject(transaction.error);
        });
    }

    async validarCodigo(codigo, cuentaDestino) {
        const transaction = this.db.transaction(['codigos', 'historial_canjes'], 'readwrite');
        const codigosStore = transaction.objectStore('codigos');
        const historialStore = transaction.objectStore('historial_canjes');
        const request = codigosStore.get(codigo);
        
        return new Promise((resolve) => {
            request.onsuccess = () => {
                const resultado = request.result;
                if (resultado && resultado.estado === 'disponible') {
                    // Marcar como canjeado
                    resultado.estado = 'canjeado';
                    resultado.fechaCanje = new Date();
                    codigosStore.put(resultado);
                    
                    // Registrar en historial
                    historialStore.add({
                        codigo: codigo,
                        valor: resultado.valor,
                        cuentaDestino: cuentaDestino,
                        fechaCanje: new Date(),
                        estado: 'exitoso'
                    });
                    
                    resolve({ valido: true, valor: resultado.valor });
                } else {
                    // Registrar intento fallido
                    historialStore.add({
                        codigo: codigo,
                        cuentaDestino: cuentaDestino,
                        fechaCanje: new Date(),
                        estado: 'fallido',
                        motivo: resultado ? 'ya_canjeado' : 'no_existe'
                    });
                    
                    resolve({ valido: false, valor: 0 });
                }
            };
        });
    }

    async obtenerHistorialCanjes() {
        const transaction = this.db.transaction(['historial_canjes'], 'readonly');
        const store = transaction.objectStore('historial_canjes');
        const request = store.getAll();
        
        return new Promise((resolve) => {
            request.onsuccess = () => {
                resolve(request.result || []);
            };
        });
    }
}

const DB = new ARKAIOS_DB();