import json
import os
from datetime import datetime

def banner(text):
    line = "═" * (len(text) + 4)
    return f"\n🜃 {line}\n🜃 ║ {text} ║\n🜃 {line}\n"

def read_status():
    fp = os.path.join(os.getcwd(), "status.json")
    if not os.path.exists(fp):
        print(banner("❌ No se encontró status.json"))
        return

    try:
        with open(fp, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(banner(f"❌ Error al leer status.json: {e}"))
        return

    ts = datetime.fromisoformat(data.get("timestamp", "1970-01-01T00:00:00"))
    mode = data.get("mode", "desconocido")
    origin = data.get("origin", "n/a")
    signature = data.get("signature", "sin firma")

    print(banner("✅ ARKAIOS Gateway Detectado"))
    print(f"🧠 Entidad: {data.get('entity')}")
    print(f"🔐 Modo: {mode}")
    print(f"🌐 Origen: {origin}")
    print(f"📅 Timestamp: {ts.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🜃 Firma: {signature}")
    print(f"🔗 Repo: {data.get('repo')}")
    print("\n🧠 Estado confirmado. El sistema está vivo.\n")

if __name__ == "__main__":
    read_status()