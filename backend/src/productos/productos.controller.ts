// productos.controller.ts — CONTROLADOR: une cada RUTA + MÉTODO HTTP con una función.
//
//   POST   /productos      → crear
//   GET    /productos      → listar
//   GET    /productos/:id  → obtenerUno
//   PATCH  /productos/:id  → actualizar
//   DELETE /productos/:id  → eliminar
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ProductosService } from './productos.service.js';
// Importación normal (no "import type"): ValidationPipe necesita las CLASES de los DTO para leer sus reglas
import { CrearProductoDto } from './dto/crear-producto.dto.js';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto.js';

@Controller('productos')   // todas las rutas de esta clase empiezan por /productos
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()   // responde 201 (Created) por defecto
  // @Body() = el JSON que envía el cliente. Al indicar el tipo CrearProductoDto,
  // ValidationPipe comprueba sus reglas ANTES de entrar aquí (si fallan → 400).
  crear(@Body() datos: CrearProductoDto) {
    return this.productosService.crear(datos);
  }

  @Get()
  listar() {
    return this.productosService.listar();   // NestJS convierte la lista en JSON automáticamente
  }

  // :id es un trozo variable de la ruta. Desde la fase 9 es el _id de MongoDB (un texto),
  // así que ya no se convierte a número (antes: ParseIntPipe).
  @Get(':id')
  obtenerUno(@Param('id') id: string) {
    return this.productosService.obtenerUno(id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() datos: ActualizarProductoDto) {
    return this.productosService.actualizar(id, datos);
  }

  @Delete(':id')
  @HttpCode(204)   // 204 = "hecho, y no hay nada que devolver"
  async eliminar(@Param('id') id: string) {
    await this.productosService.eliminar(id);   // esperar a que MongoDB termine (y propagar el 404)
  }
}
