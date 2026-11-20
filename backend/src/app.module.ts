// app.module.ts — MÓDULO RAÍZ: el "índice" que declara qué piezas forman la aplicación.
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductosModule } from './productos/productos.module.js';

// @Module es un "decorador": una etiqueta que da información a NestJS sobre la clase de debajo.
@Module({
  imports: [
    // Conexión con MongoDB (fase 9). La dirección se lee del fichero .env (variable MONGODB_URI).
    // "forRootAsync" + "useFactory": la dirección se lee AL ARRANCAR, cuando main.ts ya ha cargado el .env.
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: process.env.MONGODB_URI }),
    }),
    ProductosModule,
  ],
  controllers: [AppController],   // quién recibe las peticiones HTTP
  providers: [AppService],        // quién hace el trabajo (la lógica)
})
export class AppModule {}
