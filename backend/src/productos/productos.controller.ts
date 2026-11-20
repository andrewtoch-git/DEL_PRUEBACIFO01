// productos.controller.ts — CONTROLADOR: une cada RUTA + MÉTODO HTTP con una función.
//
//   POST   /productos      → crear
//   GET    /productos      → listar
//   GET    /productos/:id  → obtenerUno
//   PATCH  /productos/:id  → actualizar
//   DELETE /productos/:id  → eliminar
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import type { Producto } from './producto.js';

@Controller('productos')   // todas las rutas de esta clase empiezan por /productos
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()   // responde 201 (Created) por defecto
  crear(@Body() datos: Omit<Producto, 'id'>) {   // @Body() = el JSON que envía el cliente
    return this.productosService.crear(datos);
  }

  @Get()
  listar() {
    return this.productosService.listar();   // NestJS convierte la lista en JSON automáticamente
  }

  // :id es un trozo variable de la ruta. ParseIntPipe lo convierte de texto a número
  // (y responde 400 si no es un número, por ejemplo /productos/abc).
  @Get(':id')
  obtenerUno(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.obtenerUno(id);
  }

  @Patch(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() datos: Partial<Omit<Producto, 'id'>>) {
    return this.productosService.actualizar(id, datos);
  }

  @Delete(':id')
  @HttpCode(204)   // 204 = "hecho, y no hay nada que devolver"
  eliminar(@Param('id', ParseIntPipe) id: number) {
    this.productosService.eliminar(id);
  }
}
