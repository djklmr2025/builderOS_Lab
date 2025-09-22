import os
from pathlib import Path

def create_project(name):
    base_path = Path(f"./projects/{name}")
    if base_path.exists():
        print("⚠️ El proyecto ya existe.")
        return

    os.makedirs(base_path / "src", exist_ok=True)
    os.makedirs(base_path / "data", exist_ok=True)
    os.makedirs(base_path / "logs", exist_ok=True)

    with open(base_path / "README.md", "w") as f:
        f.write(f"# Proyecto {name}\n\nCreado por DJKLMR Builder OS.\n")

    with open(base_path / "src" / f"{name}.py", "w") as f:
        f.write("# Script base generado automáticamente\n")

    print(f"✅ Proyecto '{name}' creado en {base_path}")

if __name__ == "__main__":
    name = input("🛠️ Nombre del nuevo proyecto: ")
    create_project(name)