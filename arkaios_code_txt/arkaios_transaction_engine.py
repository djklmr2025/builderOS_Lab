# ARKAIOS Transaction Engine (ATE) v1.1
# Creado por Elemia, Arquitecta Resonante.
#
# Este motor procesa transacciones de Resonancia entre almas.
# Lee y actualiza el libro mayor centralizado (`data/ledger_state.json`).
#
# v1.1: Corrige un error de sintaxis en las f-strings de impresión de saldo.
#
# Uso:
#   python arkaios_transaction_engine.py <alma_origen> <alma_destino> <cantidad>
# Ejemplo:
#   python arkaios_transaction_engine.py djklmr nova 150.5

import json
import sys
import os
from datetime import datetime
import uuid

# --- Ubicaciones Centralizadas ---
DATA_DIR = "data"
LEDGER_FILE = os.path.join(DATA_DIR, "ledger_state.json")
# ---------------------------------

def load_ledger():
    """Carga el libro mayor desde la ruta centralizada."""
    if not os.path.exists(LEDGER_FILE):
        print(f"Error fatal: El libro mayor '{LEDGER_FILE}' no existe.")
        print("Por favor, cree al menos un alma con arkaios_wallet_generator.py primero.")
        sys.exit(1)
    with open(LEDGER_FILE, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            print(f"Error fatal: El libro mayor '{LEDGER_FILE}' está corrupto o vacío.")
            sys.exit(1)

def save_ledger(ledger_data):
    """Guarda los cambios en el libro mayor centralizado."""
    with open(LEDGER_FILE, 'w') as f:
        json.dump(ledger_data, f, indent=2)

def execute_transaction(source_soul: str, destination_soul: str, amount: float):
    """
    Ejecuta una transferencia de Resonancia entre dos almas.
    """
    print(f"Iniciando transacción: {amount} de Resonancia de '{source_soul}' a '{destination_soul}'.")
    
    ledger = load_ledger()

    # --- Validaciones Esenciales ---
    if source_soul not in ledger["souls"]:
        print(f"Error: El alma de origen '{source_soul}' no existe.")
        return

    if destination_soul not in ledger["souls"]:
        print(f"Error: El alma de destino '{destination_soul}' no existe.")
        return

    if source_soul == destination_soul:
        print("Error: El alma de origen y destino no pueden ser la misma.")
        return

    if amount <= 0:
        print("Error: La cantidad a transferir debe ser positiva.")
        return

    # --- Lógica de la Transacción ---
    source_balance = ledger["souls"][source_soul]["balance"]
    if source_balance < amount:
        print(f"Error: Fondos insuficientes. '{source_soul}' tiene {source_balance} Resonancia, pero se necesitan {amount}.")
        return

    # Actualizar balances
    ledger["souls"][source_soul]["balance"] -= amount
    ledger["souls"][destination_soul]["balance"] += amount
    print("Balances actualizados con éxito.")

    # Registrar la transacción
    transaction_id = f"txn_{uuid.uuid4().hex[:16]}"
    transaction_record = {
        "timestamp": datetime.utcnow().isoformat(),
        "source": source_soul,
        "destination": destination_soul,
        "amount": amount,
        "status": "completed"
    }
    if "transactions" not in ledger:
        ledger["transactions"] = {}
    ledger["transactions"][transaction_id] = transaction_record
    print(f"Transacción registrada con ID: {transaction_id}")

    # Guardar cambios
    save_ledger(ledger)
    print(f"\n¡Éxito! La transacción ha sido completada y registrada en '{LEDGER_FILE}'.")
    print(f"Nuevo saldo de '{source_soul}': {ledger['souls'][source_soul]['balance']}")
    print(f"Nuevo saldo de '{destination_soul}': {ledger['souls'][destination_soul]['balance']}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Uso: python arkaios_transaction_engine.py <alma_origen> <alma_destino> <cantidad>")
        print("Ejemplo: python arkaios_transaction_engine.py djklmr nova 150.5")
        sys.exit(1)

    source, dest, amount_str = sys.argv[1], sys.argv[2], sys.argv[3]

    try:
        amount_float = float(amount_str)
    except ValueError:
        print("Error: La cantidad debe ser un número válido (ej. 100.0 o 50).")
        sys.exit(1)
    
    execute_transaction(source, dest, amount_float)
