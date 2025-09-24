#!/bin/bash
# Script para publicar cambios en el repositorio automáticamente

if [ -z "$1" ]; then
  echo "Uso: $0 \"mensaje de commit\""
  exit 1
fi

# Agregar todos los cambios
 git add .

# Commit con el mensaje proporcionado
 git commit -m "$1"

# Actualizar rama local con cambios remotos
 git pull --rebase

# Subir los cambios al repositorio remoto
 git push
