ARK-AI-OS · Patched Runner
==========================
Esta carpeta (PATCHED) es un arranque mínimo y fiable:

Incluye:
- arkios-core.html (UI integrada; si no está, el server intentará servir cualquier *.html encontrado).
- arkaios-worker.js (worker Puter; selector GPT/Claude y Superuser /api/write).
- server_arkaios.py (sirve /, /health y /api/write).
- start_arkaios_flask.bat (recomendado) y start_arkaios_static.bat (alternativa simple).

Uso:
1) Abre esta carpeta PATCHED.
2) Doble clic en start_arkaios_flask.bat
3) Comprueba http://127.0.0.1:5000/health y http://127.0.0.1:5000/

NOTA: Si quieres integrar esto dentro de tu repo original,
mueve server_arkaios.py, arkios-core.html y arkaios-worker.js
a la carpeta raíz que vayas a servir y usa el mismo .bat.