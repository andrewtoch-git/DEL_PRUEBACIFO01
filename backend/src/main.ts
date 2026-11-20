// main.ts — PUNTO DE ARRANQUE del backend.
// El nombre "main.ts" lo impone NestJS (por eso no se traduce).
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// "async" porque crear la aplicación y ponerla a escuchar lleva un tiempo:
// "await" espera a que cada paso termine antes de seguir.
async function bootstrap() {
  // Crea la aplicación a partir del módulo raíz (AppModule)
  const app = await NestFactory.create(AppModule);

  // Validación (fase 6): todo lo que llega en @Body() se comprueba con las reglas de su DTO.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // quita los campos que no están en el DTO...
      forbidNonWhitelisted: true,  // ...y además responde 400 si alguien los envía (p. ej. "hackeo")
      transform: true,             // convierte el JSON en un objeto del DTO (necesario para quitar espacios)
    }),
  );

  // Pone el servidor a escuchar peticiones HTTP en el puerto 3000
  await app.listen(3000);
}

await bootstrap();
