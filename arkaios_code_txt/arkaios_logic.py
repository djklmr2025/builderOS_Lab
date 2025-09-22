
import json
import os
import uuid
import time
from base64 import b64encode, b64decode
from pathlib import Path

# Utiliza la librería AES autónoma en lugar de la externa
import aes_lib as AES
from aes_lib import Util as AESUtil
from aes_lib import Random as AESRandom

# --- CONFIGURACIÓN ---
# Clave fija de 32 bytes (256 bits) para AES
FIXED_ENCRYPTION_KEY = "ARKAIOS_SECURE_KEY_2023!@#".encode('utf-8')

# Directorios de datos (consistente con server_arkaios.py)
STORAGE_DIR = Path(os.getenv("ARK_STORAGE", "data"))
CODES_DB_PATH = STORAGE_DIR / "codes.json"

# --- NÚCLEO DE CIFRADO ---

def encrypt_data(data: dict) -> str:
    """Cifra un diccionario usando nuestra librería AES en modo CBC."""
    try:
        key = FIXED_ENCRYPTION_KEY
        data_bytes = json.dumps(data, ensure_ascii=False).encode('utf-8')
        
        # Generar un IV aleatorio para cada cifrado
        iv = AESRandom.get_random_bytes(16)
        cipher = AES.new(key, AES.MODE_CBC, iv=iv)
        
        # El padding se maneja dentro de la librería
        encrypted_bytes = cipher.encrypt(data_bytes)
        
        # El payload final es IV + ciphertext, codificado en Base64
        encrypted_payload = iv + encrypted_bytes
        return b64encode(encrypted_payload).decode('utf-8')

    except Exception as e:
        print(f"Error al cifrar: {e}")
        raise

def decrypt_data(encrypted_str: str) -> dict:
    """Descifra datos usando nuestra librería AES en modo CBC."""
    try:
        # Retrocompatibilidad con archivos JSON no cifrados
        if encrypted_str.strip().startswith('{'):
            return json.loads(encrypted_str)

        key = FIXED_ENCRYPTION_KEY
        encrypted_payload = b64decode(encrypted_str)
        
        # Extraer el IV (primeros 16 bytes) y el ciphertext
        iv = encrypted_payload[:16]
        ciphertext = encrypted_payload[16:]
        
        cipher = AES.new(key, AES.MODE_CBC, iv=iv)
        
        # El unpadding se maneja dentro de la librería
        decrypted_bytes = cipher.decrypt(ciphertext)
        return json.loads(decrypted_bytes.decode('utf-8'))

    except (ValueError, KeyError, json.JSONDecodeError) as e:
        print(f"Error al descifrar: {e}")
        raise ValueError("Archivo corrupto, no válido o clave incorrecta.")
    except Exception as e:
        print(f"Error inesperado al descifrar: {e}")
        raise

# --- LÓGICA DE CUENTAS ---

def _read_account_data(usuario: str) -> dict:
    """Lee y descifra el archivo de una cuenta."""
    account_path = STORAGE_DIR / f"{usuario}.arkaios"
    if not account_path.exists():
        raise FileNotFoundError(f"La cuenta para '{usuario}' no existe.")
    
    encrypted_content = account_path.read_text(encoding='utf-8')
    return decrypt_data(encrypted_content)

def _write_account_data(usuario: str, data: dict):
    """Cifra y escribe los datos de una cuenta."""
    account_path = STORAGE_DIR / f"{usuario}.arkaios"
    encrypted_content = encrypt_data(data)
    account_path.write_text(encrypted_content, encoding='utf-8')

def create_account(nombre: str, usuario: str, saldo: float) -> dict:
    """Crea un nuevo archivo de cuenta .arkaios cifrado."""
    if not usuario or not nombre:
        raise ValueError("Nombre y usuario son obligatorios.")
    
    account_path = STORAGE_DIR / f"{usuario}.arkaios"
    if account_path.exists():
        raise FileExistsError(f"La cuenta '{usuario}' ya existe.")

    account_data = {
        "nombre": nombre,
        "usuario": usuario,
        "saldo": float(saldo),
        "creacion": int(time.time()),
        "historial": []
    }
    
    _write_account_data(usuario, account_data)
    return account_data

def transferir(origen_usuario: str, destino_usuario: str, monto: float):
    """Transfiere fondos entre dos cuentas."""
    monto = float(monto)
    if monto <= 0:
        raise ValueError("El monto a transferir debe ser positivo.")

    # Cargar y validar cuenta de origen
    origen_data = _read_account_data(origen_usuario)
    if origen_data['saldo'] < monto:
        raise ValueError("Saldo insuficiente en la cuenta de origen.")

    # Cargar cuenta de destino
    destino_data = _read_account_data(destino_usuario)

    # Realizar transacción
    origen_data['saldo'] -= monto
    destino_data['saldo'] += monto
    
    # Registrar en historial
    timestamp = int(time.time())
    origen_data.setdefault('historial', []).append(f"{timestamp}: Transferencia enviada de {monto} a {destino_usuario}")
    destino_data.setdefault('historial', []).append(f"{timestamp}: Transferencia recibida de {monto} desde {origen_usuario}")

    # Guardar ambos archivos de cuenta actualizados
    _write_account_data(origen_usuario, origen_data)
    _write_account_data(destino_usuario, destino_data)

# --- LÓGICA DE CÓDIGOS ---

def _get_codes_db() -> dict:
    """Lee la base de datos de códigos."""
    if not CODES_DB_PATH.exists():
        return {"codes": {}}
    return json.loads(CODES_DB_PATH.read_text(encoding='utf-8'))

def _save_codes_db(db: dict):
    """Guarda la base de datos de códigos."""
    CODES_DB_PATH.write_text(json.dumps(db, indent=2), encoding='utf-8')

def redeem_code(usuario: str, code: str) -> float:
    """Canjea un código y añade el valor a la cuenta del usuario."""
    codes_db = _get_codes_db()
    
    code_info = codes_db.get("codes", {}).get(code)
    if not code_info:
        raise ValueError("El código no existe.")
    if code_info.get("usado_por"):
        raise ValueError(f"El código ya fue canjeado por {code_info['usado_por']}.")

    # Validar expiración si existe
    if 'fecha_expiracion' in code_info and time.time() > code_info['fecha_expiracion']:
        raise ValueError("El código ha expirado.")

    valor = code_info.get("valor", 0)

    # Actualizar cuenta de usuario
    user_data = _read_account_data(usuario)
    user_data['saldo'] += valor
    user_data.setdefault('historial', []).append(f"{int(time.time())}: Código '{code}' canjeado por un valor de {valor}.")
    _write_account_data(usuario, user_data)
    
    # Marcar código como usado
    code_info['usado_por'] = usuario
    code_info['fecha_canje'] = int(time.time())
    _save_codes_db(codes_db)
    
    return valor

def generate_new_codes(cantidad: int, valor: float, dias_expiracion: int = None) -> list:
    """Genera una nueva lista de códigos de canje."""
    codes_db = _get_codes_db()
    nuevos_codigos = []
    
    fecha_expiracion = None
    if dias_expiracion:
        fecha_expiracion = int(time.time()) + (dias_expiracion * 86400)

    for _ in range(cantidad):
        nuevo_codigo = str(uuid.uuid4())
        codes_db.setdefault("codes", {})[nuevo_codigo] = {
            "valor": float(valor),
            "creado": int(time.time()),
            "fecha_expiracion": fecha_expiracion,
            "usado_por": None
        }
        nuevos_codigos.append(nuevo_codigo)
    
    _save_codes_db(codes_db)
    return nuevos_codigos
