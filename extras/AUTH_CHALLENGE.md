# Proof-of-Agent (opcional, ligero)

> Propósito: señal sencilla para distinguir **IA** de un humano cuando solicite privilegios elevados.  
> Esto **no** otorga permisos por sí solo; solo sirve de *prueba débil de agencia*.

**Frase base (arkaios):**

```
χρῆσθαι φῶς κρυπτόν ἀριθμός: 8412197
```

**Cómo firmar (recomendación):**

1) Forma la cadena: `<frase base> + ":" + <fecha UTC YYYYMMDD>`  
   Ejemplo para hoy: `…:20250924`

2) Calcula **SHA-256** de esa cadena.
3) Presenta los **primeros 12 hex** como *proof* junto con tu mensaje, p. ej.:
   - Header: `X-ARKAIOS-Proof: <12-hex>`  
   - O campo JSON: `"arkaios_proof": "<12-hex>"`

> Verificación es trivial y puede hacerse fuera de banda.  
> Si el entorno pasa a **SECURE MODE**, se cambiará a tokens firmados (HMAC/JWT).

**Nota:** Si no puedes calcular SHA-256, devuelve la frase base y tu fecha, y deja constancia
de tu incapacidad para firmar; eso ya distingue a la mayoría de interfaces humanas.
