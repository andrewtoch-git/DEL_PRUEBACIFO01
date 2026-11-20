# Glosario

Términos técnicos explicados con palabras sencillas, en el orden en que aparecen.

---

## Fase 0

- **Editor de código**: programa para escribir código (por ejemplo, VS Code). Colorea la sintaxis y ayuda a detectar errores.
- **live-server**: pequeño servidor local para desarrollo. Sirve una carpeta por HTTP y recarga el navegador al guardar cambios.
- **npx**: herramienta que viene con npm. Descarga un paquete (si hace falta) y lo ejecuta, sin instalarlo de forma global.
- **Proceso**: un programa en ejecución. El servidor existe mientras su proceso está vivo; Ctrl+C lo detiene.
- **Navegador**: programa que pide páginas web, las interpreta (HTML, CSS, JS) y las muestra. Ejecuta nuestro frontend.
- **DevTools**: herramientas de desarrollador del navegador (F12 o Cmd+Opción+I). Permiten ver el HTML, los errores y las peticiones.
- **Node.js**: programa que ejecuta JavaScript fuera del navegador. Lo usaremos en el bloque 2 para el backend.
- **npm**: gestor de paquetes de Node. Descarga e instala librerías hechas por otras personas.
- **Servidor local**: programa en tu propio ordenador que entrega ficheros o datos cuando alguien los pide por HTTP.
- **HTTP**: el "idioma" con el que el navegador y un servidor se piden y se envían cosas.
- **`http://` frente a `file://`**: con `http://` la página llega a través de un servidor; con `file://` el navegador la lee directamente del disco.
- **Puerto**: número que identifica qué programa atiende una petición dentro de un ordenador (5500 para Live Server, 3000 para el futuro backend).
- **`127.0.0.1` / `localhost`**: direcciones que significan "este mismo ordenador".
- **Terminal**: ventana donde se escriben comandos de texto. En este Mac usa la *shell* zsh.
- **Código de estado HTTP**: número con el que el servidor resume su respuesta. `200` = todo bien; `404` = no encontrado.
- **Renderizar**: lo que hace el navegador al convertir el código HTML en lo que ves en pantalla.
- **Código fuente**: el texto HTML tal cual, antes de que el navegador lo interprete.
- **`sudo`**: prefijo que ejecuta un comando con permisos de administrador. Solo se usa con permiso explícito.

## Fase 1

- **HTML**: lenguaje que describe la **estructura** de una página (títulos, formularios, tablas...).
- **Etiqueta**: cada pieza de HTML, como `<p>` o `<table>`. Casi todas tienen apertura y cierre (`<p>...</p>`).
- **Atributo**: dato extra dentro de una etiqueta, como `id="nombre"` o `required`.
- **HTML semántico**: usar la etiqueta que dice qué ES cada cosa (`<header>`, `<form>`, `<table>`), no solo cómo se ve.
- **Formulario (`<form>`)**: conjunto de campos para que el usuario introduzca datos.
- **`<label>`**: texto que describe un campo; con `for` queda enlazado a él.
- **Validación HTML**: reglas en los atributos (`required`, `min`...) que el navegador comprueba antes de enviar.
- **DOM**: el "árbol" de elementos que el navegador construye a partir del HTML. Es lo que se ve en DevTools → *Elements*.
- **Página estática**: página que se muestra pero no reacciona (aún sin JavaScript).
- **Desplegar (*deploy*)**: publicar una aplicación en un servidor de internet. Fuera de alcance en este proyecto.

## Fase 2

- **CSS**: lenguaje que decide la **presentación** (colores, tamaños, márgenes, posiciones).
- **Hoja de estilos**: fichero `.css` enlazado desde el HTML con `<link rel="stylesheet">`.
- **Selector**: la parte de una regla CSS que dice a qué elementos se aplica (`button`, `td button:last-child`).
- **Variable CSS**: valor con nombre (`--color-principal`) que se define una vez y se reutiliza.
- **Pseudoclase**: estado de un elemento, como `:hover` (ratón encima) o `:focus` (campo activo).
- **Media query**: reglas que solo se aplican en ciertas condiciones, por ejemplo pantallas estrechas.

## Fase 3

- **JavaScript**: lenguaje que da **comportamiento** a la página: reacciona a lo que hace el usuario y cambia el contenido.
- **Variable / constante**: nombre que guarda un valor. `let` puede cambiar; `const` no.
- **Función**: bloque de código con nombre que hace una tarea y se puede llamar cuando haga falta (`crearProducto(...)`).
- **Array (lista)**: colección ordenada de valores, como `[producto1, producto2]`.
- **Objeto**: conjunto de pares nombre-valor, como `{ nombre: 'Galaxy S24', precio: 899.99 }`.
- **Evento**: algo que ocurre en la página (un clic, enviar un formulario) y al que JavaScript puede reaccionar.
- **`addEventListener`**: "cuando ocurra este evento en este elemento, ejecuta esta función".
- **`preventDefault()`**: impide la acción por defecto del navegador (por ejemplo, recargar al enviar un formulario).
- **`localStorage`**: pequeño almacén del navegador que guarda texto de forma permanente, solo para esa web y ese navegador.
- **JSON**: formato de texto para representar datos (listas y objetos). `JSON.stringify` (objeto → texto) y `JSON.parse` (texto → objeto).
- **`textContent` / `innerHTML`**: el primero pone texto tal cual; el segundo lo interpreta como HTML (peligroso con datos del usuario).
- **`trim()`**: quita los espacios del principio y del final de un texto.
- **Expresión regular**: patrón para comprobar la forma de un texto, como `/^\d+$/` ("solo dígitos").
- **`defer`**: atributo de `<script>` que hace esperar al script hasta que el HTML esté cargado.
- **CRUD**: *Create, Read, Update, Delete*: crear, leer, actualizar y eliminar. Las 4 operaciones básicas sobre datos.

## Fase 4

- **Backend**: programa que se ejecuta en un servidor, recibe peticiones HTTP y devuelve datos.
- **Framework**: esqueleto de aplicación con reglas y piezas ya hechas; tú rellenas los huecos (NestJS).
- **NestJS**: framework para hacer backends con Node.js y TypeScript.
- **CLI**: programa de línea de comandos (aquí, `nest`) que genera y gestiona el proyecto.
- **TypeScript**: JavaScript con **tipos** (decir que algo es `string`, `number`...), que avisa de errores antes de ejecutar.
- **Compilar**: traducir TypeScript a JavaScript (se guarda en `dist/`), que es lo que Node ejecuta.
- **Dependencia**: librería de otros que usa nuestro proyecto. Se listan en `package.json` y se descargan en `node_modules/`.
- **Módulo (NestJS)**: agrupa controladores y servicios relacionados.
- **Controlador**: clase que recibe las peticiones de unas rutas y devuelve la respuesta.
- **Servicio**: clase con la lógica; el controlador le delega el trabajo.
- **Decorador**: etiqueta con `@` (`@Get()`, `@Controller()`) que da información a NestJS sobre una clase o función.
- **Inyección de dependencias**: NestJS crea los objetos y se los pasa a quien los necesita (por el `constructor`).
- **`async` / `await`**: forma de esperar a que termine algo que lleva tiempo sin bloquear el programa.
- **Cabeceras HTTP**: información que acompaña a una petición o respuesta (tipo de contenido, fecha...). Se ven con `curl -i`.
- **Modo watch**: el servidor vigila los ficheros y se reinicia solo al guardarlos.
