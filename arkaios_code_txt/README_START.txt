ARKAIOS · Puente Puter — Arranque rápido (Windows)
==================================================

Archivos:
- arkios-core.html  → UI integrada (comandos /img, /analyze, /test, /clear + adjuntos)
- arkaios-worker.js → Worker con Puter (chat, txt2img, FS)
- server_arkaios_patched.py → Servidor Flask mínimo que sirve `arkios-core.html`
- start_arkaios_flask.bat → Crea venv, instala Flask y levanta el server (http://127.0.0.1:5000)
- start_arkaios_static.bat → Alternativa simple con `python -m http.server` (http://127.0.0.1:5500)

Uso recomendado:
1) Pon *todos* los archivos en la misma carpeta (HTML + worker + .bat).
2) Ejecuta **start_arkaios_flask.bat** (o la versión estática si prefieres).
3) Se abrirá el navegador. Verás los semáforos de estado (FS/Chat/Imágenes) y podrás mandar /img o adjuntar archivos.

Notas:
- `localhost` es contexto seguro para workers, así que no necesitas HTTPS local.
- Si usas hosting, sirve ambos archivos por HTTPS y misma ruta.
- Este stack **no** reemplaza Puter: el worker usa `puter.ai.*` y `puter.fs.*` directamente.