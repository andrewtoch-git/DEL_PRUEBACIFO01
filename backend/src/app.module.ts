// app.module.ts — MÓDULO RAÍZ: el "índice" que declara qué piezas forman la aplicación.
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductosModule } from './productos/productos.module.js';

// @Module es un "decorador": una etiqueta que da información a NestJS sobre la clase de debajo.
@Module({
  imports: [ProductosModule],     // otros módulos que forman la aplicación
  controllers: [AppController],   // quién recibe las peticiones HTTP
  providers: [AppService],        // quién hace el trabajo (la lógica)
})
export class AppModule {}
