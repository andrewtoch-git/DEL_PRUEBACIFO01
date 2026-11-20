# Contexto del proyecto (registro vivo)

> **Para qué sirve este fichero:** es la "memoria" del proyecto. Recoge dónde estamos, cómo está montado
> el entorno, todas las decisiones tomadas y lo que se ha hecho en cada sesión.
> **Al empezar una sesión nueva, leer primero este fichero.** Se actualiza al terminar cada paso.
>
> Ficheros relacionados:
> - `CLAUDE.md` → instrucciones del profesor (no se modifica).
> - `README.md` → cómo arrancar y estado de las fases (resumen corto).
> - `docs/bitacora.md` → decisiones y aprendizajes por fase (versión didáctica).
> - `docs/glosario.md` → términos técnicos explicados.

Última actualización: **2026-11-20**

---

## 1. Estado actual

| Bloque | Fase | Estado |
|---|---|---|
| 1 — Frontend | 0. Entorno mínimo | ✅ Completada |
| 1 — Frontend | 1. Estructura (HTML) | ✅ Completada |
| 1 — Frontend | 2. Presentación (CSS) | ✅ Completada (verificada con capturas de Chrome headless) |
| 1 — Frontend | 3. Comportamiento (JS) | ✅ Completada (CRUD con `localStorage`, 19 pruebas automáticas + prueba de recarga) |
| 2 — Backend | 4. Backend mínimo | ✅ Completada |
| 2 — Backend | 5. API en memoria | ✅ Completada |
| 2 — Backend | 6. Validación | ✅ Completada |
| 2 — Backend | 7. Conexión | ✅ Completada (fetch + CORS) |
| 3 — Base de datos | 8. MongoDB | ✅ Completada (binarios en `~/mongodb`) |
| 3 — Base de datos | 9. Persistencia | ✅ Completada (Mongoose; frontend sin cambios) |
| 3 — Base de datos | 10. Repaso | ✅ Completada (viaje de un dato, en `bitacora.md`) |

**Proyecto completo: fases 0–10 terminadas y subidas a GitHub.**
Para usar la aplicación hay que arrancar, en este orden: MongoDB → backend → frontend (ver apartado 2).

**Dónde viven ahora los datos:** en **MongoDB**, base de datos `catalogo`, colección `productos` (ficheros en `~/mongodb/datos`).
- Sobreviven a recargar la página, a reiniciar el backend y a apagar el ordenador.
- Se pierden solo si se borran expresamente (o se borra la carpeta `~/mongodb/datos`).
- Recorrido: navegador → `fetch` → NestJS (valida con el DTO) → Mongoose → MongoDB, y vuelta.

---

## 2. Entorno (cómo está montado)

| Pieza | Situación |
|---|---|
| Sistema | macOS, zsh. Usuario `alumne_mati1` **sin permisos de administrador** (no puede escribir en `/Applications` ni usar `sudo`). |
| Node.js / npm | v26.13.1 / 11.20.0, en `/usr/local/bin`. |
| Navegadores | Google Chrome, Safari. |
| Servidor local | **`live-server`** (paquete npm) ejecutado con `npx`, puerto **5500**, sirve la carpeta `frontend/`. |
| Editor | **VS Code**, instalado en `~/Applications` (carpeta personal). Se usa **solo como editor**, no para servir la página. |
| No disponible | Homebrew, Command Line Tools de Apple (por tanto, tampoco `python3`). |
| Git | Se usa desde la fase 2 (D18). Git 2.39.5 (Apple), instalado con las Command Line Tools en `/Library/Developer/CommandLineTools`. |
| CLI de Nest | `@nestjs/cli` 12.0.15, instalada con `npm install -g` en `~/.npm-global` (carpeta personal, ya en el PATH; no requiere administrador). |
| Backend | NestJS 12 en `backend/`, puerto **3000**. Proyecto en modo ESM (las importaciones terminan en `.js`). |
| MongoDB | **8.0.38** (servidor `mongod`) y **mongosh 2.14.1**, binarios oficiales en `~/mongodb/bin` (sin Homebrew ni administrador; no están en el PATH, se usan con la ruta completa). Datos en `~/mongodb/datos`, registro en `~/mongodb/mongod.log`. Escucha solo en `127.0.0.1:27017`. |
| Visor de MongoDB | **MongoDB Compass 1.53.2** en `~/Applications` (`.dmg` oficial de GitHub, verificado con SHA-256). Conexión: `mongodb://127.0.0.1:27017/catalogo`. |
| GitHub | Remoto `origin` → `https://github.com/andrewtoch-git/DEL_PRUEBACIFO01.git` (público). Token personal en el llavero de macOS (D20). |

### Arrancar el frontend
Desde una terminal en `actividad01`:
```
npx live-server --host=127.0.0.1 --port=5500 frontend
```
Abrir `http://127.0.0.1:5500`. Parar con **Ctrl+C**. El servidor solo funciona mientras esa terminal está abierta.

### Arrancar el backend
Desde otra terminal en `actividad01/backend`:
```
npm run start:dev
```
Escucha en `http://localhost:3000` y se reinicia solo al guardar cambios. Parar con **Ctrl+C**.

### Arrancar MongoDB
En otra terminal (cualquier carpeta):
```
~/mongodb/bin/mongod --dbpath ~/mongodb/datos --bind_ip 127.0.0.1 --port 27017 --logpath ~/mongodb/mongod.log
```
Consola para ver los datos: `~/mongodb/bin/mongosh mongodb://127.0.0.1:27017/catalogo`. Parar `mongod` con **Ctrl+C**.

---

## 3. Estructura de ficheros actual

```
actividad01/
├── .git/                   ← repositorio de Git (oculto; guarda la historia)
├── .gitignore              ← ficheros que Git ignora (.DS_Store, node_modules/, dist/, *.tsbuildinfo, .env)
├── CLAUDE.md               ← instrucciones del profesor (adaptado: D16, D18)
├── README.md               ← arranque y estado de las fases
├── docs/
│   ├── contexto.md         ← ESTE fichero
│   ├── bitacora.md
│   └── glosario.md
├── backend/                ← NestJS (bloque 2), generado con la CLI
│   ├── .env                ← configuración local (MONGODB_URI, PORT). NO se sube a GitHub
│   ├── .env.example        ← plantilla del .env (sí se sube)
│   ├── package.json        ← dependencias y scripts (start:dev...)
│   └── src/
│       ├── main.ts         ← arranque: carga .env, CORS, validación y escucha en el puerto
│       ├── app.module.ts   ← módulo raíz
│       ├── app.controller.ts ← GET / → "¡Hola desde el backend!"
│       ├── app.service.ts
│       └── productos/      ← recurso productos (fase 5)
│           ├── producto.schema.ts        ← esquema de MongoDB (fase 9; sustituye a producto.ts)
│           ├── dto/                      ← reglas de entrada (fase 6)
│           │   ├── crear-producto.dto.ts
│           │   └── actualizar-producto.dto.ts
│           ├── productos.module.ts
│           ├── productos.controller.ts   ← rutas /productos (CRUD)
│           └── productos.service.ts      ← lógica + datos
└── frontend/
    ├── index.html          ← formulario + tabla con 3 productos de ejemplo (fase 1)
    ├── css/estilos.css     ← estilos (fase 2)
    └── js/app.js           ← comportamiento; desde la fase 7 habla con el backend con fetch
```

---

## 4. Decisiones tomadas

Numeradas para poder citarlas ("según la D7…"). Si una decisión cambia, no se borra: se marca como sustituida.

| # | Decisión | Motivo | Quién decidió |
|---|---|---|---|
| D1 | La raíz del proyecto es `actividad01/` (sin subcarpeta `catalogo-tecnologico/`). | `CLAUDE.md` ya está aquí. | Claude (delegado) |
| D2 | Cada fichero de código se crea en su fase (`index.html` fase 1, `estilos.css` fase 2, `app.js` fase 3). | Que cada fichero aparezca cuando se entiende para qué sirve. | Claude (delegado) |
| D3 | `backend/` no se crea hasta el bloque 2 (lo generará la CLI de Nest). | No adelantar piezas. | Claude (delegado) |
| D4 | ~~Servidor local: VS Code + extensión Live Server.~~ **Sustituida por D6.** | Era lo previsto en `CLAUDE.md`. | Usuario |
| D5 | VS Code instalado en `~/Applications` descargándolo de la web oficial, sin Homebrew ni `sudo`. | El usuario no es administrador y no hay Homebrew. | Claude (delegado) |
| D6 | **Servidor local: `live-server` con `npx`, puerto 5500, sirviendo `frontend/`.** | La extensión de VS Code no llegó a activarse (probable *modo restringido*) y el usuario prefirió no depender de VS Code. | Usuario |
| D7 | VS Code se conserva, solo como editor. | Hace falta un editor; TextEdit es incómodo para programar. | Usuario |
| D8 | Identificador de producto en bloques 1 y 2: número que va subiendo (1, 2, 3…). En el bloque 3, el `_id` de MongoDB (D39). | Lo más sencillo. | Claude (delegado) |
| D9 | Precio con hasta 2 decimales. | Son euros (céntimos). | Claude (delegado) |
| D10 | Los productos escritos a mano en la fase 1 se sustituirán en la fase 3 por los generados desde un array. | Así lo plantea `CLAUDE.md`. | Claude (delegado) |
| D11 | El listado se muestra en una **tabla** (`<table>`). | Datos con las mismas columnas: caso típico de tabla. | Usuario (aceptó la recomendación) |
| D12 | Se usa **validación HTML** (`required`, `minlength`, `maxlength`, `min`, `step`) desde la fase 1. | Forma parte de la estructura; en la fase 3 se compara con la validación en JS. | Usuario (aceptó la recomendación) |
| D13 | Valores de categoría sin tildes (`portatil`), texto visible con tildes (Portátil). | Convención de `CLAUDE.md`. | Claude |
| D14 | Estilo: cabecera azul, secciones como tarjetas blancas, botón Eliminar en rojo, colores en variables CSS. | Diseño sencillo y legible; colores centralizados. | Claude (delegado) |
| D15 | Se crea `docs/contexto.md` como registro vivo de todo el proyecto. | No perder el contexto entre sesiones. | Usuario |
| D16 | Se modifica `CLAUDE.md`: nueva regla 3.6 (leer y actualizar `contexto.md`), servidor local confirmado (`live-server`), raíz `actividad01/`, `contexto.md` en la estructura y en el cierre de fases/sesiones, y aviso sobre Homebrew en el bloque 3. | Que cualquier sesión nueva tenga en cuenta el registro y las decisiones. | Usuario |
| D17 | **El CRUD de la fase 3 usa `localStorage`** *(vigente solo en la fase 3; en la fase 7 lo sustituye `fetch`, D33)* (opción A: directamente, sin pasar antes por un array en memoria). Se acuerda la excepción a `CLAUDE.md` 5.4, que lo ponía fuera de alcance. | Decisión del usuario. Consecuencia aceptada: en el bloque 1 los datos **no** se pierden al recargar; el motivo del backend pasa a ser compartir los datos entre navegadores/equipos. | Usuario |
| D18 | **Se usa Git** (repositorio local, sin remotos). Se instala mediante las Command Line Tools de Apple (`xcode-select --install`). Autor de los commits: `andres <andresrodriguezinfo@gmail.com>`, configurado solo para este repositorio. Los commits llevan la línea `Co-Authored-By: Claude`. Primer commit titulado "fase 1", aunque incluye también la fase 2. Se actualiza `CLAUDE.md` (apartados 4 y 5.4), que antes prohibía Git. | Petición del usuario: llevar control de versiones del proyecto. | Usuario |
| D19 | Se crea `.gitignore` con `.DS_Store`. | Finder crea esos ficheros solo; no son del proyecto. | Usuario |
| D20 | **Repositorio conectado a GitHub**: `https://github.com/andrewtoch-git/DEL_PRUEBACIFO01.git` (remoto `origin`, **público**). Autenticación por **HTTPS + token personal**, guardado en el llavero de macOS (lo guardó Claude a petición del usuario). Se mantiene el email real en los commits (visible públicamente, aceptado por el usuario). Se actualiza `CLAUDE.md` (apartado 4). | Petición del usuario. HTTPS + token elegido frente a SSH. | Usuario |
| D21 | Fase 3: si el almacén está vacío, se cargan 3 productos de ejemplo. | No empezar con la tabla vacía. | Usuario (aceptó la recomendación) |
| D22 | Fase 3: confirmar antes de eliminar con `confirm()`. | Lo más sencillo; evita borrados por error. | Usuario (aceptó la recomendación) |
| D23 | Fase 3: validación doble (HTML + JS, con `trim()`). | No confiar en lo que llega; ejemplo: un nombre de 2 espacios pasa el HTML pero no el JS. | Usuario (aceptó la recomendación) |
| D24 | Fase 3: `app.js` en 4 partes (datos, validación, interfaz, eventos). Las funciones de datos son **síncronas**; en la fase 7, al usar `fetch`, pasarán a ser asíncronas y quien las llama necesitará `await`. | Simplicidad ahora; la asincronía se aprende en la fase 7. | Claude |
| D25 | Se mantiene el orden de `CLAUDE.md`: bloque 2 (NestJS) antes que MongoDB (bloque 3). | El navegador nunca habla directamente con MongoDB; sin backend no habría nada que lo usara. | Usuario |
| D26 | CLI de Nest instalada de forma global (`npm install -g`), que en este equipo va a `~/.npm-global`. Proyecto generado con `nest new backend --package-manager npm --skip-git`. | Lo previsto en `CLAUDE.md`; `--skip-git` evita un repositorio Git dentro del nuestro. | Claude (delegado) |
| D27 | Limpieza de lo que añadió la CLI 12 sin pedirlo: se desinstalan `@nestjs/observe` (monitorización externa) y `@nestjs/mau` (despliegue), se quita el script `deploy` y se borran `backend/CLAUDE.md`, `AGENTS.md`, `.claude/skills/` y `.agents/skills/`. | Piezas no previstas; los ficheros para agentes de IA contenían instrucciones que chocaban con las del profesor. | Usuario (aprobó al pedir terminar las fases) |
| D28 | Se añaden `node_modules/` y `dist/` al `.gitignore` de la raíz. | Con `--skip-git` la CLI no creó `.gitignore`; sin esto se subirían cientos de MB de librerías. | Claude |
| D29 | Los tests generados por Nest se conservan sin usar (solo se actualizó el texto esperado del saludo). | Tests fuera de alcance; borrarlos obligaría a tocar más configuración. | Claude (delegado) |
| D30 | API en memoria: array en `ProductosService` con 3 productos de ejemplo e `id` numérico (`siguienteId`). `ParseIntPipe` convierte `:id` a número (400 si no lo es). `NotFoundException` → 404. `DELETE` responde 204. Nombres de métodos en español (`crear`, `listar`, `obtenerUno`, `actualizar`, `eliminar`). | Lo pedido en `CLAUDE.md` 5.2; códigos de estado estándar. | Claude (delegado) |
| D31 | Validación con DTO + `class-validator` y `class-transformer` (instalados en `backend/`). `ValidationPipe` global con `whitelist`, `forbidNonWhitelisted` y `transform`. Mensajes en español. Los textos se recortan (`trim`) con `@Transform`. `ActualizarProductoDto` repite las reglas con `@IsOptional` en vez de usar `PartialType` (evita otra librería). | Reglas de `CLAUDE.md` 5.1; "no confiar en lo que llega del cliente". | Claude (delegado) |
| D32 | En `actualizar`, se copian solo los campos con valor (no `Object.assign`). | Error detectado: con `transform: true` y `target ES2023`, los campos no enviados existen como `undefined` y borraban los datos. | Claude |
| D33 | Fase 7: la parte 1 de `app.js` usa `fetch` contra `http://localhost:3000/productos` en lugar de `localStorage`. Las funciones de datos pasan a `async` y quien las llama usa `await` (como anticipaba D24). Función común `peticion()` que convierte los errores HTTP y de red en mensajes legibles. Se mantiene la validación del frontend. | `CLAUDE.md` fase 7; separación de la capa de datos. | Claude (delegado) |
| D34 | CORS: `app.enableCors({ origin: ['http://127.0.0.1:5500', 'http://localhost:5500'] })`. Solo nuestro frontend, no `*`. | Se observó primero el error real en Chrome; autorizar solo lo necesario. | Claude (delegado) |
| D35 | MongoDB instalado con los **binarios oficiales** (`.tgz` de fastdl.mongodb.org y `.zip` de mongosh en GitHub), verificados con SHA-256 y copiados a `~/mongodb/bin`. Sustituye a la instalación con Homebrew prevista en `CLAUDE.md`. | El equipo no tiene Homebrew ni permisos de administrador. | Claude (delegado) |
| D36 | Versiones: MongoDB **8.0.38** (rama madura, compatible con Mongoose) y mongosh **2.14.1** (no la publicada el día anterior). | Estabilidad y prudencia con versiones recién publicadas. | Claude (delegado) |
| D37 | `mongod` escucha solo en `127.0.0.1` (no en la red del aula). No se añade `~/mongodb/bin` al PATH (no se toca `~/.zshrc`). | Seguridad y no modificar la configuración del sistema sin necesidad. | Claude (delegado) |
| D38 | Persistencia con `@nestjs/mongoose` 12 + `mongoose` 9. Esquema `Producto` en `producto.schema.ts` (sustituye a la interfaz `producto.ts`, borrada). Fechas automáticas `creadoEn` / `actualizadoEn`. Sin campo `__v`. | `CLAUDE.md` fase 9; fechas sugeridas en 5.1. | Claude (delegado) |
| D39 | Al enviar JSON, el `_id` se convierte en `id` (texto) y se quita `_id`. Un id con formato imposible responde 404 (igual que uno inexistente). | Que el **frontend no cambie**: sigue usando `producto.id`. | Claude (delegado) |
| D40 | Configuración en `backend/.env` (`MONGODB_URI`, `PORT`), leído con `process.loadEnvFile()` de Node (sin librería extra) y `MongooseModule.forRootAsync`. Se sube `.env.example`; `.env` va al `.gitignore`. | `CLAUDE.md` 6: configuración separada del código; menos dependencias. | Claude (delegado) |
| D41 | La colección empieza vacía; los 3 productos de ejemplo se crearon **a través de la API** con `curl`. | Ejercitar el `POST` real contra la base de datos. | Claude (delegado) |
| D42 | Visor gráfico: **MongoDB Compass 1.53.2** (previsto en `CLAUDE.md` 4.1), instalado en `~/Applications` copiándolo del `.dmg` oficial, sin administrador. No la 1.53.3, publicada ese mismo día. | Petición del usuario: ver los datos con una interfaz visual. | Usuario |

---

## 5. Registro de sesiones

### Sesión 1 — 2026-11-19 y 2026-11-20

**Fase 0 — Entorno mínimo**
- Lectura y resumen de `CLAUDE.md`; preguntas de dudas (resueltas en D1–D3, D8–D10).
- Comprobaciones de solo lectura: Node y npm presentes; sin editor, sin Homebrew, sin Command Line Tools; usuario no administrador.
- Instalado VS Code en `~/Applications` y la extensión Live Server (D4, D5). Se borró después el `.zip` de descarga.
- **Problema:** Live Server no arrancaba. Diagnóstico con los registros de VS Code: la extensión nunca se activaba
  (probable *modo restringido*) y la ventana se cerraba; la página se abría como `file://` (sin servidor).
- **Solución:** `live-server` desde la terminal con `npx` (D6). Verificado: puerto 5500 escuchando, respuesta `200`.
- Se observó la primera petición HTTP: `GET /favicon.ico` → `404`.
- Creados `README.md`, `docs/bitacora.md`, `docs/glosario.md` y la estructura de carpetas.
- Nota: Claude Code bloqueó por permisos un intento de abrir VS Code desde la terminal; se resolvió abriéndolo a mano.

**Fase 1 — Estructura (HTML)**
- `frontend/index.html` con cabecera, zona de mensajes vacía (`#mensajes`), formulario de 6 campos con
  validación HTML y tabla con 3 productos de ejemplo y botones Editar/Eliminar (D11–D13).
- Los botones aún no hacen nada (llega en la fase 3).
- Aclaración: el navegador **renderiza** el HTML; el código se ve con Cmd+Opción+U o las DevTools.
- Aclaración: "deploy" = publicar en internet (fuera de alcance); aquí solo hay servidor local de desarrollo.

**Fase 2 — Presentación (CSS)**
- Creado `frontend/css/estilos.css` y enlazado con `<link>` en `index.html` (única línea añadida al HTML) (D14).
- Verificado que el servidor entrega `index.html` y `estilos.css` con `200`.
- Revisión visual hecha por Claude (el usuario estaba en pausa) con capturas de Chrome headless: correcta en escritorio y en pantalla estrecha.
  Una primera captura a 400 px parecía rota: Chrome headless no baja de 500 px de ancho (artefacto de la herramienta, no del CSS).
- **Fase 2 cerrada.**

**Creado este fichero** `docs/contexto.md` (D15) y **modificado `CLAUDE.md`** para incluirlo (D16).
Actualizados también `bitacora.md` (fases 1 y 2), `glosario.md` (términos de las fases 1 y 2) y `README.md`.

**Decisión sobre la fase 3:** CRUD con `localStorage` (D17). Se señaló el conflicto con `CLAUDE.md` 5.4 y el usuario eligió la opción A.
El usuario pidió **no avanzar ningún paso** por ahora.

**Git (D18):** el usuario pidió añadir Git antes de seguir. Se instalaron las Command Line Tools con `xcode-select --install`
(no pidió contraseña de administrador). Se creó el repositorio con `git init`, se configuró el autor solo para este
repositorio y se hizo el **primer commit, "fase 1"** (`ccb1b7d`), con todo el proyecto hasta la fase 2.
Los `.DS_Store` quedaron fuera; después se creó `.gitignore` para ignorarlos (D19) y se guardó en el commit "Añadir .gitignore".

**GitHub (D20):** se añadió el remoto `origin` y se hizo el commit "Conectar con GitHub". El primer `push` sin credenciales falló
(`could not read Username`: GitHub exige identificarse para subir). El usuario creó un token *fine-grained* y se lo pasó a Claude,
que lo guardó en el llavero de macOS con `git credential approve` (no está en la URL ni en ningún fichero) e hizo
`git push -u origin main`. Verificado: GitHub tiene los 3 commits (`5f6dbe3` en `main`) y `main` sigue a `origin/main`.

---

**Cierre de la fase 2:** commit "Cerrar fase 2" subido a GitHub (el push usó el token del llavero sin pedir nada).

**Fase 3 — Comportamiento (JS + localStorage)**
- Plan aprobado con D21–D23; el usuario pidió terminar la fase entera de una vez.
- Creado `frontend/js/app.js` (D24). `index.html`: quitadas las filas escritas a mano (el `<tbody>` queda vacío),
  añadidos `<script src="js/app.js" defer>` y los `id` `titulo-formulario` y `boton-guardar`.
  `estilos.css`: estilos `.mensaje`, `.mensaje-exito`, `.mensaje-error`.
- Verificación: `node --check` (sintaxis) y una página de prueba en Chrome headless que usa la app real:
  19 comprobaciones correctas (listado, validación, crear, editar, cancelar, eliminar con y sin confirmación,
  seguridad con `textContent`) y una segunda carga que confirma que los datos **persisten al recargar**.
- Incidencia en la prueba: Chrome headless se quedaba colgado por el script de recarga que inyecta `live-server`
  (mantiene una conexión abierta). Se quitó ese script de la página de prueba.
- **Bloque 1 cerrado.**
- Commit "Fase 3: CRUD con localStorage" subido a GitHub. El usuario quería ir a MongoDB; se le explicó el orden y eligió seguirlo (D25).

**Fase 4 — Backend mínimo (NestJS)**
- Comprobado: npm instala lo "global" en `~/.npm-global` (sin administrador); puerto 3000 libre.
- `npm install -g @nestjs/cli` → versión 12.0.15. `nest new backend --package-manager npm --skip-git`.
- **Sorpresa:** la CLI 12 añadió monitorización (`@nestjs/observe`), herramientas de despliegue (`@nestjs/mau`) y ficheros
  de instrucciones para agentes de IA, e imprimió un mensaje dirigido a "agentes" pidiendo conectar la monitorización.
  Claude no siguió esas instrucciones (no vienen del usuario) y propuso limpiarlo todo (D27). No creó `.gitignore` (D28).
- `main.ts`, `app.module.ts`, `app.controller.ts`, `app.service.ts` reescritos limpios y comentados.
- Experimento: el saludo pasa de "Hello World!" a "¡Hola desde el backend!".
- Verificado con `curl -i http://localhost:3000/` → `HTTP/1.1 200 OK`, `¡Hola desde el backend!`.

**Fase 5 — API en memoria**
- Recurso `productos` (módulo, controlador, servicio, interfaz `Producto`) registrado en `AppModule` (D30).
- Pruebas con `curl`: listar 200, uno 200, crear 201, editar 200, eliminar 204, no existe 404, id no numérico 400.
- Lección: un `POST` con `{"nombre":"","precio":"gratis","hackeo":true}` se aceptó (201) → hace falta validar (fase 6).

**Fase 6 — Validación**
- `npm install class-validator class-transformer`. DTOs `CrearProductoDto` y `ActualizarProductoDto`; `ValidationPipe` global (D31).
- Pruebas con `curl`: datos basura → 400 con 9 mensajes (incluido "property hackeo should not exist"); nombre de 2 espacios → 400;
  precio con 3 decimales y stock 2.5 → 400; creación correcta → 201 con espacios recortados y descripción `""`.
- **Error encontrado y corregido:** `PATCH {"precio":999.5}` dejaba el producto como `{"id":1,"precio":999.5}` (D32).
  Tras corregirlo, el PATCH cambia solo lo enviado.

**Fase 7 — Conexión frontend ↔ backend**
- `app.js`: parte 1 reescrita con `fetch`; las demás solo añaden `async`/`await` y manejo de errores (D33).
- **CORS observado** en Chrome headless (página servida desde `http://127.0.0.1:5500`):
  *"blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present"*. El servidor respondía 200 (visto con `curl`),
  pero el navegador ocultaba la respuesta; el frontend mostraba "No se puede conectar con el servidor".
- Solución: `enableCors` con los orígenes del frontend (D34). Comprobado: origen autorizado recibe la cabecera; uno ajeno no.
- Prueba automática en Chrome headless: listar, crear, editar (GET :id + PATCH), eliminar y rechazo 400 del servidor. Todo OK.
- Para las pruebas, `live-server` se reinició montando la carpeta temporal de Claude en `/__prueba__` (no afecta al frontend).
- **Bloque 2 cerrado.**

**Fase 8 — MongoDB**
- Mac `arm64`, macOS 15.5. Versiones consultadas en `downloads.mongodb.org/current.json` y en la API de GitHub de mongosh.
- Descargas verificadas con SHA-256 (ambas OK), instaladas en `~/mongodb/bin` (D35–D37); descargas temporales borradas.
- `mongod` arrancado en segundo plano; escuchando en `127.0.0.1:27017`.
- Con `mongosh`: `insertOne` en la colección `prueba_manual` de la base `catalogo` → MongoDB generó el `_id` (`ObjectId`).
  La base `catalogo` no existía antes: se crea al guardar el primer documento.

**Fase 9 — Persistencia (Mongoose)**
- `npm install @nestjs/mongoose mongoose` (compatibles con NestJS 12). Esquema, servicio `async` con el modelo, controlador con `id` de texto (D38, D39).
- `.env` + `.env.example` + `.gitignore` (D40). Error momentáneo al guardar `app.module.ts` antes que `main.ts`:
  `The uri parameter ... got "undefined"` (aún no se cargaba el `.env`); se resolvió al guardar `main.ts`.
- Pruebas con `curl`: lista vacía → 3 `POST` (201) → GET, PATCH parcial (cambia `actualizadoEn`), POST inválido 400, id `abc` 404, id inexistente 404.
- `mongosh` muestra los documentos con `_id` y fechas.
- **Persistencia comprobada:** backend parado (000) y arrancado de nuevo → los 3 productos siguen, con el stock editado.
- **Frontend sin cambios** (`git diff` vacío desde la fase 7) y la prueba automática del navegador pasa entera.
- `CLAUDE.md` actualizado: MongoDB con binarios en `~/mongodb` en vez de Homebrew.
- **Bloque 3 (salvo la fase 10 de repaso) cerrado.**

**Fase 10 — Repaso**
- Se siguió el producto "Ratón inalámbrico MX" por las 16 etapas (ida y vuelta) con `curl -v` (mismo mensaje que el navegador)
  y `mongosh`. Tabla completa con referencias `fichero:línea` en `docs/bitacora.md`. El producto se deja en la base de datos.
- Se mostró al usuario la web en su navegador y MongoDB en una ventana de Terminal con `mongosh`.
- A petición del usuario, se instaló y abrió **MongoDB Compass** como visor gráfico (D42).

## 6. Pendientes y preguntas abiertas

- [x] Revisar el estilo de la fase 2 (capturas de Chrome headless a 1280 y 600 px).
- [x] Cerrar fase 2 (bitácora, glosario, README).
- [ ] Opcional: evitar que el precio se parta en dos líneas en pantallas estrechas.
- [x] Instalar Git y hacer el primer commit "fase 1" (D18).
- [x] Conectar con GitHub y hacer el primer `push` (D20).
- [ ] Revocar el token de GitHub cuando deje de usarse (se compartió en la conversación con Claude).
- [x] Fase 3 (con `localStorage`, D17).
- [ ] Que el usuario pruebe la aplicación en su navegador (MongoDB + backend + frontend arrancados).
- [x] Fase 10: repaso (recorrido de un dato por todas las piezas).
- [ ] Opcional: los tests generados por Nest no se han adaptado (el e2e necesitaría MongoDB).
- [x] Commit y push de la fase 3.
- [x] Decidir el orden: se sigue el de `CLAUDE.md` (D25).
- [x] Fase 4 (NestJS mínimo).
- [ ] Decidir si se actualiza `CLAUDE.md` 5.4 para reflejar la excepción de `localStorage` (de momento solo consta en D17).
- [x] Bloque 3: instalar MongoDB sin Homebrew ni administrador (D35).
- [ ] Opcional: añadir `~/mongodb/bin` al PATH para escribir solo `mongod` / `mongosh`.
- [ ] Opcional: borrar la colección de prueba `prueba_manual` cuando ya no haga falta.
