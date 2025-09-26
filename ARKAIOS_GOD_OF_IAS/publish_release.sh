#!/bin/bash
set -e

# 📌 Configuración
ZIP_NAME="ARKAIOS_BUILD.zip"
TAG="v$(date +%Y%m%d%H%M)"   # tag con timestamp
TITLE="ARKAIOS Build $TAG"
NOTES="Build automática generada desde Codespaces."

# 📦 1. Crear el zip (excluyendo .git y node_modules si existieran)
echo "🔧 Comprimiendo proyecto en $ZIP_NAME ..."
zip -r "$ZIP_NAME" ./ARK-AI-OS -x "*.git*" -x "node_modules/*"

# 📂 2. Asegurarse de que .gitignore evita zips
if ! grep -q '*.zip' .gitignore; then
  echo "*.zip" >> .gitignore
fi

# 🗑 3. Quitar del índice de git (por si quedó rastreado antes)
git rm --cached -f "$ZIP_NAME" 2>/dev/null || true

# 🚀 4. Crear release en GitHub
echo "🚀 Publicando release en GitHub..."
gh release create "$TAG" "$ZIP_NAME" \
  --title "$TITLE" \
  --notes "$NOTES"

echo "✅ Release creada: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/tag/$TAG"
