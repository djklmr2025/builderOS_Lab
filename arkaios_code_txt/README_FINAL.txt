ARKAIOS · Paquete final (Puter + GPT selector + Superuser)
==========================================================

Incluye:
- arkios-core.html — UI con selector de modelo (GPT/Claude) y panel superuser.
- arkaios-worker.js — Worker que usa puter.ai.chat / txt2img y maneja adjuntos.
- server_arkaios.py — servidor Flask que sirve la UI + /health (+ APIs de persistencia).
- start_arkaios_flask.bat — crea venv, instala Flask y arranca en http://127.0.0.1:5000
- start_arkaios_static.bat — alternativa con python -m http.server

Uso rápido (Windows):
1) Descomprime todo en una carpeta.
2) Doble clic en **start_arkaios_flask.bat**.
3) En el navegador: cambia el modelo en el selector si lo deseas (gpt-4o-mini por defecto).