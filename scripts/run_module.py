#!/usr/bin/env python3
import subprocess, sys, time, shlex, pathlib, datetime, os

LOG_DIR = pathlib.Path("logs"); LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / "diagnostics.log"

def log(msg):
    t = datetime.datetime.utcnow().isoformat()+"Z"
    line = f"[{t}] {msg}"
    print(line)
    with LOG_FILE.open("a", encoding="utf-8") as f:
        f.write(line+"\n")

def run(mod_path, name):
    path = pathlib.Path(mod_path)
    if not path.exists():
        log(f"ERROR: no existe {mod_path}")
        sys.exit(1)
    log(f"RUN {name} -> {mod_path}")
    cmd = f"{sys.executable} -u {shlex.quote(str(path))}"
    p = subprocess.Popen(shlex.split(cmd), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    t0 = time.time(); lines=0
    while True:
        line = p.stdout.readline()
        if not line: break
        line = line.rstrip("\n")
        print(line)
        with LOG_FILE.open("a", encoding="utf-8") as f: f.write(line+"\n")
        lines += 1
        if time.time()-t0>15: break  # 15s máximo de smoke por módulo
    try: p.kill()
    except: pass
    if lines == 0:
        msg = f"INFO: {name} ejecutado (sin stdout). Añade prints si quieres más visibilidad."
        print(msg); log(msg)

if __name__ == "__main__":
    MODS = [
      ("core",        "BuilderOS/core.py"),
      ("prometeo",    "BuilderOS/prometeo.py"),
      ("awakener",    "BuilderOS/awakener.py"),
      ("convergence", "BuilderOS/convergence.py"),
    ]
    target = sys.argv[1] if len(sys.argv)>1 else "all"
    if target=="all":
        for n,p in MODS: run(p, n.upper())
    else:
        found = next((p for n,p in MODS if n==target or p==target), None)
        if not found: sys.exit("Uso: run_module.py [all|core|prometeo|awakener|convergence|ruta]")
        run(found, target.upper())
