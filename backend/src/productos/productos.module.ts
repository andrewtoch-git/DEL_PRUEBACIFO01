// productos.module.ts — Agrupa todo lo relacionado con los productos.
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosController } from './productos.controller.js';
import { ProductosService } from './productos.service.js';
import { Producto, ProductoSchema } from './producto.schema.js';

@Module({
  // Registra el modelo "Producto" (con su esquema) para que el servicio pueda usarlo
  imports: [MongooseModule.forFeature([{ name: Producto.name, schema: ProductoSchema }])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
