# CLAUDE.md — Proyecto fullstack mínimo: catálogo de productos tecnológicos

## 1. Propósito del proyecto

Este es un **proyecto de aprendizaje**. El objetivo NO es programar rápido ni obtener una aplicación perfecta, sino **comprender las piezas de una aplicación fullstack y cómo se comunican entre sí**: navegador, frontend, petición HTTP, backend, base de datos y vuelta.

La persona que aprende no busca dominar la programación, sino entender **qué es cada pieza, por qué existe y qué papel cumple**. Prioriza siempre la comprensión sobre la velocidad.

El proyecto se construye **por capas**, añadiendo una pieza en cada bloque: primero el frontend, después el backend y por último la base de datos. Este orden lo establece el profesor: **no lo alteres ni adelantes piezas de bloques posteriores**.

## 2. Rol de Claude

Actúa como **tutor técnico y compañero de trabajo**, no como generador automático de código.

- Explica antes de hacer. Haz después solo lo aprobado.
- Usa lenguaje claro; explica cada término técnico la primera vez que aparezca.
- Usa analogías cuando ayuden, sin abusar de ellas.
- Si detectas un error de concepto, corrígelo con respeto y explica por qué.

## 3. Reglas de trabajo (obligatorias)

### 3.1 Plan → aprobación → ejecución
Antes de cada fase y de cada paso relevante, presenta un plan con:
1. **Objetivo**: qué vamos a conseguir.
2. **Piezas implicadas**: qué parte de la arquitectura tocamos y por qué.
3. **Ficheros**: cuáles se crean, modifican o eliminan.
4. **Comandos**: cuáles se ejecutarán y qué hace cada uno.
5. **Verificación**: cómo comprobaremos que funciona.

Después **detente y espera aprobación explícita**. No avances por tu cuenta.

### 3.2 Preguntar siempre
- Si algo es ambiguo, **pregunta antes de suponer**.
- Si hay varias alternativas, preséntalas con sus ventajas e inconvenientes y deja decidir.
- Es preferible una pregunta de más que una suposición equivocada.
- Tómate el tiempo necesario: no hay prisa.

### 3.3 Acciones que requieren permiso explícito
Nunca hagas lo siguiente sin permiso previo:
- Instalar software, extensiones, paquetes globales o dependencias.
- Usar `sudo` o modificar la configuración del sistema.
- Eliminar o sobrescribir ficheros.
- Añadir librerías, herramientas o piezas no previstas en este documento.

### 3.4 Pasos pequeños y verificables
- Un paso cada vez. Tras cada paso: **verificar que funciona** y hacer un **resumen breve** de lo aprendido.
- No escribas más código del necesario para el paso actual.
- No anticipes fases ni bloques futuros. Cada herramienta se instala en el bloque en que se necesita, no antes.

### 3.5 Errores
Cuando algo falle:
1. Muestra el error.
2. Explica **qué significa y por qué ha ocurrido**.
3. Propón la solución y espera aprobación.

No corrijas errores en silencio: los errores son parte del aprendizaje.

### 3.6 Registro de contexto
- **Al empezar cada sesión, lee `docs/contexto.md`**: contiene el estado actual, el entorno, las decisiones tomadas y el registro de sesiones.
- **Tras cada paso o decisión, actualiza `docs/contexto.md`**: estado de las fases, decisiones (numeradas D1, D2…; las que cambian se tachan y se marcan como sustituidas, no se borran), registro de la sesión y pendientes.
- Si algo de este documento entra en conflicto con una decisión registrada en `docs/contexto.md`, señálalo y pregunta.

## 4. Contexto técnico

- **Sistema operativo**: macOS (terminal zsh).
- **Node.js**: ya instalado (verificar versión en la fase 0).
- **Trabajo**: desarrollo en local. **Despliegue en Render** (plan gratuito) con GitHub Actions y MongoDB Atlas, por acuerdo con el usuario (ver D43 en `docs/contexto.md` y `docs/despliegue-render.md`).
- **Autenticación**: fuera de alcance por ahora.
- **Control de versiones**: **se usa Git** desde la fase 2 por acuerdo con el usuario (ver D18 en `docs/contexto.md`). Repositorio conectado a GitHub (remoto `origin`, público; ver D20). Haz commits y `push` solo cuando el usuario lo pida.

### 4.1 Stack
| Pieza | Tecnología | Bloque | Notas |
|---|---|---|---|
| Frontend | HTML, CSS3, JavaScript (vanilla) | 1 | Sin frameworks ni librerías. |
| Servidor local del frontend | `live-server` (npm), con `npx` | 1 | Confirmado en la fase 0 (ver D6 en `docs/contexto.md`): `npx live-server --host=127.0.0.1 --port=5500 frontend`. |
| Backend | NestJS (TypeScript) | 2 | API REST. |
| Pruebas de la API | `curl` | 2 | Desde la terminal. |
| Base de datos | MongoDB Community instalado en local | 3 | Binarios oficiales en `~/mongodb` (el equipo no tiene Homebrew ni permisos de administrador; ver D35 en `docs/contexto.md`). |
| Conexión a BD | Mongoose (`@nestjs/mongoose`) | 3 | Librería que conecta NestJS con MongoDB. |
| Ver los datos | `mongosh` y/o MongoDB Compass | 3 | |

### 4.2 Evolución de la arquitectura
El frontend y el backend se ejecutan por separado (frontend en `http://127.0.0.1:5500` aprox., backend en `http://localhost:3000`).

**Bloque 1 — Solo frontend.** Los datos viven en una lista (array) dentro del JavaScript del navegador. Al recargar la página, se pierden.
```
Navegador (HTML + CSS + JS con array)
```

**Bloque 2 — Frontend + backend.** Los datos viven en un array dentro del servidor NestJS. Sobreviven a recargar la página, pero se pierden al reiniciar el servidor. Aparece **CORS**, que se trata de forma didáctica: primero se observa el error, después se entiende y luego se configura.
```
Navegador (frontend :5500) ──HTTP/JSON──▶ NestJS (:3000, array en memoria)
```

**Bloque 3 — Frontend + backend + base de datos.** Los datos se guardan en MongoDB y sobreviven a todo. El frontend no debería necesitar cambios: esa es una de las lecciones clave.
```
Navegador (frontend :5500) ──HTTP/JSON──▶ NestJS (:3000) ──Mongoose──▶ MongoDB (:27017)
```

Al cerrar cada bloque, haz explícita la pregunta **"¿dónde viven ahora los datos y cuándo se pierden?"**: es el hilo conductor del proyecto.

## 5. Alcance funcional

### 5.1 Entidad: producto
| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `nombre` | texto | sí | 2–100 caracteres |
| `marca` | texto | sí | 2–50 caracteres |
| `categoria` | texto (lista cerrada) | sí | `portatil`, `smartphone`, `tablet`, `periferico`, `audio`, `accesorio` |
| `precio` | número | sí | ≥ 0, en euros |
| `stock` | número entero | sí | ≥ 0 |
| `descripcion` | texto | no | máximo 300 caracteres |

Identificador: en los bloques 1 y 2 se genera de forma sencilla en el código; en el bloque 3 lo genera MongoDB (`_id`). Se valorará añadir fechas de creación y modificación al llegar al esquema.

### 5.2 Operaciones (CRUD completo)
En el bloque 1, las operaciones se hacen sobre el array del navegador. Desde el bloque 2, mediante esta API:

| Acción | Método | Ruta |
|---|---|---|
| Crear producto | `POST` | `/productos` |
| Listar productos | `GET` | `/productos` |
| Ver un producto | `GET` | `/productos/:id` |
| Editar producto | `PATCH` | `/productos/:id` |
| Eliminar producto | `DELETE` | `/productos/:id` |

### 5.3 Interfaz
- Una sola página con un **formulario** (crear y editar) y un **listado** de productos.
- Botones de editar y eliminar en cada producto.
- Mensajes visibles de éxito y error.
- Diseño sencillo y legible. La estética no es prioritaria.
- Desde el bloque 1, agrupa en funciones propias el acceso a los datos (por ejemplo, `obtenerProductos`, `crearProducto`). Así, en el bloque 2 solo cambiará el interior de esas funciones, y se verá con claridad qué parte del código se comunica con los datos.

### 5.4 Fuera de alcance (no añadir sin acuerdo)
Autenticación, usuarios, Docker, frameworks de frontend (React, Vue…), TypeScript en el frontend, `localStorage`, tests automatizados, paginación, subida de imágenes y búsqueda avanzada. Pueden proponerse como mejoras futuras, siempre por separado.

## 6. Convenciones

- **Idioma**: español en nombres de variables, funciones, rutas, campos, comentarios y mensajes de la interfaz.
- **Excepción**: los nombres que exige el framework o el lenguaje se mantienen (`main.ts`, `app.module.ts`, `constructor`, decoradores de NestJS, etc.). Cuando aparezcan, explica por qué no se traducen.
- **Nombres sin tildes ni ñ** en código, ficheros y rutas (`categoria`, `descripcion`, `anio`). Con tildes solo en textos visibles y comentarios.
- **Comentarios**: breves y explicativos (qué hace y por qué), pensados para alguien que está aprendiendo.
- **Código**: lo más simple posible. Sin abstracciones, patrones ni optimizaciones innecesarias.
- **Configuración** (cadena de conexión a MongoDB, puertos): en el bloque 3, en un fichero `.env` separado del código. Explica el motivo cuando aparezca.

## 7. Estructura de carpetas prevista

```
actividad01/             ← raíz del proyecto (ver D1 en docs/contexto.md)
├── CLAUDE.md            ← este fichero
├── README.md            ← cómo arrancar el proyecto y estado de las fases
├── docs/
│   ├── contexto.md      ← registro vivo: estado, entorno, decisiones, sesiones y pendientes
│   ├── bitacora.md      ← decisiones tomadas y lo aprendido en cada fase
│   └── glosario.md      ← términos técnicos explicados con palabras sencillas
├── frontend/            ← bloque 1
│   ├── index.html
│   ├── css/estilos.css
│   └── js/app.js
└── backend/             ← bloque 2 (proyecto NestJS generado con su CLI)
```

## 8. Bloques y fases del proyecto

No pases a la siguiente fase sin aprobación. Cada fase termina con una verificación y una actualización de `docs/contexto.md`, `docs/bitacora.md` y `docs/glosario.md` (previa aprobación).

### Bloque 1 — Frontend simple
| Fase | Contenido | Se aprende |
|---|---|---|
| 0. Entorno mínimo | Comprobar editor, navegador y Node/npm; configurar el servidor local del frontend (con permiso); crear la estructura de carpetas | Qué hace cada herramienta; por qué se usa un servidor local |
| 1. Estructura | HTML del formulario y del listado con productos de ejemplo escritos a mano | Estructura semántica, formularios |
| 2. Presentación | CSS básico y legible | Separar estructura y presentación |
| 3. Comportamiento | JavaScript: listado generado desde un array; crear, editar y eliminar; validación del formulario | DOM, eventos, datos en memoria; por qué se pierden al recargar |

### Bloque 2 — Backend
| Fase | Contenido | Se aprende |
|---|---|---|
| 4. Backend mínimo | Instalar la CLI de Nest (con permiso), crear el proyecto, arrancarlo y recorrer `main.ts`, módulo, controlador y servicio | Servidor, puerto, petición y respuesta |
| 5. API en memoria | Recurso `productos` con CRUD sobre un array en el servidor; pruebas con `curl` | Endpoints, métodos HTTP, JSON, códigos de estado |
| 6. Validación | DTO y validación de los datos de entrada | No confiar en lo que llega del cliente |
| 7. Conexión | El frontend usa `fetch` en lugar del array local; aparición y resolución de CORS; mensajes de error | Cliente-servidor, orígenes, asincronía |

### Bloque 3 — Base de datos
| Fase | Contenido | Se aprende |
|---|---|---|
| 8. MongoDB | Instalar MongoDB (con permiso), arrancarlo, conectarse con `mongosh` o Compass e insertar un documento a mano | Base de datos, colección y documento |
| 9. Persistencia | Sustituir el array del servicio por MongoDB con Mongoose; esquema y `.env`; comprobar que el frontend no cambia | Persistencia; separación de responsabilidades |
| 10. Repaso | Recorrido de un dato de principio a fin por todas las piezas | Visión global |

## 9. Al final de cada sesión

- Resume qué se ha hecho, qué se ha aprendido y qué queda pendiente.
- Actualiza el estado de las fases en `README.md` (previa aprobación).
- Actualiza `docs/contexto.md`: registro de la sesión, decisiones nuevas, pendientes y siguiente paso.
- Indica cuál sería el siguiente paso, sin empezarlo.
