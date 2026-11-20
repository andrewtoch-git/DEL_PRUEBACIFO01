// config.js — CONFIGURACIÓN del frontend: a qué backend se conecta.
// Va separado de app.js por la misma razón que el .env del backend: la configuración
// cambia según dónde se ejecute la aplicación, el código no.
//
// - Si la página se abre en este ordenador (live-server: 127.0.0.1 o localhost) → backend local.
// - Si se abre desde Internet (Render) → backend publicado en Render.
//
// ⚠️ Tras crear el backend en Render, sustituye URL_BACKEND_RENDER por la dirección real
//    que te dé Render (la ves arriba en el panel del servicio). Ver docs/despliegue-render.md, paso 4.

const URL_BACKEND_LOCAL = 'http://localhost:3000';
const URL_BACKEND_RENDER = 'https://catalogo-backend.onrender.com';

const ES_LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

// "window.CONFIG" deja la configuración disponible para app.js (que se carga después)
window.CONFIG = {
  URL_API: (ES_LOCAL ? URL_BACKEND_LOCAL : URL_BACKEND_RENDER) + '/productos'
};
