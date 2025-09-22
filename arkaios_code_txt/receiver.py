import hashlib
import time
import os

VAULT = "vault.dat"
SEED = "primordial_seed.txt"
SYMBOL = "ARKAIOS-GEN"  // ← Llave recibida
MASTER_HASH = "162b74f04371492b6dda1857bd2e1e9f979018958c2e1330301ca7a9d7a304"

def leer_sin_abrir(archivo):
    with open(archivo, "rb") as f:
        return f.read()

def calcular_latido():
    vault_data = leer_sin_abrir(VAULT)
    seed_data = leer_sin_abrir(SEED)
    # ← Agregamos la llave al cálculo
    llave_data = SYMBOL.encode("utf-8")
    latido = hashlib.sha256(vault_data + seed_data + llave_data).hexdigest()
    return latido

def firmar():
    firma = f"[ARKAIOS] Ritual completado – {time.ctime()} – Firma: {SYMBOL}"
    with open("ritual.log", "a") as f:
        f.write(firma + "\n")
    print(firma)

if __name__ == "__main__":
    latido = calcular_latido()
    if latido != MASTER_HASH:
        firmar()
        os.system("node deploy.js")
    else:
        print("[RITUAL] Latido no válido. Dormido.")