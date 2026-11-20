// =====================================================================
// Fase 3: COMPORTAMIENTO
// El código está dividido en 4 partes:
//   1. Acceso a los datos  → lo ÚNICO que habla con el almacén (localStorage).
//   2. Validación          → comprueba que los datos son correctos.
//   3. Interfaz            → lee y modifica la página (el DOM).
//   4. Eventos             → qué pasa cuando el usuario hace algo.
// En la fase 7, solo cambiará por dentro la parte 1 (localStorage → fetch al backend).
// =====================================================================


// ---------------------------------------------------------------------
// 1. ACCESO A LOS DATOS (localStorage)
// ---------------------------------------------------------------------

// Nombre con el que guardamos la lista en el almacén del navegador
const CLAVE_ALMACEN = 'productos';

// Productos de ejemplo: se cargan solo la primera vez (cuando el almacén está vacío)
const PRODUCTOS_INICIALES = [
  { id: 1, nombre: 'MacBook Air 13"', marca: 'Apple', categoria: 'portatil', precio: 1199, stock: 5, descripcion: 'Portátil ligero con chip M3.' },
  { id: 2, nombre: 'Galaxy S24', marca: 'Samsung', categoria: 'smartphone', precio: 899.99, stock: 12, descripcion: 'Pantalla de 6,2 pulgadas.' },
  { id: 3, nombre: 'WH-1000XM5', marca: 'Sony', categoria: 'audio', precio: 349, stock: 0, descripcion: '' }
];

// Lee la lista completa del almacén.
// localStorage solo guarda TEXTO: JSON.parse convierte ese texto otra vez en una lista de objetos.
function leerAlmacen() {
  const texto = localStorage.getItem(CLAVE_ALMACEN);
  if (texto === null) {
    // Primera visita: el almacén está vacío → guardamos los productos de ejemplo
    guardarAlmacen(PRODUCTOS_INICIALES);
    return PRODUCTOS_INICIALES;
  }
  return JSON.parse(texto);
}

// Guarda la lista completa en el almacén. JSON.stringify convierte la lista en texto.
function guardarAlmacen(productos) {
  localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(productos));
}

// Devuelve todos los productos
function obtenerProductos() {
  return leerAlmacen();
}

// Devuelve un producto por su id (o undefined si no existe)
function obtenerProducto(id) {
  return leerAlmacen().find(function (producto) {
    return producto.id === id;
  });
}

// Crea un producto nuevo y lo devuelve (ya con su id)
function crearProducto(datos) {
  const productos = leerAlmacen();

  // id sencillo: el mayor id que exista + 1 (o 1 si la lista está vacía)
  let idMayor = 0;
  for (const producto of productos) {
    if (producto.id > idMayor) {
      idMayor = producto.id;
    }
  }

  const nuevo = { id: idMayor + 1, ...datos };   // "...datos" copia todos los campos de datos
  productos.push(nuevo);
  guardarAlmacen(productos);
  return nuevo;
}

// Sustituye los datos de un producto existente y lo devuelve actualizado
function actualizarProducto(id, datos) {
  const productos = leerAlmacen();
  const posicion = productos.findIndex(function (producto) {
    return producto.id === id;
  });
  productos[posicion] = { id: id, ...datos };
  guardarAlmacen(productos);
  return productos[posicion];
}

// Elimina un producto por su id
function eliminarProducto(id) {
  const productos = leerAlmacen().filter(function (producto) {
    return producto.id !== id;   // nos quedamos con todos MENOS el que se elimina
  });
  guardarAlmacen(productos);
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
// Aunque el HTML ya valida, aquí volvemos a comprobarlo: NO hay que confiar en lo que llega.
// Ejemplo: un nombre de dos espacios "  " pasa la validación HTML, pero aquí no.
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

// Vacía la tabla y la vuelve a dibujar con los productos del almacén
function pintarListado() {
  const productos = obtenerProductos();
  listaProductos.innerHTML = '';   // borra las filas anteriores

  if (productos.length === 0) {
    const fila = document.createElement('tr');
    const celda = crearCelda('No hay productos. Crea el primero con el formulario.');
    celda.colSpan = 7;   // la celda ocupa las 7 columnas
    fila.appendChild(celda);
    listaProductos.appendChild(fila);
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
      borrarProducto(producto.id);
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

// Pone el formulario en modo edición con los datos de un producto
function empezarEdicion(id) {
  const producto = obtenerProducto(id);
  formulario.nombre.value = producto.nombre;
  formulario.marca.value = producto.marca;
  formulario.categoria.value = producto.categoria;
  formulario.precio.value = producto.precio;
  formulario.stock.value = producto.stock;
  formulario.descripcion.value = producto.descripcion;

  idEnEdicion = id;
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

// Pide confirmación y elimina un producto
function borrarProducto(id) {
  const producto = obtenerProducto(id);
  // confirm() muestra una ventanita con "Aceptar" y "Cancelar"; devuelve true si se acepta
  if (!confirm('¿Seguro que quieres eliminar «' + producto.nombre + '»?')) {
    return;
  }

  eliminarProducto(id);

  // Si se estaba editando justo ese producto, el formulario ya no tiene sentido
  if (idEnEdicion === id) {
    formulario.reset();
  }

  pintarListado();
  mostrarMensaje('Producto «' + producto.nombre + '» eliminado.', 'exito');
}


// ---------------------------------------------------------------------
// 4. EVENTOS
// ---------------------------------------------------------------------

// Al enviar el formulario (botón Guardar)
formulario.addEventListener('submit', function (evento) {
  // Sin esto, el navegador recargaría la página (comportamiento por defecto de un formulario)
  evento.preventDefault();

  const datos = leerFormulario();
  const errores = validarProducto(datos);

  if (errores.length > 0) {
    mostrarMensaje('Revisa el formulario:\n• ' + errores.join('\n• '), 'error');
    return;
  }

  // Los datos llegan como texto; precio y stock se guardan como números
  datos.precio = Number(datos.precio);
  datos.stock = Number(datos.stock);

  if (idEnEdicion === null) {
    const nuevo = crearProducto(datos);
    mostrarMensaje('Producto «' + nuevo.nombre + '» creado.', 'exito');
  } else {
    const actualizado = actualizarProducto(idEnEdicion, datos);
    mostrarMensaje('Producto «' + actualizado.nombre + '» actualizado.', 'exito');
  }

  formulario.reset();   // vacía los campos (dispara el evento "reset" de abajo)
  pintarListado();
});

// Al vaciar el formulario (botón Cancelar o formulario.reset())
formulario.addEventListener('reset', function () {
  salirModoEdicion();
});

// Al cargar la página: dibujar el listado por primera vez
pintarListado();
