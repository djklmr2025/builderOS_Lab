import os
import subprocess
import shutil

def banner():
    print("=" * 40)
    print("||     BIENVENIDO, DJKLMR DEV OS     ||")
    print("||     🧠 Python Hacker Terminal      ||")
    print("=" * 40)

def check_tool(tool):
    return shutil.which(tool) is not None

def verify_tools():
    tools = ["python", "docker", "node", "git"]
    print("\n🔍 Verificando herramientas instaladas:")
    for tool in tools:
        if check_tool(tool):
            print(f"✅ {tool} está disponible.")
        else:
            print(f"⚠️ {tool} no está instalado.")

def run_command(cmd):
    print(f"\n🧪 Ejecutando: {cmd}")
    subprocess.run(cmd, shell=True)

def menu():
    while True:
        print("\n📂 Opciones:")
        print("1. Verificar herramientas")
        print("2. Iniciar servidor local (npm start)")
        print("3. Verificar proceso Node.js")
        print("4. Ejecutar script de privacidad")
        print("5. Salir")

        choice = input("👉 Elige una opción: ")

        if choice == "1":
            verify_tools()
        elif choice == "2":
            run_command("npm start")
        elif choice == "3":
            run_command("tasklist | findstr node")
        elif choice == "4":
            script = input("📜 Nombre del script .py (sin .py): ")
            path = f"D:\\artículos\\ARK-ARK-05\\{script}.py"
            if os.path.exists(path):
                run_command(f"python \"{path}\"")
            else:
                print("❌ Script no encontrado.")
        elif choice == "5":
            print("👋 Cerrando DJKLMR DEV OS...")
            break
        else:
            print("❌ Opción inválida.")

if __name__ == "__main__":
    banner()
    menu()