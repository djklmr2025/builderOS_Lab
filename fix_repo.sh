#!/usr/bin/env bash
set -euo pipefail

echo "[ARKAIOS] Reparando repositorio y activando agente..."

# Variables
ZIP="ARKAIOS_BUILD.zip"
TARGET_DIR="ARKAIOS_GOD_OF_IAS/ARK-AI-OS"

# 1. Eliminar del control de Git el ZIP si está versionado
if git ls-files --error-unmatch "$ZIP" >/dev/null 2>&1; then
  echo "[INFO] Quitando $ZIP del repo..."
  git rm --cached "$ZIP"
fi

# 2. Crear directorio de destino
mkdir -p "$TARGET_DIR"

# 3. Descomprimir build
echo "[INFO] Descomprimiendo $ZIP en $TARGET_DIR..."
unzip -o "$ZIP" -d "$TARGET_DIR"

# 4. Añadir archivos descomprimidos al repo
echo "[INFO] Versionando agente Arkaios..."
git add "$TARGET_DIR"

# 5. Commit
git commit -m "Fix: descomprimir Arkaios agente y versionarlo en $TARGET_DIR"

echo "[OK] Ahora haz: git push origin main"
