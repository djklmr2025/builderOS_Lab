#!/usr/bin/env python3
import os, sys, json, hashlib, time

ROOTS = [
  ("arkaios_text_for_copilot", "doc"),
  ("arkaios_code_txt", "code"),
  ("BuilderOS", "module")
]

def sha256_of(path, chunk=65536):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while True:
            b = f.read(chunk)
            if not b: break
            h.update(b)
    return h.hexdigest()

def main():
    index = {"generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
             "collections": []}

    for root, kind in ROOTS:
        if not os.path.isdir(root):
            index["collections"].append({
                "name": root,
                "type": kind,
                "missing": True,
                "entries": []
            })
            continue

        entries = []
        for dirpath, _, files in os.walk(root):
            for fn in files:
                path = os.path.join(dirpath, fn)
                rel = os.path.relpath(path, ".")
                try:
                    stat = os.stat(path)
                    entries.append({
                        "path": rel.replace("\\","/"),
                        "size": stat.st_size,
                        "sha256": sha256_of(path),
                        "kind": kind
                    })
                except Exception as e:
                    entries.append({"path": rel.replace("\\","/"), "error": str(e), "kind": kind})
        index["collections"].append({"name": root, "type": kind, "entries": entries})

    with open("index.json", "w", encoding="utf-8") as f:
        json.dump(index, f, indent=2, ensure_ascii=False)

    print("index.json generado con", sum(len(c.get("entries",[])) for c in index["collections"]), "entradas.")

if __name__ == "__main__":
    main()
