# Bitácora del proyecto

Decisiones tomadas y lo aprendido en cada fase.

---

## Fase 0 — Entorno mínimo (19–20/11/2026)

### Lo que había
- Node.js v26.13.1 y npm 11.20.0, en `/usr/local/bin`.
- Navegadores: Google Chrome y Safari.
- No había editor de código ni Homebrew.
- No estaban las *Command Line Tools* de Apple, así que tampoco `python3`.
- El usuario no es administrador: no puede escribir en `/Applications`.

### Decisiones
- **Carpeta raíz:** `actividad01/`, sin subcarpeta `catalogo-tecnologico/`.
- **Servidor local:** paquete `live-server` de npm, ejecutado con `npx` desde la terminal, en el puerto 5500.
  - Primer intento: VS Code + extensión Live Server. La extensión no llegó a activarse
    (probablemente por el *modo restringido* de VS Code) y la ventana se cerraba, así que se abría la página como `file://`.
  - Se decidió no depender de VS Code y usar `live-server` desde la terminal: misma idea, sin editor de por medio.
  - Python se descartó porque exigía instalar las Command Line Tools de Apple.
- **Editor:** pendiente de decidir (VS Code sigue instalado en `~/Applications`).
- **Ficheros de código:** cada uno se crea en su fase (`index.html` en la 1, `estilos.css` en la 2, `app.js` en la 3).
  En la fase 0 solo hay un `index.html` mínimo de prueba.
- **`backend/`:** no se crea todavía; la generará la CLI de Nest en el bloque 2.
- **Detalles de datos:** `id` numérico que va subiendo; precio con hasta 2 decimales;
  los productos de ejemplo escritos a mano en la fase 1 se sustituirán en la fase 3.

### Lo aprendido
- Un **servidor local** entrega los ficheros al navegador por `http://`, como una web real.
  Abrir el HTML con doble clic usa `file://` y algunas cosas (como `fetch`) no funcionan igual.
- Un **puerto** es el "número de puerta" por el que un programa escucha peticiones (Live Server: 5500).
- Los **permisos de usuario** limitan dónde se puede instalar. Sin ser administrador, se instala en la carpeta personal.
- Un **aviso** (*warning*) no es un error: el programa sigue funcionando (p. ej., `npm warn deprecated`).
- Se vio la **primera petición HTTP**: el navegador pidió `GET /favicon.ico` y el servidor respondió `404` (no existe).
  La página respondió `200` (todo bien).
- El navegador **interpreta** el HTML y muestra el resultado; el código se ve con "Ver código fuente" o las DevTools.
- Un servidor solo funciona **mientras su proceso está en marcha**: si se cierra, la página deja de llegar.

---

## Fase 1 — Estructura HTML (20/11/2026)

### Decisiones
- El listado es una **tabla** (`<table>`): todos los productos tienen las mismas columnas.
- Se usa **validación HTML** desde ya: `required`, `minlength`, `maxlength`, `min`, `step`.
- Categorías: valor sin tildes (`portatil`), texto visible con tildes (Portátil).
- 3 productos de ejemplo escritos a mano; se sustituirán en la fase 3.
- Zona `#mensajes` vacía, reservada para los avisos de la fase 3.

### Lo aprendido
- Estructura semántica: `<header>`, `<main>`, `<section>`, `<form>`, `<table>` dicen **qué es** cada parte.
- `<label for="x">` se enlaza con el campo `id="x"`: al pulsar la etiqueta se activa el campo.
- El navegador puede validar un formulario **sin JavaScript**.
- Sin JavaScript, la página es **estática**: los botones se ven, pero no hacen nada.
- "Desplegar" (*deploy*) es publicar en internet; aquí solo tenemos un servidor local de desarrollo.

---

## Fase 2 — Presentación CSS (20/11/2026)

### Decisiones
- Fichero `css/estilos.css`, enlazado con `<link>`: es el **único cambio** en el HTML.
- Colores en **variables CSS** al principio del fichero.
- Cabecera azul, secciones como tarjetas blancas, botón Eliminar en rojo, filas alternas en la tabla.
- En pantallas estrechas, la tabla se desplaza en horizontal.

### Lo aprendido
- **Separar estructura y presentación**: el HTML dice qué hay; el CSS, cómo se ve.
- Selectores, variables CSS y *media queries*.
- Con las DevTools (panel *Styles*) se ve qué reglas afectan a cada elemento.

### Verificación
- Capturas con Chrome en modo *headless* (sin ventana) a 1280 px y 600 px de ancho.
- Escritorio: cabecera, tarjetas, formulario, tabla y colores de los botones correctos.
- Pantalla estrecha: el formulario se adapta y la tabla se desplaza en horizontal dentro de su tarjeta, como se diseñó.
- Curiosidad: Chrome *headless* no baja de 500 px de ancho; una captura a 400 px sale recortada y parece un fallo que no existe.
  Moraleja: comprobar la herramienta de verificación antes de culpar al código.
- Mejora opcional detectada (no aplicada): en pantallas estrechas el precio se parte en dos líneas ("1199,00 / €").

---

## Fase 3 — Comportamiento con JavaScript (20/11/2026)

### Decisiones
- Los datos se guardan en **`localStorage`** (excepción acordada a `CLAUDE.md`).
- Si el almacén está vacío, se cargan 3 productos de ejemplo.
- Antes de eliminar se pide confirmación con `confirm()`.
- Validación doble: la del HTML y otra en JavaScript.
- `app.js` se divide en 4 partes: **datos**, **validación**, **interfaz** y **eventos**. Solo la parte de datos toca `localStorage`.
- El `<tbody>` del HTML queda vacío: las filas las crea JavaScript.

### Lo aprendido
- **DOM**: JavaScript busca elementos (`getElementById`), los crea (`createElement`) y los cambia (`textContent`).
- **Eventos**: `addEventListener('submit' | 'click' | 'reset', ...)` = "cuando pase esto, haz aquello".
- `preventDefault()` evita que el formulario recargue la página (su comportamiento por defecto).
- `localStorage` solo guarda **texto**: `JSON.stringify` convierte la lista en texto y `JSON.parse` la recupera.
- `textContent` en vez de `innerHTML`: lo que escribe el usuario se muestra como texto, nunca se ejecuta como HTML.
- Del formulario todo llega como **texto**; precio y stock se convierten a número con `Number()` después de validar.
- La validación HTML se puede saltar; la de JavaScript es una segunda barrera (y en el bloque 2 habrá una tercera, en el servidor).

### Verificación
- 19 comprobaciones automáticas en Chrome headless sobre la app real, todas correctas, y una segunda carga
  que confirma que los datos persisten al recargar.
- Incidencia: la prueba se colgaba por el script de recarga automática de `live-server`, que mantiene una conexión abierta.

---

## Cierre del bloque 1: ¿dónde viven ahora los datos y cuándo se pierden?

```
Navegador (HTML + CSS + JS) ──▶ localStorage (en ese mismo navegador)
```

- **Dónde:** en el `localStorage` del navegador, clave `productos`, como texto JSON.
- **Sobreviven a:** recargar la página, cerrar el navegador, apagar el ordenador.
- **Se pierden si:** se borran los datos del sitio, se usa otro navegador u otro ordenador.
- **Limitación clave:** cada navegador tiene su propia copia; nadie más ve tus productos.
  Por eso hace falta un **servidor** (bloque 2): un sitio central al que todos los navegadores pidan los mismos datos.
