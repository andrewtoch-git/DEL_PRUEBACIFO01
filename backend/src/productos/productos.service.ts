// productos.service.ts — SERVICIO: la lógica de los productos.
// Fase 5: los datos viven en un ARRAY EN MEMORIA dentro del servidor.
// → Sobreviven a recargar la página, pero se pierden al reiniciar el servidor.
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Producto } from './producto.js';
import type { CrearProductoDto } from './dto/crear-producto.dto.js';
import type { ActualizarProductoDto } from './dto/actualizar-producto.dto.js';

@Injectable()
export class ProductosService {
  // Productos de ejemplo con los que arranca el servidor
  private productos: Producto[] = [
    { id: 1, nombre: 'MacBook Air 13"', marca: 'Apple', categoria: 'portatil', precio: 1199, stock: 5, descripcion: 'Portátil ligero con chip M3.' },
    { id: 2, nombre: 'Galaxy S24', marca: 'Samsung', categoria: 'smartphone', precio: 899.99, stock: 12, descripcion: 'Pantalla de 6,2 pulgadas.' },
    { id: 3, nombre: 'WH-1000XM5', marca: 'Sony', categoria: 'audio', precio: 349, stock: 0, descripcion: '' },
  ];

  // id que tendrá el próximo producto creado
  private siguienteId = 4;

  listar(): Producto[] {
    return this.productos;
  }

  obtenerUno(id: number): Producto {
    const producto = this.productos.find((p) => p.id === id);
    if (!producto) {
      // NestJS convierte esta excepción en una respuesta HTTP 404 (no encontrado)
      throw new NotFoundException(`No existe ningún producto con id ${id}`);
    }
    return producto;
  }

  // Los datos ya llegan VALIDADOS (fase 6). El id lo pone el servidor, nunca el cliente.
  crear(datos: CrearProductoDto): Producto {
    // Si no viene descripción, se guarda como texto vacío
    const nuevo: Producto = { id: this.siguienteId, ...datos, descripcion: datos.descripcion ?? '' };
    this.siguienteId++;
    this.productos.push(nuevo);
    return nuevo;
  }

  // PATCH: solo llegan los campos que cambian (todos opcionales en ActualizarProductoDto)
  actualizar(id: number, datos: ActualizarProductoDto): Producto {
    const producto = this.obtenerUno(id);   // si no existe, lanza el 404

    // Copiamos SOLO los campos que traen valor. Los que no se enviaron existen en el DTO
    // con valor undefined, y si los copiáramos borrarían los datos buenos (error visto en la fase 6).
    for (const [campo, valor] of Object.entries(datos)) {
      if (valor !== undefined) {
        (producto as unknown as Record<string, unknown>)[campo] = valor;
      }
    }
    return producto;
  }

  eliminar(id: number): void {
    this.obtenerUno(id);   // comprueba que existe (si no, 404)
    this.productos = this.productos.filter((p) => p.id !== id);
  }
}
