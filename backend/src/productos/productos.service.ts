// productos.service.ts — SERVICIO: la lógica de los productos.
// Fase 5: los datos viven en un ARRAY EN MEMORIA dentro del servidor.
// → Sobreviven a recargar la página, pero se pierden al reiniciar el servidor.
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Producto } from './producto.js';

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

  // Omit<Producto, 'id'> = un producto SIN el id (el id lo pone el servidor, no el cliente)
  crear(datos: Omit<Producto, 'id'>): Producto {
    const nuevo: Producto = { id: this.siguienteId, ...datos };
    this.siguienteId++;
    this.productos.push(nuevo);
    return nuevo;
  }

  // Partial<...> = todos los campos opcionales: PATCH permite cambiar solo algunos
  actualizar(id: number, datos: Partial<Omit<Producto, 'id'>>): Producto {
    const producto = this.obtenerUno(id);   // si no existe, lanza el 404
    Object.assign(producto, datos);          // copia en el producto solo los campos recibidos
    return producto;
  }

  eliminar(id: number): void {
    this.obtenerUno(id);   // comprueba que existe (si no, 404)
    this.productos = this.productos.filter((p) => p.id !== id);
  }
}
