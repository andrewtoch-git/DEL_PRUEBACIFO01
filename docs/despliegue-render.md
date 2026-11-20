# Guía de despliegue en Render (con GitHub Actions)

> Objetivo: publicar el catálogo en Internet para que cualquiera pueda usarlo desde su navegador.
> **Desplegar** = copiar la aplicación a ordenadores de un proveedor (Render) que la mantienen encendida y accesible.

---

## 0. Qué vamos a montar

En local teníamos tres servidores en tu Mac. En Internet serán tres servicios en la nube:

```
                 ┌──────────────── GitHub ────────────────┐
  git push  ───▶ │ repositorio  ──▶  GitHub Actions (CI)  │
                 └───────────────────────┬────────────────┘
                                         │ si todo va bien, Render despliega
                                         ▼  (render.yaml: autoDeployTrigger: checksPass)
 Navegador ──▶ Render Static Site ──▶ Render Web Service ──▶ MongoDB Atlas
 (cualquiera)   frontend/ (HTML,CSS,JS)   backend/ (NestJS)    (base de datos M0)
```

| Pieza | En local | En Internet | Plan gratuito |
|---|---|---|---|
| Frontend | `live-server` :5500 | **Render · Static Site** | Gratis |
| Backend | `npm run start:dev` :3000 | **Render · Web Service** | Gratis, con límites (ver abajo) |
| Base de datos | `mongod` en `~/mongodb` :27017 | **MongoDB Atlas · M0** | Gratis, 512 MB |
| Pruebas y despliegue | a mano | **GitHub Actions** | Gratis en repositorios públicos |

**¿Por qué MongoDB Atlas y no Render?** Render no ofrece MongoDB, y su plan gratuito no tiene discos permanentes:
un MongoDB dentro de Render perdería los datos en cada reinicio. Atlas es el servicio en la nube de la propia empresa MongoDB.

### Límites del plan gratuito (importante)
- El **backend se "duerme"** tras ~15 minutos sin visitas. La primera petición después tarda **hasta ~1 minuto**
  (Render lo vuelve a arrancar). Si la página dice "No se puede conectar", espera un poco y recarga.
- Render da un número limitado de horas gratis al mes para servicios web (suficiente para un proyecto así).
- Atlas M0: 512 MB de datos, de sobra para un catálogo.

---

## 1. Qué ficheros se han preparado (y por qué)

| Fichero | Para qué |
|---|---|
| `render.yaml` | **Blueprint** de Render: describe los dos servicios (backend y frontend) con toda su configuración. Render los crea solos. |
| `.github/workflows/ci-cd.yml` | **GitHub Actions**: en cada `git push` comprueba el frontend y compila y prueba el backend con un MongoDB temporal. Render **espera a que pase** antes de desplegar. |
| `backend/.node-version` | Versión de Node (24) que usarán Render y GitHub Actions. |
| `backend/src/main.ts` | Lee el `.env` **solo si existe** (en Render no hay `.env`: las variables se ponen en su panel) y toma los orígenes de CORS de la variable `CORS_ORIGINS`. |
| `backend/.env.example` | Documenta la nueva variable `CORS_ORIGINS`. |
| `frontend/js/config.js` | Elige a qué backend conectarse: el local si abres la página en tu Mac, el de Render si la abres desde Internet. |
| `frontend/index.html` | Carga `config.js` antes que `app.js`. |

Todo esto se ha probado en local: el backend compilado arranca sin `.env` solo con variables de entorno,
la prueba de humo del workflow pasa (201, 200, 400, 404), CORS acepta solo los orígenes indicados
y el frontend local sigue funcionando.

---

## 2. Antes de empezar

- [ ] Cuenta de **Render** (ya la tenéis): https://render.com
- [ ] Cuenta de **GitHub** con el repositorio `andrewtoch-git/DEL_PRUEBACIFO01` (ya está).
- [ ] Cuenta de **MongoDB Atlas** (nueva, gratis): https://www.mongodb.com/cloud/atlas/register
- [ ] **Permiso del token de GitHub para workflows.** GitHub no deja subir ficheros de `.github/workflows/`
  con un token que no tenga ese permiso. En GitHub → *Settings* → *Developer settings* →
  *Personal access tokens* → *Fine-grained tokens* → tu token → *Edit* →
  *Repository permissions* → **Workflows: Read and write** → *Update*.
  (Si no, el `git push` fallará con un mensaje que menciona `workflow`.)

> 🔒 **Regla de oro:** el repositorio es **público**. Ninguna contraseña, cadena de conexión ni URL de
> Deploy Hook se escribe en el código. Todas van en los paneles de Render y en los *Secrets* de GitHub.

---

## Paso 1 — Base de datos en MongoDB Atlas

1. Entra en Atlas y crea un **cluster** (grupo de servidores de base de datos):
   - *Create* → plan **M0 (Free)**.
   - Proveedor: **AWS**. Región: **Frankfurt (eu-central-1)** (cerca de la región de Render que usaremos).
   - Nombre: `catalogo` (o el que quieras) → *Create Deployment*.
2. **Usuario de la base de datos** (Atlas lo pide al crear el cluster, o en *Database Access*):
   - Usuario: `catalogo_app`.
   - Contraseña: pulsa **Autogenerate** (solo letras y números: evita problemas con símbolos en la dirección).
   - **Cópiala en un sitio seguro.** No la pegues en el código ni en el chat.
   - Permisos: *Read and write to any database*.
3. **Acceso de red** (*Network Access* → *Add IP Address*):
   - Elige **Allow access from anywhere** (`0.0.0.0/0`).
   - ¿Por qué? Los servicios gratuitos de Render no tienen una dirección IP fija, así que no se puede
     autorizar "solo a Render". La protección es la contraseña del paso anterior (por eso debe ser larga y aleatoria).
4. **Cadena de conexión** (*Database* → *Connect* → *Drivers*): copia algo como
   ```
   mongodb+srv://catalogo_app:<db_password>@catalogo.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=catalogo
   ```
   y transfórmala así:
   - Sustituye `<db_password>` por la contraseña real.
   - Añade el **nombre de la base de datos** (`catalogo`) justo antes del `?`:
   ```
   mongodb+srv://catalogo_app:CONTRASEÑA@catalogo.xxxxx.mongodb.net/catalogo?retryWrites=true&w=majority&appName=catalogo
   ```
   Esta es tu **`MONGODB_URI` de producción**. Guárdala para el paso 3.
5. *(Opcional)* Comprueba que funciona desde tu Mac:
   ```
   ~/mongodb/bin/mongosh "mongodb+srv://catalogo_app:CONTRASEÑA@catalogo.xxxxx.mongodb.net/catalogo"
   ```
   O añádela en **MongoDB Compass** (*Add new connection*) para ver los datos de la nube.

---

## Paso 2 — Subir los cambios a GitHub

(Claude lo hace cuando se lo pidáis: commit + push.) Recuerda el permiso **Workflows** del token (apartado 2).

Después, en GitHub → pestaña **Actions** verás el workflow **CI/CD** ejecutándose:
- `Comprobar frontend` ✅
- `Comprobar backend` ✅ (arranca un MongoDB temporal y prueba la API de verdad)
(El despliegue lo hace Render al ver los dos trabajos en verde, desde el paso 3.)

---

## Paso 3 — Crear todo en Render con el Blueprint ⚡ (camino rápido)

1. En Render: **New +** → **Blueprint**.
2. Conecta GitHub si te lo pide y elige el repositorio **`DEL_PRUEBACIFO01`**, rama `main`.
3. Render lee `render.yaml` y muestra lo que va a crear: **`catalogo-backend`** (Web Service, Free) y
   **`catalogo-frontend`** (Static Site). Ponle un nombre al Blueprint (por ejemplo `catalogo`).
4. Te pedirá el valor de **`MONGODB_URI`** (es la única variable marcada como secreta). Pega la cadena de Atlas
   **con tu contraseña** en lugar de `<db_password>`:
   ```
   mongodb+srv://USUARIO:CONTRASEÑA@cluster0.xxxxx.mongodb.net/catalogo?retryWrites=true&w=majority&appName=Cluster0
   ```
5. **Apply** (o *Deploy Blueprint*). Render instala, compila y arranca. En el backend → *Logs* debe aparecer
   `Nest application successfully started`.
6. Mira las **URLs** de los dos servicios (arriba en cada uno). Si son exactamente
   `https://catalogo-backend.onrender.com` y `https://catalogo-frontend.onrender.com`, **no hay nada más que configurar**.
   Si Render les añadió letras (porque el nombre estaba cogido), pasa a Claude las dos URLs: hay que ajustar
   `frontend/js/config.js` (paso 4) y la variable `CORS_ORIGINS` del backend (*Environment*).
7. Prueba: `curl https://catalogo-backend.onrender.com/productos` → `[]`.

A partir de aquí, **cada push a `main` se despliega solo** cuando GitHub Actions termina en verde.
No hacen falta Deploy Hooks ni *Secrets* (los pasos 3-bis, 5 y 6 son solo para quien prefiera crearlo a mano).

---

## Paso 3-bis — (Alternativa manual) Backend en Render (Web Service)

1. En Render: **New +** → **Web Service** → *Build and deploy from a Git repository*.
2. Conecta GitHub (la primera vez Render pide instalar su aplicación en GitHub) y elige el repositorio `DEL_PRUEBACIFO01`.
3. Rellena:

   | Campo | Valor |
   |---|---|
   | **Name** | `catalogo-backend` |
   | **Region** | Frankfurt (EU Central) |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |
   | **Runtime / Language** | Node |
   | **Build Command** | `npm ci --include=dev && npm run build` |
   | **Start Command** | `npm run start:prod` |
   | **Instance Type** | **Free** |

   - `npm ci --include=dev`: instala las dependencias **incluidas las de desarrollo**, porque la CLI de Nest
     (que compila el TypeScript) es una dependencia de desarrollo.
   - `npm run start:prod` = `node dist/main`: arranca el JavaScript ya compilado (sin modo watch).
4. **Environment Variables** (*Environment* → *Add Environment Variable*):

   | Clave | Valor |
   |---|---|
   | `MONGODB_URI` | la cadena de Atlas del paso 1 |
   | `CORS_ORIGINS` | `https://catalogo-frontend.onrender.com` (provisional; se confirma en el paso 5) |

   No hace falta `PORT`: Render la pone sola. Nuestro `main.ts` la lee.
5. En *Advanced*:
   - **Health Check Path**: `/productos` (Render comprueba esa ruta para saber si el servicio está vivo).
   - **Auto-Deploy**: **Off** (*No*). Quien decide cuándo desplegar será **GitHub Actions**, y solo si las pruebas pasan.
6. **Create Web Service**. En *Logs* verás la instalación, la compilación y al final:
   `Nest application successfully started`.
7. Arriba aparece la **URL del backend**, por ejemplo `https://catalogo-backend.onrender.com`
   (si el nombre estaba cogido, Render añade letras: `https://catalogo-backend-ab12.onrender.com`). **Apúntala.**
8. Prueba:
   ```
   curl https://catalogo-backend.onrender.com/productos
   ```
   Debe responder `[]` (lista vacía: la base de datos de Atlas es nueva).

---

## Paso 4 — Decirle al frontend dónde está el backend

En `frontend/js/config.js`, cambia esta línea por la URL real del paso 3 (sin `/` al final):
```js
const URL_BACKEND_RENDER = 'https://catalogo-backend.onrender.com';
```
Después: commit + push (Claude puede hacerlo si le pasáis la URL; no es secreta).

---

## Paso 5 — (Alternativa manual) Frontend en Render (Static Site)

1. **New +** → **Static Site** → mismo repositorio.
2. Rellena:

   | Campo | Valor |
   |---|---|
   | **Name** | `catalogo-frontend` |
   | **Branch** | `main` |
   | **Root Directory** | *(vacío)* |
   | **Build Command** | *(vacío)* — no hay nada que compilar: son HTML, CSS y JS tal cual |
   | **Publish Directory** | `frontend` |

3. En *Advanced* → **Auto-Deploy**: **Off**.
4. **Create Static Site**. Apunta su URL, por ejemplo `https://catalogo-frontend.onrender.com`.
5. **Vuelve al backend** → *Environment* → comprueba que `CORS_ORIGINS` es **exactamente** esa URL
   (con `https://`, sin `/` al final). Si cambió, edítala → *Save, rebuild and deploy*.

---

## Paso 6 — (Solo en el camino manual) Esperar a GitHub Actions antes de desplegar

Con el Blueprint ya está hecho (`autoDeployTrigger: checksPass`). En el camino manual:
en cada servicio → *Settings* → **Auto-Deploy** → **After CI Checks Pass**.

<details><summary>Alternativa antigua: Deploy Hooks (no necesaria)</summary>


Un **Deploy Hook** es una URL secreta: quien la llama hace que Render publique la última versión del repositorio.

1. En Render, en **cada** servicio: *Settings* → **Deploy Hook** → copia la URL
   (`https://api.render.com/deploy/srv-...?key=...`). **Es secreta.**
2. En GitHub, en el repositorio: *Settings* → *Secrets and variables* → *Actions* → **New repository secret**:

   | Name | Secret |
   |---|---|
   | `RENDER_DEPLOY_HOOK_BACKEND` | Deploy Hook del backend |
   | `RENDER_DEPLOY_HOOK_FRONTEND` | Deploy Hook del frontend |

   Los *Secrets* están cifrados: no se ven en el código ni en los registros, ni siquiera siendo público el repositorio.
   (Requiere volver a añadir al workflow un trabajo que llame a esas URLs.)

</details>

---

## Paso 7 — Probar el ciclo completo

1. Haz cualquier cambio pequeño (por ejemplo, un texto) → commit → push.
2. GitHub → **Actions**: los dos trabajos en verde.
3. Render → cada servicio → *Events*: aparece un despliegue nuevo **después** de que Actions termine.
4. Abre `https://catalogo-frontend.onrender.com`:
   - La primera vez puede tardar (backend dormido). La lista estará **vacía**: es la base de datos de Atlas.
   - Crea un producto desde la web. Míralo en Atlas (*Browse Collections*) o en Compass conectado a Atlas.
5. Abre la web desde **otro dispositivo** (el móvil): verás los mismos datos. 🎉

**¿Y si una prueba falla?** El trabajo `Desplegar en Render` no se ejecuta: lo que está publicado sigue funcionando.

---

## 8. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `git push` rechazado mencionando `workflow` | El token no tiene permiso **Workflows** | Apartado 2 |
| La web dice "No se puede conectar con el servidor" | Backend dormido (plan gratuito) | Esperar ~1 min y recargar |
| Consola del navegador: *blocked by CORS policy* | `CORS_ORIGINS` no coincide exactamente con la URL del frontend | Revisar `https`, sin `/` final, nombre exacto (paso 5.5) |
| La web llama a `catalogo-backend.onrender.com` y no es la tuya | No se actualizó `config.js` | Paso 4 |
| Logs de Render: `Falta la variable MONGODB_URI` | No se definió en *Environment* | Paso 3.4 |
| Logs: `bad auth : authentication failed` | Usuario o contraseña de Atlas mal escritos en la cadena | Revisar el paso 1.4 |
| Logs: `Could not connect to any servers ... IP` | Atlas no permite la conexión | *Network Access* → `0.0.0.0/0` (paso 1.3) |
| Logs: `nest: not found` al compilar | No se instalaron las dependencias de desarrollo | Build Command con `--include=dev` |
| Render no despliega tras un push | Actions falló (en rojo), o Auto-Deploy no está en *After CI Checks Pass* | Revisar Actions; paso 6 |
| Blueprint: error de validación en `render.yaml` | Algún campo no admitido por la versión actual de Render | Copiar el mensaje a Claude, o usar el camino manual (3-bis y 5) |

---

## 9. ¿Dónde viven ahora los datos y cuándo se pierden?

| Entorno | Dónde | Cuándo se pierden |
|---|---|---|
| Local | MongoDB en tu Mac (`~/mongodb/datos`) | Solo si se borran |
| Internet | **MongoDB Atlas** (servidores de MongoDB en Frankfurt) | Solo si se borran (o se elimina el cluster) |

Son **dos bases de datos distintas**: lo que crees en local no aparece en Internet, y al revés.
El código es el mismo; lo que cambia es la **configuración** (`MONGODB_URI`, `CORS_ORIGINS`, `config.js`).
Esa es la razón de haber separado la configuración del código desde la fase 9.
