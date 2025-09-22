# ===============================
# DJKLMR DEV OS SETUP 🔥 con -Force
# ===============================

Write-Host "=====================================" -ForegroundColor Green
Write-Host "||     BIENVENIDO, DJKLMR DEV OS    ||" -ForegroundColor Cyan
Write-Host "||     🧠 PowerShell Custom Shell    ||" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`n🔍 Verificando herramientas instaladas..."

foreach ($tool in @("python", "docker", "node", "git")) {
    if (Get-Command $tool -ErrorAction SilentlyContinue) {
        Write-Host "✅ $tool está disponible." -ForegroundColor Green
    } else {
        Write-Host "⚠️ $tool no está instalado." -ForegroundColor Red
    }
}

Write-Host "`n🔗 Configurando alias con -Force..."
New-Alias -Name gs -Value "git status" -Force
New-Alias -Name gcommit -Value "git commit" -Force
New-Alias -Name npms -Value "npm start" -Force

Write-Host "`n🧠 Cargando funciones personalizadas..."

function ServidorLocal {
    Write-Host "🚀 Iniciando servidor local..."
    npm start
}

function VerificarNode {
    $proc = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($proc) {
        Write-Host "✅ Node.js está corriendo." -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js no está activo." -ForegroundColor Red
    }
}

Write-Host "`n🎨 Aplicando estilo visual con -Force..."
Import-Module PSReadLine -Force
Set-PSReadLineOption -EditMode Emacs
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -Colors @{
    Command   = "Cyan"
    Parameter = "Yellow"
    String    = "Magenta"
    Operator  = "DarkGray"
    Variable  = "Green"
}

Write-Host "`n✅ Entorno DJKLMR DEV OS listo para despegar." -ForegroundColor Green