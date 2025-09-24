#!/usr/bin/env bash
set -euo pipefail

# --- Config ---
PAGES_URL="https://djklmr2025.github.io/builderOS_Lab/"

# --- Ubicación repo ---
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# --- Checks básicos ---
test -f scripts/gen_index.py || { echo "❌ Falta scripts/gen_index.py"; exit 1; }
test -f docs/index.html     || { echo "❌ Falta docs/index.html"; exit 1; }

BRANCH="$(git rev-parse --abbrev-ref HEAD || echo main)"
if [ "$BRANCH" != "main" ]; then
  echo "⚠️  Estás en la rama '$BRANCH' (no 'main')."
  read -rp "¿Continuar publicando en '$BRANCH'? [y/N] " ans
  [[ "$ans" == "y" || "$ans" == "Y" ]] || exit 1
fi

# --- Generar índice y copiar al visor ---
echo "🧮 Generando index.json..."
python3 scripts/gen_index.py
cp -f index.json docs/index.json

# --- Commit + push ---
MSG="${1:-chore(index): update index + viewer copy}"
git add index.json docs/index.json
set +e
git commit -m "$MSG"
RET=$?
set -e

if [ $RET -ne 0 ]; then
  echo "ℹ️  No había cambios que commitear."
fi

echo "⤴️  Haciendo push a 'origin/$BRANCH'..."
git push origin "$BRANCH"

echo "✅ Publicado. Revisa GitHub Pages:"
echo "   $PAGES_URL"
