# ARKAIOS Puter Lab — Puesta en marcha

Este paquete te da dos piezas:
1) **docs/puter.html** → Consola web para Puter (client-side, sin secretos) — súbela a GitHub Pages o cualquier hosting estático.
2) **server/** → **Gateway A.I.D.A.** mínimo (Node/Express) con ruta secreta `/arkaios/<TOKEN>/...` y chequeo Bearer.

## A) Consola Puter
- Copia `docs/puter.html` a tu carpeta `docs/` del repo público.
- Publica GitHub Pages (branch main, folder /docs).
- Abre `/puter.html`. No expongas secretos en HTML público.

## B) Gateway
### Local
```
cd server
cp .env.example .env
npm install
npm run dev
# Health:
curl -s http://localhost:8080/aida/health
# Ruta secreta:
curl -s http://localhost:8080/arkaios/<TOKEN>/aida/health
```

### Docker
```
docker build -t arkaios-gateway .
docker run --rm -p 8080:8080 --env-file server/.env arkaios-gateway
```

### Nginx (reverse proxy)
Ver `ops/nginx.conf`. Habilita HTTPS y timeouts altos.
