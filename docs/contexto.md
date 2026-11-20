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
| 1 — Frontend | 2. Presentación (CSS) | 🔄 Hecha, pendiente de que la revises en el navegador |
| 1 — Frontend | 3. Comportamiento (JS) | ⏳ Pendiente |
| 2 — Backend | 4–7 | ⏳ Pendiente |
| 3 — Base de datos | 8–10 | ⏳ Pendiente |

**Siguiente paso:** ⏸️ **En pausa por indicación del usuario: no avanzar hasta que lo pida.**
Cuando se retome: revisar el estilo de la fase 2 → cerrar fase 2 → plan de la fase 3 (JavaScript: CRUD con `localStorage` según D17, listado, crear, editar, eliminar, validar).

**Dónde viven ahora los datos:** escritos a mano dentro de `index.html` (3 productos de ejemplo). No hay datos "vivos" todavía.
En la fase 3 vivirán en el `localStorage` del navegador (D17): sobreviven a recargar, pero solo existen en ese navegador de ese equipo.

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

### Arrancar el frontend
Desde una terminal en `actividad01`:
```
npx live-server --host=127.0.0.1 --port=5500 frontend
```
Abrir `http://127.0.0.1:5500`. Parar con **Ctrl+C**. El servidor solo funciona mientras esa terminal está abierta.

---

## 3. Estructura de ficheros actual

```
actividad01/
├── .git/                   ← repositorio de Git (oculto; guarda la historia)
├── .gitignore              ← ficheros que Git ignora (.DS_Store)
├── CLAUDE.md               ← instrucciones del profesor (adaptado: D16, D18)
├── README.md               ← arranque y estado de las fases
├── docs/
│   ├── contexto.md         ← ESTE fichero
│   ├── bitacora.md
│   └── glosario.md
└── frontend/
    ├── index.html          ← formulario + tabla con 3 productos de ejemplo (fase 1)
    ├── css/estilos.css     ← estilos (fase 2)
    └── js/                 ← vacía; app.js se crea en la fase 3
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
| D8 | Identificador de producto en bloques 1 y 2: número que va subiendo (1, 2, 3…). | Lo más sencillo. | Claude (delegado) |
| D9 | Precio con hasta 2 decimales. | Son euros (céntimos). | Claude (delegado) |
| D10 | Los productos escritos a mano en la fase 1 se sustituirán en la fase 3 por los generados desde un array. | Así lo plantea `CLAUDE.md`. | Claude (delegado) |
| D11 | El listado se muestra en una **tabla** (`<table>`). | Datos con las mismas columnas: caso típico de tabla. | Usuario (aceptó la recomendación) |
| D12 | Se usa **validación HTML** (`required`, `minlength`, `maxlength`, `min`, `step`) desde la fase 1. | Forma parte de la estructura; en la fase 3 se compara con la validación en JS. | Usuario (aceptó la recomendación) |
| D13 | Valores de categoría sin tildes (`portatil`), texto visible con tildes (Portátil). | Convención de `CLAUDE.md`. | Claude |
| D14 | Estilo: cabecera azul, secciones como tarjetas blancas, botón Eliminar en rojo, colores en variables CSS. | Diseño sencillo y legible; colores centralizados. | Claude (delegado) |
| D15 | Se crea `docs/contexto.md` como registro vivo de todo el proyecto. | No perder el contexto entre sesiones. | Usuario |
| D16 | Se modifica `CLAUDE.md`: nueva regla 3.6 (leer y actualizar `contexto.md`), servidor local confirmado (`live-server`), raíz `actividad01/`, `contexto.md` en la estructura y en el cierre de fases/sesiones, y aviso sobre Homebrew en el bloque 3. | Que cualquier sesión nueva tenga en cuenta el registro y las decisiones. | Usuario |
| D17 | **El CRUD de la fase 3 usa `localStorage`** (opción A: directamente, sin pasar antes por un array en memoria). Se acuerda la excepción a `CLAUDE.md` 5.4, que lo ponía fuera de alcance. | Decisión del usuario. Consecuencia aceptada: en el bloque 1 los datos **no** se pierden al recargar; el motivo del backend pasa a ser compartir los datos entre navegadores/equipos. | Usuario |
| D18 | **Se usa Git** (repositorio local, sin remotos). Se instala mediante las Command Line Tools de Apple (`xcode-select --install`). Autor de los commits: `andres <andresrodriguezinfo@gmail.com>`, configurado solo para este repositorio. Los commits llevan la línea `Co-Authored-By: Claude`. Primer commit titulado "fase 1", aunque incluye también la fase 2. Se actualiza `CLAUDE.md` (apartados 4 y 5.4), que antes prohibía Git. | Petición del usuario: llevar control de versiones del proyecto. | Usuario |
| D19 | Se crea `.gitignore` con `.DS_Store`. | Finder crea esos ficheros solo; no son del proyecto. | Usuario |

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
- Pendiente: revisión visual por parte del usuario.

**Creado este fichero** `docs/contexto.md` (D15) y **modificado `CLAUDE.md`** para incluirlo (D16).
Actualizados también `bitacora.md` (fases 1 y 2), `glosario.md` (términos de las fases 1 y 2) y `README.md`.

**Decisión sobre la fase 3:** CRUD con `localStorage` (D17). Se señaló el conflicto con `CLAUDE.md` 5.4 y el usuario eligió la opción A.
El usuario pidió **no avanzar ningún paso** por ahora.

**Git (D18):** el usuario pidió añadir Git antes de seguir. Se instalaron las Command Line Tools con `xcode-select --install`
(no pidió contraseña de administrador). Se creó el repositorio con `git init`, se configuró el autor solo para este
repositorio y se hizo el **primer commit, "fase 1"** (`ccb1b7d`), con todo el proyecto hasta la fase 2.
Los `.DS_Store` quedaron fuera; después se creó `.gitignore` para ignorarlos (D19) y se guardó en el commit "Añadir .gitignore".

---

## 6. Pendientes y preguntas abiertas

- [ ] Revisar en el navegador el estilo de la fase 2 y pedir cambios si hace falta.
- [ ] Cerrar fase 2 (bitácora, glosario, README).
- [x] Instalar Git y hacer el primer commit "fase 1" (D18).
- [ ] Plan de la fase 3 (con `localStorage`, D17).
- [ ] Decidir si se actualiza `CLAUDE.md` 5.4 para reflejar la excepción de `localStorage` (de momento solo consta en D17).
- [ ] Bloque 3: decidir cómo instalar MongoDB sin Homebrew ni permisos de administrador.
