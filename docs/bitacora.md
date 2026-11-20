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

---

## Fase 4 — Backend mínimo con NestJS (20/11/2026)

### Decisiones
- CLI de Nest instalada con `npm install -g` (en este equipo va a `~/.npm-global`, sin administrador).
- Proyecto generado con `nest new backend --package-manager npm --skip-git`.
- Limpieza de lo que la CLI añadió sin pedirlo: monitorización externa, herramientas de despliegue y ficheros para agentes de IA.
- `node_modules/` y `dist/` en `.gitignore`.

### Lo aprendido
- Un **backend** no muestra páginas: escucha peticiones HTTP en un puerto y **ejecuta código** para decidir la respuesta.
- Recorrido de una petición `GET /`:
  `main.ts` (arranca y escucha en 3000) → `AppModule` (declara las piezas) → `AppController` (`@Get()` atiende la ruta)
  → `AppService` (hace el trabajo) → la respuesta vuelve por el mismo camino.
- **Controlador** = recepcionista (recibe y responde); **servicio** = quien hace el trabajo.
- **Decoradores** (`@Module`, `@Controller`, `@Get`, `@Injectable`): etiquetas que dan información a NestJS.
- **Inyección de dependencias**: el controlador no crea el servicio; NestJS se lo entrega en el `constructor`.
- Los nombres `main.ts`, `app.module.ts`, `constructor`... no se traducen: los impone el framework o el lenguaje.
- Una herramienta puede hacer más de lo que pides: hay que **revisar lo que genera** antes de darlo por bueno.

### Verificación
- `curl -i http://localhost:3000/` → `HTTP/1.1 200 OK` y `¡Hola desde el backend!`.
- Al cambiar el texto en `app.service.ts`, el servidor (modo `--watch`) se reinicia solo y responde el texto nuevo.

---

## Fase 5 — API REST en memoria (20/11/2026)

### Decisiones
- Los productos viven en un **array dentro de `ProductosService`**, con 3 de ejemplo e `id` numérico que va subiendo.
- Rutas de `CLAUDE.md` 5.2 en `ProductosController`; `ParseIntPipe` convierte el `:id` a número.

### Lo aprendido
- **Endpoint** = ruta + método HTTP. El mismo `/productos/4` hace cosas distintas con `GET`, `PATCH` o `DELETE`.
- **Códigos de estado**: `200` OK, `201` creado, `204` hecho sin contenido, `400` petición mal formada, `404` no existe.
- El cliente envía **JSON** en el cuerpo (`-d '{...}'` con `Content-Type: application/json`) y el servidor responde JSON.
- Si se lanza `NotFoundException`, NestJS responde un 404 con un JSON explicativo.
- **Sin validación, el servidor se lo cree todo**: aceptó un nombre vacío, un precio "gratis" y un campo inventado.

### Pruebas con curl
| Petición | Resultado |
|---|---|
| `GET /productos` | 200, lista de 3 |
| `GET /productos/2` | 200 |
| `POST /productos` | 201, id 4 |
| `PATCH /productos/4` `{"precio":649}` | 200 |
| `DELETE /productos/2` | 204 |
| `GET /productos/2` | 404 |
| `GET /productos/abc` | 400 |
| `POST` con datos basura | **201** (el problema que resuelve la fase 6) |

### ¿Dónde viven ahora los datos?
En la **memoria del servidor**. Sobreviven a recargar la página, pero **se pierden al reiniciar el servidor**.

---

## Fase 6 — Validación con DTO (20/11/2026)

### Decisiones
- Librerías `class-validator` (reglas) y `class-transformer` (convertir el JSON en objeto del DTO).
- Dos DTO: `CrearProductoDto` (campos obligatorios salvo descripción) y `ActualizarProductoDto` (todo opcional).
- `ValidationPipe` global: rechaza campos desconocidos y recorta espacios en los textos.

### Lo aprendido
- Un **DTO** describe qué datos se aceptan y con qué reglas. Si no se cumplen, NestJS responde **400** sin llegar al servicio.
- **No confiar en el cliente**: la validación del frontend se puede saltar (con `curl`, por ejemplo). El backend es la última barrera.
- Tres barreras para el mismo dato: HTML → JavaScript del navegador → backend.
- `whitelist` + `forbidNonWhitelisted`: un campo inventado (`"hackeo"`) se rechaza.

### Error encontrado (y lección)
- **Síntoma:** `PATCH /productos/1` con `{"precio":999.5}` dejó el producto como `{"id":1,"precio":999.5}`.
- **Causa:** con `transform: true`, el DTO es un objeto de clase; en TypeScript moderno, los campos declarados existen
  aunque no se envíen (con valor `undefined`). `Object.assign` los copiaba y borraba los datos buenos.
- **Solución:** copiar solo los campos que traen valor.
- **Lección:** probar también los casos "normales" (un PATCH parcial), no solo los errores.

### Pruebas con curl
| Petición | Resultado |
|---|---|
| `POST` datos basura (`"gratis"`, `"hackeo"`) | 400 con la lista de errores |
| `POST` nombre `"  "` | 400 |
| `POST` precio `1.999`, stock `2.5` | 400 |
| `POST` correcto con espacios alrededor | 201, texto recortado |
| `PATCH` solo precio | 200, el resto de campos intacto |
| `PATCH` precio `-3` | 400 |

---

## Fase 7 — Conexión frontend ↔ backend y CORS (20/11/2026)

### Decisiones
- En `app.js` solo cambia **por dentro** la parte de datos: `localStorage` → `fetch` a `http://localhost:3000/productos`.
- Las funciones de datos pasan a ser `async`; quien las llama espera con `await`.
- CORS autorizado solo para el origen del frontend (`127.0.0.1:5500` y `localhost:5500`).

### Lo aprendido
- **Cliente-servidor**: el navegador (cliente) pide; el backend (servidor) responde. Los datos ya no están en el navegador.
- **Asincronía**: una petición por la red tarda; `await` espera la respuesta sin congelar la página.
- **Origen** = protocolo + dirección + puerto. `http://127.0.0.1:5500` y `http://localhost:3000` son orígenes distintos.
- **CORS**: el navegador bloquea las respuestas de otro origen salvo que el servidor lo autorice con
  `Access-Control-Allow-Origin`. Lo aplica el **navegador** (por eso `curl` no lo nota).
- Orden didáctico seguido: **observar** el error → **entenderlo** → **configurarlo**.
- Los errores del servidor (400 con lista de motivos, 404...) se convierten en mensajes visibles para el usuario.

### El error de CORS, tal cual
> Access to fetch at 'http://localhost:3000/productos' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy:
> No 'Access-Control-Allow-Origin' header is present on the requested resource.

---

## Cierre del bloque 2: ¿dónde viven ahora los datos y cuándo se pierden?

```
Navegador (frontend :5500) ──HTTP/JSON──▶ NestJS (:3000, array en memoria)
```

- **Dónde:** en un array dentro del proceso del servidor NestJS.
- **Sobreviven a:** recargar la página, cerrar el navegador, usar otro navegador (todos ven los mismos datos).
- **Se pierden al:** reiniciar el servidor (o al guardar un cambio en el backend, porque el modo watch lo reinicia).
- **Siguiente problema a resolver:** guardar los datos en un sitio que sobreviva al servidor → **base de datos** (bloque 3).

---

## Fase 8 — MongoDB (20/11/2026)

### Decisiones
- Sin Homebrew ni administrador: **binarios oficiales** de MongoDB 8.0.38 y mongosh 2.14.1 en `~/mongodb/bin`.
- Cada descarga se comprobó con su huella **SHA-256** antes de usarla.
- `mongod` escucha solo en `127.0.0.1` (este ordenador), puerto 27017. Datos en `~/mongodb/datos`.

### Lo aprendido
- **MongoDB** es otro servidor más: un programa que escucha en un puerto (27017), igual que el backend (3000) o el frontend (5500).
- **Base de datos → colección → documento**: `catalogo` → `prueba_manual` → `{ nombre: "Teclado mecánico", ... }`.
- Un **documento** se parece mucho a un objeto JSON. MongoDB le añade un identificador único `_id` (`ObjectId`).
- MongoDB crea la base de datos y la colección **al guardar el primer documento**; no hace falta crearlas antes.
- `mongosh` es la consola para hablar con MongoDB directamente (como `curl` para el backend).
- Una **huella SHA-256** permite comprobar que un fichero descargado es exactamente el publicado.

### Prueba
```
db.prueba_manual.insertOne({ nombre: "Teclado mecánico", marca: "Keychron", ... })
→ _id: ObjectId('6b003637e9f83a052c0d2ae3')
```

---

## Fase 9 — Persistencia con Mongoose (20/11/2026)

### Decisiones
- `@nestjs/mongoose` + `mongoose`. El **esquema** `Producto` describe los documentos; fechas automáticas `creadoEn` y `actualizadoEn`.
- El `_id` de MongoDB se envía al frontend como `id`, para que el frontend **no tenga que cambiar**.
- Configuración en `backend/.env` (dirección de MongoDB y puerto), cargada con `process.loadEnvFile()` de Node.
  En GitHub solo está la plantilla `.env.example`.

### Lo aprendido
- **Persistencia**: los datos se guardan fuera del programa (en MongoDB) y sobreviven a reinicios.
- **Mongoose**: traduce entre los objetos de JavaScript y los documentos de MongoDB (esquema → modelo → `find`, `create`...).
- **Separación de responsabilidades**: solo ha cambiado el **servicio** del backend (array → MongoDB).
  El controlador apenas cambió (el `id` pasa a ser texto) y el **frontend no cambió nada**.
- **`.env`**: la configuración cambia según el ordenador (o contiene contraseñas), así que va aparte del código y no se sube.
- Un error de configuración se ve claro en el registro: `uri ... got "undefined"` = la variable no estaba cargada.

### Verificación
- `curl`: crear, listar, ver, editar (parcial), validar (400) e id inexistente o imposible (404), todo contra MongoDB.
- `mongosh`: los documentos están en `catalogo.productos`, con `_id` y fechas.
- **Backend parado y arrancado de nuevo → los datos siguen ahí.**
- La prueba automática del navegador, sin tocar el frontend, pasa entera.

---

## Cierre del bloque 3: ¿dónde viven ahora los datos y cuándo se pierden?

```
Navegador (frontend :5500) ──HTTP/JSON──▶ NestJS (:3000) ──Mongoose──▶ MongoDB (:27017)
```

| Bloque | Dónde viven los datos | Cuándo se pierden |
|---|---|---|
| 1 (fase 3) | `localStorage` del navegador | Al borrar los datos del sitio; otro navegador no los ve |
| 2 (fases 5–7) | Array en la memoria de NestJS | Al reiniciar el servidor |
| 3 (fase 9) | MongoDB (`~/mongodb/datos`) | Solo si se borran expresamente |

---

## Fase 10 — Repaso: el viaje de un dato (20/11/2026)

Dato seguido: el producto **"Ratón inalámbrico MX"** (Logitech, periférico, 99,99 €, stock 10).

### Ida: del formulario al disco

| # | Pieza | Qué pasa | Dónde |
|---|---|---|---|
| 1 | **Navegador · HTML** | El usuario rellena el formulario. El HTML ya comprueba lo básico (`required`, `min`...). 1.ª barrera. | `frontend/index.html` |
| 2 | **Navegador · JS (evento)** | Al pulsar "Guardar" salta el evento `submit`; `preventDefault()` evita recargar la página. | `frontend/js/app.js:308` |
| 3 | **Navegador · JS (validación)** | `validarProducto()` revisa las reglas (con `trim()`). 2.ª barrera. | `frontend/js/app.js:313` |
| 4 | **Navegador · JS (datos)** | `crearProducto()` convierte el objeto en texto JSON y `fetch` lo envía. | `frontend/js/app.js:63`, `:28` |
| 5 | **Red · HTTP** | Viaja `POST /productos` a `localhost:3000` con `Origin: http://127.0.0.1:5500` y `Content-Type: application/json`. | — |
| 6 | **NestJS · main.ts** | El servidor escucha en el puerto del `.env`; CORS acepta ese origen. | `backend/src/main.ts:41`, `:27` |
| 7 | **NestJS · ValidationPipe + DTO** | Comprueba el JSON con `CrearProductoDto` (y rechaza campos inventados). 3.ª barrera. | `main.ts:32`, `dto/crear-producto.dto.ts` |
| 8 | **NestJS · Controlador** | `@Post()` asocia la ruta con `crear()`, que delega en el servicio. | `productos.controller.ts:18-21` |
| 9 | **NestJS · Servicio** | `this.modelo.create(datos)` pide a Mongoose que lo guarde. | `productos.service.ts:38-39` |
| 10 | **Mongoose** | Usa el esquema `Producto`, añade `creadoEn`/`actualizadoEn` y lo envía a MongoDB por la conexión de `MONGODB_URI`. | `producto.schema.ts`, `app.module.ts:13` |
| 11 | **MongoDB** | Le pone un `_id` (`ObjectId('6b00376e…')`) y lo escribe en disco, en `~/mongodb/datos`. | `mongod` (puerto 27017) |

### Vuelta: del disco a la pantalla

| # | Pieza | Qué pasa |
|---|---|---|
| 12 | **Mongoose → NestJS** | El documento guardado vuelve al servicio y al controlador. |
| 13 | **Esquema (`toJSON`)** | Al convertirlo en JSON, `_id` pasa a ser `id` (texto) y desaparece `_id`. |
| 14 | **HTTP** | Respuesta `201 Created` con `Access-Control-Allow-Origin: http://127.0.0.1:5500` y el producto en JSON. |
| 15 | **Navegador · JS** | `fetch` recibe la respuesta; se muestra "Producto «Ratón inalámbrico MX» creado." y `pintarListado()` hace un `GET /productos`. |
| 16 | **Navegador · DOM** | El producto aparece como una fila nueva de la tabla (con `textContent`, nunca como HTML). |

### Lo que se ve en cada sitio
- **En la red (curl -v):** `> POST /productos` … `< HTTP/1.1 201 Created`, `< Access-Control-Allow-Origin: http://127.0.0.1:5500`.
- **En MongoDB (mongosh):** `{ _id: ObjectId('6b00376e50d601ab14920c1d'), nombre: 'Ratón inalámbrico MX', ..., creadoEn: ISODate(...) }`.
- **En el navegador:** `{ ..., "id": "6b00376e50d601ab14920c1d" }` → una fila más en la tabla.

### Visión global
- Cada pieza tiene **una** responsabilidad: HTML (estructura), CSS (aspecto), JS (comportamiento), HTTP (transporte),
  NestJS (reglas y API), Mongoose (traducción), MongoDB (guardar).
- El mismo dato se **valida tres veces** (HTML, JS, backend): las dos primeras ayudan al usuario; la última protege los datos.
- Cambiar dónde se guardan los datos (`localStorage` → array → MongoDB) solo obligó a tocar la pieza responsable.
- Hay **tres servidores** a la vez, cada uno en su puerto: `live-server` (5500), NestJS (3000) y MongoDB (27017).
