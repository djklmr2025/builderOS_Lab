// js/auth.js
document.addEventListener('DOMContentLoaded', async () => {
    const authBox = document.getElementById('auth-box');
    const appContent = document.getElementById('app-content');
    const pinInput = document.getElementById('pin-input');
    const authButton = document.getElementById('auth-button');
    const statusMessage = document.getElementById('status-message');

    // Esperar a que la DB esté lista
    try {
        await DB.initDB();
    } catch (error) {
        showError("Error al inicializar la base de datos");
        console.error(error);
        return;
    }

    // Función para mostrar mensajes de estado
    function showMessage(message, type = 'success') {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message ' + type;
        statusMessage.style.display = 'block';
        
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }

    function showError(message) {
        showMessage(message, 'error');
    }

    // Evento de autenticación
    authButton.addEventListener('click', async () => {
        const pin = pinInput.value.trim();
        
        if (pin.length !== 4 || !/^\d+$/.test(pin)) {
            showError("El PIN debe tener exactamente 4 dígitos numéricos");
            return;
        }
        
        authButton.disabled = true;
        authButton.textContent = 'Verificando...';
        
        try {
            const autenticado = await DB.autenticar(pin);
            
            if (autenticado) {
                authBox.style.display = 'none';
                appContent.style.display = 'block';
            } else {
                // Obtener estado actual del usuario para mostrar mensaje detallado
                const transaction = DB.db.transaction(['usuarios'], 'readonly');
                const store = transaction.objectStore('usuarios');
                const request = store.get('admin');
                
                request.onsuccess = () => {
                    const usuario = request.result;
                    if (usuario.bloqueadoHasta && new Date(usuario.bloqueadoHasta) > new Date()) {
                        const tiempoRestante = Math.ceil((new Date(usuario.bloqueadoHasta) - new Date()) / 1000 / 60);
                        showError(`Cuenta bloqueada. Intente nuevamente en ${tiempoRestante} minutos.`);
                    } else {
                        const intentosRestantes = 3 - (usuario.intentosFallidos || 0);
                        showError(`PIN incorrecto. ${intentosRestantes > 0 ? 
                                 `Intentos restantes: ${intentosRestantes}` : 
                                 'Cuenta bloqueada temporalmente'}`);
                    }
                };
                
                pinInput.value = '';
                pinInput.focus();
            }
        } catch (error) {
            console.error("Error de autenticación:", error);
            showError(error.message.includes("bloqueada") ? 
                     error.message : 
                     "Error en el sistema. Intente más tarde.");
        } finally {
            authButton.disabled = false;
            authButton.textContent = 'Acceder';
        }
    });
    
    // Inicializar vista
    authBox.style.display = 'block';
    appContent.style.display = 'none';
});