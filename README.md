# Catálogo de productos tecnológicos

Proyecto de aprendizaje: aplicación fullstack mínima en local, construida por capas
(frontend → backend → base de datos). Las instrucciones completas están en `CLAUDE.md`.

> **Contexto completo** (decisiones, registro de sesiones, pendientes): `docs/contexto.md`.

## Cómo arrancar el proyecto

### Frontend (bloque 1)
1. Abrir una terminal en la carpeta `actividad01`.
2. Arrancar el servidor local:
   ```
   npx live-server --host=127.0.0.1 --port=5500 frontend
   ```
   - `npx` descarga (la primera vez) y ejecuta el paquete `live-server` sin instalarlo de forma global.
   - `--host` y `--port`: dirección y puerto donde escucha el servidor.
   - `frontend`: carpeta que se sirve.
3. El navegador abre `http://127.0.0.1:5500`. Al guardar un fichero, la página se recarga sola.
4. Para parar el servidor: **Ctrl+C** en esa terminal.

### Backend (bloque 2)
1. Abrir **otra** terminal en `actividad01/backend`.
2. La primera vez (o tras descargar el proyecto): `npm install` (descarga las librerías en `node_modules/`).
3. Arrancar: `npm run start:dev` → escucha en `http://localhost:3000` y se reinicia al guardar cambios.
4. Probar: `curl http://localhost:3000/`.

## Estado de las fases

| Bloque | Fase | Estado |
|---|---|---|
| 1 — Frontend | 0. Entorno mínimo | ✅ Completada |
| 1 — Frontend | 1. Estructura | ✅ Completada |
| 1 — Frontend | 2. Presentación | ✅ Completada |
| 1 — Frontend | 3. Comportamiento | ✅ Completada (CRUD con `localStorage`) |
| 2 — Backend | 4. Backend mínimo | ✅ Completada |
| 2 — Backend | 5. API en memoria | ✅ Completada |
| 2 — Backend | 6. Validación | ✅ Completada |
| 2 — Backend | 7. Conexión | ✅ Completada |
| 3 — Base de datos | 8. MongoDB | ⏳ Pendiente |
| 3 — Base de datos | 9. Persistencia | ⏳ Pendiente |
| 3 — Base de datos | 10. Repaso | ⏳ Pendiente |
