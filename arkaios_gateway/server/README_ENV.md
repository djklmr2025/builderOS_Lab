# ARKAIOS Gateway — Paquete de Entorno Seguro (.env)

Este paquete te deja listo el árbol de carpetas y los archivos para configurar tu **MASTER_TOKEN**
sin exponerlo en el repositorio.

## ¿Qué contiene?
```
arkaios_gateway/
  └─ server/
     ├─ .env            ← Pega aquí tu MASTER_TOKEN
     ├─ .env.example    ← Ejemplo documentado
     └─ README_ENV.md   ← Esta guía
.gitignore              ← (sugerido) ignorar .env
```

## Pasos
1. Descomprime este zip en la **raíz** de tu repo (`builderOS_Lab/`).
2. Abre `arkaios_gateway/server/.env` y reemplaza:
   ```
   MASTER_TOKEN=__PASTE_YOUR_MASTER_TOKEN_HERE__
   ```
   por tu token real.
3. (Opcional) Ajusta `ALLOW_ORIGIN` si usarás otra consola web además de GitHub Pages.
4. En Render, configura variables si no usas `.env` local:
   - `OPEN_MODE=0`
   - `ALLOW_ORIGIN=https://djklmr2025.github.io`
   - `PUBLIC_ACTIONS=echo,plan,analyze,explain,generate`
   - `MASTER_TOKEN=<tu_token>`
   - `SECRET_BASE=/arkaios/secure`
   - `TRUST_PROXY=1`
   - `LOG_LEVEL=info`

## Comandos útiles
### Linux/macOS
```bash
unzip arkaios_secure_env_pack.zip -d .
```

### Windows (PowerShell)
```powershell
Expand-Archive -Path .\arkaios_secure_env_pack.zip -DestinationPath . -Force
```

## Prueba rápida (PowerShell)
```powershell
$gw = "https://arkaios-gateway-open.onrender.com"
irm "$gw/aida/health"
$body = @{ agent_id="puter"; action="plan"; params=@{ objective="mapear BuilderOS" } } | ConvertTo-Json
irm -Method Post -Uri "$gw/aida/gateway" -ContentType "application/json" -Headers @{Authorization="Bearer TU_MASTER_TOKEN"} -Body $body
```

> Recuerda: **no subas `.env` al repo**. Mantén tu token en secreto.
