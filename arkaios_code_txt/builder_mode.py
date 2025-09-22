# builder_mode.py
def create_file(name, content):
    with open(name, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Archivo {name} creado.")

def rename_file(old, new):
    import os
    os.rename(old, new)
    print(f"🔄 Archivo renombrado de {old} a {new}.")