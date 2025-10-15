Param(
  [string]$SourceDir = "Puter_App_extracted",
  [string]$OutputZip = "Worker.ready.zip"
)

$ErrorActionPreference = 'Stop'

Write-Host "Empaquetando Worker desde '$SourceDir' hacia '$OutputZip'..." -ForegroundColor Cyan

if (-not (Test-Path $SourceDir)) {
  throw "No se encontró el directorio '$SourceDir'"
}

# Asegurar que exista memory.json mínimo
$memPath = Join-Path $SourceDir 'memory.json'
if (-not (Test-Path $memPath)) {
  Write-Host "Creando memory.json base" -ForegroundColor Yellow
  '{}' | Set-Content -Path $memPath -Encoding UTF8
}

# Archivos requeridos
$entryPath = Join-Path $SourceDir 'index.js'
if (-not (Test-Path $entryPath)) {
  throw "No se encontró el archivo de entrada 'index.js' en '$SourceDir'"
}

# Limpiar ZIP anterior
if (Test-Path $OutputZip) {
  Remove-Item $OutputZip -Force
}

<#
  Empaqueta solo los archivos necesarios para el Worker persistente
  evitando incluir implementaciones alternativas que dependan de `puter`.
  Incluye:
  - index.js (entrypoint)
  - memory.json (persistencia)
  - README_WORKER.md (documentación breve)
#>

$include = @('index.js', 'memory.json', 'README_WORKER.md')
$paths = $include | ForEach-Object { Join-Path $SourceDir $_ }

Compress-Archive -Path $paths -DestinationPath $OutputZip

Write-Host "Listo: '$OutputZip'" -ForegroundColor Green