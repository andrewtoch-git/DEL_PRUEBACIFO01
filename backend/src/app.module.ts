// app.module.ts — MÓDULO RAÍZ: el "índice" que declara qué piezas forman la aplicación.
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

// @Module es un "decorador": una etiqueta que da información a NestJS sobre la clase de debajo.
@Module({
  imports: [],                    // otros módulos que usa esta aplicación (de momento, ninguno)
  controllers: [AppController],   // quién recibe las peticiones HTTP
  providers: [AppService],        // quién hace el trabajo (la lógica)
})
export class AppModule {}
