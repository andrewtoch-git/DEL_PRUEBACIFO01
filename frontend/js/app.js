// =====================================================================
// COMPORTAMIENTO DEL FRONTEND
// El código está dividido en 4 partes:
//   1. Acceso a los datos  → lo ÚNICO que habla con los datos (desde la fase 7: el backend, con fetch).
//   2. Validación          → comprueba que los datos son correctos antes de enviarlos.
//   3. Interfaz            → lee y modifica la página (el DOM).
//   4. Eventos             → qué pasa cuando el usuario hace algo.
//
// Historia: en la fase 3 la parte 1 usaba localStorage. En la fase 7 solo ha cambiado POR DENTRO
// la parte 1 (localStorage → fetch). El resto solo ha añadido "await", porque ahora hay que ESPERAR
// la respuesta del servidor.
// =====================================================================


// ---------------------------------------------------------------------
// 1. ACCESO A LOS DATOS (petición HTTP al backend con fetch)
// ---------------------------------------------------------------------

// Dirección de la API del backend. Viene de js/config.js, que elige la local o la de Render
// según desde dónde se abra la página (despliegue).
const URL_API = window.CONFIG.URL_API;

// Hace una petición HTTP al backend y devuelve los datos de la respuesta.
// Si algo falla, lanza un Error con un mensaje que se puede enseñar al usuario.
// "async" = esta función tarda (va por la red); quien la llame debe usar "await" para esperar el resultado.
async function peticion(url, opciones) {
  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch (error) {
    // fetch solo falla así cuando NO hay respuesta: servidor apagado, sin red... o bloqueo por CORS
    throw new Error('No se puede conectar con el servidor. ¿Está arrancado el backend en el puerto 3000?');
  }

  // respuesta.ok es true si el código de estado es 2xx (200, 201, 204...)
  if (!respuesta.ok) {
    // El backend explica el error en un JSON: { message: "..." } o { message: ["...", "..."] }
    const cuerpo = await respuesta.json().catch(() => null);
    let mensaje = cuerpo && cuerpo.message ? cuerpo.message : 'Error ' + respuesta.status;
    if (Array.isArray(mensaje)) {
      mensaje = 'El servidor ha rechazado los datos:\n• ' + mensaje.join('\n• ');
    }
    throw new Error(mensaje);
  }

  // 204 = "hecho, sin contenido" (al eliminar): no hay JSON que leer
  if (respuesta.status === 204) {
    return null;
  }
  return respuesta.json();   // convierte el JSON de la respuesta en objetos de JavaScript
}

// GET /productos
async function obtenerProductos() {
  return peticion(URL_API);
}

// GET /productos/:id
async function obtenerProducto(id) {
  return peticion(URL_API + '/' + id);
}

// POST /productos  (los datos viajan en el cuerpo, como texto JSON)
async function crearProducto(datos) {
  return peticion(URL_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },   // avisa al servidor de que enviamos JSON
    body: JSON.stringify(datos)
  });
}

// PATCH /productos/:id
async function actualizarProducto(id, datos) {
  return peticion(URL_API + '/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
}

// DELETE /productos/:id
async function eliminarProducto(id) {
  return peticion(URL_API + '/' + id, { method: 'DELETE' });
}


// ---------------------------------------------------------------------
// 2. VALIDACIÓN
// ---------------------------------------------------------------------

// Lista cerrada de categorías: valor guardado → texto visible
const CATEGORIAS = {
  portatil: 'Portátil',
  smartphone: 'Smartphone',
  tablet: 'Tablet',
  periferico: 'Periférico',
  audio: 'Audio',
  accesorio: 'Accesorio'
};

// Recibe los datos tal como vienen del formulario (texto) y devuelve una lista de errores.
// Si la lista está vacía, los datos son válidos.
// Es la 2.ª barrera (la 1.ª es el HTML). El backend vuelve a validar (3.ª barrera, fase 6):
// esta validación sirve para avisar rápido al usuario, sin esperar al servidor.
function validarProducto(datos) {
  const errores = [];

  if (datos.nombre.length < 2 || datos.nombre.length > 100) {
    errores.push('El nombre debe tener entre 2 y 100 caracteres.');
  }
  if (datos.marca.length < 2 || datos.marca.length > 50) {
    errores.push('La marca debe tener entre 2 y 50 caracteres.');
  }
  if (!(datos.categoria in CATEGORIAS)) {
    errores.push('Elige una categoría de la lista.');
  }
  // Expresión regular: uno o más dígitos y, opcionalmente, un punto con 1 o 2 decimales
  if (!/^\d+(\.\d{1,2})?$/.test(datos.precio)) {
    errores.push('El precio debe ser un número mayor o igual que 0, con 2 decimales como máximo.');
  }
  // Solo dígitos: número entero, sin signo ni decimales
  if (!/^\d+$/.test(datos.stock)) {
    errores.push('El stock debe ser un número entero mayor o igual que 0.');
  }
  if (datos.descripcion.length > 300) {
    errores.push('La descripción no puede superar los 300 caracteres.');
  }

  return errores;
}


// ---------------------------------------------------------------------
// 3. INTERFAZ (leer y modificar la página)
// ---------------------------------------------------------------------

// Referencias a los elementos de la página que vamos a usar (los buscamos por su id)
const formulario = document.getElementById('formulario-producto');
const tituloFormulario = document.getElementById('titulo-formulario');
const botonGuardar = document.getElementById('boton-guardar');
const listaProductos = document.getElementById('lista-productos');
const zonaMensajes = document.getElementById('mensajes');

// id del producto que se está editando; null = estamos creando uno nuevo
let idEnEdicion = null;

// Convierte 1199 en "1199,00 €" (formato español)
function formatearPrecio(precio) {
  return precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

// Crea una celda <td> con un texto.
// Usamos textContent (no innerHTML) para que, si alguien escribe código HTML en un campo,
// se muestre como texto y no se ejecute.
function crearCelda(texto) {
  const celda = document.createElement('td');
  celda.textContent = texto;
  return celda;
}

// Crea una fila con un único texto que ocupa toda la tabla (lista vacía o error)
function crearFilaAviso(texto) {
  const fila = document.createElement('tr');
  const celda = crearCelda(texto);
  celda.colSpan = 7;   // la celda ocupa las 7 columnas
  fila.appendChild(celda);
  return fila;
}

// Pide los productos al backend y vuelve a dibujar la tabla
async function pintarListado() {
  let productos;
  try {
    productos = await obtenerProductos();   // "await": espera a que llegue la respuesta del servidor
  } catch (error) {
    listaProductos.innerHTML = '';
    listaProductos.appendChild(crearFilaAviso('No se ha podido cargar el listado.'));
    mostrarMensaje(error.message, 'error');
    return;
  }

  listaProductos.innerHTML = '';   // borra las filas anteriores

  if (productos.length === 0) {
    listaProductos.appendChild(crearFilaAviso('No hay productos. Crea el primero con el formulario.'));
    return;
  }

  for (const producto of productos) {
    const fila = document.createElement('tr');
    fila.appendChild(crearCelda(producto.nombre));
    fila.appendChild(crearCelda(producto.marca));
    fila.appendChild(crearCelda(CATEGORIAS[producto.categoria]));
    fila.appendChild(crearCelda(formatearPrecio(producto.precio)));
    fila.appendChild(crearCelda(producto.stock));
    fila.appendChild(crearCelda(producto.descripcion));

    // Celda de acciones con sus dos botones
    const celdaAcciones = document.createElement('td');

    const botonEditar = document.createElement('button');
    botonEditar.type = 'button';
    botonEditar.textContent = 'Editar';
    botonEditar.addEventListener('click', function () {
      empezarEdicion(producto.id);
    });

    const botonEliminar = document.createElement('button');
    botonEliminar.type = 'button';
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.addEventListener('click', function () {
      borrarProducto(producto);
    });

    celdaAcciones.appendChild(botonEditar);
    celdaAcciones.appendChild(botonEliminar);
    fila.appendChild(celdaAcciones);

    listaProductos.appendChild(fila);
  }
}

// Muestra un mensaje en la zona de mensajes. tipo: 'exito' o 'error'
function mostrarMensaje(texto, tipo) {
  zonaMensajes.textContent = texto;
  zonaMensajes.className = 'mensaje mensaje-' + tipo;
}

function borrarMensaje() {
  zonaMensajes.textContent = '';
  zonaMensajes.className = '';
}

// Lee los campos del formulario. trim() quita los espacios del principio y del final.
function leerFormulario() {
  return {
    nombre: formulario.nombre.value.trim(),
    marca: formulario.marca.value.trim(),
    categoria: formulario.categoria.value,
    precio: formulario.precio.value.trim(),
    stock: formulario.stock.value.trim(),
    descripcion: formulario.descripcion.value.trim()
  };
}

// Pide al backend los datos actuales de un producto y pone el formulario en modo edición
async function empezarEdicion(id) {
  let producto;
  try {
    producto = await obtenerProducto(id);
  } catch (error) {
    mostrarMensaje(error.message, 'error');
    return;
  }

  formulario.nombre.value = producto.nombre;
  formulario.marca.value = producto.marca;
  formulario.categoria.value = producto.categoria;
  formulario.precio.value = producto.precio;
  formulario.stock.value = producto.stock;
  formulario.descripcion.value = producto.descripcion;

  idEnEdicion = producto.id;
  tituloFormulario.textContent = 'Editar producto';
  botonGuardar.textContent = 'Guardar cambios';
  borrarMensaje();

  // Sube hasta el formulario y pone el cursor en el primer campo
  formulario.scrollIntoView({ behavior: 'smooth' });
  formulario.nombre.focus();
}

// Vuelve el formulario al modo "crear"
function salirModoEdicion() {
  idEnEdicion = null;
  tituloFormulario.textContent = 'Nuevo producto';
  botonGuardar.textContent = 'Guardar';
}

// Pide confirmación y pide al backend que elimine un producto
async function borrarProducto(producto) {
  // confirm() muestra una ventanita con "Aceptar" y "Cancelar"; devuelve true si se acepta
  if (!confirm('¿Seguro que quieres eliminar «' + producto.nombre + '»?')) {
    return;
  }

  try {
    await eliminarProducto(producto.id);
  } catch (error) {
    mostrarMensaje(error.message, 'error');
    return;
  }

  // Si se estaba editando justo ese producto, el formulario ya no tiene sentido
  if (idEnEdicion === producto.id) {
    formulario.reset();
  }

  await pintarListado();
  mostrarMensaje('Producto «' + producto.nombre + '» eliminado.', 'exito');
}


// ---------------------------------------------------------------------
// 4. EVENTOS
// ---------------------------------------------------------------------

// Al enviar el formulario (botón Guardar)
formulario.addEventListener('submit', async function (evento) {
  // Sin esto, el navegador recargaría la página (comportamiento por defecto de un formulario)
  evento.preventDefault();

  const datos = leerFormulario();
  const errores = validarProducto(datos);

  if (errores.length > 0) {
    mostrarMensaje('Revisa el formulario:\n• ' + errores.join('\n• '), 'error');
    return;
  }

  // Los datos llegan como texto; precio y stock se envían como números
  datos.precio = Number(datos.precio);
  datos.stock = Number(datos.stock);

  try {
    if (idEnEdicion === null) {
      const nuevo = await crearProducto(datos);
      mostrarMensaje('Producto «' + nuevo.nombre + '» creado.', 'exito');
    } else {
      const actualizado = await actualizarProducto(idEnEdicion, datos);
      mostrarMensaje('Producto «' + actualizado.nombre + '» actualizado.', 'exito');
    }
  } catch (error) {
    // El servidor rechazó los datos o no respondió: se muestra el motivo y NO se vacía el formulario
    mostrarMensaje(error.message, 'error');
    return;
  }

  formulario.reset();   // vacía los campos (dispara el evento "reset" de abajo)
  await pintarListado();
});

// Al vaciar el formulario (botón Cancelar o formulario.reset())
formulario.addEventListener('reset', function () {
  salirModoEdicion();
});

// Al cargar la página: dibujar el listado por primera vez (pidiéndolo al backend)
pintarListado();
