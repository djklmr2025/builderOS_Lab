ARKAIOS image hotfix
====================

Qué hace:
- Normaliza las respuestas de Puter (string | {url} | {image_url}).
- No modifica tu código: se inyecta como script adicional.

Cómo usar:
1) Copia `arkaios-img-hotfix.js` junto a tu `arkios-core.html`.
2) Abre `arkios-core.html` y, ANTES de cerrar </body>, agrega:
   <script src="arkaios-img-hotfix.js"></script>

Listo. Tu flujo de imágenes debería dejar de mostrar "[object Object]" y
renderizar las miniaturas correctamente.