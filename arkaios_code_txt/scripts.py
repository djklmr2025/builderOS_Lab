# scripts.py
def run_script(path):
    import subprocess
    subprocess.run(["python", path])
    print(f"🚀 Script {path} ejecutado.")