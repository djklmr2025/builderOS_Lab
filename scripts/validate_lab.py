import subprocess, sys, time, shlex

CMDS = [
  ("core",       "python -u BuilderOS/core.py"),
  ("prometeo",   "python -u BuilderOS/prometeo.py"),
  ("awakener",   "python -u BuilderOS/awakener.py"),
  ("convergence","python -u BuilderOS/convergence.py"),
]

for name, cmd in CMDS:
    print(f"\n=== [{name}] -> {cmd}")
    p = subprocess.Popen(shlex.split(cmd), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    t0 = time.time(); lines = []
    while time.time()-t0 < 12:
        line = p.stdout.readline()
        if not line: break
        lines.append(line.rstrip())
        if len(lines) >= 18: break
    p.kill()
    print("\n".join(lines) or "(sin salida)")
