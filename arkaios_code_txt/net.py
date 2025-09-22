# net.py
import requests
import subprocess

def check_connection():
    try:
        requests.get("https://www.google.com", timeout=3)
        print("✅ Conexión activa.")
    except:
        print("❌ Sin conexión.")

def install_package(pkg):
    subprocess.run(["pip", "install", pkg])
    print(f"📦 Paquete {pkg} instalado.")