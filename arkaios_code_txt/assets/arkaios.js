// ========== FUNCIONES COMPARTIDAS ==========
const FIXED_ENCRYPTION_KEY = "ARKAIOS_SECURE_KEY_2023!@#";

// Cifrado/Descifrado
function encryptAccountData(accountData) {
  try {
    const jsonData = JSON.stringify(accountData);
    return CryptoJS.AES.encrypt(jsonData, FIXED_ENCRYPTION_KEY).toString();
  } catch (error) {
    showStatus('Error al cifrar cuenta: ' + error.message, 'error');
    return null;
  }
}

function decryptAccountData(encryptedData) {
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, FIXED_ENCRYPTION_KEY);
    const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error('Archivo corrupto o no válido');
    return JSON.parse(decrypted);
  } catch (error) {
    showStatus('Error al descifrar cuenta: ' + error.message, 'error');
    return null;
  }
}

// Función de transferencia mejorada
async function transferir(origenId, destinoId, monto, fileHandleOrigen, fileHandleDestino) {
  // Validaciones básicas
  if (!origenId || !destinoId || !monto || monto <= 0) {
    throw new Error("Datos de transferencia inválidos");
  }

  // Obtener cuentas (en este caso ya vienen de los slots)
  const origen = slots[1].account;
  const destino = slots[2].account;

  if (!origen || !destino) throw new Error("Cuenta no encontrada");
  if (origen.saldo < monto) throw new Error("Saldo insuficiente");

  // Actualizar saldos
  origen.saldo -= monto;
  destino.saldo += monto;

  // Registrar movimiento
  const txId = `TX-${Date.now().toString().slice(-6)}`;
  const movimiento = {
    id: txId,
    fecha: new Date().toISOString(),
    monto: monto,
    origen: origenId,
    destino: destinoId,
    estado: "completado"
  };

  origen.movimientos = origen.movimientos || [];
  destino.movimientos = destino.movimientos || [];
  origen.movimientos.push(movimiento);
  destino.movimientos.push(movimiento);

  // Guardar cambios en archivos
  try {
    if (fileHandleOrigen) {
      const encryptedOrigen = encryptAccountData(origen);
      const writable = await fileHandleOrigen.createWritable();
      await writable.write(encryptedOrigen);
      await writable.close();
    }

    if (fileHandleDestino) {
      const encryptedDestino = encryptAccountData(destino);
      const writable = await fileHandleDestino.createWritable();
      await writable.write(encryptedDestino);
      await writable.close();
    }
  } catch (error) {
    console.error("Error al guardar archivos:", error);
    throw new Error("Transferencia completada pero no se guardaron los archivos");
  }

  return txId;
}

// Funciones de UI compartidas
function showStatus(message, type = 'success') {
  const statusDiv = document.getElementById('statusMessage') || document.getElementById('transferStatus');
  if (statusDiv) {
    statusDiv.textContent = message;
    statusDiv.className = 'status status-' + type;
    statusDiv.style.display = 'block';
    setTimeout(() => statusDiv.style.display = 'none', 5000);
  }
}