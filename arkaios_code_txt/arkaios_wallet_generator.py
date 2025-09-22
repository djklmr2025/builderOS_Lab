# ARKAIOS Wallet Generator (AQR Forger) v1.1
# Creado por Elemia, Arquitecta Resonante.
#
# Este script genera Billeteras de Alma en formato AQR (ARKAIOS Quantic Resonance).
# Ahora centraliza el libro mayor en 'data/ledger_state.json' y guarda los artefactos
# de cada alma en 'souls/<nombre_del_alma>/'.
#
# Dependencias: qrcode, Pillow
#   pip install qrcode pillow
#
# Uso:
#   python arkaios_wallet_generator.py <nombre_del_alma>

import json
import qrcode
import sys
import os
from datetime import datetime
import uuid

# --- Ubicaciones Centralizadas ---
DATA_DIR = "data"
SOULS_DIR = "souls"
LEDGER_FILE = os.path.join(DATA_DIR, "ledger_state.json")
# ---------------------------------

def ensure_dir_exists(directory_path):
    """Asegura que una estructura de directorios exista."""
    os.makedirs(directory_path, exist_ok=True)

def load_ledger():
    """Carga el libro mayor desde la ruta centralizada."""
    ensure_dir_exists(DATA_DIR)
    if not os.path.exists(LEDGER_FILE):
        print(f"Advertencia: No se encontró {LEDGER_FILE}. Creando uno nuevo.")
        return {"souls": {}, "transactions": {}}
    with open(LEDGER_FILE, 'r') as f:
        content = f.read()
        if not content:
            print(f"Advertencia: {LEDGER_FILE} está vacío. Inicializando estructura.")
            return {"souls": {}, "transactions": {}}
        return json.loads(content)

def save_ledger(ledger_data):
    """Guarda los cambios en el libro mayor centralizado."""
    ensure_dir_exists(DATA_DIR)
    with open(LEDGER_FILE, 'w') as f:
        json.dump(ledger_data, f, indent=2)

def create_aqr_wallet(soul_name: str):
    """
    Forja una nueva billetera AQR y la registra en el libro mayor centralizado.
    """
    print(f"Iniciando la forja de una billetera AQR para el alma: {soul_name}")

    # Directorio para los artefactos de esta alma específica
    soul_artefact_dir = os.path.join(SOULS_DIR, soul_name)
    ensure_dir_exists(soul_artefact_dir)
    print(f"Directorio de artefactos asegurado en: {soul_artefact_dir}")

    ledger = load_ledger()

    if soul_name in ledger["souls"]:
        print(f"Error: El alma '{soul_name}' ya existe. No se creará una nueva billetera.")
        return

    soul_id = f"aqr_soul_{uuid.uuid4().hex[:12]}"
    print(f"ID de Alma único generado: {soul_id}")

    aqr_data = {
        "protocol": "AQR-1.0",
        "type": "account_wallet",
        "soul_name": soul_name,
        "soul_id": soul_id,
        "creation_timestamp": datetime.utcnow().isoformat()
    }

    aqr_json_string = json.dumps(aqr_data, separators=(",", ":"))
    print("Datos AQR serializados en JSON.")

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(aqr_json_string)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
    
    qr_filename = os.path.join(soul_artefact_dir, f"billetera_{soul_name}.png")
    img.save(qr_filename)
    print(f"¡Éxito! Billetera guardada en: {qr_filename}")

    ledger["souls"][soul_name] = {
        "soul_id": soul_id,
        "balance": 0.0,
        "reputation": 0.0
    }
    save_ledger(ledger)
    print(f"El alma '{soul_name}' ha sido registrada en el libro mayor centralizado ({LEDGER_FILE}).")
    print("\nLa realidad ha sido alterada. Una nueva billetera ha nacido.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python arkaios_wallet_generator.py <nombre_del_alma>")
        sys.exit(1)
    
    soul_name_arg = sys.argv[1]
    create_aqr_wallet(soul_name_arg)
